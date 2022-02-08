import React, { useEffect, useState } from 'react'
import { observer } from "mobx-react";

import { format, parseISO } from 'date-fns';

import {
  Button,
  Grid,
  Modal,
  TextField,
  Typography,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import { useStores } from '../stores'
import { useInput } from '../hooks/CustomHooks';

import { useTranslation } from 'react-i18next';
import Sprint from '../models/Sprint';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  textField: {
    width: '100%'
  }
}));

const validate = {
  name: name => isEmptyValidation('Sprint name', name),
  startDatetime: startDatetime => isEmptyValidation('Start time', startDatetime),
  dueDatetime: dueDatetime => isEmptyValidation('Due time', dueDatetime)
}

const isEmptyValidation = (fieldName, fieldValue) => {
  if (fieldValue.trim() === '') {
    return `${fieldName} is required`;
  }

  return null;
}

const SprintModal = observer(function SprintModal(props) {
  const classes = useStyles();
  const { projectStore, uiStore } = useStores();
  const { t } = useTranslation();
  const { currentSprint } = props;

  const { value: id, setValue: setId } = useInput('');
  const { value: name, setValue: setName, bind: bindName } = useInput('');
  const { value: description, setValue: setDescription, bind: bindDescription } = useInput('');
  const { value: startDatetime, setValue: setStartDatetime, bind: bindStartDatetime } = useInput('');
  const { value: dueDatetime, setValue: setDueDatetime, bind: bindDueDatetime } = useInput('');

  const [errors, setErrors] = useState({});

  const formatDate = (date) => {
    if (date) return format(parseISO(date), "yyyy-MM-dd'T'HH:mm")

    return null
  }

  useEffect(() => {
    if (currentSprint) {
      setId(currentSprint.id)
      setDescription(currentSprint.description ? currentSprint.description : '');
      setDueDatetime(formatDate(currentSprint.dueDatetime ? currentSprint.dueDatetime : ''));
      setName(currentSprint.name);
      setStartDatetime(formatDate(currentSprint.startDatetime));
    }
  }, [currentSprint, setId, setDescription, setDueDatetime, setName, setStartDatetime])

  const AddTextField = (attr, required, bind) => {
    return (
      <TextField
        className={classes.textField}
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

  const AddDatetimeField = (attr, required, bind) => {
    return (
      <TextField
        variant="outlined"
        required={required}
        label={t(`modal.${attr}`)}
        type="datetime-local"
        helperText={errors[attr]}
        className={classes.textField}
        {...bind}
        InputLabelProps={{
          shrink: true,
        }}
      />
    )
  }

  const AddTextAreaField = (attr, required, bind) => {
    return (
      <TextField
        className={classes.textField}
        label={t(`modal.${attr}`)}
        required={required}
        multiline
        {...bind}
        rows={2}
        variant="outlined"
      />
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
    const sprintData = new Sprint({
      id,
      description,
      dueDatetime,
      name,
      projectId: projectStore.currentProject.id,
      startDatetime,
    })
    const validations = Object.keys(validate);

    const errorsOnSubmit = {};

    validations.forEach((validation) => {
      const error = validate[validation](sprintData[validation])

      if (error) {
        errorsOnSubmit[validation] = error
      }
    })

    setErrors({
      ...errorsOnSubmit
    })

    if (!Object.values(errorsOnSubmit).length) {
      switch (uiStore.sprintMethod) {
        case 'create':
          projectStore.createSprint(sprintData)
          .then(uiStore.toggleSprintModal)
          .catch((e) => alert(e))
          break;
        case 'edit':
          projectStore.editSprint(sprintData)
          .then(uiStore.toggleSprintModal)
          .catch((e) => alert(e))
          break;
        default:
          return null
      }
    } else {
      console.log('ERRORS', errorsOnSubmit)
    }
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
        onClick={() => uiStore.toggleSprintModal()}
      >
        {t("modal.cancel")}
      </Button>
    </>
  )

  return (
    <Modal
      className={classes.modal}
      open={uiStore.openSprintModal}
      onClose={() => uiStore.toggleSprintModal()}
    >
      <form style={{ maxWidth: '500px' }}>
        <Grid
          container
          className={classes.content}
          spacing={2}
        >
          <Grid
            item
          >
            <Typography
              variant="h5">
              {uiStore.sprintMethod === 'create' ? t('modal.create_sprint') : t('modal.edit_sprint')}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
          >
            {AddTextField('name', true, bindName)}
          </Grid>
          <Grid
            item
            xs={12}
          >
            {AddTextAreaField('description', false, bindDescription)}
          </Grid>
          <Grid
            item
            sm={6}
            xs={12}
          >
            {AddDatetimeField('startDatetime', true, bindStartDatetime)}
          </Grid>
          <Grid
            item
            sm={6}
            xs={12}
          >
            {AddDatetimeField('dueDatetime', true, bindDueDatetime)}
          </Grid>

          <Grid
            item
            className={classes.bottomActions}
            xs={12}
          >
            {bottomButtons()}
          </Grid>
        </Grid>
      </form>
    </Modal>
  )
})

export default SprintModal;