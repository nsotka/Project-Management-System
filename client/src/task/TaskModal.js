import React, { useCallback, useEffect, useState, useRef } from 'react'
import { observer } from "mobx-react";

import {
  Grid,
  Button,
  Chip,
  Modal,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
  InputLabel,
  Tooltip,
} from '@material-ui/core';

import {
  Add,
} from '@material-ui/icons';

import { makeStyles } from '@material-ui/core/styles';
import { useStores } from '../stores'
import { useInput } from '../hooks/CustomHooks';

import Task from '../models/Task'
import { useTranslation } from 'react-i18next';
import AddUsersSelect from './AddUsersSelect';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },
  bottomActions: {
    backgroundColor: '#FFFFFF',
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 3)
  },
  fullField: {
    width: '100%'
  },
  formControl: {
    margin: theme.spacing(1),
  },
}));

const validate = {
  title: title => titleValidation('Task title', title),
  taskCategoryId: categoryId => categoryValidation('Task category', categoryId),
}

const titleValidation = (fieldName, fieldValue) => {
  if (fieldValue.trim() === '') {
    return `${fieldName} is required`;
  }

  return null;
}

const categoryValidation = (fieldName, fieldValue) => {
  if (!fieldValue) {
    return `${fieldName} is required`;
  }

  return null
}

