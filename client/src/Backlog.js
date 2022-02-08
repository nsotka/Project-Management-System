import React from 'react';
import { observer } from "mobx-react";
import {
  Grid,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import TaskModal from './task/TaskModal';
import { useStores } from './stores';
import TaskItem from './task/TaskItem';
import ActionModal from './common/ActionModal';
import CustomTopBar from './common/CustomTopBar';

const Backlog = observer(function Backlog() {
  const { t } = useTranslation();
  const { uiStore, projectStore, projectStore: { currentProject } } = useStores();

  const submitSprintMove = (evt, sprintId) => {
    evt.preventDefault();
    projectStore.moveTask(sprintId, uiStore.currentTask.id)
      .then(() => uiStore.toggleActionModal())
      .catch((e) => alert(e))
  }

  const topBarItems = [
    {
      type: 'button',
      text: t('backlog.create_task'),
      action: () => uiStore.toggleTaskModal('create')
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

      {
        currentProject?.tasks.filter((task) => task.sprintId === null).map((task) => (
          <Grid
            key={`task_${task.id}`}
            item
            xs={12}
            md={4}
            lg={3}
          >
            <TaskItem
              task={task}
            />
          </Grid>
        ))
      }
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
})

export default Backlog
