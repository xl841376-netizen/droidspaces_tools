# droidspaces_tools

**Droidspaces 容器管理工具包 — Operit Sandbox ToolPkg v0.1.5**

基于 Droidspaces-OSS 的 Linux 容器管理工具包，提供完整的容器生命周期管理、交互式终端、系统检查与 Compose DSL 自定义仪表盘 UI。

---

## 系统架构

```
┌─────────────────────────────────────────────────┐
│                   Operit AI                     │
│  (LLM 调用  →  ToolPkg  →  Sandbox Runtime)     │
└──────────────────┬──────────────────────────────┘
                   │ ToolPkg API
┌──────────────────▼──────────────────────────────┐
│              droidspaces_tools                   │
│  ┌──────────┐ ┌──────────┐ ┌───────────────┐   │
│  │  exec    │ │exec_code │ │enter/send/read│   │
│  │(快速命令)│ │(复杂代码)│ │ (交互终端)    │   │
│  └────┬─────┘ └────┬─────┘ └───────┬───────┘   │
│       │             │               │           │
│  ┌────▼─────────────▼───────────────▼───────┐   │
│  │         命令传递层 (ctExec)               │   │
│  │  toOctalEscaped / base64Encode           │   │
│  │  ct_socket_transfer.py (TCP 自收发)       │   │
│  └────────────────────┬────────────────────┘   │
└───────────────────────┼─────────────────────────┘
                        │ su -c
┌───────────────────────▼─────────────────────────┐
│           ct (Container Tool)                    │
│     /data/adb/modules/ct_intercept/             │
└───────────────────────┬─────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────┐
│          Droidspaces Daemon (v6.4.0)             │
│        /data/local/Droidspaces/bin/              │
└───────────────────────┬─────────────────────────┘
                        │ Linux namespaces
┌───────────────────────▼─────────────────────────┐
│            Linux Container                       │
│   (Debian/Ubuntu aarch64, privileged)            │
└─────────────────────────────────────────────────┘
```

---

## 命令传递链路

### exec — 单条快速命令
```
命令 → toOctalEscaped(UTF-8 手动编码) → printf "\\ooo" → bash -c
     → su -c 'ct <容器> exec bash -c "..."'
```
- 所有非 ASCII/特殊字符转义为八进制，确保通过 printf 时不被 shell 二次解释
- 适用于简单单行命令（< 200 字符）

### exec_code — 大段复杂代码（核心创新）
```
代码 → base64Encode(纯 JS 实现，无 TextEncoder 依赖)
     → su -c 'ct <容器> exec_code @b64:<base64>'
     → ct_socket_transfer.py self 模式 TCP 回环传输
     → base64 解码 → 写入临时脚本 → 执行 → 自动清理
```
- **零转义**：base64 字符集仅含 A-Za-z0-9+/=，完全绕过所有 shell 转义层
- **容量上限**：60,000 字节（execve 128KB 限制，base64 膨胀 ~33%）
- **自动前置**：自动推送 ct_socket_transfer.py、自动安装 python3

### 交互式终端 (enter/send/read_screen)
- **tmux 优先**：自动检测 → apt-get/apk/yum 三连安装 → tmux new-session
- **降级模式**：无 tmux 时使用 /tmp/.ct_session_<sid>/cwd 文件追踪工作目录
- **标记轮询**：echo __DS_DONE__ → capture-pane 轮询（150ms 间隔）→ 过滤标记行
- **控制键映射**：enter/tab/esc/ctrl_c/ctrl_d → tmux send-keys

---

## 工具清单（17 个）

### 容器生命周期
| 工具 | 说明 | 关键参数 |
|------|------|----------|
| start | 启动容器 | name, conf/rootfs, net, privileged, bind_mounts, gpu |
| stop | 停止一个或多个容器 | names (逗号分隔) |
| restart | 快速重启（保留 loop mount） | name |
| list | 列出运行中容器 | — |
| info | 容器详细技术信息 | name |
| scan | 扫描并注册孤立容器 | — |

### 命令执行
| 工具 | 说明 | 适用场景 |
|------|------|----------|
| exec | 执行简单单条命令 | 单行命令、快速检查 |
| exec_code | 执行大段/复杂代码 | 多行脚本、驱动编译、Python/Perl |

