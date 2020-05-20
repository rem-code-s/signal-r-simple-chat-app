import React, { useContext, useState, useEffect } from 'react';
import { Dialog, TextField, Button, Box, makeStyles, LinearProgress, Avatar } from '@material-ui/core';
import { simpleChatAppContext } from 'Scenes/SimpleChatApp/Context/SimpleChatAppContext';
import { IUser } from 'Scenes/SimpleChatApp/signalRHubHandler/signalRClient';
import { v4 as uuidv4 } from 'uuid';
import { grey } from '@material-ui/core/colors';
import AvatarSelector from '../MessageList/Components/AvatarSelector/AvatarSelector';

const useStyles = makeStyles(theme => ({
  button: {
    padding: theme.spacing(2)
  },
  avatar: {
    margin: 'auto',
    cursor: 'pointer',
    width: 64,
    height: 64,
    fontSize: 32,
    border: `4px solid ${theme.palette.primary.main}`,

    '&:hover': {
      border: `4px solid ${grey[400]}`,
    },
  }
}));

export default function Register () {
  const classes = useStyles(undefined);
  const { currentUser, onSetUser, usersData } = useContext(simpleChatAppContext);
  const [user, setUser] = useState<IUser>(undefined);
  const [open, setOpen] = useState(true);
  const [avatarSelectionOpen, setAvatarSelectionOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, usersData])

  function initialize () {
    if (usersData.length > 0) {
      setOpen(!Boolean(currentUser));
    }
  }

  function handleUserChange (delta: Partial<IUser>) {
    setUser(prevState => ({ ...prevState, ...delta }));
  }

  function handleRegister (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSetUser({ ...user, userId: uuidv4() });
  }

  function handleAvatarClick (event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    setAnchorEl(event.currentTarget);
    setAvatarSelectionOpen(true)
  }

  return (
    <Dialog open={open}>
      <AvatarSelector
        anchorEl={anchorEl}
        color={user?.color}
        onSetColor={color => handleUserChange({ color })}
        emoji={user?.avatar}
        onSetEmoji={avatar => handleUserChange({ avatar })}
        open={avatarSelectionOpen}
        onSetOpen={setAvatarSelectionOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      />
      <form onSubmit={handleRegister}>
        <Box p={2} display='flex'>
          <Box>
            <Box pb={2}>
              <Avatar
                className={classes.avatar}
                style={{ background: user?.color, fontSize: 32 }}
                onClick={handleAvatarClick}>
                {user?.avatar}
              </Avatar>
            </Box>
            <Box pb={1}>
              <TextField
                disabled={Boolean(currentUser)}
                required
                placeholder='First name'
                fullWidth
                variant="outlined"
                value={user?.firstName ?? ''}
                onChange={e => handleUserChange({ firstName: e.target.value })}
              />
            </Box>
            <Box>
              <TextField
                disabled={Boolean(currentUser)}
                required
                placeholder='Last name'
                fullWidth
                variant="outlined"
                value={user?.lastName ?? ''}
                onChange={e => handleUserChange({ lastName: e.target.value })}
              />
            </Box>
            <Box pt={2}>
              <Button
                disabled={Boolean(currentUser)}
                className={classes.button}
                color='primary'
                fullWidth
                type='submit'
                variant='contained'>
                Register
        </Button>
            </Box>
          </Box>
        </Box>
      </form>
      {Boolean(user) && Boolean(currentUser) && <LinearProgress />}
    </Dialog>)
}