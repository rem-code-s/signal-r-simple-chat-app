import * as signalR from '@microsoft/signalr';
import { IUser } from './signalRClient';
import { HttpTransportType } from '@microsoft/signalr';

export default abstract class SignalRHubHandler {
  private hubId: string;
  private sessionInfo: IUser;
  private hubSessionIsActive: boolean;

  protected connection: signalR.HubConnection;

  constructor(hubId: string) {
    this.hubId = hubId;
  }

  async initialize (data: IUser) {

    this.sessionInfo = data;

    this.connection = new signalR.HubConnectionBuilder().withUrl(`http://sandbox.noahstolk.com/${this.hubId}?group_name=default`, { skipNegotiation: true, transport: HttpTransportType.WebSockets }).build();

    this.initializeEvents();

    if (this.connection.state === signalR.HubConnectionState.Disconnected) {
      await this.connection.start().then(() => { setTimeout(() => this.connectToHub(), 2000); });
    }
  }

  async connectToHub () {
    if (!this.hubSessionIsActive) {
      this.clientSendJoin(this.sessionInfo);
      this.hubSessionIsActive = true;
    }
  }

  async disconnectFromHub () {
    if (this.hubSessionIsActive) {
      this.clientSendLeave(this.sessionInfo);
      this.hubSessionIsActive = false;
    }
  }

  async clientSendJoin (connectionInfo: IUser) {
    try {
      await this.connection.invoke('ClientSendJoin', connectionInfo);
    } catch (error) {
      console.log(error);
    }
  }

  async clientSendLeave (connectionInfo: IUser) {
    try {
      await this.connection.invoke('ClientSendLeave', connectionInfo);
      console.log('disconnected')
    } catch (error) {
      console.log(error);
    }
  }

  protected initializeEvents () {
    this.connection.on('ClientReceiveJoin', (parameters: IUser) => this.clientReceiveJoin(parameters));
    this.connection.on('ClientReceiveLeave', (parameters: IUser) => this.clientReceiveLeave(parameters));
  }

  private clientReceiveJoin (_sessionInfo: IUser) {
  }

  private clientReceiveLeave (_sessionInfo: IUser) {
  }
}
