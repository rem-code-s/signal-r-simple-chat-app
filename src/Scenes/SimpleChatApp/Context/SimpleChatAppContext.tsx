import React, { createContext, useEffect, useState } from 'react';
import SimpleChatHubHandler from '../signalRHubHandler/simpleChatHubHandler';
import { IUser, ISimpleChatClientReceiveMessage } from '../signalRHubHandler/signalRClient';

const simpleChatAppHubHandler: SimpleChatHubHandler = new SimpleChatHubHandler('simple-chat-hub');

interface ISimpleChatAppHubContextValue {
  simpleChatAppHubHandler: SimpleChatHubHandler;
  currentUser: IUser;
  messageData: ISimpleChatClientReceiveMessage[];
  usersData: IUser[];
  onSetUser: (data: IUser) => void;
  sendMessageEvent: (message: string) => void;
  sendLeaveEvent: () => void;
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
  sendLeaveEvent: () => { }
});

export default function SimpleChatAppHubContextProvider (props: IProps) {
  const { children } = props;
  const [user, setUser] = useState<IUser>(undefined);
  const [messages, setMessages] = useState<ISimpleChatClientReceiveMessage[]>([]);
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

  function handleIncomingMessage (data: ISimpleChatClientReceiveMessage) {
    setMessages(prevState => [...prevState, data]);
  }

  function clientSendMessageEvent (userId: string, message: string) {
    simpleChatAppHubHandler.clientSendMessageEvent({ userId, message });
  }

  function clientSendLeaveEvent () {
    simpleChatAppHubHandler.clientSendLeave(user);
  }

  // Receive events
  simpleChatAppHubHandler.receiveJoin = data => handleIncomingMessage({ userId: data.user.userId, dateTimeString: data.dateTimeString, message: `${data.user.firstName} ${data.user.lastName} joined the chat!` });
  simpleChatAppHubHandler.receiveLeave = data => handleIncomingMessage({ userId: data.user.userId, dateTimeString: data.dateTimeString, message: `${data.user.firstName} ${data.user.lastName} left the chat!` });
  simpleChatAppHubHandler.receiveMessage = data => handleIncomingMessage(data);
  simpleChatAppHubHandler.receiveUsers = data => setUsers(data.users);

  return (
    <simpleChatAppContext.Provider value={{
      simpleChatAppHubHandler,
      currentUser: user,
      messageData: messages,
      usersData: users,
      onSetUser: setUser,
      sendMessageEvent: message => clientSendMessageEvent(user.userId, message),
      sendLeaveEvent: clientSendLeaveEvent
    }}>
      {children}
    </simpleChatAppContext.Provider>
  )
}