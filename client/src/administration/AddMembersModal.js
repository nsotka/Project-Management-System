import React, { useEffect, useState } from 'react'
import { observer } from "mobx-react";

import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';

import {
  Add,
  Delete,
} from '@material-ui/icons';

import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';

import { useStores } from '../stores'

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
  email: email => isEmptyValidation('Email', email),
  role: role => isNumberValidation('Role', role),
}

const isEmptyValidation = (fieldName, fieldValue) => {
  if (fieldValue.trim() === '') {
    return `${fieldName} is required`;
  }

  return null;
}

const isNumberValidation = (fieldName, fieldValue) => {
  if (typeof fieldValue !== 'number') {
    return `${fieldName} is required`;
  }

  return null
}

const AddMembersModal = observer(function AddMembersModal(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState(null)
  const {
    addMembersOpen,
    toggleAddMembersOpen,
  } = props;

  const {
    projectStore,
    projectStore: {
      currentProject
    }
  } = useStores();

  const memberObj = {
    role: '',
    projectId: currentProject?.id,
    email: '',
  }

  useEffect(() => {
    const fetchRoles = async () => {
      const roles = await projectStore.getRoles();
      setRoles(roles)
    }

    fetchRoles()
    setMembers([...members, memberObj])
  }, [currentProject])

  const validateAll = (members) => {
    const validations = Object.keys(validate)
    const errorsOnSubmit = {};

    members.forEach((member, index) => {
      validations.forEach((validation) => {
        const error = validate[validation](member[validation])

        if (error) {
          errorsOnSubmit[index] = { ...errorsOnSubmit[index], [validation]: error }
        }
      })
    });

    setErrors({
      ...errorsOnSubmit
    })

    return errorsOnSubmit
  }

  const handleChangeEmail = (evt, index) => {
    const { value } = evt.target;

    const newMembers = [...members];

    newMembers[index].email = value

    setMembers([...newMembers])
  }

  const handleDeleteEmail = (index) => {

    const newEmails = [...members];

    newEmails.splice(index, 1)

    setErrors({})

    setMembers([...newEmails])
  }

  const handleRoleChange = (evt, index, validation) => {
    const { value } = evt.target;

    const error = validate[validation](value)

    const {
      [index]: {
        [validation]: removedError,
        ...re
      } = { [validation]: {} },
      ...rest
    } = errors;

    if (re) {
      rest[index] = { ...re }
    }

    setErrors({
      ...rest,
      ...(error && { [index]: { [validation]: error, ...re } })
    })

    const newMembers = [...members];

    newMembers[index].role = value

    setMembers([...newMembers])
  }

  const onBlurDo = (index, value, validation) => {
    const error = validate[validation](value)

    const {
      [index]: {
        [validation]: removedError,
        ...re
      } = { [validation]: {} },
      ...rest
    } = errors;

    if (re) {
      rest[index] = { ...re }
    }

    setErrors({
      ...rest,
      ...(error && { [index]: { [validation]: error, ...re } })
    })
  }

  const addEmailField = (member, index, required) => {
    return (
      <TextField
        required={required}
        label={t("login.email")}
        fullWidth
        value={member.email}
        error={errors[index]?.email ? true : false}
        helperText={errors[index]?.email}
        onBlur={(evt) => onBlurDo(index, evt.target.value, 'email')}
        onChange={(evt) => handleChangeEmail(evt, index)}
        variant="outlined"
      />
    )
  }

  const addRoleField = (member, index, required) => {
    return (
      <FormControl
        variant="outlined"
        fullWidth
        required={required}
        error={errors[index]?.role ? true : false}
      >
        <InputLabel id="role-select-label">{t('modal.role')}</InputLabel>
        <Select
          labelId="role-select-label"
          id="role-select"
          value={`${member.role}`}
          // label={t(`input_label.${type}`)}
          label={`${t('modal.role')} *`}
          onChange={(evt) => handleRoleChange(evt, index, 'role')}
        >
          {roles && (roles.map((role) => (
            <MenuItem
              key={`role_${role.id}`}
              value={role.id}
            >
              {role.title}
            </MenuItem>
          )))
          }
        </Select>
        <FormHelperText>{errors[index]?.role}</FormHelperText>
      </FormControl>
    )
  }

  const addEmailRow = (member, index) => {
    return (
      <Grid
        key={`email_${index}`}
        container
        spacing={2}
      >
        <Grid
          item
          xs={6}
        >
          {addEmailField(member, index, true)}
        </Grid>
        <Grid
          item
          xs={4}
        >
          {addRoleField(member, index, true)}
        </Grid>
        <Grid
          item
          xs={2}
        >
          <IconButton
            color="secondary"
            variant="contained"
            onClick={() => handleDeleteEmail(index)}
          >
            <Delete />
          </IconButton>
        </Grid>

      </Grid>

    )
  }

  const addNewEmail = () => {
    setMembers([...members, memberObj])
  }

  const bottomButtons = () => (
    <>
      <Button
        color="primary"
        variant="contained"
        type="submit"
        onClick={(evt) => handleSubmit(evt)}
      >
        {t("modal.add")}
      </Button>
      <Button
        color="secondary"
        variant="outlined"
        onClick={() => toggleAddMembersOpen()}
      >
        {t("modal.cancel")}
      </Button>
    </>
  )

  const handleSubmit = (evt) => {
    evt.preventDefault();

    const errorsOnSubmit = validateAll(members)

    if (!Object.values(errorsOnSubmit).length) {
      const memberData = [];

      members.forEach((member) => {
        const newMember = {
          role_id: member.role,
          project_id: member.projectId,
          email: member.email
        }
        memberData.push(newMember)
      })

      projectStore.addNewMembers(memberData)
        .then(() => toggleAddMembersOpen())
    } else {
      console.log('ERRORS', errorsOnSubmit)
    }
  }

  return (
    <Modal
      className={classes.modal}
      open={addMembersOpen}
      onClose={() => toggleAddMembersOpen()}
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
              {t("user_management.add_members")}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
          >
            {members?.map((member, index) => (
              addEmailRow(member, index)
            ))}
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Button
              color="primary"
              variant="outlined"
              startIcon={<Add />}
              onClick={(evt) => addNewEmail()}
            >
              {t("modal.add_email")}
            </Button>
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

export default AddMembersModal;