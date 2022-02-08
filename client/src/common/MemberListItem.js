import React, { useState } from 'react';

import CancelIcon from '@material-ui/icons/Cancel';

import {
  IconButton,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  MenuItem,
  Typography,
  Select,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';

import { useStores } from '../stores';

import ConfirmModal from './ConfirmModal';

const useStyles = makeStyles((theme) => ({
  negative: {
    color: theme.palette.negative.main
  },
  noPadding: {
    padding: '0px'
  }
}))

const MemberListItem = observer(function MemberListItem(props) {
  const {
    item,
    itemType,
  } = props;

  const { projectStore } = useStores();

  const classes = useStyles();

  const [edit, setEdit] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const toggleEditMode = () => {
    setEdit(!edit)
  }

  const handleChoose = () => {
    toggleEditMode()
  }

  const roles = [
    "Admin",
    "Member"
  ]

  const handleDeleteInvitation = (evt) => {
    evt.preventDefault();
    projectStore.deleteInvitation(item.id)
  }

  const toggleConfirmModal = () => {
    setConfirmModalOpen(!confirmModalOpen)
  }

  return (
    <>
      <ListItem
        key={`${itemType}_${item.id}`}
      >
        <ListItemText
          children={
            <>
              <Typography
                variant="body1"
              >
                {itemType === 'invitation'
                  ? `${item.user.firstName} ${item.user.lastName}`
                  : `${item.firstName} ${item.lastName}`
                }
              </Typography>
              {!edit
                ? (
                  <Typography
                    variant="body2"
                    onDoubleClick={toggleEditMode}
                  >
                    {itemType === 'invitation'
                      ? `${item.user.role}`
                      : `${item.role}`
                    }
                  </Typography>
                )
                : (
                  <Select
                    value={item.role}
                    variant="outlined"
                    open={true}
                    classes={{
                      select: classes.noPadding,
                    }}
                  >
                    {roles.map((role) => (
                      <MenuItem
                        key={role}
                        value={role}
                        onClick={handleChoose}
                      >
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                )
              }
            </>
          }
        />
        {itemType === 'invitation' && (
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              className={`${classes.negative}`}
              onClick={() => setConfirmModalOpen(true)}
            >
              <CancelIcon />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>
      <ConfirmModal
        openConfirmModal={confirmModalOpen}
        toggleConfirmModal={toggleConfirmModal}
        confirmMethod="delete"
        confirmAction={handleDeleteInvitation}
        target={`${item.user?.firstName} ${item.user?.lastName}`}
      />
    </>
  )
})

export default MemberListItem;
