import './App.css';
import { observer } from "mobx-react";
import {
  AppBar,
  CssBaseline,
  IconButton,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from '@material-ui/core';
import ResponsiveDrawer from './drawer/ResponsiveDrawer';
import MenuIcon from '@material-ui/icons/Menu';

import { makeStyles } from '@material-ui/core/styles';

import {
  Switch,
  Route,
  Redirect,
  useLocation,
  useHistory,
} from "react-router-dom";

import React, { useEffect, useRef } from 'react';
import Dashboard from './dashboard/Dashboard';
import Sprints from './sprint/Sprints';
import ProjectModal from './project/ProjectModal';
import Login from './Login';
import Backlog from './Backlog';
import { useStores } from './stores'
import i18n from './i18n';
import UserManagement from './administration/UserManagement';
import SprintModal from './sprint/SprintModal';

import { useTranslation } from 'react-i18next';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  langContainer: {
    display: 'flex',
  },
  langSelect: {
    color: '#FFFFFF'
  },
  langTitle: {
    marginRight: '7px',
    alignSelf: 'center',
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    },
  },
}));

const App = observer(function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedView, setSelectedView] = React.useState('');
  const { uiStore, projectStore } = useStores();
  const classes = useStyles();
  const location = useLocation();
  const mountedRef = useRef(true);
  const history = useHistory();
  const { t } = useTranslation();

  const dataFetch = async () => {
    if (!uiStore.loggedIn && location.pathname !== '/') {
      history.push('/')
    } else if (uiStore.loggedIn && !uiStore.currentUser) {
      try {
        await uiStore.getCurrentUserData();
        await projectStore.getUserProjects();
      }
      catch (e) {
        console.log('ERROR', e)
      }
    }
  }

  useEffect(() => {
    dataFetch()
    return () => {
      mountedRef.current = false;
    }
  }, [])

  const handleChangeLanguage = (event) => {
    const { value } = event.target;

    uiStore.changeLanguage(value)
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  };

  const handleSelectView = (viewName) => {
    setSelectedView(viewName)
  }

  if (!uiStore.loggedIn && location.pathname !== '/') {
    history.push('/')
  }

  if (location.pathname === '/') {
    return (
      <Route>
        {uiStore.loggedIn ? <Redirect to='/dashboard' /> : <Login />}
      </Route>
    )
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar
          style={{ justifyContent: 'space-between' }}
        >
          <div
            style={{ display: 'flex' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {selectedView}
            </Typography>
          </div>
          <div
            className={classes.langContainer}
          >
            <Typography
              variant='subtitle1'
              className={classes.langTitle}
            >
              {t('navigation.language')}
            </Typography>
            <Select
              value={uiStore.currentLanguage}
              onChange={handleChangeLanguage}
              disableUnderline
              className={classes.langSelect}
              classes={{
                icon: classes.langSelect
              }}
            >
              {i18n.languages.map((lang) => (
                <MenuItem
                  key={lang}
                  value={lang}
                >
                  {lang.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </div>
        </Toolbar>
      </AppBar>
      <ResponsiveDrawer
        handleDrawerToggle={handleDrawerToggle}
        mobileOpen={mobileOpen}
        handleSelectView={handleSelectView}
        selectedView={selectedView}
      />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route exact path='/'>
            {uiStore.loggedIn ? <Redirect to='/dashboard' /> : <Login />}
          </Route>
          <Route path='/dashboard'>
            <Dashboard />
          </Route>
          <Route path='/users'>
            <UserManagement />
          </Route>
          <Route path='/sprints/:id'>
            <Sprints
              setSelectedView={setSelectedView}
            />
          </Route>
          <Route path='/backlog'>
            <Backlog />
          </Route>
        </Switch>
      </main>
      {uiStore.openProjectModal && (
        <ProjectModal />
      )}
      {uiStore.openSprintModal && (
        <SprintModal
          currentSprint={uiStore.currentSprint}
        />
      )}
    </div>
  );
})


export default App;
