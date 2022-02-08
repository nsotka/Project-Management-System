import React from 'react'

import {
  Avatar,
  Tooltip,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  avatarContainer: {
    display: 'flex',
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    fontSize: '12px',
    '&:hover': {
      zIndex: 1
    }
  }
}));

export default function UserAvatar(props) {
  const { user, index } = props;
  const classes = useStyles();
  const defaultLeftValue = 10;

  const colors = {
    0: '#c3c4c3',
    1: '#aaacaa',
    2: '#919492',
    3: '#787c79',
    4: '#606361',
    5: '#484a49',
  }

  return (
    <div>
      <Tooltip
        title={`${user.firstName} ${user.lastName}`}
        placement="top"
        enterTouchDelay={100}
      >
        <Avatar
          key={`user_${user.id}`}
          style={{
            backgroundColor: colors[index],
            left: index > 0
              ? `-${index * defaultLeftValue}px`
              : 'auto',
          }}
          className={classes.avatar}
        >
          {`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
        </Avatar>
      </Tooltip>
    </div>
  )
}
