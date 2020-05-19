import React from 'react';
import SimpleChatAppOverview from 'Scenes/SimpleChatApp/Scenes/SimpleChatAppOverview/SimpleChatAppOverview';
import { ThemeProvider } from '@material-ui/core';
import { theme } from 'Style/Theme';

function App () {
  return (
    <ThemeProvider theme={theme}>
      <SimpleChatAppOverview />
    </ThemeProvider>
  )
}

export default App;
