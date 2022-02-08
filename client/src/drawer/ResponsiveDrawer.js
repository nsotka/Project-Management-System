import React from 'react';
import { observer } from "mobx-react";
import { useTranslation } from 'react-i18next';

import {
  CircularProgress,
  Collapse,
  Divider,
  Drawer,
  FormControl,
  Hidden,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select
} from '@material-ui/core';

import {
  Add,
  Dashboard,
  DirectionsRun,
  ExpandLess,
  ExpandMore,
  Lock,
  MeetingRoom,
  PeopleAlt,
  Settings,
  Star
} from '@material-ui/icons';

import ListIcon from '@material-ui/icons/List';

import { Link, useHistory } from "react-router-dom";

import { makeStyles, useTheme } from '@material-ui/core/styles';

import { useStores } from '../stores';
import SprintNavItem from './SprintNavItem';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  activeProject: {
    height: '40px'
  },
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
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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

function ListItemChildLink(child, handleSelectView, selectedView) {
  const { icon, text, to } = child;
  const classes = useStyles();

  const CustomChildLink = React.useMemo(
    () =>
      React.forwardRef((linkProps, ref) => (
        <Link ref={ref} to={to} {...linkProps} />
      )),
    [to],
  );

  return (
    <List
      key={text}
      component="div"
      disablePadding
    >
      <ListItem
        button
        className={classes.nested}
        component={CustomChildLink}
        selected={selectedView === child.text}
        onClick={() => {
          handleSelectView(child.text)
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItem>
    </List>
  )
}

function ListItemLink(item, handleSelectView, selectedView) {
  const { icon, text, to, collapse } = item;
  const [boardsOpen, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!boardsOpen);
  };

  const CustomLink = React.useMemo(
    () =>
      React.forwardRef((linkProps, ref) => (
        <Link ref={ref} to={to} {...linkProps} />
      )),
    [to],
  );

  return (
    <li
      key={text}
    >
      <ListItem
        button
        selected={selectedView === item.text ? true : false}
        component={!collapse ? CustomLink : null}
        onClick={collapse ? handleClick : () => handleSelectView(item.text)}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
        {collapse && (
          boardsOpen ? <ExpandLess /> : <ExpandMore />
        )
        }
      </ListItem>
      {collapse && (
        <Collapse in={boardsOpen} timeout="auto" unmountOnExit>
          {item.children.map((child, index) => (
            ListItemChildLink(child, handleSelectView, selectedView)
          ))}
        </Collapse>
      )}
    </li>
  )
}

const ResponsiveDrawer = observer(function ResponsiveDrawer(props) {
  const { window, handleDrawerToggle, mobileOpen, handleSelectView, selectedView } = props;
  const classes = useStyles();
  const theme = useTheme();
  const {
    uiStore,
    projectStore,
    projectStore: {
      userProjects,
      currentProject,
    }
  } = useStores();
  const [sprintsOpen, setSprintsOpen] = React.useState(false);
  const history = useHistory();
  const { t } = useTranslation();

  const getIcon = (sprint) => {
    if (sprint.closed) {
      return <Lock />
    }
    else if (sprint.active) {
      return <Star />
    } else {
      return null
    }
  }

  const sprints =
    currentProject?.sprints
      ? currentProject.sprints.map((sprint, index) => ({
        id: sprint.id,
        sprintItem: sprint,
        icon: getIcon(sprint),
        text: sprint.name,
        to: `/sprints/${sprint.id}`
      }))
      : []


  const navItems = [

    {
      collapse: false,
      icon: <Dashboard />,
      text: t('navigation.dashboard'),
      to: '/dashboard',
    },
    {
      collapse: false,
      icon: <ListIcon />,
      text: t('navigation.backlog'),
      to: '/backlog',
    },
    {
      collapse: true,
      icon: <Settings />,
      text: t('navigation.management'),
      to: null,
      children: [
        {
          icon: <PeopleAlt />,
          text: t('navigation.users'),
          to: '/users'
        }
      ]
    }
  ]

  const handleChange = (event) => {

    const { changeCurrentProject } = projectStore;
    const { value } = event.target;

    changeCurrentProject(value)
    history.push('/dashboard')
  }

  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <FormControl
          variant="outlined"
          className={classes.formControl}
        >
          <InputLabel id="active-project-label">{t('navigation.project')}</InputLabel>
          <Select
            className={classes.activeProject}
            labelId="active-project-label"
            id="active-project"
            label={t('navigation.project')}
            value={userProjects?.value && currentProject ? `${projectStore.currentProject.id}` : ''}
            onChange={handleChange}
          >
            {userProjects && userProjects.case({
              pending: () => {
                return (
                  <div
                    className={classes.listProgress}
                  >
                    <CircularProgress />
                  </div>
                )
              },
              fulfilled: (value) => {
                return (
                  value.map((project) => (
                    <MenuItem
                      key={`project_${project.id}`}
                      value={project.id}
                    >
                      {project.title}
                    </MenuItem>
                  ))
                )
              }
            })}
          </Select>
        </FormControl>
      </div>
      <Divider />
      <List>
        <ListItem
          button
          onClick={() => uiStore.toggleProjectModal('create')}
        >
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText primary={t('navigation.new_project')} />
        </ListItem>
      </List>
      <Divider />
      <List>
        {navItems.map((item) => (
          ListItemLink(item, handleSelectView, selectedView)
        ))}
        {
          <>
            <ListItem
              button
              onClick={() => setSprintsOpen(!sprintsOpen)}
            >
              <ListItemIcon>
                <DirectionsRun />
              </ListItemIcon>
              <ListItemText primary={t('navigation.sprints')} />
              {sprintsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={sprintsOpen} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
              >
                <ListItem
                  button
                  className={classes.nested}
                  onClick={() => uiStore.toggleSprintModal('create')}
                >
                  <ListItemIcon>
                    <Add />
                  </ListItemIcon>
                  <ListItemText primary={"Uusi sprintti"} />
                </ListItem>
                <Divider />
                {sprints?.map((sprint) => (
                  <SprintNavItem
                    key={`sprint_${sprint.id}`}
                    sprint={sprint}
                    selectedView={selectedView}
                    handleSelectView={handleSelectView}
                  />
                )
                )}
              </List>
            </Collapse>
          </>
        }
      </List>
      <Divider />
      <List>
        <ListItem
          button
          onClick={() => uiStore.logout()}
        >
          <ListItemIcon>
            <MeetingRoom />
          </ListItemIcon>
          <ListItemText primary={t('navigation.signout')} />
        </ListItem>
      </List>
    </div >
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Hidden smUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
})

export default ResponsiveDrawer;