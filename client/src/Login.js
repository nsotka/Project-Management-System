import React from 'react'
import {
  TextField,
  Button,
  InputAdornment,
  Typography
} from '@material-ui/core';

import {
  AccountCircle,
  VpnKey
} from '@material-ui/icons';

import { makeStyles } from '@material-ui/core/styles';

import { useInput } from './hooks/CustomHooks';
import { useStores } from './stores'

import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme => ({
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  noError: {
    marginTop: '21px',
  },
  input: {
    display: 'flex',
    width: '20em',
    maxWidth: '90vw',
    marginBottom: '1em',
  },
  inputNoError: {
  },
  button: {
    width: '100%'
  },
  error: {
    color: 'red'
  }
})));

const validate = {
  email: (email, t = null) => emailValidation("email", email, t),
  password: (password, t = null) => passwordValidation("password", password, t),
}

const emailValidation = (fieldName, fieldValue, t) => {

  if (fieldValue.trim() === '') {
    return t("validation.is_required", {field: t(`login.${fieldName}`)})
  }

  if (!fieldValue.trim().includes('@') || !fieldValue.trim().includes('.')) {
    return t("validation.wrong_format", {field: t(`login.${fieldName}`)})
  }

  return null;
}

const passwordValidation = (fieldName, fieldValue, t) => {
  if (fieldValue.trim() === '') {
    return t("validation.no_empty", {field: t(`login.${fieldName}`)})
  }

  return null
}

export default function Login() {
  const { uiStore, projectStore, requests } = useStores()

  const [errors, setErrors] = React.useState({});
  const [values, setValues] = React.useState({ email: '', password: '' });

  const classes = useStyles();

  const { t } = useTranslation();

  const { value: email, bind: bindEmail } = useInput('');
  const { value: password, bind: bindPassword } = useInput('');

  const addTextField = (attr, value, bind) => {
    return (
      <TextField
        variant="outlined"
        className={classes.input}
        label={t(`login.${attr}`)}
        type={attr}
        {...bind}
        helperText={
          errors[attr] ? errors[attr] : " "
        }
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {attr === 'email' ? <AccountCircle /> : <VpnKey />}
            </InputAdornment>
          ),
        }}
        FormHelperTextProps={{
          classes: {
            root: classes.error
          }
        }}
        onBlur={() => onBlurDo(attr, value)}
        onFocus={() => setErrors({})}
      />
    )
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();

    const validations = Object.keys(validate);

    const errorsOnSubmit = {};

    validations.forEach((validation) => {
      const error = validate[validation](values[validation], t)

      if (error) {
        errorsOnSubmit[validation] = error
      }
    })

    setErrors({
      ...errorsOnSubmit
    })

    if (!Object.values(errors).length) {
      requests.login.create(email, password)
        .then((res) => {
          if (res.error) {
            throw new Error(res.error)
          } else {
            uiStore.login(res)
          }
        })
        .then(() => projectStore.getUserProjects())
        .catch((e) => {
          setErrors({
            ...errors,
            login: e.message
          })
        })
    } else {
      console.log('ERRORS', errors)
    }
  }

  const onBlurDo = (attr, value) => {
    const error = validate[attr](value, t)

    const { [attr]: removedError, ...rest } = errors;

    setValues({
      ...values,
      [attr]: value
    })

    setErrors({
      ...rest,
      ...(error && { [attr]: error })
    })
  }

  return (
    <div className={classes.wrapper}>
      {errors.login && (
        <Typography
          className={classes.error}
        >
          {errors.login}
        </Typography>
      )}
      <form className={errors.login ? '' : classes.noError}>
        {addTextField('email', email, bindEmail)}
        {addTextField('password', password, bindPassword)}
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={(evt) => handleSubmit(evt)}
        >
          {t("login.login")}
        </Button>
      </form>
    </div>
  )
}
