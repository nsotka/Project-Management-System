import { observer } from 'mobx-react'
import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles';

import {
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

import {
  MoreVert,
} from '@material-ui/icons';

import { useStores } from '../stores';

import { Link } from "react-router-dom";

import { useTranslation } from 'react-i18next';

import DropDownMenu from '../common/DropDownMenu';
import ConfirmModal from '../common/ConfirmModal';

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  endIcon: {
    justifyContent: 'end',
  },
  formControl: {
    minWidth: 200
  },
  toolbar: {
    ...theme.mixins.toolbar,
    textAlign: 'center'
  },
  drawerPaper: {
    width: drawerWidth,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  listProgress: {
    display: 'flex',
    justifyContent: 'center'
  },
  noLinkStyles: {
    alignItems: 'center',
    display: 'flex',
    width: '100%',
    textDecoration: 'none',
    color: '#000000',
  },
}));

const drawerWidth = 240;

const SprintNavItem = observer(function SprintNavItem(props) {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const { t } = useTranslation();
  const { sprint, selectedView, handleSelectView } = props;
  const { projectStore, uiStore } = useStores();

  const classes = useStyles();

  const menuItems = [
    !sprint.sprintItem.active && (
      {
        text: t('menu.change_active'),
        action: () => {
          projectStore.changeActiveStatus(sprint.id)
          handleCloseMenu();
        }
      }
    ),
    {
      text: t('menu.edit_sprint'),
      action: () => {
        uiStore.toggleSprintModal('edit', sprint.sprintItem);
        handleCloseMenu();
      }
    },
    !sprint.sprintItem.closed
      ? {
        text: t('menu.close_sprint'),
        action: () => {
          projectStore.changeClosedStatus(sprint.id)
          handleCloseMenu();
        }
      }
      : {
        text: t('menu.open_sprint'),
        action: () => {
          projectStore.changeClosedStatus(sprint.id)
          handleCloseMenu();
        }
      },
    {
      text: t('menu.delete_sprint'),
      action: () => {
        toggleConfirmModal()
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

  const toggleConfirmModal = () => {
    setConfirmModalOpen(!confirmModalOpen);
  }

  const deleteSprint = (evt) => {
    evt.preventDefault();
    projectStore.deleteSprint(sprint.sprintItem)
  }

  return (
    <ListItem
      button
      key={sprint.id}
      className={classes.nested}
      selected={selectedView === sprint.name ? true : false}
    >
      <Link
        className={classes.noLinkStyles}
        to={sprint.to}
        onClick={() => {
          handleSelectView(sprint.text)
        }}
      >
        <ListItemIcon>
          {sprint.icon && (
            sprint.icon
          )}
        </ListItemIcon>
        <ListItemText primary={sprint.text} />
      </Link>
      <ListItemIcon
        className={classes.endIcon}
      >
        <MoreVert
          id={`testi_${sprint.id}`}
          onClick={(evt) => handleMenuClick(evt)}
        />
        <DropDownMenu
          items={menuItems}
          anchorEl={menuAnchorEl}
          handleCloseMenu={handleCloseMenu}
        />
      </ListItemIcon>
      <ConfirmModal
        openConfirmModal={confirmModalOpen}
        toggleConfirmModal={toggleConfirmModal}
        confirmMethod="delete"
        confirmAction={deleteSprint}
        target={sprint.text}
      />
    </ListItem>
  )
})

export default SprintNavItem;