import * as vscode from 'vscode';
import { MSG_LEVEL } from '../isomorphic/consts';

export function showWindowMsg(data: {
  message: string,
  level: MSG_LEVEL,
}) {
  if (!data.message) {
    return;
  }
  switch (data.level) {
    case MSG_LEVEL.info:
      vscode.window.showInformationMessage(data.message);
      break;
    case MSG_LEVEL.success:
      vscode.window.showInformationMessage(data.message);
      break;
    case MSG_LEVEL.error:
      vscode.window.showErrorMessage(data.message);
      break;
    case MSG_LEVEL.warning:
      vscode.window.showWarningMessage(data.message);
      break;
    default:
      vscode.window.showInformationMessage(data.message);
      break;
  }
}
