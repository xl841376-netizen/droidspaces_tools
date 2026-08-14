/*
 * droidspaces_tools — TypeScript Source v0.2.0
 * Target: QuickJS (ES5+ subset) via Python compile script
 * Compile: python3 compile.py → packages/droidspaces.js
 */

/* METADATA
{
    "name": "droidspaces",
    "display_name": {
        "zh": "Droidspaces 容器管理器",
        "en": "Droidspaces Container Manager"
    },
    "description": {
        "zh": "Droidspaces 容器管理工具。基于 Droidspaces-OSS，提供完整的容器生命周期管理、交互式终端、系统检查。内置 Shell，不依赖外部包。",
        "en": "Droidspaces container management tools. Based on Droidspaces-OSS, provides full container lifecycle management, interactive terminal, system checks. Built-in shell, no external dependencies."
    },
    "enabledByDefault": true,
    "category": "System",
    "tools": [
        { "name": "enter", "description": { "zh": "【交互终端】在容器中创建交互式终端会话（自动安装 tmux）。返回 session_id。不是用来执行单次命令的——单次命令走 exec_code。", "en": "[Interactive Terminal] Create interactive terminal session (auto-installs tmux). NOT for one-shot commands — use exec_code." }, "parameters": [ { "name": "name", "type": "string", "required": true, "description": "容器名称" }, { "name": "user", "type": "string", "required": false, "description": "可选，指定用户" }, { "name": "session_id", "type": "string", "required": false, "description": "可选，自定义会话 ID" }, { "name": "timeout_ms", "type": "string", "required": false, "description": "超时毫秒（默认15000）" } ] },
        { "name": "send", "description": { "zh": "【终端发信】向已有交互式终端发送文本或控制键。只管发送不管读取。", "en": "[Terminal Send] Send text/control to existing terminal." }, "parameters": [ { "name": "session_id", "type": "string", "required": true, "description": "会话 ID" }, { "name": "input", "type": "string", "required": false, "description": "输入文本" }, { "name": "control", "type": "string", "required": false, "description": "控制键：enter/tab/esc/ctrl/ctrl_c/ctrl_d" } ] },
        { "name": "read_screen", "description": { "zh": "【终端读取】读取交互式终端的可见屏幕内容。只读不写。", "en": "[Terminal Read] Read visible screen content from terminal." }, "parameters": [ { "name": "session_id", "type": "string", "required": true, "description": "会话 ID" } ] },
        { "name": "start", "description": { "zh": "【启动容器】启动一个新 Droidspaces 容器。只启动不执行命令。", "en": "[Start Container] Start a new Droidspaces container." }, "parameters": [ { "name": "name", "type": "string", "required": true, "description": "容器名称" }, { "name": "rootfs", "type": "string", "required": false, "description": "rootfs 目录路径" }, { "name": "rootfs_img", "type": "string", "required": false, "description": "rootfs ext4 镜像路径" }, { "name": "hostname", "type": "string", "required": false, "description": "容器主机名" }, { "name": "conf", "type": "string", "required": false, "description": "配置文件路径" }, { "name": "net", "type": "string", "required": false, "description": "网络模式 host/nat/none" }, { "name": "volatile", "type": "boolean", "required": false, "description": "临时模式" }, { "name": "bind_mounts", "type": "string", "required": false, "description": "绑定挂载 src:dst" }, { "name": "port", "type": "string", "required": false, "description": "端口转发 HOST:CONT[/proto]" }, { "name": "extra_args", "type": "string", "required": false, "description": "额外参数如 --gpu" } ] },
        { "name": "stop", "description": { "zh": "【停止容器】停止一个或多个容器。只停止不自动重启。", "en": "[Stop Container] Stop one or more containers." }, "parameters": [ { "name": "names", "type": "string", "required": true, "description": "容器名逗号分隔" } ] },
        { "name": "restart", "description": { "zh": "【重启容器】快速重启容器（保留 loop mount）。", "en": "[Restart Container] Fast restart (preserves loop mounts)." }, "parameters": [ { "name": "name", "type": "string", "required": true, "description": "容器名称" } ] },
        { "name": "list", "description": { "zh": "【列出容器】列出所有运行中的容器。只查询不修改。", "en": "[List Containers] List running containers." }, "parameters": [ { "name": "timeout_ms", "type": "string", "required": false, "description": "超时毫秒（默认10000）" } ] },
        { "name": "info", "description": { "zh": "【容器详情】查看容器详细技术信息。只读不写。", "en": "[Container Info] View container technical info." }, "parameters": [ { "name": "name", "type": "string", "required": true, "description": "容器名称" }, { "name": "timeout_ms", "type": "string", "required": false, "description": "超时毫秒（默认10000）" } ] },
        { "name": "scan", "description": { "zh": "【扫描容器】扫描并注册孤立容器。只扫描注册不执行命令。", "en": "[Scan Containers] Scan and register orphaned containers." }, "parameters": [ { "name": "timeout_ms", "type": "string", "required": false, "description": "超时毫秒（默认15000）" } ] },
        { "name": "check", "description": { "zh": "【环境检查】验证系统要求与内核配置。只检查不修改。", "en": "[Environment Check] Verify system requirements." }, "parameters": [ { "name": "timeout_ms", "type": "string", "required": false, "description": "超时毫秒（默认15000）" } ] },
        { "name": "shell", "description": { "zh": "【宿主 Shell】在 Android 宿主上执行 Shell 命令（不是容器内！）。容器内执行命令请用 exec_code。", "en": "[Host Shell] Execute command on Android HOST (NOT in container!). Use exec_code for container commands." }, "parameters": [ { "name": "command", "type": "string", "required": true, "description": "命令" }, { "name": "timeout_ms", "type": "string", "required": false, "description": "超时毫秒（默认15000）" } ] },
        { "name": "ping", "description": { "zh": "【连通测试】测试工具能否返回值给 UI。纯测试不操作容器。", "en": "[Ping Test] Test if tool returns value to UI." }, "parameters": [] },
        { "name": "status", "description": { "zh": "【安装状态】获取 droidspaces 安装状态与容器列表。只读查询。", "en": "[Install Status] Get installation status and container list." }, "parameters": [ { "name": "timeout_ms", "type": "string", "required": false, "description": "超时毫秒（默认10000）" } ] },
        { "name": "open_dashboard", "description": { "zh": "【仪表盘】打开容器管理器仪表盘 UI。只打开界面不做后台操作。", "en": "[Dashboard] Open container manager dashboard UI." }, "parameters": [] },
        { "name": "close", "description": { "zh": "【关闭终端】关闭交互式终端会话，清理 tmux 和临时文件。只清理不执行命令。", "en": "[Close Terminal] Close terminal session, cleanup tmux & temp files." }, "parameters": [ { "name": "session_id", "type": "string", "required": true, "description": "会话 ID" } ] },
        { "name": "exec_code", "description": { "zh": "【容器命令/代码执行】在容器中执行任意命令或代码。统一走 ct exec + base64 单引号管道。容量上限 60000 字节。", "en": "[Container Command/Code Execution] Execute any command or code in container. Unified ct exec + base64 single-quoted pipe. Capacity: 60000 bytes max." }, "parameters": [ { "name": "name", "type": "string", "required": true, "description": "容器名称" }, { "name": "code", "type": "string", "required": true, "description": "要执行的代码/脚本内容" }, { "name": "interpreter", "type": "string", "required": false, "description": "解释器，默认 sh。可选 python3/perl/bash 等" }, { "name": "timeout_ms", "type": "string", "required": false, "description": "超时毫秒（默认60000）" } ] }
    ]
}
*/

