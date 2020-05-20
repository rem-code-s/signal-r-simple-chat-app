import React, { useContext, useState, useEffect } from 'react';
import { Dialog, TextField, Button, Box, makeStyles, LinearProgress, Avatar, Popover } from '@material-ui/core';
import { simpleChatAppContext } from 'Scenes/SimpleChatApp/Context/SimpleChatAppContext';
import { IUser } from 'Scenes/SimpleChatApp/signalRHubHandler/signalRClient';
import { v4 as uuidv4 } from 'uuid';
import { Picker, BaseEmoji } from 'emoji-mart'
import { CirclePicker } from 'react-color';
import { grey } from '@material-ui/core/colors';

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
  },
  popperAvatar: {
    margin: 'auto',
    width: 128,
    height: 128,
    fontSize: 64,
  },
  popperContainer: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    }

  }
}))

export default function Register () {
  const classes = useStyles(undefined);
  const { currentUser, onSetUser, usersData } = useContext(simpleChatAppContext);
  const [user, setUser] = useState<IUser>(undefined);
  const [open, setOpen] = useState(true);
  const [avatarOpen, setAvatarOpen] = useState(false);
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
    setAvatarOpen(true)
  }

  function handleEmojiClick (emoji: BaseEmoji, _e: React.MouseEvent<HTMLElement, MouseEvent>) {
    handleUserChange({ avatar: emoji.native });
  }

  function renderPopOver () {
    return (
      <Popover
        open={avatarOpen}
        anchorEl={anchorEl}
        onClose={() => setAvatarOpen(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >

        <Box >
          <Box className={classes.popperContainer}>
            <Box flexGrow={1}>
              <Picker
                showSkinTones={false}
                emoji=''
                title=''
                set='google'
                showPreview={false}
                onClick={handleEmojiClick}
              />
            </Box>
            <Box flexGrow={1} p={2} margin='0 auto'>
              <Box>
                <CirclePicker
                  color={user?.color}
                  onChangeComplete={e => handleUserChange({ color: e.hex })}
                />
              </Box>
              <Box pt={3}>
                <Avatar
                  className={classes.popperAvatar}
                  style={{ background: user?.color, width: 128, height: 128, fontSize: 64 }}
                >
                  {user?.avatar}
                </Avatar>
              </Box>
            </Box>
          </Box>
          <Box flexGrow={1}>
            <Button
              onClick={() => setAvatarOpen(false)}
              fullWidth
              color='primary'
              variant='contained'>
              done
              </Button>
          </Box>
        </Box>
      </Popover>)
  }

  return (
    <Dialog open={open}>
      {renderPopOver()}
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