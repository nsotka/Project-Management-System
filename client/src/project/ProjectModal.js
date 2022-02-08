import React from 'react'

import { observer } from "mobx-react";

import {
  Button,
  Grid,
  Modal,
  TextField,
  Typography
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles';

import { useStores } from '../stores'

import { useInput } from '../hooks/CustomHooks';

import Project from '../models/Project';
import { useTranslation } from 'react-i18next';

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
  textField: {
    width: '100%'
  }
}));

const validate = {
  title: title => titleValidation("Project title", title),
  description: description => { return null },
}

const titleValidation = (fieldName, fieldValue) => {
  if (fieldValue.trim() === '') {
    return `${fieldName} is required`;
  }

  return null;
}

const ProjectModal = observer(function ProjectModal() {
  const { uiStore, projectStore } = useStores()
  const classes = useStyles();
  const { t } = useTranslation();

  const { value: title, bind: bindTitle } = useInput('');
  const { value: description, bind: bindDescription } = useInput('');

  const [errors, setErrors] = React.useState({});

  const AddTextField = (attr, required, bind) => {
    return (
      <TextField
        variant="outlined"
        className={classes.textField}
        required={required}
        helperText={errors[attr]}
        id={attr}
        label={t(`modal.${attr}`)}
        {...bind}
        onBlur={(evt) => onBlurDo(attr, evt.target.value)}
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
    const projectData = new Project({
      title,
      description
    })
    const validations = Object.keys(validate);

    const errorsOnSubmit = {};

    validations.forEach((validation) => {
      const error = validate[validation](projectData[validation])

      if (error) {
        errorsOnSubmit[validation] = error
      }
    })

    setErrors({
      ...errorsOnSubmit
    })

    if (!Object.values(errorsOnSubmit).length) {
      projectStore.createNewProject(projectData)
      .then(uiStore.toggleProjectModal())
      .catch((e) => alert(e))
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
        onClick={() => uiStore.toggleProjectModal()}
      >
        {t("modal.cancel")}
      </Button>
    </>
  )

  return (
    <Modal
      className={classes.modal}
      open={uiStore.openProjectModal}
      onClose={() => uiStore.toggleProjectModal()}
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
              {uiStore.projectMethod && `${t(`modal.${uiStore.projectMethod}_project`)}`}
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
            {AddTextAreaField('description', false, bindDescription)}
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
});

export default ProjectModal;
