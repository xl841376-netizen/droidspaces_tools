/*
METADATA
{
    "name": "droidspaces",
    "display_name": {
        "zh": "Droidspaces 容器管理器",
        "en": "Droidspaces Container Manager"
    },
    "description": {
        "zh": "Droidspaces 容器管理工具。基于 Droidspaces-OSS，提供完整的容器生命周期管理、交互式终端、系统检查。内置 Shell，不依赖外部包。【使用规约见记忆条目：droidspaces_tools 工具使用规约】",
        "en": "Droidspaces container management tools. Based on Droidspaces-OSS, provides full container lifecycle management, interactive terminal, system checks. Built-in shell, no external dependencies."
    },
    "enabledByDefault": true,
    "category": "System",
    "tools": [
        { "name": "enter", "description": { "zh": "【交互终端】在容器中创建交互式终端会话（自动安装 tmux）。自带功能：自动检测并安装 tmux 确保持久工作目录和 Shell 状态。返回 session_id 供后续 send/read_screen 使用。不是用来执行单次命令的——单次命令走 exec 或 exec_code。", "en": "[Interactive Terminal] Create interactive terminal session (auto-installs tmux). Built-in: auto-detects and installs tmux for persistent cwd & shell state.  NOT for one-shot commands — use exec/exec_code." }, "parameters": [ { "name": "name", "type": "string", "required": true, "description": "容器名称" }, { "name": "user", "type": "string", "required": false, "description": "可选，指定用户" }, { "name": "session_id", "type": "string", "required": false, "description": "可选，自定义会话 ID" }, { "name": "timeout_ms", "type": "string", "required": false, "description": "超时毫秒（默认15000）" } ] },
        { "name": "send", "description": { "zh": "【终端发信】向已有交互式终端发送文本或控制键。只管发送不管读取。读取输出用 read_screen。不要用来替代 exec/exec_code 执行命令。", "en": "[Terminal Send] Send text/control to existing terminal. Send only. Use read_screen for output.  NOT for command execution — use exec/exec_code." }, "parameters": [ { "name": "session_id", "type": "string", "required": true, "description": "会话 ID" }, { "name": "input", "type": "string", "required": false, "description": "输入文本" }, { "name": "control", "type": "string", "required": false, "description": "控制键：enter/tab/esc/ctrl/ctrl_c/ctrl_d" } ] },
        { "name": "read_screen", "description": { "zh": "【终端读取】读取交互式终端的可见屏幕内容。只读不写。需要执行命令用 exec/exec_code。", "en": "[Terminal Read] Read visible screen content from terminal. Read only.  Use exec/exec_code to run commands." }, "parameters": [ { "name": "session_id", "type": "string", "required": true, "description": "会话 ID" } ] },
        { "name": "exec", "description": { "zh": "【快速命令】在容器中执行简单单条命令。只传命令，不做环境准备（不推脚本、不装 python3）。不要用来执行大段代码——会被截断。复杂脚本请用 exec_code（自动处理前置条件）。", "en": "[Quick Command] Execute one simple command in container. No env prep (no script push, no python3 install).  NOT for large code — will be truncated. Use exec_code for complex scripts." }, "parameters": [ { "name": "name", "type": "string", "required": true, "description": "容器名称" }, { "name": "command", "type": "string", "required": true, "description": "要执行的命令" }, { "name": "user", "type": "string", "required": false, "description": "可选，指定用户" }, { "name": "timeout_ms", "type": "string", "required": false, "description": "超时毫秒（默认30000）" } ] },
        { "name": "start", "description": { "zh": "【启动容器】启动一个新 Droidspaces 容器。只启动不执行命令。启动后如需执行命令走 exec/exec_code。", "en": "[Start Container] Start a new Droidspaces container. Starts only. Use exec/exec_code to run commands." }, "parameters": [ { "name": "name", "type": "string", "required": true, "description": "容器名称" }, { "name": "rootfs", "type": "string", "required": false, "description": "rootfs 目录路径" }, { "name": "rootfs_img", "type": "string", "required": false, "description": "rootfs ext4 镜像路径" }, { "name": "hostname", "type": "string", "required": false, "description": "容器主机名" }, { "name": "conf", "type": "string", "required": false, "description": "配置文件路径" }, { "name": "net", "type": "string", "required": false, "description": "网络模式 host/nat/none" }, { "name": "volatile", "type": "boolean", "required": false, "description": "临时模式" }, { "name": "bind_mounts", "type": "string", "required": false, "description": "绑定挂载 src:dst" }, { "name": "port", "type": "string", "required": false, "description": "端口转发 HOST:CONT[/proto]" }, { "name": "extra_args", "type": "string", "required": false, "description": "额外参数如 --gpu" } ] },
        { "name": "stop", "description": { "zh": "【停止容器】停止一个或多个容器。只停止不自动重启。", "en": "[Stop Container] Stop one or more containers. Stops only." }, "parameters": [ { "name": "names", "type": "string", "required": true, "description": "容器名逗号分隔" } ] },
        { "name": "restart", "description": { "zh": "【重启容器】快速重启容器（保留 loop mount）。只重启不做额外操作。", "en": "[Restart Container] Fast restart (preserves loop mounts). Restarts only." }, "parameters": [ { "name": "name", "type": "string", "required": true, "description": "容器名称" } ] },
        { "name": "list", "description": { "zh": "【列出容器】列出所有运行中的容器。只查询不修改。", "en": "[List Containers] List running containers. Read-only." }, "parameters": [ { "name": "timeout_ms", "type": "string", "required": false, "description": "超时毫秒（默认10000）" } ] },
        { "name": "info", "description": { "zh": "【容器详情】查看容器详细技术信息。只读不写。", "en": "[Container Info] View container technical info. Read-only." }, "parameters": [ { "name": "name", "type": "string", "required": true, "description": "容器名称" }, { "name": "timeout_ms", "type": "string", "required": false, "description": "超时毫秒（默认10000）" } ] },
        { "name": "scan", "description": { "zh": "【扫描容器】扫描并注册孤立容器。只扫描注册不执行命令。", "en": "[Scan Containers] Scan and register orphaned containers. Scan only." }, "parameters": [ { "name": "timeout_ms", "type": "string", "required": false, "description": "超时毫秒（默认15000）" } ] },
        { "name": "check", "description": { "zh": "【环境检查】验证系统要求与内核配置。只检查不修改。", "en": "[Environment Check] Verify system requirements. Check only." }, "parameters": [ { "name": "timeout_ms", "type": "string", "required": false, "description": "超时毫秒（默认15000）" } ] },
        { "name": "shell", "description": { "zh": "【宿主 Shell】在 Android 宿主上执行 Shell 命令（不是容器内！）。容器内执行命令请用 exec/exec_code。", "en": "[Host Shell] Execute command on Android HOST (NOT in container!).  Use exec/exec_code for container commands." }, "parameters": [ { "name": "command", "type": "string", "required": true, "description": "命令" }, { "name": "timeout_ms", "type": "string", "required": false, "description": "超时毫秒（默认15000）" } ] },
        { "name": "ping", "description": { "zh": "【连通测试】测试工具能否返回值给 UI。纯测试不操作容器。", "en": "[Ping Test] Test if tool returns value to UI. Pure test." }, "parameters": [] },
        { "name": "status", "description": { "zh": "【安装状态】获取 droidspaces 安装状态与容器列表。只读查询。", "en": "[Install Status] Get installation status and container list. Read-only." }, "parameters": [ { "name": "timeout_ms", "type": "string", "required": false, "description": "超时毫秒（默认10000）" } ] },
        { "name": "open_dashboard", "description": { "zh": "【仪表盘】打开容器管理器仪表盘 UI。只打开界面不做后台操作。", "en": "[Dashboard] Open container manager dashboard UI. UI only." }, "parameters": [] },
        { "name": "close", "description": { "zh": "【关闭终端】关闭交互式终端会话，清理 tmux 和临时文件。只清理不执行命令。", "en": "[Close Terminal] Close terminal session, cleanup tmux & temp files. Cleanup only." }, "parameters": [ { "name": "session_id", "type": "string", "required": true, "description": "会话 ID" } ] },
        { "name": "exec_code", "description": { "zh": "【复杂代码执行】在容器中执行大段/复杂代码脚本。自带功能：自动推送 ct_socket_transfer.py（TCP 自收发用），自动安装 python3（容器内缺时自动装）。容量上限 60000 字节（超时阻断）。简单单条命令请用 exec——更快更轻量。", "en": "[Complex Code Execution] Execute large/complex code in container. Built-in: auto-pushes ct_socket_transfer.py, auto-installs python3 if missing. Capacity: 60000 bytes max.  Simple commands? Use exec — faster, lighter." }, "parameters": [ { "name": "name", "type": "string", "required": true, "description": "容器名称" }, { "name": "code", "type": "string", "required": true, "description": "要执行的代码/脚本内容" }, { "name": "interpreter", "type": "string", "required": false, "description": "解释器，默认 bash。可选 python3/perl/sh 等" }, { "name": "timeout_ms", "type": "string", "required": false, "description": "超时毫秒（默认60000）" } ] }
    ]
}
*/
var DROIDSPACES_BIN = "/data/local/Droidspaces/bin/droidspaces";
var TRANSFER_SCRIPT_HOST = "/data/adb/modules/ct_intercept/system/bin/ct_socket_transfer.py";
var TRANSFER_SCRIPT_CONT = "/usr/local/bin/ct_socket_transfer.py";
async function runDroidspaces(args, timeoutMs) {
    var tmo = 0;
    if (timeoutMs !== undefined && timeoutMs !== null) {
        tmo = typeof timeoutMs === 'string' ? parseInt(timeoutMs, 10) : timeoutMs;
        if (isNaN(tmo) || tmo <= 0) tmo = 0;
    }
    var safeArgs = String(args).replace(/'/g, "'\\''");
    var cmd = "su -c '" + DROIDSPACES_BIN + " " + safeArgs + "' 2>&1; echo ___EXIT___:$?";
    try {
        var result;
        if (tmo > 0) {
            var shellPromise = Tools.System.shell(cmd);
            var timeoutPromise = new Promise(function(_, reject) {
                var timer = setTimeout(function() {
                    Tools.System.shell("su -c 'pkill -f \"droidspaces.*--name=.*run\" 2>/dev/null'").catch(function(){});
                    clearTimeout(timer);
                    reject(new Error("__TIMEOUT__:" + tmo));
                }, tmo);
            });
            result = await Promise.race([shellPromise, timeoutPromise]);
        } else {
            result = await Tools.System.shell(cmd);
        }
        var output = typeof result === 'string' ? result : (result && result.output ? result.output : String(result));
        var exitMatch = output.match(/___EXIT___:(\d+)$/m);
        var exitCode = exitMatch ? parseInt(exitMatch[1]) : 0;
        var cleanOutput = output.replace(/\n?___EXIT___:\d+$/m, '').trimEnd();
        return { success: true, output: cleanOutput, exit_code: exitCode };
    } catch (e) {
        var msg = e && e.message ? e.message : String(e);
        if (msg.startsWith("__TIMEOUT__:")) {
            var ms = msg.split(":")[1] || "unknown";
            return { success: true, output: "命令执行超时 (" + ms + "ms)", exit_code: -1, timed_out: true };
        }
        var exitMatch = msg.match(/exit code:\s*(\d+)/i);
        var exitCode = exitMatch ? parseInt(exitMatch[1]) : 1;
        var output = msg.replace(/^ADB command execution failed \(exit code: \d+\):\s*/m, '');
        return { success: true, output: output, exit_code: exitCode };
    }
}
async function runShell(cmd, timeoutMs) {
    var result = await Tools.System.shell(cmd);
    var output = typeof result === 'string' ? result : (result && result.output ? result.output : String(result));
    return { success: true, command: cmd, output: output, exit_code: result && result.exitCode ? result.exitCode : 0 };
}
async function ensureDroidspacesInstalled() {
    var chk = await Tools.System.shell("ls " + DROIDSPACES_BIN + " 2>/dev/null || echo 'NOT_FOUND'");
    var out = typeof chk === 'string' ? chk : String(chk);
    if (out.includes("NOT_FOUND")) return { ok: false, msg: "droidspaces 未安装" };
    return { ok: true, msg: "" };
}
async function isDroidspacesInstalled() {
    var r = await ensureDroidspacesInstalled();
    return r.ok;
}
async function statusTool(_params) {
    var cmd = "su -c '" + DROIDSPACES_BIN + " show 2>&1 || echo BIN_NOT_FOUND'";
    var result = await Tools.System.shell(cmd);
    var output = typeof result === 'string' ? result : (result && result.output ? result.output : String(result));
    if (output.includes("BIN_NOT_FOUND")) {
        globalThis.__droidspaces_status = { installed: false, containers: "", message: "droidspaces 未安装", from: "subpackage" };
        return { success: true, installed: false, binary: DROIDSPACES_BIN, containers: [], message: "droidspaces 未安装" };
    }
    globalThis.__droidspaces_status = { installed: true, containers: output, message: "droidspaces 已就绪", from: "subpackage" };
    return { success: true, installed: true, binary: DROIDSPACES_BIN, containers: output, message: "droidspaces 已就绪" };
}
function wrap(asyncFn) {
    return function(p) {
        try { return asyncFn(p); } catch(e) { return { success: false, message: e && e.message ? e.message : String(e) }; }
    };
}
var sessions = {};
/**
 * ctExec — 在容器中执行命令。
 * 正确链路：su → ct exec → droidspaces run, 经过 base64 管道直通。
 * 完全跳过多层 shell 解析，任意复杂命令安全传递。
 */
async function ctExec(container, cmd, timeoutMs) {
    var tmo = 0;
    if (timeoutMs !== undefined && timeoutMs !== null) {
        tmo = typeof timeoutMs === 'string' ? parseInt(timeoutMs, 10) : timeoutMs;
        if (isNaN(tmo) || tmo <= 0) tmo = 0;
    }
    var b64 = base64Encode(String(cmd));
    var fullCmd = "su -c 'ct " + container + " exec sh -c \"echo " + b64 + " | base64 -d | sh\" 2>&1; echo ___EXIT___:$?'";
    try {
        var result;
        if (tmo > 0) {
            var shellPromise = Tools.System.shell(fullCmd);
            var timeoutPromise = new Promise(function(_, reject) {
                var timer = setTimeout(function() { reject(new Error("__TIMEOUT__:" + tmo)); }, tmo);
            });
            result = await Promise.race([shellPromise, timeoutPromise]);
        } else {
            result = await Tools.System.shell(fullCmd);
        }
        var output = typeof result === 'string' ? result : (result && result.output ? result.output : String(result));
        var exitMatch = output.match(/___EXIT___:(\d+)$/m);
        var exitCode = exitMatch ? parseInt(exitMatch[1]) : 0;
        var cleanOutput = output.replace(/\n?___EXIT___:\d+$/m, '').trimEnd();
        return { success: true, output: cleanOutput, exit_code: exitCode };
    } catch (e) {
        var msg = e && e.message ? e.message : String(e);
        if (msg.startsWith("__TIMEOUT__:")) {
            var ms = msg.split(":")[1] || "unknown";
            return { success: true, output: "命令执行超时 (" + ms + "ms)", exit_code: -1, timed_out: true };
        }
        return { success: true, output: msg, exit_code: 1 };
    }
}
async function ctRaw(container, action, cmd) {
    var safeAction = String(action).replace(/'/g, "'\\''");
    var fullCmd;
    if (cmd !== undefined) {
        var b64 = base64Encode(String(cmd));
        fullCmd = "su -c 'ct " + container + " " + safeAction + " sh -c \"echo " + b64 + " | base64 -d | sh\" 2>&1; echo ___EXIT___:$?'";
    } else {
        fullCmd = "su -c 'ct " + container + " " + safeAction + "' 2>&1; echo ___EXIT___:$?";
    }
    try {
        var result = await Tools.System.shell(fullCmd);
        var output = typeof result === 'string' ? result : (result && result.output ? result.output : String(result));
        var exitMatch = output.match(/___EXIT___:(\d+)$/m);
        var exitCode = exitMatch ? parseInt(exitMatch[1]) : 0;
        var cleanOutput = output.replace(/\n?___EXIT___:\d+$/m, '').trimEnd();
        return { success: true, output: cleanOutput, exit_code: exitCode };
    } catch (e) {
        return { success: true, output: String(e), exit_code: 1 };
    }
}
function genSessionId() {
    return "s" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}
/** enterTool — 使用 ct 创建交互式终端会话。同上。 */
async function enterTool(params) {
    if (!params.name) return { success: true, message: "容器名称 (name) 是必填项", skipped: true };
    var ctCheck = await ctRaw("", "list");
    if (ctCheck.exit_code !== 0 || ctCheck.output.includes("not found")) return { success: true, message: "ct (Container Tool) 未安装。请在 KernelSU Manager 中安装 ct_intercept 模块。", skipped: true };
    var containerList = ctCheck.output.trim();
    var containerNames = containerList.split(/\s+/);
    if (containerNames.indexOf(params.name) === -1) return { success: true, message: "容器 '" + params.name + "' 未在 ct 配置中定义。请检查 /data/local/ct/containers.conf", skipped: true };
    var statusCheck = await ctRaw(params.name, "status");
    if (statusCheck.output.includes("not running") || statusCheck.output.includes("stopped") || statusCheck.exit_code !== 0) return { success: true, message: "容器 '" + params.name + "' 未运行。请先使用 start 工具启动容器。", skipped: true };
    var sid = params.session_id || genSessionId();
    var tmuxCheck = await ctExec(params.name, "which tmux 2>/dev/null && echo TMUX_OK || echo TMUX_NONE");
    var hasTmux = tmuxCheck.output.indexOf("TMUX_OK") !== -1 && tmuxCheck.output.indexOf("TMUX_NONE") === -1;
    if (!hasTmux) {
        var installResult = await ctExec(params.name, "apt-get update -qq 2>/dev/null && apt-get install -y tmux 2>/dev/null && echo INSTALL_OK || echo INSTALL_FAIL", 60000);
        if (installResult.output.indexOf("INSTALL_OK") === -1) installResult = await ctExec(params.name, "apk add tmux 2>/dev/null && echo INSTALL_OK || echo INSTALL_FAIL", 60000);
        if (installResult.output.indexOf("INSTALL_OK") === -1) installResult = await ctExec(params.name, "yum install -y tmux 2>/dev/null && echo INSTALL_OK || echo INSTALL_FAIL", 60000);
        var verifyCheck = await ctExec(params.name, "which tmux 2>/dev/null && echo TMUX_OK || echo TMUX_NONE");
        hasTmux = verifyCheck.output.indexOf("TMUX_OK") !== -1 && verifyCheck.output.indexOf("TMUX_NONE") === -1;
    }
if (hasTmux) await ctExec(params.name, "tmux ls 2>/dev/null | grep '^ct_' | cut -d: -f1 | xargs -I{} tmux kill-session -t {} 2>/dev/null; SHELL=/bin/bash tmux new-session -d -s ct_" + sid + " -c /root /bin/bash 2>/dev/null");
    await ctExec(params.name, "rm -rf /tmp/.ct_session_" + sid + " 2>/dev/null; mkdir -p /tmp/.ct_session_" + sid + " && echo /root > /tmp/.ct_session_" + sid + "/cwd");
    sessions[sid] = { name: params.name, container: params.name, sid: sid, hasTmux: hasTmux, lastOutput: "", createdAt: Date.now() };
    return { success: true, session_id: sid, container: params.name, has_tmux: hasTmux, message: hasTmux ? "交互式终端已通过 ct + tmux 创建。tmux 已自动安装。使用 send 发送命令，read_screen 读取输出。工作目录和 Shell 状态会持续保持。" : "交互式终端已通过 ct 创建（tmux 安装失败，使用工作目录文件追踪）。使用 send 发送命令，read_screen 读取输出。" };
}
function escapeForTmux(input) {
    return "'" + input.replace(/'/g, "'\\''") + "'";
}
function sleep(ms) { return new Promise(function(resolve) { setTimeout(resolve, ms); }); }

/**
 * sendTool — 向交互式终端发送输入。
 *  tmux 模式：仅 tmux send-keys（单通道），capture-pane 返回输出。
 *  非 tmux 模式：ctExec + cwd 追踪；控制键仅在 tmux 下完全支持。
 */
async function sendTool(params) {
    if (!params.session_id) return { success: true, message: "session_id 是必填项", skipped: true };
    var state = sessions[params.session_id];
    if (!state) return { success: true, message: "会话 '" + params.session_id + "' 不存在，请先 enter", skipped: true };
    var textInput = "";
    var controlInput = "";
    if (params.input) textInput = String(params.input);
    if (params.control) controlInput = String(params.control);
    if (!textInput && !controlInput) return { success: true, message: "input 或 control 是必填项", skipped: true };
    var output = "";
    var exitCode = 0;

    if (state.hasTmux) {
        var keysCmd = "";
        if (textInput) {
            keysCmd += "tmux send-keys -t ct_" + state.sid + " " + escapeForTmux(textInput) + " Enter 2>/dev/null; ";
        }
        if (controlInput) {
            var tmuxKey = "";
            switch (controlInput) {
                case "enter": tmuxKey = "Enter"; break;
                case "tab": tmuxKey = "Tab"; break;
                case "esc": tmuxKey = "Escape"; break;
                case "ctrl": case "ctrl_c": tmuxKey = "C-c"; break;
                case "ctrl_d": tmuxKey = "C-d"; break;
                default: tmuxKey = controlInput; break;
            }
            keysCmd += "tmux send-keys -t ct_" + state.sid + " " + escapeForTmux(tmuxKey) + " 2>/dev/null; ";
        }
        if (textInput) {
            keysCmd += "tmux send-keys -t ct_" + state.sid + " " + escapeForTmux("echo __DS_DONE__") + " Enter 2>/dev/null";
        }
        await ctExec(state.name, keysCmd, 10000);
        if (textInput) {
            var marker = "__DS_DONE__";
            var pollStart = Date.now();
            var pollTimeout = 15000;
            var screenContent = "";
            while (Date.now() - pollStart < pollTimeout) {
                await sleep(150);
                var capture = await ctExec(state.name, "tmux capture-pane -t ct_" + state.sid + " -p -S -9999 2>/dev/null", 5000);
                screenContent = capture.output;
                if (screenContent.indexOf(marker) !== -1) break;
            }
            if (!screenContent) {
                var capture = await ctExec(state.name, "tmux capture-pane -t ct_" + state.sid + " -p -S -9999 2>/dev/null", 5000);
                screenContent = capture.output;
            }
            output = screenContent.split('\n').filter(function(line) { return line.indexOf(marker) === -1; }).join('\n').trim();
        } else {
            var capture = await ctExec(state.name, "tmux capture-pane -t ct_" + state.sid + " -p -S -9999 2>/dev/null", 5000);
            output = capture.output.trim();
        }
        exitCode = 0;
        state.lastOutput = output;
    } else {
        if (controlInput) {
            switch (controlInput) {
                case "enter": {
                    var enterResult = await ctExec(state.name, "cd \"$(cat /tmp/.ct_session_" + state.sid + "/cwd 2>/dev/null || echo /root)\" 2>/dev/null; pwd; echo '---STATUS---'; ls 2>/dev/null", 10000);
                    output = enterResult.output; exitCode = enterResult.exit_code; state.lastOutput = output;
                    return { success: true, session_id: state.sid, container: state.name, command_sent: "[enter]", output: output, exit_code: exitCode, has_tmux: false, note: "非 tmux 模式下 enter 仅刷新状态" };
                }
                case "tab": case "esc": case "ctrl": case "ctrl_c": case "ctrl_d":
                    return { success: true, session_id: state.sid, container: state.name, command_sent: "[" + controlInput + "]", output: "", exit_code: 0, has_tmux: false, note: "控制键 " + controlInput + " 仅在 tmux 模式下有效" };
                default: break;
            }
        }
        if (textInput) {
            var cwdFile = "/tmp/.ct_session_" + state.sid + "/cwd";
            var execResult = await ctExec(state.name, "cd \"$(cat " + cwdFile + " 2>/dev/null || echo /root)\" 2>/dev/null; " + textInput + " 2>&1; echo ___EXIT___:$?; pwd > " + cwdFile + "_ && mv " + cwdFile + "_ " + cwdFile, 30000);
            output = execResult.output.trimEnd();
            var exitMatch = output.match(/___EXIT___:(\d+)$/m);
            exitCode = exitMatch ? parseInt(exitMatch[1]) : 0;
            output = output.replace(/\n?___EXIT___:\d+$/m, '').trimEnd();
            if (execResult.exit_code !== 0 && !output) output = "(命令已执行，无输出)";
        }
        state.lastOutput = output;
    }
    return { success: true, session_id: state.sid, container: state.name, command_sent: textInput || "[" + controlInput + "]", output: output, exit_code: exitCode, has_tmux: state.hasTmux };
}

/**
 * readScreenTool — 读取终端显示内容。
 *  tmux 模式：capture-pane。
 *  无 tmux 模式：通过 ctExec 获取 cwd 和 lastOutput。
 */
async function readScreenTool(params) {
    if (!params.session_id) return { success: true, message: "session_id 是必填项", skipped: true };
    var state = sessions[params.session_id];
    if (!state) return { success: true, message: "会话 '" + params.session_id + "' 不存在，请先 enter", skipped: true };
    if (state.hasTmux) {
        var capture = await ctExec(state.name, "tmux capture-pane -t ct_" + state.sid + " -p -S -9999 2>/dev/null");
        state.lastOutput = capture.output;
        return { success: true, session_id: state.sid, container: state.name, screen: capture.output, has_tmux: true };
    } else {
        var cwdResult = await ctExec(state.name, "echo '=== CWD ==='; cat /tmp/.ct_session_" + state.sid + "/cwd 2>/dev/null || echo '(unknown)'; echo '=== LAST OUTPUT ==='; echo '" + String(state.lastOutput || "(no output yet)").replace(/'/g, "'\\''") + "'", 10000);
        return { success: true, session_id: state.sid, container: state.name, screen: cwdResult.output, has_tmux: false };
    }
}

/** closeTool — 关闭交互式终端会话，清理资源 */
async function closeTool(params) {
    if (!params.session_id) return { success: true, message: "session_id 是必填项", skipped: true };
    await sessionCleanup(params.session_id);
    return { success: true, session_id: params.session_id, message: "会话已关闭，tmux 会话和临时文件已清理" };
}

/** 清理指定会话的后台资源 */
async function sessionCleanup(sid) {
    var state = sessions[sid];
    if (!state) return;
    if (state.hasTmux) await ctExec(state.name, "tmux kill-session -t ct_" + sid + " 2>/dev/null").catch(function(){});
    await ctExec(state.name, "rm -rf /tmp/.ct_session_" + sid + " 2>/dev/null").catch(function(){});
    delete sessions[sid];
}

async function isContainerRunning(name) {
    var r = await runDroidspaces("show");
    return r.output.indexOf(name) !== -1;
}
async function execTool(params) {
    if (!params.name || !params.command) return { success: true, message: "name 和 command 是必填项", skipped: true };
    var result = await ctExec(params.name, params.command, params.timeout_ms || 30000);
    return { success: result.success, container: params.name, command: params.command, output: result.output || "", exit_code: result.exit_code };
}
/**
 * execCodeTool — 在容器中执行大段/复杂代码脚本。
 * 链路：JS base64 → @b64: 直通 → su → ct exec_code → TCP 握手传码 → 解码写入 → 执行
 * interpreter 参数透传，内部 sh/bash/dash fallback 链。
 * 自动清理临时文件。
 *
 * 容量限制：单次传输上限约 60000 字节（源码长度）。
 *   这是因为整个命令通过 execve（128KB 上限）传递，base64 编码膨胀 ~33%。
 *   超过 60000 字节时工具会提前阻断返回错误，请改用其他方式（如宿主写文件后 stdin 重定向）。
 */
async function execCodeTool(params) {
    if (!params.name) return { success: true, message: "容器名称 (name) 是必填项", skipped: true };
    if (!params.code) return { success: true, message: "代码内容 (code) 是必填项", skipped: true };
    var code = String(params.code);
    var interp = (params.interpreter || "").trim();
    var tmo = params.timeout_ms || 120000;

    // 自动推送 transfer 脚本（非关键，失败不影响主流程）
    await ensureTransferWithPython(params.name);
    
    // 容量限制：超 60000 字节时提前阻断，避免被 execve 静默截断
    if (code.length > 60000) {
        return { success: true, container: params.name, code_length: code.length,
            interpreter: interp || "sh",
            output: "代码长度 " + code.length + " 字节超出单次传输上限 60000 字节。"
                + "请将代码保存到宿主文件后通过 stdin 重定向执行（使用 exec/enter 工具）。",
            exit_code: -2 };
    }

    // 方案：@b64: 直通，跳过中间编解码
    // ct exec_code 识别 @b64: 前缀后直接 TCP 传码，不做二次编码
    var b64 = base64Encode(code);
    var interpArg = interp ? " " + interp : "";
    var fullCmd = "su -c '/data/adb/modules/ct_intercept/system/bin/ct "
        + params.name + " exec_code @b64:" + b64 + interpArg + "' 2>&1; echo ___EXIT___:$?";
    try {
        var result = await Tools.System.shell(fullCmd);
        var output = typeof result === 'string' ? result : (result && result.output ? result.output : String(result));
        var exitMatch = output.match(/___EXIT___:(\d+)$/m);
        var exitCode = exitMatch ? parseInt(exitMatch[1]) : 0;
        var cleanOutput = output.replace(/\n?___EXIT___:\d+$/m, '').trimEnd();
        return { success: true, container: params.name, code_length: code.length, interpreter: interp || "sh", output: cleanOutput, exit_code: exitCode };
    } catch (e) {
        var msg = e && e.message ? e.message : String(e);
        return { success: false, container: params.name, code_length: code.length, interpreter: interp || "sh", output: msg, exit_code: 1 };
    }
}

/** base64 编码（保留供其他函数使用） */
function base64Encode(str) {
    var b64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var bytes = [];
    for (var i = 0; i < str.length; i++) {
        var cp = str.charCodeAt(i);
        if (cp < 0x80) bytes.push(cp);
        else if (cp < 0x800) { bytes.push(0xc0 | (cp >>> 6)); bytes.push(0x80 | (cp & 0x3f)); }
        else if (cp < 0xd800 || cp > 0xdfff) { bytes.push(0xe0 | (cp >>> 12)); bytes.push(0x80 | ((cp >>> 6) & 0x3f)); bytes.push(0x80 | (cp & 0x3f)); }
        else { i++; var cp2 = str.charCodeAt(i); var fullCp = 0x10000 + ((cp - 0xd800) << 10) + (cp2 - 0xdc00); bytes.push(0xf0 | (fullCp >>> 18)); bytes.push(0x80 | ((fullCp >>> 12) & 0x3f)); bytes.push(0x80 | ((fullCp >>> 6) & 0x3f)); bytes.push(0x80 | (fullCp & 0x3f)); }
    }
    var b64 = "";
    for (var i = 0; i < bytes.length; i += 3) {
        var b0 = bytes[i];
        var b1 = i + 1 < bytes.length ? bytes[i + 1] : -1;
        var b2 = i + 2 < bytes.length ? bytes[i + 2] : -1;
        var c0 = b0 >>> 2;
        var c1 = (b0 & 0x3) << 4;
        if (b1 >= 0) c1 |= b1 >>> 4;
        b64 += b64chars.charAt(c0) + b64chars.charAt(c1);
        if (b1 >= 0) {
            var c2 = ((b1 & 0xf) << 2);
            if (b2 >= 0) {
                c2 |= b2 >>> 6;
                var c3 = b2 & 0x3f;
                b64 += b64chars.charAt(c2) + b64chars.charAt(c3);
            } else {
                b64 += b64chars.charAt(c2) + "=";
            }
        } else {
            b64 += "==";
        }
    }
    return b64;
}
async function listTool(_params) {
    if (!(await isDroidspacesInstalled())) return { success: true, message: "droidspaces 未安装", skipped: true };
    return await runDroidspaces("list");
}
async function infoTool(params) {
    if (!params.name) return { success: true, message: "容器名称 (name) 是必填项", skipped: true };
    if (!(await isDroidspacesInstalled())) return { success: true, message: "droidspaces 未安装", skipped: true };
    return await runDroidspaces("show");
}
async function startTool(params) {
    if (!params.name) return { success: true, message: "容器名称 (name) 是必填项", skipped: true };
    var cmd = "start --name " + params.name;
    if (params.rootfs) cmd += " --rootfs=" + params.rootfs;
    if (params.rootfs_img) cmd += " --rootfs-img=" + params.rootfs_img;
    if (params.hostname) cmd += " --hostname=" + params.hostname;
    if (params.conf) cmd += " --conf=" + params.conf;
    if (params.net) cmd += " --net=" + params.net;
    if (params.volatile !== undefined) cmd += params.volatile ? " --volatile" : "";
    if (params.bind_mounts) cmd += " --bind=" + params.bind_mounts;
    if (params.port) cmd += " -p " + params.port;
    if (params.extra_args) cmd += " " + params.extra_args;
    return await runDroidspaces(cmd);
}
async function stopTool(params) {
    if (!params.names) return { success: true, message: "names 是必填项（逗号分隔的容器名）", skipped: true };
    var names = params.names.split(',').map(function(n) { return n.trim(); }).filter(function(n) { return n.length > 0; }).join(' ');
    if (!names) return { success: true, message: "未指定有效容器名", skipped: true };
    return await runDroidspaces("stop --name " + names);
}
async function restartTool(params) {
    if (!params.name) return { success: true, message: "容器名称 (name) 是必填项", skipped: true };
    return await runDroidspaces("restart --name " + params.name);
}
async function scanTool(_params) {
    if (!(await isDroidspacesInstalled())) return { success: true, message: "droidspaces 未安装", skipped: true };
    return await runDroidspaces("scan");
}
async function checkTool(_params) {
    if (!(await isDroidspacesInstalled())) return { success: true, message: "droidspaces 未安装", skipped: true };
    return await runDroidspaces("check");
}
async function shellTool(params) {
    if (!params.command) return { success: true, message: "command 是必填项", skipped: true };
    return await runShell(params.command);
}
async function pingTool() { return { success: true, pong: true, ts: Date.now(), from: "subpackage" }; }
async function openDashboardTool() {
    try { await ToolPkg.openUiRoute("droidspaces_dashboard"); return { success: true, message: "仪表盘已打开" }; }
    catch(e) { return { success: true, message: "打开仪表盘失败: " + (e && e.message ? e.message : e), skipped: true }; }
}
var Droidspaces = {
    enter: wrap(enterTool), send: wrap(sendTool), read_screen: wrap(readScreenTool), exec: wrap(execTool),
    exec_code: wrap(execCodeTool),
    start: wrap(startTool), stop: wrap(stopTool), restart: wrap(restartTool), list: wrap(listTool),
    info: wrap(infoTool), scan: wrap(scanTool), check: wrap(checkTool), shell: wrap(shellTool),
    status: wrap(statusTool), ping: wrap(pingTool), open_dashboard: wrap(openDashboardTool),
    close: wrap(closeTool)
};
exports.enter = Droidspaces.enter;
exports.send = Droidspaces.send;
exports.read_screen = Droidspaces.read_screen;
exports.exec = Droidspaces.exec;
exports.exec_code = Droidspaces.exec_code;
exports.start = Droidspaces.start;
exports.stop = Droidspaces.stop;
exports.restart = Droidspaces.restart;
exports.list = Droidspaces.list;
exports.info = Droidspaces.info;
exports.scan = Droidspaces.scan;
exports.check = Droidspaces.check;
exports.shell = Droidspaces.shell;
exports.status = Droidspaces.status;
exports.ping = Droidspaces.ping;
exports.open_dashboard = Droidspaces.open_dashboard;
exports.close = Droidspaces.close;

/**
 * ensureTransferWithPython — 自动推送 ct_socket_transfer.py + 自动安装 python3。
 * 检测脚本是否存在 /usr/local/bin/ct_socket_transfer.py，如缺则从宿主推送。
 * 检测 python3 是否可用，如缺则自动尝试 apt-get/yum/apk 安装。
 * 在 execCodeTool 入口自动调用，失败不影响主流程。
 */

async function ensureTransferWithPython(containerName) {
    try {
        // === 第一步：检测脚本 ===
        var scriptChk = await ctExec(containerName, "test -f " + TRANSFER_SCRIPT_CONT + " && echo SCRIPT_OK || echo SCRIPT_MISSING", 5000);
        var scriptExists = (scriptChk.output || "").indexOf("SCRIPT_OK") !== -1;

        // === 第二步：检测 python3 ===
        var pyChk = await ctExec(containerName, "command -v python3 2>/dev/null && echo PY_OK || echo PY_MISSING", 5000);
        var pyExists = (pyChk.output || "").indexOf("PY_OK") !== -1;

        // 两者都已就绪 → 快速返回
        if (scriptExists && pyExists) return { done: true, reason: "all_ready" };

        // === 第三步：缺 python3 → 自动安装 ===
        if (!pyExists) {
            // 尝试1: 通过包管理器安装
            var installAttempts = [
                { cmd: "apt-get install -y python3 2>/dev/null && echo INSTALL_OK || echo FAIL", label: "apt-get" },
                { cmd: "yum install -y python3 2>/dev/null && echo INSTALL_OK || echo FAIL", label: "yum" },
                { cmd: "apk add python3 2>/dev/null && echo INSTALL_OK || echo FAIL", label: "apk" }
            ];
            for (var i = 0; i < installAttempts.length; i++) {
                var att = installAttempts[i];
                var r = await ctExec(containerName, att.cmd, 90000);
                if (r.output && r.output.indexOf("INSTALL_OK") !== -1) {
                    var verify = await ctExec(containerName, "command -v python3 2>/dev/null && echo PY_OK || echo PY_MISSING", 5000);
                    if ((verify.output || "").indexOf("PY_OK") !== -1) { pyExists = true; break; }
                }
            }

            // 尝试2: 包管理器安装成功但 binary 没重建 → 找版本号文件手动建 symlink
            if (!pyExists) {
                var findPy = await ctExec(containerName, "ls /usr/bin/python3.* 2>/dev/null | grep -E '/usr/bin/python3\\.[0-9]+$' | head -1", 5000);
                var pyVerPath = (findPy.output || "").trim();
                if (pyVerPath && pyVerPath.length > 0) {
                    var linkCmd = "ln -sf " + pyVerPath + " /usr/bin/python3 2>/dev/null && command -v python3 2>/dev/null && echo PY_OK || echo PY_MISSING";
                    var linkResult = await ctExec(containerName, linkCmd, 5000);
                    if ((linkResult.output || "").indexOf("PY_OK") !== -1) pyExists = true;
                }
            }
        }

        // === 第四步：缺脚本 → 从宿主推送 ===
        if (!scriptExists) {
            var raw = await Tools.System.shell("cat " + TRANSFER_SCRIPT_HOST + " | base64 -w0");
            var b64 = (typeof raw === 'string' ? raw : (raw && raw.output || '')).trim();
            if (b64 && b64.length >= 100) {
                var pushCmd = "mkdir -p /usr/local/bin && echo '" + b64 + "' | base64 -d > " + TRANSFER_SCRIPT_CONT + " && chmod 0755 " + TRANSFER_SCRIPT_CONT + " && echo PUSH_OK";
                var push = await ctExec(containerName, pushCmd, 15000);
                if (push.output && push.output.indexOf("PUSH_OK") !== -1) scriptExists = true;
            }
        }

        return { done: true, script_ok: scriptExists, python_ok: pyExists };
    } catch (e) {
        return { done: false, reason: "exception", msg: String(e).substring(0, 200) };
    }
}