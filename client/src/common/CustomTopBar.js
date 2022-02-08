import React from 'react'

import {
  Button,
  Grid,
  Paper,
  Typography
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1)
  },
  positive: {
    color: theme.palette.positive.main,
  },
  negative: {
    color: theme.palette.negative.main,
  },
}));

function CustomTopBar(props) {
  const classes = useStyles();

  const {
    topBarItems,
  } = props;

  const renderElement = (item) => {
    switch (item.type) {
      case ('button'):
        return (
          <Button
            key={item.text}
            // className={classes.button}
            variant="contained"
            color="primary"
            onClick={(evt) => item.action()}
          >
            {item.text}
          </Button>
        )
      case ('text'):
        return (
          <Typography
            key={item.text}
            variant="sub1"
            className={item.isFuture ? classes.positive : classes.negative}
          >
            {item.text}
          </Typography>
        )
      case ('icon_text'):
        return (
          <Grid
            container
            key={item.text}
            style={{ color: item.color, alignItems: 'center' }}
          >
            <Grid
              item
              style={{ display: 'flex' }}
            >
              {item.icon}
            </Grid>

            <Grid
              item
            >
              <Typography
                variant="subtitle1"
              >
                {item.text && item.text.short}
              </Typography>
            </Grid>
          </Grid>
        )
      default:
        return null;
    }
  }

  return (
    <Grid
      item
      xs={12}
    >
      <Paper
        className={classes.paper}
      >
        <Grid
          container
        >
          {topBarItems?.map((item) => (
            renderElement(item)
          ))}
          {/* <Button
          // className={classes.button}
          variant="contained"
          color="primary"
        // onClick={(evt) => handleSubmit(evt)}
        >Lisää käyttäjiä</Button> */}
        </Grid>
      </Paper>
    </Grid>
  )
}

export default CustomTopBar;