### 交互式终端
| 工具 | 说明 |
|------|------|
| enter | 创建交互式终端会话（自动安装 tmux） |
| send | 发送文本或控制键 |
| read_screen | 读取终端屏幕内容 |
| close | 关闭会话，清理 tmux + 临时文件 |

### 诊断与系统
| 工具 | 说明 |
|------|------|
| check | 验证内核配置与系统要求 |
| shell | 在 Android 宿主上执行命令（非容器内） |
| status | 获取 droidspaces 安装状态与容器列表 |
| ping | 连通性测试 |
| open_dashboard | 打开 Compose DSL 仪表盘 UI |

---

## 核心模块

| 文件 | 说明 |
|------|------|
| packages/droidspaces.js | 核心实现，包含所有 17 个工具函数、命令传递链路、会话管理 |
| main.js | 入口，注册 Compose DSL 仪表盘 UI 模块 |
| manifest.json | 工具包元数据、子包声明、资源注册 |
| scripts/ct_socket_transfer.py | TCP socket 自收发工具，支持 serve/send/self 三种模式 |

---

## ct_socket_transfer.py

TCP socket 自收发工具，用于在容器内可靠传输大段代码，完全绕开 shell 管道链。

**三种模式：**

```bash
# 1. 接收端 — 监听随机端口，接受一次连接，base64 解码写入文件
python3 ct_socket_transfer.py serve <output_path>

# 2. 发送端 — 从 stdin 读取 base64，发送到指定端口
echo "BASE64_DATA" | python3 ct_socket_transfer.py send <port>

# 3. 自收发 — 同一进程内 TCP 回环传输（免并发依赖）
python3 ct_socket_transfer.py self <output_path> <b64_data>
```

---

## Bug 修复历史（11 项）

| 版本 | 修复 |
|------|------|
| v0.1.0 | TextEncoder 崩溃（QuickJS 无 TextEncoder）→ 纯 JS UTF-8 编码 |
| v0.1.0 | type of 语法错误 → typeof |
| v0.1.0 | 模板字符串不兼容 → 字符串拼接 |
| v0.1.0 | await 超时回调位置错误 → Promise.race 修正 |
| v0.1.0 | 回调中未处理 exitCode |
| v0.1.1 | ctExec 双引号溢出转义 → toOctalEscaped 新增引号美元反引号百分号单引号转义 |
| v0.1.2 | 非 tmux send 退出码追踪 → cwd 文件覆盖修复 |
| v0.1.3 | tmux capture-pane 截断输出 → -S -9999 + 标记轮询 |
| v0.1.4 | input+control 同时发送文本丢失 → textInput/controlInput 分离 |
| v0.1.4 | read_screen 只显示提示符 → __DS_DONE__ 标记轮询机制 |
| v0.1.5 | 新增 exec_code 工具 → base64 + 临时脚本文件，零转义传递 |

---

## 安全特性

### shell 写入保护（2026-07-17）

shell 工具添加了命令黑名单过滤，拦截以下操作：

- **磁盘写入**：dd / mkfs.* / mke2fs / resize2fs / tune2fs
- **分区表**：fdisk / parted / gdisk
- **挂载**：mount / swapon / swapoff / mkswap
- **固件操作**：flash_* / fastboot
- **系统控制**：reboot / shutdown / halt / setenforce / fsck
- **块设备访问**：/dev/block/ /dev/mmcblk* /dev/sd* /dev/nvme*
- **危险路径**：rm 到 /boot /system /vendor /data
- **权限修改**：chmod / chown

命中黑名单返回 blocked: true, exit_code: -1。只读命令（ls/cat/ps/df 等）不受影响。

---

## 安装

### 前置条件
- Android 设备（已 root，KernelSU/Magisk/APatch）
- Droidspaces v6.4.0+
- ct_intercept 模块
- Operit AI 助手

### 安装方式
通过 Operit 的 debug_install_toolpkg 安装 droidspaces_tools_new.toolpkg 或从源码目录加载。

---

## 使用规约

每次调用工具前，按场景选择最合适的工具：

| 场景 | 工具 |
|------|------|
| 多行脚本、驱动编译、复杂 shell 语法 | exec_code（首选） |
| 简单单行命令（ls、which、ps） | exec |
| 交互式操作、保持工作目录 | enter + send + read_screen |
| 容器启停管理 | start / stop / restart |
| Android 宿主命令 | shell |

---

## 许可证

MIT License

---

## 作者

Operit Dev — [xl841376-netizen](https://github.com/xl841376-netizen)
