import React, { useContext, createRef, useEffect } from 'react';
import { makeStyles, Box, ListItem, ListItemText, List, Toolbar, Hidden, Typography, ListItemAvatar, Avatar } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import MessageInput from './Components/MessageInput/MessageInput';
import { simpleChatAppContext, IMessage } from 'Scenes/SimpleChatApp/Context/SimpleChatAppContext';

const useStyles = makeStyles(theme => ({
  container: {
    background: grey[200],
    height: '100vh',
    margin: 0,
  },
  list: {
    width: '100%',
  },
  messagesContainer: {
    overflow: 'auto',
    height: 'calc(100% - 88px - 64px)',
    [theme.breakpoints.down('sm')]: {
      height: 'calc(100% - 80px - 64px)',
    }
  },
  messageInput: {
    background: grey[300],
    height: '88px',
    minWidth: '100%',
  },
  title: {
    flexGrow: 1,
    color: '#fff'
  },
}))

export default function MessageList () {
  const { messageData } = useContext(simpleChatAppContext);
  const classes = useStyles(undefined);
  const ref = createRef<HTMLLIElement>();

  useEffect(() => {
    ref?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  })

  function renderMessage (messageData: IMessage, index: number) {

    return (
      <ListItem
        style={{ background: messageData?.isJoinOrLeaveMessage && messageData?.color }}
        ref={ref}
        key={`${messageData.userId}-${index}`}
        divider
      >
        <ListItemAvatar>
          <Avatar style={{ background: messageData?.color }}>
            {messageData?.avatar ?? `${messageData?.firstName[0].toUpperCase()}${messageData?.lastName[0].toUpperCase()}`}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={messageData.message}
          secondary={!messageData?.isJoinOrLeaveMessage ? `${messageData?.firstName} ${messageData?.lastName} - ${messageData.dateTimeString.split(' ')[1]}` : null}
        />
      </ListItem>
    );
  }

  function renderMessages () {
    const sortedMessages = messageData.sort((a, b) => {
      const aTime = a.dateTimeString.split(' ')[1].split(':');
      const aTimeSplitted = aTime[0] + aTime[1] + aTime[2];
      const bTime = b.dateTimeString.split(' ')[1].split(':');
      const bTimeSplitted = bTime[0] + aTime[1] + aTime[2];
      return parseInt(aTimeSplitted) - parseInt(bTimeSplitted);
    })
    return (
      <List
        className={classes.list}
        disablePadding
      >
        {sortedMessages.map(renderMessage)}
      </List>
    )
  }

  return (
    <Box className={classes.container}>
      <Toolbar style={{ background: '#B6BD00' }}>
        <Hidden smUp>
          <Typography variant="h6" className={classes.title}>
            Jem-chat
          </Typography>
        </Hidden>
      </Toolbar>
      <Box className={classes.messagesContainer}>
        {renderMessages()}
      </Box>
      <Box className={classes.messageInput}>
        <MessageInput />
      </Box>
    </Box>
  )
}