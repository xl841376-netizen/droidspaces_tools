"use strict";
// Droidspaces 容器管理仪表盘 - Compose DSL UI
// 完全对齐 Docker 正常工作包写法：Screen 同步，异步操作只在按钮回调内
// 初始状态由 main.ts 通过 params 传入（有 root 权限时检测）
Object.defineProperty(exports, "__esModule", { value: true });
function Screen(ctx) {
    // 从 params 读取主包注册时传入的状态（含 root 权限检测结果）
    var p = ctx.params || {};
    var s = p.status || {};
    var initLabel = s.label || "点击刷新检测";
    var initContainers = s.containers || "请点击「刷新」检测 Droidspaces 状态";
    var initInstalled = s.installed === true;
    const [containers, setContainers] = ctx.useState("containers", initContainers);
    const [installed, setInstalled] = ctx.useState("installed", initInstalled);
    const [busy, setBusy] = ctx.useState("busy", false);
    const [error, setError] = ctx.useState("error", "");
    const [statusLabel, setStatusLabel] = ctx.useState("statusLabel", initLabel);
    async function refresh() {
        setError("");
        setBusy(true);
        setStatusLabel("检测中...");
        try {
            // 先用 ping 测试返回值能不能到 UI
            var pingRaw = await ctx.callTool("droidspaces_tools:ping", {});
            // callTool 返回值可能是 JSON 字符串，需统一解析为对象
            var ping = (typeof pingRaw === 'string') ? JSON.parse(pingRaw) : (pingRaw || {});
            if (ping && ping.pong === true) {
                // ping 通了！调真正的 status
                var statusRaw = await ctx.callTool("droidspaces_tools:status", { timeout_ms: "10000" });
                var r = (typeof statusRaw === 'string') ? JSON.parse(statusRaw) : (statusRaw || {});
                if (r && r.success && r.installed) {
                    setInstalled(true);
                    setStatusLabel("droidspaces 已安装 ✓");
                    setContainers(r.containers || "没有运行中的容器");
                }
                else {
                    setInstalled(false);
                    setStatusLabel((r && r.message) || "未检测到 droidspaces");
                    setContainers("点击「刷新」重试，或确认已安装 droidspaces");
                }
            }
            else {
                // ping 没返回值——UI 收不到子包返回值
                setStatusLabel("UI 无法接收子包返回值 (ping 无响应)");
                setContainers("ping 结果: " + JSON.stringify(pingRaw));
            }
        }
        catch (e) {
            setError(e?.message || "刷新失败");
            setInstalled(false);
            setStatusLabel("刷新异常: " + (e?.message || ""));
        }
        setBusy(false);
    }
    async function runCheck() {
        setBusy(true);
        try {
            var r = await ctx.callTool("droidspaces_tools:check", { timeout_ms: "15000" });
            setContainers("检查结果:\n" + ((r && r.output) || "检查完成").substring(0, 500));
        }
        catch (e) {
            setError(e?.message || "检查失败");
        }
        setBusy(false);
    }
    return ctx.UI.Column({ modifier: ctx.Modifier.fillMaxSize().padding(8) }, [
        ctx.UI.Text({ text: "Droidspaces 容器管理器", fontSize: 24, bold: true, modifier: ctx.Modifier.padding(16, 8) }),
        ctx.UI.Card({ modifier: ctx.Modifier.fillMaxWidth().padding(16, 4), elevation: 2 }, ctx.UI.Column({ modifier: ctx.Modifier.fillMaxWidth().padding(12) }, [
            ctx.UI.Text({
                text: statusLabel,
                fontSize: 15,
                bold: true,
                color: installed ? "#4CAF50" : (statusLabel.includes("点击") ? "#9E9E9E" : "#F44336")
            }),
            ctx.UI.Spacer({ height: 8 }),
            ctx.UI.Text({ text: "容器状态", fontSize: 17, bold: true }),
            ctx.UI.Spacer({ height: 4 }),
            busy
                ? ctx.UI.CircularProgressIndicator({ strokeWidth: 4, color: "#1976D2" })
                : ctx.UI.Text({ text: error || containers, fontSize: 13 })
        ])),
        ctx.UI.Spacer({ height: 8 }),
        ctx.UI.Row({ modifier: ctx.Modifier.fillMaxWidth().padding(16, 4), arrangement: "spaceEvenly" }, [
            ctx.UI.Button({ text: "刷新", onClick: refresh }),
            ctx.UI.Button({ text: "系统检查", onClick: runCheck }),
            ctx.UI.Button({ text: "停止全部", enabled: installed, onClick: async function () {
                    await ctx.showToast("正在停止所有容器...");
                } })
        ]),
        ctx.UI.Spacer({ height: 8 }),
        ctx.UI.Card({ modifier: ctx.Modifier.fillMaxWidth().padding(16, 4), elevation: 1 }, ctx.UI.Column({ modifier: ctx.Modifier.padding(12) }, [
            ctx.UI.Text({ text: "快捷操作指南", fontSize: 17, bold: true }),
            ctx.UI.Spacer({ height: 6 }),
            ctx.UI.Text({
                text: "• start: 启动新容器\n• enter: 进入容器终端\n• exec: 执行命令\n• stop: 停止容器\n• list: 列出容器\n• check: 系统检查\n• info: 容器详情\n• shell: 执行Shell命令",
                fontSize: 12
            })
        ]))
    ]);
}
exports.default = Screen;