// ====== Constants ======

const DROIDSPACES_BIN: string = "/data/local/Droidspaces/bin/droidspaces";
const CT_BIN: string = "/data/adb/modules/ct_intercept/system/bin/ct";
const TRANSFER_SCRIPT_HOST: string = "/data/adb/modules/ct_intercept/system/bin/ct_socket_transfer.py";
const TRANSFER_SCRIPT_CONT: string = "/usr/local/bin/ct_socket_transfer.py";

// ====== Type definitions ======

interface ShellResult {
    success: boolean;
    command?: string;
    output: string;
    exit_code: number;
    timed_out?: boolean;
}

interface DroidspacesResult {
    success: boolean;
    output: string;
    exit_code: number;
    timed_out?: boolean;
}

interface SessionState {
    name: string;
    container: string;
    sid: string;
    hasTmux: boolean;
    lastOutput: string;
    createdAt: number;
}

interface ToolParams {
    [key: string]: any;
}

// ====== Utility functions ======

function parseTimeout(timeoutMs: any): number {
    if (timeoutMs === undefined || timeoutMs === null) return 0;
    const tmo: number = typeof timeoutMs === "string" ? parseInt(timeoutMs, 10) : timeoutMs;
    return (isNaN(tmo) || tmo <= 0) ? 0 : tmo;
}

