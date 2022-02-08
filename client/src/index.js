import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, unstable_createMuiStrictModeTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

import {
  BrowserRouter as Router,
} from "react-router-dom";

// import i18n (needs to be bundled ;))
import './i18n';

let theme = unstable_createMuiStrictModeTheme({
  palette: {
    primary: {
      main: blue[500],
    },
    // secondary: {
    //   main: green[500],
    // },
    positive: {
      main: green[500],
    },
    negative: {
      main: red[500],
    }
  },
});

theme = unstable_createMuiStrictModeTheme(theme, {
  overrides: {
    MuiFormHelperText: {
      root: {
        color: theme.palette.negative.main
      },
    },
  },
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
