import * as vscode from 'vscode';
import Bard, { UserPrompt } from './bard';
import path from 'path';
import logger from './logger';
import { MSG } from './consts';

export default class ChatProvider implements vscode.WebviewViewProvider {
  context: vscode.ExtensionContext;
  private bot: Bard;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    const config = vscode.workspace.getConfiguration('vscode-bard');

    let cookies = config.get('cookies') as string;
    this.bot = new Bard(this.context, cookies);
  }
  // 实现 resolveWebviewView 方法，用于处理 WebviewView 的创建和设置
  resolveWebviewView(webviewView: vscode.WebviewView): void | Thenable<void> {
    // 配置 WebviewView 的选项
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri]
    };

    const isProduction = this.context.extensionMode === vscode.ExtensionMode.Production;

    this.context.subscriptions.push(
      vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('vscode-bard.cookies')) {
          const config = vscode.workspace.getConfiguration('vscode-bard');
          const cookies = config.get('cookies') as string;
          logger.info('set cookies');
          this.bot.setCookies(cookies);
        }
      })
    );

    webviewView.webview.onDidReceiveMessage((message) => {
      logger.debug(message, 'message');
      if (message.type === MSG.sendMessage) {
        sendMessage(message.message);
      } else if (message.type === MSG.initialized) {
        const data = this.bot.getConversationData();
        if (data.messages) {
          webviewView.webview.postMessage({
            type: MSG.initData,
            data: JSON.stringify(data.messages),
          });
        }
      } else if (message.type === MSG.deleteMessage) {
        const uid = message.message.uid;
        this.bot.deleteMsg(uid);
        webviewView.webview.postMessage({
          type: MSG.deleteMessageSuccess,
          data: JSON.stringify({ uid }),
        });
      }
    });

    const sendMessage = async (message: UserPrompt) => {
      let response = await this.bot.ask(message);
      webviewView.webview.postMessage({
        type: MSG.showResponse,
        data: JSON.stringify(response),
      });
    };

    let srcUrl = '';
    if (isProduction) {
      const filePath = vscode.Uri.file(
        path.join(this.context.extensionPath, 'dist', 'static/js/main.js')
      );
      srcUrl = webviewView.webview.asWebviewUri(filePath).toString();
    } else {
      srcUrl = 'http://localhost:3000/static/js/main.js';
    }
    webviewView.webview.html = getWebviewContent(srcUrl);

    const updateWebview = () => {
      webviewView.webview.html = getWebviewContent(srcUrl);
      this.bot.saveData();
    };
    updateWebview();
    const interval = setInterval(updateWebview, 1000);

    webviewView.onDidDispose(
      () => {
        logger.info('dispose');
        this.bot.saveData();
        clearInterval(interval);
      },
      null,
      this.context.subscriptions,
    );
  }

}

function getWebviewContent(srcUri: string) {
  return `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>bard chat</title>
    <script> 
      const vscode = acquireVsCodeApi();
      window.vscode = vscode;
    </script>
    <script defer="defer" src="${srcUri}"></script>
  </head>
  <body
    style="display: block;box-shadow: var(--vscode-scrollbar-shadow) 0 6px 6px -6px inset;"
  >
    <div id="root"></div>
    <script>
      window.onload = () => {
        window.vscode.postMessage({ type: 'initialized' });
      };
    </script>
  </body>
  </html>`;
}
