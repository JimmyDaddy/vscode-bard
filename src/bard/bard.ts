/* eslint-disable @typescript-eslint/naming-convention */

import axios, { AxiosInstance } from "axios";
import * as vscode from 'vscode';
import { load } from 'cheerio';
import vm from 'vm';
import logger from "../isomorphic/logger";
import { uid, getReqId } from '../isomorphic/utils';
import { DEFAULT_RESPONSE_MESSAGE } from "../isomorphic/consts";

const BARD_HOST = 'https://bard.google.com';

export default class Bard {
  private cookie: string;
  private axios: AxiosInstance;
  public locale: string = 'en';
  private at: string = '';
  private bl: string = '';
  private reqId: number = getReqId();
  private conversationData: {
    c?: string;
    r?: string;
    at?: string;
    bl?: string;
    messages?: BardMessage[];
    rpcids?: string;
  } = {};

  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext, cookie: string) {
    this.cookie = cookie;
    this.axios = axios.create({
      baseURL: BARD_HOST,
      headers: {
        "User-Agent": `VSCode/${vscode.version} vscode-bard/0.0.1 Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0`,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
				"Sec-Fetch-Dest": "document",
				"Sec-Fetch-Mode": "navigate",
				"Sec-Fetch-Site": "none",
				"Sec-Fetch-User": "?1",
				TE: "trailers",
      }
    });

    this.context = context;

    this.loadData();

  }

  public deleteMsg(uid: string) {
    this.conversationData.messages = this.conversationData.messages?.filter((msg) => msg.uid !== uid);
    this.saveData();
  }

  private showBardError(err: Error) {
    logger.error(err);
    vscode.window.showErrorMessage(err.message);
  }

  public loadData() {
    try {
      const data = this.context.workspaceState.get('data');
      this.conversationData = data || {};
      if (this.conversationData) {
        this.at = this.conversationData.at || '';
        this.bl = this.conversationData.bl || '';
      }
    } catch (error) {
      this.conversationData = {};
    }
  }

  public getConversationData() {
    return this.conversationData;
  }

  public saveData() {
    this.context.workspaceState.update('data', this.conversationData);
  }

  public setCookies(cookie: string) {
    if (cookie !== this.cookie) {
      this.at = '';
      this.bl = '';
    }
    this.cookie = cookie;
  }

  /**
   * get response params from html
   * @returns {Promise<{at: string, bl: string}>}
   */
  private async getVerifyParams() {
    const response = await this.axios.get(BARD_HOST, {
      headers: {
        Cookie: this.cookie,
      },
    });
    let responseData = load(response.data);
    let script: string | null | undefined = responseData(
      "script[data-id=_gd]"
    )?.html();
    script = script?.replace("window.WIZ_global_data", "data");
    if (!script) {
      this.showBardError(new Error(`Get Bard Request Params Error: responseData is null`));
      return;
    }
    const context = { data: { cfb2h: "", SNlM0e: "", sEwWPd: "", N5bhKc: "", P4fUA: "", TuX5cc: "" } };
    vm.createContext(context);
    vm.runInContext(script, context);
    logger.info(context, 'context');
    if (!context.data.SNlM0e) {
      vscode.window.showErrorMessage('Failed to get bard params SNlM0e, pls check your cookies');
      throw new Error('Failed to get bard params SNlM0e, pls check your cookies');
    }
    this.at = context.data.SNlM0e;
    this.bl = context.data.cfb2h;
    this.conversationData.at = this.at;
    this.conversationData.bl = this.bl;
    const locale = context.data.TuX5cc;
    if (locale) {
      this.locale = locale;
    }
  }

  private parseResponse(text: string) {
    logger.info(text, 'parseResponse');
    const contentRaw = text.split("\n")?.find((line) => line.includes("wrb.fr"));
    if (!contentRaw) { return; }
    let data = JSON.parse(contentRaw);
    this.conversationData.rpcids = data[0][1];
    let responsesData = JSON.parse(data[0][2]);
    if (!responsesData?.length) {
      return;
    }
    const metaData: string[] = responsesData[1];
    if (!metaData?.length) {
      return;
    }

    const prompts = responsesData[2];
    const answers = responsesData[4];
    if (!prompts?.length || !answers?.length) {
      return;
    }
    const responses: BardResponse[] = [];
    for (const key in prompts) {
      const prompt = prompts[key];
      if (prompt && prompt[0] && answers[key] && answers[key]?.[1]) {
        responses.push({
          prompt: prompt[0],
          rc: answers[key][0],
          response: answers[key][1],
        });
      }
    }
    const resData = {
      c: metaData.find(c => c.startsWith('c_')),
      r: metaData.find(c => c.startsWith('r_')),
      responses,
    };
    return resData;
  }

  private async requestBard(params: any, message: BardUserPrompt) {
    let response = await axios.post(`${BARD_HOST}/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate`, 
      new URLSearchParams({
        at: this.at,
        "f.req": JSON.stringify([null, `[[${JSON.stringify(message.prompt)}],null,${JSON.stringify([this.conversationData.c || '', this.conversationData.r || '', message.rc || ''])}]`]),
      }),
      {
        headers: {
          Cookie: this.cookie,
        },
        params,
      }
    );

    let parsedResponse = this.parseResponse(response.data);
    return parsedResponse;
  }

  public async ask(message: BardUserPrompt) {
    logger.debug(message, 'ask');

    let curMessage: BardMessage = {
      ask: message.prompt,
      uid: message.uid || uid(),
    };

    if (!this.conversationData.messages) {
      this.conversationData.messages = [];
    }

    if (message.uid) {
      curMessage = this.conversationData.messages.find((msg) => msg.uid === message.uid) || curMessage;
    }

    logger.debug(this.at, this.bl, this.reqId, 'init ask data');

    try {
      if (!this.at || !this.bl) {
        await this.getVerifyParams();
      }
      const params: any = {
        bl: this.bl,
        rt: "c",
        _reqid: `${this.reqId}`,
      };
      if (this.conversationData.rpcids) {
        params.rpcids = this.conversationData.rpcids;
      }

      let parsedResponse;
      let retry = 0;
      do {
        try {
          parsedResponse = await this.requestBard(params, message);
        } catch (error) {
          logger.debug(retry, parsedResponse, 'retry');
          logger.error(error);
          if (retry >= 3) {
            throw error;
          }
        }
        retry++;
      } while (!parsedResponse && retry < 3);
      this.conversationData.c = parsedResponse?.c;
      this.conversationData.r = parsedResponse?.r;

      logger.debug(parsedResponse, 'parsedResponse');
      curMessage.responses = parsedResponse?.responses || [{
        response: DEFAULT_RESPONSE_MESSAGE,
        prompt: message.prompt,
        rc: message.rc || '',
      }];
      this.updateReqId();
    } catch (error: any) {
      logger.error('failed to get bard answers: ', error);
      this.showBardError(error);
      curMessage.responses = [{
        response: error.message || DEFAULT_RESPONSE_MESSAGE,
        prompt: message.prompt,
        rc: message.rc || '',
      }];
    }
    const existIndex = this.conversationData.messages.findIndex((v) => v.uid === curMessage.uid)
    if (existIndex === -1) {
      this.conversationData.messages.push(curMessage);
    } else {
      this.conversationData.messages[existIndex] = curMessage;
    }
    this.saveData();
    return curMessage;
  }

  private updateReqId() {
    this.reqId = getReqId(this.reqId);
  }

}
