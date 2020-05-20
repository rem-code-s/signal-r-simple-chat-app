import React, { useContext, useState } from 'react';
import { List, ListItem, ListItemIcon, Avatar, ListItemText, makeStyles, Typography, Toolbar, ListItemAvatar } from '@material-ui/core';
import { simpleChatAppContext } from 'Scenes/SimpleChatApp/Context/SimpleChatAppContext';
import { IUser } from 'Scenes/SimpleChatApp/signalRHubHandler/signalRClient';
import AvatarSelector from '../MessageList/Components/AvatarSelector/AvatarSelector';

const useStyles = makeStyles({
  list: {
    height: 'calc(100vh - 64px)',
    width: 300,
    overflow: 'auto'
  },
  title: {
    flexGrow: 1,
    color: '#fff'
  },
})

export default function UserList () {
  const classes = useStyles(undefined);
  const { currentUser, sendLeaveEvent, usersData, sendColorEvent, sendAvatarEvent } = useContext(simpleChatAppContext);
  const [avatarSelectionOpen, setAvatarSelectionOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // these functions don't work for firefox
  window.onbeforeunload = function () {
    sendLeaveEvent();
  };

  window.onhashchange = function () {
    sendLeaveEvent();
  }

  function handleAvatarClick (event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    setAnchorEl(event.currentTarget);
    setAvatarSelectionOpen(true)
  }

  function renderCurrentUser () {
    if (!currentUser) {
      return null;
    }

    return (
      <ListItem
        button
        onClick={handleAvatarClick}
        style={{ background: currentUser.color }}
      >
        <ListItemAvatar>
          <Avatar
            style={{ background: currentUser?.color }}
          >
            {currentUser?.avatar ?? `${currentUser?.firstName[0].toUpperCase()}${currentUser?.lastName[0].toUpperCase()}`}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          style={{ color: '#fff' }}
          primary={`${currentUser?.firstName} ${currentUser?.lastName}`}
        />
      </ListItem>
    )
  }

  function renderUser (user: IUser) {
    return (
      <ListItem key={user.userId}>
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
    const userItems = usersData.filter(u => u).filter(u => u.userId !== currentUser.userId).map(renderUser);
    return (
      <>
        <AvatarSelector
          anchorEl={anchorEl}
          color={currentUser?.color}
          onSetColor={color => sendColorEvent(color)}
          emoji={currentUser?.avatar}
          onSetEmoji={avatar => sendAvatarEvent(avatar)}
          open={avatarSelectionOpen}
          onSetOpen={setAvatarSelectionOpen}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        />
        <Toolbar style={{ background: '#B6BD00' }}>
          <Typography variant="h6" className={classes.title}>
            Jem-chat
          </Typography>
        </Toolbar>
        <List
          className={classes.list}
          disablePadding>
          {renderCurrentUser()}
          {userItems}
        </List>
      </>
    )
  }

  return renderUsers();
}