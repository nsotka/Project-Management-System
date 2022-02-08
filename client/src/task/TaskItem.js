import React, { useState } from 'react'

import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'

import { makeStyles } from '@material-ui/core/styles';

import { useTranslation } from 'react-i18next';

import UserAvatar from './UserAvatar';
import DropDownMenu from '../common/DropDownMenu';
import { useStores } from '../stores';
import ConfirmModal from '../common/ConfirmModal';

const useStyles = makeStyles((theme) => ({
  avatarContainer: {
    display: 'flex',
  },
  avatar: {
    '&:hover': {
      zIndex: 1
    }
  },
  cardContent: {
    paddingTop: '0px',
    paddingBottom: '0px'
  },
  usersContainer: {
    display: 'flex',
  },
  withUsers: {
    paddingBottom: '0px',
  }
}));

export default function TaskItem(props) {
  const { task, submitTaskMove } = props;
  const classes = useStyles();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const { t } = useTranslation();
  const { projectStore, uiStore } = useStores();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const toggleConfirmModal = () => {
    setOpenConfirmModal(!openConfirmModal);
  }

  const menuItems = [
    task.sprintId
    && {
      text: t('menu.move_to_backlog'),
      action: (evt) => {
        submitTaskMove(evt, null, task, 'backlog')
        handleCloseMenu();
      }
    },
    {
      text: t('menu.move_to_sprint'),
      action: () => {
        uiStore.toggleActionModal(task)
        handleCloseMenu();
      }
    },
    {
      text: t('menu.edit_task'),
      action: () => {
        uiStore.toggleTaskModal('edit', task);
        handleCloseMenu();
      }
    },
    {
      text: t('menu.delete_task'),
      action: () => {
        toggleConfirmModal();
        handleCloseMenu();
      }
    }
  ].filter(Boolean)

  const handleMenuClick = (evt) => {
    setMenuAnchorEl(evt.currentTarget);
  }

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  }

  const deleteTask = (evt) => {
    evt.preventDefault();
    projectStore.deleteTask(task.id)
  }

  return (
    <Card>
      <CardHeader
        className={task.users.length > 0 ? classes.withUsers : ''}
        title={
          <Typography
            variant="subtitle1"
          >
            {task.title}
          </Typography>
        }
        action={
          <>
            <IconButton
              aria-controls="simple-menu" aria-haspopup="true"
              onClick={(evt) => handleMenuClick(evt)}
            >
              <MoreVert />
            </IconButton>
            <DropDownMenu
              items={menuItems}
              anchorEl={menuAnchorEl}
              handleCloseMenu={handleCloseMenu}
            />
          </>
        }
      />
      {task.users.length > 0 && (
        <CardContent
          className={classes.cardContent}
        >

          <div className={classes.usersContainer}>
            {task.users.map((user, index) => (
              <UserAvatar
                key={`userAvatar_${index}`}
                user={user}
                index={index}
              />
            ))
            }
          </div>
        </CardContent>
      )}
      <ConfirmModal
        openConfirmModal={openConfirmModal}
        toggleConfirmModal={toggleConfirmModal}
        confirmMethod="delete"
        confirmAction={deleteTask}
        target={task.title}
      />
    </Card>
  )
}
