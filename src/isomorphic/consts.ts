
export enum MSG {
  sendMessage = 'sendMessage',
  initialized = 'initialized',
  initData = 'initData',
  showResponse = 'showResponse',
  deleteMessage = 'deleteMessage',
  deleteMessageSuccess = 'deleteMessageSuccess',
  initPromptHistory = 'initPromptHistory',
  showInfo = 'showInfo',
}

export enum MSG_LEVEL {
  info = 'info',
  success = 'success',
  error = 'error',
  warning = 'warning',
}

export const DEFAULT_RESPONSE_MESSAGE = `Failed to get answers, pls retry or check your cookies.
You can obtain your cookie by following the instructions provided in this [link](https://github.com/JimmyDaddy/vscode-bard#how-to-get-cookies).
`;
