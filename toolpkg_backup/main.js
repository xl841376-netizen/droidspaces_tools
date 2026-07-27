"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onApplicationCreate = exports.registerToolPkg = void 0;
function registerToolPkg() {
    ToolPkg.registerToolboxUiModule({
        id: "droidspaces_dashboard",
        runtime: "compose_dsl",
        screen: "ui/dashboard/index.ui.js",
        params: {},
        title: {
            zh: "Droidspaces 仪表盘",
            en: "Droidspaces Dashboard",
        },
    });
    return true;
}
exports.registerToolPkg = registerToolPkg;
function onApplicationCreate() {
    return { ok: true };
}
exports.onApplicationCreate = onApplicationCreate;
