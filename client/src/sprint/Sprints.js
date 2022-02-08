import React, { useEffect, useState } from 'react'

import { observer } from "mobx-react";

import {
  Grid,
} from '@material-ui/core'

import {
  Schedule,
} from '@material-ui/icons';

import { useTranslation } from 'react-i18next';

import { useStores } from '../stores'

import { useParams } from "react-router-dom";

import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  isFuture,
  isPast
} from 'date-fns';

import { DragDropContext } from 'react-beautiful-dnd';
import TaskCategory from './TaskCategory';
import TaskModal from '../task/TaskModal';
import ActionModal from '../common/ActionModal';
import CustomTopBar from '../common/CustomTopBar';

const Sprints = observer(function Sprints(props) {
  const { setSelectedView } = props;
  const { uiStore, projectStore, projectStore: { currentProject }, requests } = useStores();
  const { id } = useParams();
  const { t } = useTranslation();

  const [curSprint, setCurSprint] = useState(null);
  const [statuses, setStatuses] = useState(null);
  const [tasks, setTasks] = useState([[], [], []]);

  const categorizeTasks = (curSprint) => {

    const plannedTasks = currentProject?.tasks.filter((task) => task.sprintId === curSprint.id && task.status === 'planned')
    const ongoingTasks = currentProject?.tasks.filter((task) => task.sprintId === curSprint.id && task.status === 'ongoing')
    const testingTasks = currentProject?.tasks.filter((task) => task.sprintId === curSprint.id && task.status === 'testing')
    const completedTasks = currentProject?.tasks.filter((task) => task.sprintId === curSprint.id && task.status === 'completed')

    setTasks(
      {
        "planned": plannedTasks,
        "ongoing": ongoingTasks,
        "testing": testingTasks,
        "completed": completedTasks
      }
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      const taskStatuses = await requests.taskStatus.getTaskStatuses();
      setStatuses(taskStatuses);
    }

    fetchData().then(() => {
      const currentSprint = currentProject?.sprints.find((sprint) => sprint.id === parseInt(id));
      setCurSprint(currentSprint);
      setSelectedView(curSprint?.name);
      categorizeTasks(currentSprint);
    })
  }, [id, currentProject, setSelectedView, curSprint, requests])

  const submitSprintMove = (evt, sprintId = null, movedTask = null, destination) => {
    evt.preventDefault();
    projectStore.moveTask(sprintId, !movedTask ? uiStore.currentTask.id : movedTask.id)
      .then((respTask) => {
        setTasks((prevState) => {
          return {
            ...prevState,
            [respTask.status]: tasks[respTask.status].filter((task) => task.id !== respTask.id),
          }
        })
      })
      .then(() => destination !== 'backlog' && uiStore.toggleActionModal())
      .catch((e) => alert(e))
  }

  const onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (destination.droppableId === source.droppableId) {
      const fromColumn = statuses[source.droppableId]
      const fromTasks = Array.from(tasks[fromColumn.status])

      const itemToMove = tasks[fromColumn.status].find((task) => task.id === parseInt(draggableId))

      fromTasks.splice(source.index, 1);
      fromTasks.splice(destination.index, 0, itemToMove)

      setTasks((prevState) => {
        return {
          ...prevState,
          [fromColumn.status]: fromTasks,
        }
      })
    }

    if (destination.droppableId !== source.droppableId) {
      const fromColumn = statuses[source.droppableId]
      const toColumn = statuses[destination.droppableId]
      const fromTasks = Array.from(tasks[fromColumn.status])
      const toTasks = Array.from(tasks[toColumn.status])

      const itemToMove = tasks[fromColumn.status].find((task) => task.id === parseInt(draggableId))
      itemToMove.changeAttr('status', statuses[destination.droppableId].status)

      projectStore.changeTaskStatus(itemToMove.id, itemToMove.status)

      fromTasks.splice(source.index, 1);
      toTasks.splice(destination.index, 0, itemToMove)

      setTasks((prevState) => {
        return {
          ...prevState,
          [fromColumn.status]: fromTasks,
          [toColumn.status]: toTasks,
        }
      })
    }
  }

  const getTimeLeft = () => {
    const dayDifference = curSprint?.dueDatetime ? differenceInDays(new Date(curSprint?.dueDatetime), new Date()) : null

    const hourDifference = differenceInHours(new Date(curSprint?.dueDatetime), new Date())
    const minuteDifference = differenceInMinutes(new Date(curSprint?.dueDatetime), new Date())

    let message

    if (dayDifference < 0) {
      message = {
        long: t("task.dueDaysAgo.long", { days: Math.abs(dayDifference) }),
        short: t("task.dueDaysAgo.short", { days: Math.abs(dayDifference) }),
      }
    } else if (dayDifference > 0) {
      message = {
        long: t("task.dueInDays.long", { days: dayDifference }),
        short: t("task.dueInDays.short", { days: dayDifference }),
      }
    } else if (dayDifference === 0) {
      if (hourDifference > 0) {
        message = {
          long: t("task.dueInHours.long", { hours: Math.floor(minuteDifference / 60), minutes: minuteDifference - Math.floor(minuteDifference / 60) * 60 }),
          short: t("task.dueInHours.short", { hours: Math.floor(minuteDifference / 60), minutes: minuteDifference - Math.floor(minuteDifference / 60) * 60 }),
        }
      } else if (hourDifference < 0) {
        message = {
          long: t("task.dueHoursAgo.long", { hours: Math.abs(Math.round(minuteDifference / 60)), minutes: Math.abs(minuteDifference - Math.round(minuteDifference / 60) * 60) }),
          short: t("task.dueHoursAgo.short", { hours: Math.abs(Math.round(minuteDifference / 60)), minutes: Math.abs(minuteDifference - Math.round(minuteDifference / 60) * 60) }),
        }
      } else {
        message = `${Math.abs(Math.floor(minuteDifference))}min`
      }
    } else {
      message = null;
    }

    return message
  }

  const getColor = () => {
    const dueTime = new Date(curSprint?.dueDatetime)
    const dayDifference = curSprint?.dueDatetime ? differenceInDays(new Date(curSprint?.dueDatetime), new Date()) : null
    if (isFuture(dueTime) && dayDifference > 0) {
      return 'green';
    } else if (isPast(dueTime)) {
      return 'red';
    } else {
      return 'green';
    }
  }

  const topBarItems = [
    {
      type: 'icon_text',
      icon: (
        <Schedule />
      ),
      text: getTimeLeft(),
      color: getColor()
    }
  ]

  return (
    <Grid
      container
      spacing={2}
    >
      <CustomTopBar
        topBarItems={topBarItems}
      />

      <Grid
        item
        xs={12}
      >
        <Grid
          container
          spacing={2}
        >
          <DragDropContext
            onDragEnd={onDragEnd}
          >
            {statuses?.map((value, index) => (
              <Grid
                item
                key={index}
                xs={12}
                lg={12 / statuses.length}
              >
                <TaskCategory
                  index={index}
                  label={value.status}
                  tasks={tasks[value.status]}
                  submitTaskMove={submitSprintMove}
                  currentSprint={curSprint}
                />
              </Grid>
            ))}
          </DragDropContext>
        </Grid>
      </Grid>

      {uiStore.openTaskModal && (
        <TaskModal
          currentTask={uiStore.currentTask}
        />
      )}
      {uiStore.openActionModal && (
        <ActionModal
          title={t('menu.move_to_sprint')}
          data={currentProject?.sprints}
          type={'sprint'}
          acceptAction={submitSprintMove}
        />
      )}
    </Grid>
  )
});

export default Sprints;