import React from 'react';
import { Popover, Box, Avatar, Button, makeStyles, PopoverOrigin } from '@material-ui/core';
import { BaseEmoji, Picker } from 'emoji-mart';
import { CirclePicker } from 'react-color';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
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


interface IProps {
  open: boolean;
  onSetOpen: (value: boolean) => void;
  anchorEl: HTMLDivElement;
  emoji?: string;
  onSetEmoji: (emoji: string) => void;
  color?: string;
  onSetColor?: (color: string) => void;
  anchorOrigin: PopoverOrigin;
  transformOrigin: PopoverOrigin;
  onlyShowEmoji?: boolean;
}

export default function AvatarSelector (props: IProps) {
  const { open, onSetOpen, anchorEl, emoji, onSetEmoji, color, onSetColor, anchorOrigin, transformOrigin, onlyShowEmoji } = props;
  const classes = useStyles(undefined);

  function handleEmojiClick (emoji: BaseEmoji, _e: React.MouseEvent<HTMLElement, MouseEvent>) {
    onSetEmoji(emoji.native);
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={() => onSetOpen(false)}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
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
          {!onlyShowEmoji &&
            <Box flexGrow={1} p={2} margin='0 auto'>
              <Box>
                <CirclePicker
                  color={color}
                  onChangeComplete={e => onSetColor(e.hex)}
                />
              </Box>
              <Box pt={3}>
                <Avatar
                  className={classes.popperAvatar}
                  style={{ background: color, width: 128, height: 128, fontSize: 64 }}
                >
                  {emoji}
                </Avatar>
              </Box>
            </Box>
          }
        </Box>
        {!onlyShowEmoji &&
          <Box flexGrow={1}>
            <Button
              onClick={() => onSetOpen(false)}
              fullWidth
              color='primary'
              variant='contained'>
              done
            </Button>
          </Box>
        }
      </Box>
    </Popover>)
}