import SignalRHubHandler from './signalRHubHandler';
import { ISimpleChatClientReceiveColors, ISimpleChatClientReceiveMessage, ISimpleChatClientSendColor, ISimpleChatClientSendMessage, ISimpleChatClientReceiveUsers } from './signalRClient';

export default class SimpleChatHubHandler extends SignalRHubHandler {
  public receiveMessage: (clientReceiveMessageEvent: ISimpleChatClientReceiveMessage) => void;
  public receiveUsers: (clientReceiveUsersEvent: ISimpleChatClientReceiveUsers) => void;

  initializeEvents () {
    super.initializeEvents();
    this.connection.on('ClientReceiveMessage', (clientReceiveMessageEvent: ISimpleChatClientReceiveMessage) => this.handleEvent(() => this.receiveMessage(clientReceiveMessageEvent)));
    this.connection.on('ClientReceiveUsers', (clientReceiveUsersEvent: ISimpleChatClientReceiveUsers) => this.handleEvent(() => this.receiveUsers(clientReceiveUsersEvent)));
  }

  public async clientSendColorEvent (clientSendColorEvent: ISimpleChatClientSendColor) {
    this.handleEvent(async () => { await this.connection.invoke('ClientSendColor', clientSendColorEvent); });
  }

  public async clientSendMessageEvent (clientSendMessageEvent: ISimpleChatClientSendMessage) {
    this.handleEvent(async () => { await this.connection.invoke('ClientSendMessage', clientSendMessageEvent); });
  }

  private handleEvent (eventFunc: () => void) {
    try {
      eventFunc();
    } catch (error) {
      console.log(error);
    }
  }
}
