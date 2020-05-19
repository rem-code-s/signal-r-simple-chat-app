import React, { useState, useContext } from 'react';
import { Box, TextField, Button, makeStyles, Popover, Avatar } from '@material-ui/core';
import { simpleChatAppContext } from 'Scenes/SimpleChatApp/Context/SimpleChatAppContext';
import Picker, { IEmojiData } from 'emoji-picker-react';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';

const useStyles = makeStyles(theme => ({
  button: {
    padding: theme.spacing(2)
  }
}))

export default function MessageInput () {
  const classes = useStyles(undefined);
  const { sendMessageEvent } = useContext(simpleChatAppContext);
  const [message, setMessage] = useState('');
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  function handleMessageChange (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!message) {
      return;
    }
    sendMessageEvent(message);
    setMessage('');
  }

  function handleAvatarClick (event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    setAnchorEl(event.currentTarget);
    setAvatarOpen(true)
  }

  function handleEmojiClick (_event: MouseEvent, data: IEmojiData) {
    setMessage(prevState => `${prevState}${data.emoji}`)
    setAvatarOpen(false);
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
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <Picker onEmojiClick={handleEmojiClick} />
      </Popover>)
  }

  return (
    <form onSubmit={handleMessageChange}>
      <Box p={2} display='flex'>
        {renderPopOver()}
        <Box pr={1.5} py={1}>
          <Avatar
            style={{ margin: 'auto', cursor: 'pointer' }}
            onClick={handleAvatarClick}>
            <InsertEmoticonIcon />
          </Avatar>
        </Box>
        <Box flexGrow={1}>
          <TextField
            placeholder='Message'
            fullWidth
            style={{ background: '#fff' }}
            variant="outlined"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        </Box>
        <Box pl={2}>
          <Button

            disabled={!message}
            className={classes.button}
            fullWidth
            color='primary'
            type='submit'
            variant='contained'>
            Send
        </Button>
        </Box>
      </Box>
    </form>
  )
}