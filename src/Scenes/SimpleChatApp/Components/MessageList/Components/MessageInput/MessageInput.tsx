import React, { useState, useContext } from 'react';
import { Box, TextField, Button, makeStyles, Avatar } from '@material-ui/core';
import { simpleChatAppContext } from 'Scenes/SimpleChatApp/Context/SimpleChatAppContext';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import AvatarSelector from '../AvatarSelector/AvatarSelector';

const useStyles = makeStyles(theme => ({
  button: {
    padding: theme.spacing(2)
  }
}))

export default function MessageInput () {
  const classes = useStyles(undefined);
  const { sendMessageEvent } = useContext(simpleChatAppContext);
  const [message, setMessage] = useState('');
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  function handleMessageChange (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!message) {
      return;
    }
    sendMessageEvent(message);
    setMessage('');
  }

  function handleEmojiClick (event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    setAnchorEl(event.currentTarget);
    setEmojiOpen(true)
  }

  return (
    <form onSubmit={handleMessageChange}>
      <AvatarSelector
        anchorEl={anchorEl}
        onSetEmoji={emoji => setMessage(prevState => `${prevState}${emoji}`)}
        open={emojiOpen}
        onSetOpen={setEmojiOpen}
        onlyShowEmoji
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      />
      <Box p={2} display='flex'>
        <Box pr={1.5} py={1}>
          <Avatar
            style={{ margin: 'auto', cursor: 'pointer' }}
            onClick={handleEmojiClick}>
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