
import axios from "axios";

const BARD_HOST = 'https://bard.google.com';

export default class Bard {
  private cookies: string;
  constructor(cookies: string) {
    this.cookies = cookies;
    axios.defaults.headers.common['Cookie'] = cookies;
  }

  public setCookies(cookies: string) {
    this.cookies = cookies;
    axios.defaults.headers.common['Cookie'] = this.cookies;
  }

  public async ask(message: string) {
    let response = await axios.post(BARD_HOST, {
      message
    });
    return response.data;
  }

  public async getHistory() {
    let response = await axios.get(BARD_HOST);
    return response.data;
  }

  public async getHistoryByConversationId(id: string) {
    let response = await axios.get(`${BARD_HOST}/${id}`);
    return response.data;
  }

}