import * as vscode from "vscode";
import ChatProvider from "./chat_provider";

export function activate(context: vscode.ExtensionContext) {
  // 注册 setCookie 命令
  context.subscriptions.push(
    vscode.commands.registerCommand("vscode-bard.setCookie", async () => {
      const cookie = await vscode.window.showInputBox({
        prompt: "Enter your cookie",
      });

      if (cookie) {
        // 获取配置对象
        const config = vscode.workspace.getConfiguration("vscode-bard");
        // 更新配置项
        config.update("cookies", cookie, vscode.ConfigurationTarget.Global);
      }
    })
  );
  vscode.window.registerWebviewViewProvider(
    "bard-chat",
    new ChatProvider(context)
  );
}
