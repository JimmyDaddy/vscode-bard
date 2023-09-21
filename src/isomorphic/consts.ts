
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
You can get your cookie by following the instructions provided in this [link](https://github.com/JimmyDaddy/vscode-bard#how-to-get-cookies).
`;

export const DEFAULT_RESPONSE_MESSAGE_SNlM0E = `Failed to get bard params SNlM0e, pls retry or check your cookies.
You can get your cookie by following the instructions provided in this [link](https://github.com/JimmyDaddy/vscode-bard#how-to-get-cookies).
`;

export const BARD_HOST = 'https://bard.google.com';

export const GOOGLE_ACCOUNT_HOST = 'https://accounts.google.com';
