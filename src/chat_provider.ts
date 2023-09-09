import * as vscode from 'vscode';
import Bard from './bard';
import path from 'path';

export default class ChatProvider implements vscode.WebviewViewProvider {
  context: vscode.ExtensionContext;
  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }
  // 实现 resolveWebviewView 方法，用于处理 WebviewView 的创建和设置
  resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {
    // 配置 WebviewView 的选项
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri]
    };

    const config = vscode.workspace.getConfiguration('vscode-bard');

    const isProduction = this.context.extensionMode === vscode.ExtensionMode.Production;

    let cookies = config.get('cookies') as string;

    let bot = new Bard(cookies);

    webviewView.webview.onDidReceiveMessage((message) => {
      if (message.type === 'sendMessage') {
        sendMessage(message.message);
      }
    });

    async function sendMessage(message: string) {
      let response = await bot.ask(message);
      webviewView.webview.postMessage({
        type: 'showResponse',
        message: response
      });
    }

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
    };
    updateWebview();
    const interval = setInterval(updateWebview, 1000);

    webviewView.onDidDispose(
      () => {
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
    <title>webview-react</title>
    <script> 
      const vscode = acquireVsCodeApi();
      window.vscode = vscode;
    </script>
    <script defer="defer" src="${srcUri}"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
  </html>`;
}