/** base64 encode (RFC 4648) */
function base64Encode(str: string): string {
    const b64chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const bytes: number[] = [];
    for (let i: number = 0; i < str.length; i++) {
        const cp: number = str.charCodeAt(i);
        if (cp < 0x80) { bytes.push(cp); }
        else if (cp < 0x800) { bytes.push(0xc0 | (cp >>> 6)); bytes.push(0x80 | (cp & 0x3f)); }
        else if (cp < 0xd800 || cp > 0xdfff) {
            bytes.push(0xe0 | (cp >>> 12));
            bytes.push(0x80 | ((cp >>> 6) & 0x3f));
            bytes.push(0x80 | (cp & 0x3f));
        } else {
            i++;
            const cp2: number = str.charCodeAt(i);
            const fullCp: number = 0x10000 + ((cp - 0xd800) << 10) + (cp2 - 0xdc00);
            bytes.push(0xf0 | (fullCp >>> 18));
            bytes.push(0x80 | ((fullCp >>> 12) & 0x3f));
            bytes.push(0x80 | ((fullCp >>> 6) & 0x3f));
            bytes.push(0x80 | (fullCp & 0x3f));
        }
    }
    let b64: string = "";
    for (let i: number = 0; i < bytes.length; i += 3) {
        const b0: number = bytes[i];
        const b1: number = i + 1 < bytes.length ? bytes[i + 1] : -1;
        const b2: number = i + 2 < bytes.length ? bytes[i + 2] : -1;
        const c0: number = b0 >>> 2;
        let c1: number = (b0 & 0x3) << 4;
        if (b1 >= 0) c1 |= b1 >>> 4;
        b64 += b64chars.charAt(c0) + b64chars.charAt(c1);
        if (b1 >= 0) {
            let c2: number = ((b1 & 0xf) << 2);
            if (b2 >= 0) {
                c2 |= b2 >>> 6;
                b64 += b64chars.charAt(c2) + b64chars.charAt(b2 & 0x3f);
            } else {
                b64 += b64chars.charAt(c2) + "=";
            }
        } else {
            b64 += "==";
        }
    }
    return b64;
}

// ====== Shell execution ======

async function runShell(cmd: string): Promise<ShellResult> {
    const result: any = await Tools.System.shell(cmd);
    const output: string = typeof result === "string" ? result : (result && result.output ? result.output : String(result));
    return { success: true, command: cmd, output: output, exit_code: (result && result.exitCode) ? result.exitCode : 0 };
}

async function runDroidspaces(args: string, timeoutMs?: any): Promise<DroidspacesResult> {
    const tmo: number = parseTimeout(timeoutMs);
    const safeArgs: string = String(args).replace(/'/g, "'\\''");
    const cmd: string = "su -c '" + DROIDSPACES_BIN + " " + safeArgs + "' 2>&1; echo ___EXIT___:$?";
    try {
        let result: any;
        if (tmo > 0) {
            const shellPromise: Promise<any> = Tools.System.shell(cmd);
            const timeoutPromise: Promise<never> = new Promise((_, reject) => {
                setTimeout(() => {
                    Tools.System.shell("su -c 'pkill -f \"droidspaces.*--name=.*run\" 2>/dev/null'").catch(() => {});
                    reject(new Error("__TIMEOUT__:" + tmo));
                }, tmo);
            });
            result = await Promise.race([shellPromise, timeoutPromise]);
        } else {
            result = await Tools.System.shell(cmd);
        }
        const output: string = typeof result === "string" ? result : (result && result.output ? result.output : String(result));
        const exitMatch: RegExpMatchArray | null = output.match(/___EXIT___:(\d+)$/m);
        const exitCode: number = exitMatch ? parseInt(exitMatch[1]) : 0;
        const cleanOutput: string = output.replace(/\n?___EXIT___:\d+$/m, "").trimEnd();
        return { success: true, output: cleanOutput, exit_code: exitCode };
    } catch (e: any) {
        const msg: string = e && e.message ? e.message : String(e);
        if (msg.startsWith("__TIMEOUT__:")) {
            const ms: string = msg.split(":")[1] || "unknown";
            return { success: true, output: "命令执行超时 (" + ms + "ms)", exit_code: -1, timed_out: true };
        }
        const exitMatch: RegExpMatchArray | null = msg.match(/exit code:\s*(\d+)/i);
        const exitCode: number = exitMatch ? parseInt(exitMatch[1]) : 1;
        const output: string = msg.replace(/^ADB command execution failed \(exit code: \d+\):\s*/m, "");
        return { success: true, output: output, exit_code: exitCode };
    }
}

async function ensureDroidspacesInstalled(): Promise<{ ok: boolean; msg: string }> {
    const chk: any = await Tools.System.shell("ls " + DROIDSPACES_BIN + " 2>/dev/null || echo 'NOT_FOUND'");
    const out: string = typeof chk === "string" ? chk : String(chk);
    if (out.includes("NOT_FOUND")) return { ok: false, msg: "droidspaces 未安装" };
    return { ok: true, msg: "" };
}

async function isDroidspacesInstalled(): Promise<boolean> {
    const r: { ok: boolean; msg: string } = await ensureDroidspacesInstalled();
    return r.ok;
}

// ====== Session store ======

const sessions: Record<string, SessionState> = {};

function genSessionId(): string {
    return "s" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}

function escapeForTmux(input: string): string {
    return "'" + input.replace(/'/g, "'\\''") + "'";
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ====== Wrap wrapper ======

function wrap(asyncFn: (params: ToolParams) => Promise<any>): (p: ToolParams) => Promise<any> {
    return function (p: ToolParams): Promise<any> {
        try { return asyncFn(p); } catch (e: any) {
            return { success: false, message: e && e.message ? e.message : String(e) };
        }
    };
}

// ====== CT execution — the core fix ======

/**
 * ctExec — execute command/code inside container.
 * Link: su → ct exec sh -c → echo 'B64' | base64 -d | interpreter
 * Base64 is single-quoted: +, /, = pass through literally.
 */
async function ctExec(
    container: string,
    cmd: string,
    timeoutMs?: any,
    interpreter?: string
): Promise<ShellResult> {
    const tmo: number = parseTimeout(timeoutMs);
    const code: string = String(cmd);

    if (code.length > 60000) {
        return {
            success: true,
            output: "代码长度 " + code.length + " 字节超出单次传输上限 60000 字节。请分次执行或通过文件方式。",
            exit_code: -2
        };
    }

    const interp: string = interpreter || "sh";
    const b64: string = base64Encode(code);
    // su -c "ct <name> exec sh -c 'echo <b64> | base64 -d | <interp>'"
    // Outer: double quotes → su -c
    // Inner: single quotes → echo argument (base64 chars are literal)
    const fullCmd: string = "su -c \"" + CT_BIN + " " + container
        + " exec sh -c 'echo " + b64 + " | base64 -d | " + interp + "'\" 2>&1; echo ___EXIT___:$?";

    try {
        let result: any;
        if (tmo > 0) {
            const shellPromise: Promise<any> = Tools.System.shell(fullCmd);
            const timeoutPromise: Promise<never> = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("__TIMEOUT__:" + tmo)), tmo);
            });
            result = await Promise.race([shellPromise, timeoutPromise]);
        } else {
            result = await Tools.System.shell(fullCmd);
        }
        const output: string = typeof result === "string" ? result
            : (result && result.output ? result.output : String(result));
        const exitMatch: RegExpMatchArray | null = output.match(/___EXIT___:(\d+)$/m);
        const exitCode: number = exitMatch ? parseInt(exitMatch[1]) : 0;
        const cleanOutput: string = output.replace(/\n?___EXIT___:\d+$/m, "").trimEnd();
        return { success: true, output: cleanOutput, exit_code: exitCode };
    } catch (e: any) {
        const msg: string = e && e.message ? e.message : String(e);
        if (msg.startsWith("__TIMEOUT__:")) {
            const ms: string = msg.split(":")[1] || "unknown";
            return { success: true, output: "命令执行超时 (" + ms + "ms)", exit_code: -1, timed_out: true };
        }
        return { success: true, output: msg, exit_code: 1 };
    }
}

