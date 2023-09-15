
interface vscode {
  postMessage(message: any): void;
}

declare const vscode: vscode;

declare interface BardResponse {
  prompt: string;
  response: string;
  rc?: string;
}
declare interface BardMessage {
  ask?: string;
  responses?: BardResponse[];
  isTemp?: boolean;
  uid: string;
}

declare interface BardUserPrompt {
  rc?: string;
  prompt: string;
  uid?: string;
}