const TaskModal = observer(function TaskModal(props) {
  const { t } = useTranslation()
  const { uiStore, projectStore, requests } = useStores()
  const classes = useStyles();
  const { currentTask } = props;

  const { value: id, setValue: setId } = useInput('');
  const { value: title, setValue: setTitle, bind: bindTitle } = useInput('');
  const [categories, setCategories] = useState(null);
  const [taskCategoryId, setTaskCategoryId] = useState('');
  const [usersOpen, setUsersOpen] = useState(false);
  const [addableMembers, setAddableMembers] = useState([]);
  const [taskUsers, setTaskUsers] = useState([]);

  const [errors, setErrors] = useState({});

  const mountedRef = useRef(true);

  const getAddableMembers = () => {
    const allMembers = projectStore.currentProject.members

    const addable = allMembers.filter((member) => {
      let alrdyInTask = null
      currentTask?.users.forEach((user) => {
        if (user.id === member.id) {
          alrdyInTask = member
        }
      })
      if (!alrdyInTask) {
        return member
      }
      else {
        return null
      }
    })

    return addable
  }

  const fetchTaskCategories = useCallback(async (currentproject, currentTask) => {
    if (projectStore.currentProject) {
      const fetchData = async () => {
        const taskCategories = await requests.taskCategory.getTaskCategories(projectStore.currentProject.id);
        setCategories(taskCategories)
      }

      if (!mountedRef.current) return null;

      fetchData().then(() => {
        setAddableMembers(getAddableMembers())
        if (currentTask) {
          setId(currentTask.id)
          setTitle(currentTask.title)
          setTaskCategoryId(currentTask.taskCategoryId)
          setTaskUsers(currentTask.users)
        }
      })
    }
  })

  useEffect(() => {
    fetchTaskCategories(projectStore.currentProject, currentTask)
    return () => {
      mountedRef.current = false;
    }
  }, [projectStore.currentProject, currentTask, taskUsers])

  const handleCategoryChange = (attr, event) => {
    const { value } = event.target;

    const error = validate[attr](value)

    const { [attr]: removedError, ...rest } = errors;

    setErrors({
      ...rest,
      ...(error && { [attr]: error })
    })

    setTaskCategoryId(value)
  }

  const AddTextField = (attr, required, bind) => {
    return (
      <TextField
        className={classes.fullField}
        required={required}
        helperText={errors[attr]}
        id={attr}
        label={t(`modal.${attr}`)}
        {...bind}
        variant="outlined"
        onBlur={(evt) => onBlurDo(attr, evt.target.value)}
      />
    )
  }

  const AddSelectField = (attr, required) => {
    return (
      <FormControl
        variant="outlined"
        required={required}
        className={classes.FormControl}
        fullWidth
      >
        <InputLabel
          id="category_title"
        >
          {t("modal.category")}
        </InputLabel>
        <Select
          labelId="category_title"
          label={t("modal.category") + "*"}
          value={`${taskCategoryId}`}
          onChange={(evt) => handleCategoryChange(attr, evt)}
        >
          {categories && (categories.map((category) => (
            <MenuItem
              key={`category_${category.id}`}
              value={category.id}
            >
              {category.title}
            </MenuItem>
          )))
          }
        </Select>
        <FormHelperText>
          {errors[attr]}
        </FormHelperText>
      </FormControl>
    )
  }

  const onBlurDo = (attr, value) => {
    const error = validate[attr](value)

    const { [attr]: removedError, ...rest } = errors;

    setErrors({
      ...rest,
      ...(error && { [attr]: error })
    })
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const taskData = new Task({
      id,
      title,
      taskCategoryId,
      users: taskUsers,
    })
    const validations = Object.keys(validate);

    const errorsOnSubmit = {};

    validations.forEach((validation) => {
      const error = validate[validation](taskData[validation])

      if (error) {
        errorsOnSubmit[validation] = error
      }
    })

    setErrors({
      ...errorsOnSubmit
    })

    if (!Object.values(errorsOnSubmit).length) {
      switch (uiStore.taskMethod) {
        case 'create':
          projectStore.createTask(taskData).then(uiStore.toggleTaskModal)
          break;
        case 'edit':
          projectStore.editTask(taskData).then(uiStore.toggleTaskModal)
          break;
        default:
          return null
      }
    } else {
      console.log('ERRORS', errorsOnSubmit)
    }
  }

  const handleUserSubmit = (evt, users) => {
    evt.preventDefault();

    const usersToAdd = []

    Object.values(users).forEach((userChecked) => {
      if (userChecked.checked) {
        usersToAdd.push(userChecked.user)
      }
    })

    setTaskUsers(taskUsers.concat(usersToAdd))
    toggleUsersOpen()
  }

  const bottomButtons = () => (
    <>
      <Button
        color="primary"
        variant="contained"
        type="submit"
        onClick={(evt) => handleSubmit(evt)}
      >
        {t("modal.save")}
      </Button>
      <Button
        color="secondary"
        variant="outlined"
        onClick={() => uiStore.toggleTaskModal()}
      >
        {t("modal.cancel")}
      </Button>
    </>
  )

  const toggleUsersOpen = () => {
    setUsersOpen(!usersOpen)
  }

  const removeTaskUser = (index) => {
    setTaskUsers(taskUsers.filter((_, idx) => idx !== index))
  }

  return (
    <Modal
      className={classes.modal}
      open={uiStore.openTaskModal}
      onClose={() => uiStore.toggleTaskModal()}
    >
      <form style={{ maxWidth: '500px' }}>
        <Grid
          container
          className={classes.content}
          spacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <Typography
              variant="h5">
              {uiStore.taskMethod === 'create' ? t('backlog.create_task') : t('menu.edit_task')}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
          >
            {AddTextField('title', true, bindTitle)}
          </Grid>
          <Grid
            item
            xs={12}
          >
            {AddSelectField('taskCategoryId', true)}
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Button
              color="primary"
              startIcon={<Add />}
              onClick={() => toggleUsersOpen()}
            >
              {t("modal.add_users")}
            </Button>
          </Grid>
          <Grid
            container
            item
            spacing={1}
          >
            {taskUsers.map((user, index) => (
              <Grid
                key={`user_${user.id}`}
                item
                md={4}
                xs={6}
              >
                <Tooltip
                  title={`${user.firstName} ${user.lastName}`}
                  placement="top"
                  enterTouchDelay={100}
                >
                  <Chip
                    id={user.id}
                    style={{ width: '100%' }}
                    label={`${user.firstName} ${user.lastName}`}
                    onDelete={() => removeTaskUser(index)}
                  />
                </Tooltip>
              </Grid>
            ))}
          </Grid>
          <Grid
            item
            xs={12}
            className={classes.bottomActions}
          >
            {bottomButtons()}
          </Grid>
          <AddUsersSelect
            usersOpen={usersOpen}
            addableMembers={addableMembers}
            toggleUsersOpen={toggleUsersOpen}
            handleUserSubmit={handleUserSubmit}
          />
        </Grid>
      </form>
    </Modal>
  )
})

export default TaskModal;