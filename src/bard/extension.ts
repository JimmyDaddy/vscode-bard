import * as vscode from "vscode";
import ChatProvider from "./chat_provider";

export function activate(context: vscode.ExtensionContext) {

  const chatProvider = new ChatProvider(context);
  // 注册 setCookie 命令
  context.subscriptions.push(
    vscode.commands.registerCommand("vscode-bard.setCookie", async () => {
      const cookie = await vscode.window.showInputBox({
        prompt: "Enter your Google cookie",
      });

      if (cookie) {
        // 获取配置对象
        const config = vscode.workspace.getConfiguration("vscode-bard");
        // 更新配置项
        config.update("cookie", cookie, vscode.ConfigurationTarget.Global);
      }
    }),
    vscode.commands.registerCommand("vscode-bard.cleanConversation", async () => {
      vscode.window.showInformationMessage("Clean all conversations?", {
          modal: true,
        }, 
        "Yes", 
        "Cancel").then((value) => {
          if (value === "Yes") {
            context.workspaceState.update("data", {}).then(() => {
              // vscode.commands.executeCommand("workbench.action.reloadWindow");
              chatProvider.reloadAllData();
            });
          }
      });
    })
  );
  vscode.window.registerWebviewViewProvider(
    "bard-chat",
    chatProvider,
  );
}
