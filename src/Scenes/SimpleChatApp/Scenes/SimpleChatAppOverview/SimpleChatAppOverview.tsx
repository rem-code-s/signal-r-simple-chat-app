import React from 'react';
import { Box, Hidden } from '@material-ui/core';
import UserList from 'Scenes/SimpleChatApp/Components/UserList/UserList';
import MessageList from 'Scenes/SimpleChatApp/Components/MessageList/MessageList';
import Register from 'Scenes/SimpleChatApp/Components/Register/Register';
import SimpleChatAppHubContextProvider from 'Scenes/SimpleChatApp/Context/SimpleChatAppContext';

export default function SimpleChatAppOverview () {

  return (
    <SimpleChatAppHubContextProvider>
      <>
        <Box display='flex'>
          <Hidden smDown>
            <Box>
              <UserList />
            </Box>
          </Hidden>
          <Box flexGrow={1}>
            <MessageList />
          </Box>
        </Box>
        <Register />
      </>
    </SimpleChatAppHubContextProvider>
  );
}
