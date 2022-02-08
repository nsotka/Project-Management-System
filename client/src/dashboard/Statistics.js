import { observer } from 'mobx-react'
import React from 'react'

import {
  CircularProgress,
  Grid,
  Typography,
} from '@material-ui/core';

import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';

import { useStores } from '../stores';

const useStylesCircular = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  wrapper: {
    position: "relative",
    alignSelf: 'center'
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === "light" ? 200 : 700]
  },
  top: {
    color: "#1a90ff",
    position: "absolute",
    left: 0
  },
  circularLabel: {
    alignSelf: 'center'
  },
  tasksContainer: {
    textAlign: 'center'
  },
}));

const Statistics = observer(function Statistics(props) {
  const { t } = useTranslation();
  const { label } = props;
  const classes = useStylesCircular();
  const { projectStore: { currentProject } } = useStores();

  const CalcPercentage = (value1, value2) => {
    if (value1 === 0 && value2 === 0 ) {
      return 0
    }
  
    // return ((value2 / value1) * 100).toFixed(2)
    return Math.round((value2 / value1) * 100)
  }

  const percentage = label === 'tasks' && currentProject
    ? CalcPercentage(
      currentProject?.tasks.length,
      currentProject?.tasks.filter((task) => task.status === 'completed').length
    )
    : CalcPercentage(
      currentProject?.sprints.length,
      currentProject?.sprints.filter((sprint) => sprint.closed).length
    )

  return (
    <div className={classes.root}>
      <Typography
        variant="h6"
        className={classes.circularLabel}
      >
        {t(`dashboard.${label}`)}
      </Typography>
      <Typography
        variant="h6"
        className={classes.circularLabel}
      >
        {`${percentage}%`}
      </Typography>
      <div className={classes.wrapper}>
        <CircularProgress
          className={classes.bottom}
          variant="determinate"
          value={100}
          size={120}
          thickness={22}
        />
        <CircularProgress
          className={classes.top}
          variant="determinate"
          value={percentage}
          size={120}
          thickness={22}
        />
      </div>
      <Grid
        className={classes.tasksContainer}
        container
      >
        <Grid
          item
          xs={4}
        >
          <Typography
            variant="subtitle1"
          >
            {t('dashboard.total')}
          </Typography>
          <Typography
            variant='subtitle1'
          >
            {
              label === 'tasks'
                ? currentProject?.tasks.length
                : currentProject?.sprints.length
            }
          </Typography>
        </Grid>
        <Grid
          item
          xs={4}
        >
          <Typography
            variant='subtitle1'
          >
            {t('dashboard.open')}
          </Typography>
          <Typography
            variant='subtitle1'
          >
            {
              label === 'tasks'
                ? currentProject?.tasks.filter((task) => task.status !== 'completed').length
                : currentProject?.sprints.filter((sprint) => !sprint.closed).length
            }
          </Typography>
        </Grid>
        <Grid
          item
          xs={4}
        >
          <Typography
            variant='subtitle1'
          >
            {t('dashboard.closed')}
          </Typography>
          <Typography
            variant='subtitle1'
          >
            {
              label === 'tasks'
                ? currentProject?.tasks.filter((task) => task.status === 'completed').length
                : currentProject?.sprints.filter((sprint) => sprint.closed).length
            }
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
})

export default Statistics;
