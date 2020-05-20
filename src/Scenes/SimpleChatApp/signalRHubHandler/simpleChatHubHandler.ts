import SignalRHubHandler from './signalRHubHandler';
import { ISimpleChatClientReceiveMessage, ISimpleChatClientSendColor, ISimpleChatClientSendMessage, ISimpleChatClientReceiveUsers, IClientReceiveUser, ISimpleChatClientSendAvatar } from './signalRClient';

export default class SimpleChatHubHandler extends SignalRHubHandler {
  public receiveJoin: (clientReceiveJoinEvent: IClientReceiveUser) => void;
  public receiveLeave: (clientReceiveLeaveEvent: IClientReceiveUser) => void;
  public receiveMessage: (clientReceiveMessageEvent: ISimpleChatClientReceiveMessage) => void;
  public receiveUsers: (clientReceiveUsersEvent: ISimpleChatClientReceiveUsers) => void;

  initializeEvents () {
    super.initializeEvents();
    this.connection.on('ClientReceiveJoin', (user: IClientReceiveUser) => this.receiveJoin(user));
    this.connection.on('ClientReceiveLeave', (user: IClientReceiveUser) => this.receiveLeave(user));
    this.connection.on('ClientReceiveMessage', (clientReceiveMessageEvent: ISimpleChatClientReceiveMessage) => this.receiveMessage(clientReceiveMessageEvent));
    this.connection.on('ClientReceiveUsers', (clientReceiveUsersEvent: ISimpleChatClientReceiveUsers) => this.receiveUsers(clientReceiveUsersEvent));
  }

  public async clientSendColorEvent (clientSendColorEvent: ISimpleChatClientSendColor) {
    await this.connection.invoke('ClientSendColor', clientSendColorEvent);
  }

  public async clientSendAvatarEvent (clientSendAvatarEvent: ISimpleChatClientSendAvatar) {
    await this.connection.invoke('ClientSendAvatar', clientSendAvatarEvent);
  }

  public async clientSendMessageEvent (clientSendMessageEvent: ISimpleChatClientSendMessage) {
    await this.connection.invoke('ClientSendMessage', clientSendMessageEvent);
  }
}
