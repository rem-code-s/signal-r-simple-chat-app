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


  function handleClientLeaveJoin (data: IClientReceiveUser, message: string, event?: 'join' | 'leave') {
    let newData: IMessage = { ...data.user, dateTimeString: data.dateTimeString, message: '', isJoinOrLeaveMessage: true };

    if (message) {
      if (data.user.userId === user.userId) {
        newData.message = message;
      } else {
        if (event === 'join') {
          newData.message = `${data.user.firstName} ${data.user.lastName} joined the chat!`;
        }

        if (event === 'leave') {
          newData.message = `${data.user.firstName} ${data.user.lastName} left the chat!`;
        }
      }

      handleIncomingMessage(newData);
    }
  }

  function handleIncomingMessage (data: IMessage) {
    setMessages(prevState => [...prevState, data]);
  }

  function handleIncomingUsers (data: IUser[]) {

    const messagesToEdit = messages.map(m => {
      const user = data.find(d => d.userId === m.userId);
      return handleMessageChange(m.userId, m, { ...user });
    });

    setMessages(messagesToEdit);
    setUsers(data);
  }

  function handleMessageChange (userId: string, message: IMessage, partialMessage: Partial<IMessage>) {
    if (message.userId === userId) {
      return { ...message, ...partialMessage };
    };
    return message;
  };

  async function clientSendMessageEvent (userId: string, message: string) {
    await simpleChatAppHubHandler.clientSendMessageEvent({ userId, message });
  }

  async function clientSendColorEvent (userId: string, color: string) {
    await simpleChatAppHubHandler.clientSendColorEvent({ userId, color });
    setUser(prevState => ({ ...prevState, color }));
  }

  async function clientSendAvatarEvent (userId: string, avatar: string) {
    setUser(prevState => ({ ...prevState, avatar }));
    await simpleChatAppHubHandler.clientSendAvatarEvent({ userId, avatar });
  }

  async function clientSendLeaveEvent () {
    await simpleChatAppHubHandler.clientSendLeave(user);
  }

  // Receive events
  simpleChatAppHubHandler.receiveJoin = data => handleClientLeaveJoin(data, 'You joined the chat!', 'join');
  simpleChatAppHubHandler.receiveLeave = data => handleClientLeaveJoin(data, 'You left the chat!', 'leave');
  simpleChatAppHubHandler.receiveMessage = data => handleIncomingMessage({ ...data, ...users.find(u => u.userId === data.userId), isJoinOrLeaveMessage: false });
  simpleChatAppHubHandler.receiveUsers = data => handleIncomingUsers(data.users);

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