import React, { createContext, useEffect, useState } from 'react';
import SimpleChatHubHandler from '../signalRHubHandler/simpleChatHubHandler';
import { IUser, IClientReceiveUser } from '../signalRHubHandler/signalRClient';

const simpleChatAppHubHandler: SimpleChatHubHandler = new SimpleChatHubHandler('simple-chat-hub');

interface ISimpleChatAppHubContextValue {
  simpleChatAppHubHandler: SimpleChatHubHandler;
  currentUser: IUser;
  messageData: IMessage[];
  usersData: IUser[];
  onSetUser: (data: IUser) => void;
  sendMessageEvent: (message: string) => void;
  sendColorEvent: (color: string) => void;
  sendAvatarEvent: (avatar: string) => void;
  sendLeaveEvent: () => void;
}

export interface IMessage {
  userId: string;
  firstName: string;
  lastName: string;
  dateTimeString: string;
  color: string;
  avatar: string;
  message: string;
  isJoinOrLeaveMessage: boolean;
}

interface IProps {
  children: JSX.Element;
}

export const simpleChatAppContext = createContext<ISimpleChatAppHubContextValue>({
  simpleChatAppHubHandler: undefined,
  currentUser: undefined,
  usersData: undefined,
  messageData: [],
  onSetUser: () => { },
  sendMessageEvent: () => { },
  sendColorEvent: () => { },
  sendAvatarEvent: () => { },
  sendLeaveEvent: () => { }
});

export default function SimpleChatAppHubContextProvider (props: IProps) {
  const { children } = props;
  const [user, setUser] = useState<IUser>(undefined);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    initializeHub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function initializeHub () {
    try {
      if (!user) {
        return;
      }

      await simpleChatAppHubHandler.initialize(user);
    } catch (error) {
      console.log(error);
    }
  }

  function clientLeaveJoinEvent (data: IClientReceiveUser, message: string) {
    let newData: IMessage = { ...data.user, dateTimeString: data.dateTimeString, message: `${data.user.firstName} ${data.user.lastName} joined the chat!`, isJoinOrLeaveMessage: true };
    if (data.user.userId === user.userId) {
      newData.message = message;
    }
    handleIncomingMessage(newData);
  }

  function handleIncomingMessage (data: IMessage) {
    setMessages(prevState => [...prevState, data]);
  }

  function handleMessageChange (userId: string, partialMessage: Partial<IMessage>) {
    const newMessages = messages.map(message => {

      if (message.userId === userId) {
        return { ...message, ...partialMessage };
      };

      return message;
    })

    setMessages(newMessages);
  };

  async function clientSendMessageEvent (userId: string, message: string) {
    await simpleChatAppHubHandler.clientSendMessageEvent({ userId, message });
  }

  async function clientSendColorEvent (userId: string, color: string) {
    handleMessageChange(userId, { color });
    await simpleChatAppHubHandler.clientSendColorEvent({ userId, color });
    setUser(prevState => ({ ...prevState, color }));
  }

  async function clientSendAvatarEvent (userId: string, avatar: string) {
    handleMessageChange(userId, { avatar });
    setUser(prevState => ({ ...prevState, avatar }));
    await simpleChatAppHubHandler.clientSendAvatarEvent({ userId, avatar });
  }

  async function clientSendLeaveEvent () {
    await simpleChatAppHubHandler.clientSendLeave(user);
  }

  // Receive events
  simpleChatAppHubHandler.receiveJoin = data => clientLeaveJoinEvent(data, 'You joined the chat!');
  simpleChatAppHubHandler.receiveLeave = data => clientLeaveJoinEvent(data, 'You left the chat!');
  simpleChatAppHubHandler.receiveMessage = data => handleIncomingMessage({ ...data, ...users.find(u => u.userId === data.userId), isJoinOrLeaveMessage: false });
  simpleChatAppHubHandler.receiveUsers = data => setUsers(data.users);

  return (
    <simpleChatAppContext.Provider value={{
      simpleChatAppHubHandler,
      currentUser: user,
      messageData: messages,
      usersData: users,
      onSetUser: setUser,
      sendMessageEvent: message => clientSendMessageEvent(user.userId, message),
      sendColorEvent: color => clientSendColorEvent(user.userId, color),
      sendAvatarEvent: avatar => clientSendAvatarEvent(user.userId, avatar),
      sendLeaveEvent: clientSendLeaveEvent
    }}>
      {children}
    </simpleChatAppContext.Provider>
  )
}