async function ctRaw(
    container: string,
    action: string,
    cmd?: string
): Promise<ShellResult> {
    const safeAction: string = String(action).replace(/'/g, "'\\''");
    let fullCmd: string;
    if (cmd !== undefined) {
        const escapedCmd: string = String(cmd).replace(/'/g, "'\\''");
        fullCmd = "su -c '" + CT_BIN + " " + container + " " + safeAction + " " + escapedCmd + "' 2>&1; echo ___EXIT___:$?";
    } else {
        fullCmd = "su -c '" + CT_BIN + " " + container + " " + safeAction + "' 2>&1; echo ___EXIT___:$?";
    }
    try {
        const result: any = await Tools.System.shell(fullCmd);
        const output: string = typeof result === "string" ? result
            : (result && result.output ? result.output : String(result));
        const exitMatch: RegExpMatchArray | null = output.match(/___EXIT___:(\d+)$/m);
        const exitCode: number = exitMatch ? parseInt(exitMatch[1]) : 0;
        const cleanOutput: string = output.replace(/\n?___EXIT___:\d+$/m, "").trimEnd();
        return { success: true, output: cleanOutput, exit_code: exitCode };
    } catch (e: any) {
        return { success: true, output: String(e), exit_code: 1 };
    }
}

// ====== exec_code tool ======

async function execCodeTool(params: ToolParams): Promise<any> {
    if (!params.name) return { success: true, message: "容器名称 (name) 是必填项", skipped: true };
    if (!params.code) return { success: true, message: "代码内容 (code) 是必填项", skipped: true };
    const interp: string = (params.interpreter || "").trim();
    const result: ShellResult = await ctExec(params.name, params.code, params.timeout_ms || 120000, interp || "sh");
    return {
        success: result.success,
        container: params.name,
        code_length: String(params.code).length,
        interpreter: interp || "sh",
        output: result.output || "",
        exit_code: result.exit_code
    };
}

