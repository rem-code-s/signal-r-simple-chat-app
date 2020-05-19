import React, { useContext } from 'react';
import { List, ListItem, ListItemIcon, Avatar, ListItemText, makeStyles, Typography, Toolbar } from '@material-ui/core';
import { simpleChatAppContext } from 'Scenes/SimpleChatApp/Context/SimpleChatAppContext';
import { IUser } from 'Scenes/SimpleChatApp/signalRHubHandler/signalRClient';

const useStyles = makeStyles({
  list: {
    height: 'calc(100% - 64px)',
    width: 300,
  },
  title: {
    flexGrow: 1,
    color: '#fff'
  },
})

export default function UserList () {
  const classes = useStyles(undefined);
  const { sendLeaveEvent, usersData } = useContext(simpleChatAppContext);

  // these functions don't work for firefox
  window.onbeforeunload = function () {
    sendLeaveEvent();
  };

  window.onhashchange = function () {
    sendLeaveEvent();
  }

  function renderUser (user: IUser) {
    return (
      <ListItem button key={user.userId}>
        <ListItemIcon>
          <Avatar
            style={{ background: user?.color }}
          > {user?.avatar ?? `${user?.firstName[0].toUpperCase()}${user?.lastName[0].toUpperCase()}`}</Avatar>
        </ListItemIcon>
        <ListItemText primary={`${user.firstName} ${user.lastName}`} />
      </ListItem>
    );
  }

  function renderUsers () {
    const userItems = usersData.filter(u => u).map(renderUser);
    return (
      <>
        <Toolbar style={{ background: '#B6BD00' }}>
          <Typography variant="h6" className={classes.title}>
            Jem-chat
          </Typography>
        </Toolbar>
        <List
          className={classes.list}
          disablePadding>
          {userItems}
        </List>
      </>
    )
  }

  return renderUsers();
}