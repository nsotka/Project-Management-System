import React from 'react'
import { Droppable } from 'react-beautiful-dnd';
import TaskDragItem from './TaskDragItem';
import {
  Divider,
  Grid,
  Typography
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles';

import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  divider: {
    height: '5px'
  },
  categoryLabel: {
    textAlign: 'center',
  },
  container: {
    marginTop: '5px',
    minHeight: '80vh'
  }
}));

export default function TaskCategory(props) {
  const { label, tasks, index, submitTaskMove, currentSprint } = props;

  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <>
      <Typography
        className={classes.categoryLabel}
        variant="h6"
      >
        {t(`task.status.${label}`)}
      </Typography>
      <Divider className={classes.divider} />
      <Droppable droppableId={`${index}`}>
        {(provided) => (
          <Grid
            container
            spacing={1}
            item
            direction="column"
            className={classes.container}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks?.map((task, index) => (
              <TaskDragItem
                index={index}
                task={task}
                key={task.id}
                submitTaskMove={submitTaskMove}
                currentSprint={currentSprint}
              />
            ))}
            {provided.placeholder}
          </Grid>
        )}
      </Droppable>
    </>
  )
}
