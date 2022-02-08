import React from 'react'
import { Draggable } from 'react-beautiful-dnd';

import { Grid } from '@material-ui/core'

import TaskItem from '../task/TaskItem';

function TaskDragItem(props) {
  const {
    task,
    index,
    submitTaskMove,
    currentSprint,
  } = props;

  return (
    <Draggable
      draggableId={`${task.id}`}
      isDragDisabled={currentSprint.closed}
      index={index}
    >
      {(provided) => (
        <Grid
          item
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <TaskItem
            task={task}
            submitTaskMove={submitTaskMove}
          />
        </Grid>
      )}
    </Draggable>
  )
}

export default TaskDragItem;
