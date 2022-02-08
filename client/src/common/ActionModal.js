import React, { useState } from 'react';
import { observer } from 'mobx-react';

import { makeStyles } from '@material-ui/core/styles';
import { useStores } from '../stores';

import { useTranslation } from 'react-i18next';

import {
  Button,
  Modal,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // paper: {
  //   backgroundColor: theme.palette.background.paper,
  //   border: '1px solid #000',
  //   boxShadow: theme.shadows[5],
  //   // padding: theme.spacing(2, 4, 3),
  // },
  content: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },
  form: {
    width: '500px',
    maxWidth: '98%'
  },
  bottomActions: {
    backgroundColor: '#FFFFFF',
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 3)
  },
  textField: {
    width: '100%'
  },
  formControl: {
    marginTop: '15px'
  },
}));

const ActionModal = observer(function ActionModal(props) {
  const classes = useStyles();
  const { uiStore } = useStores();
  const { t } = useTranslation();

  const [itemId, setItemId] = useState('');

  const { data, title, acceptAction } = props;

  const bottomButtons = () => (
    <>
      <Button
        color="primary"
        variant="contained"
        type="submit"
        onClick={(evt) => acceptAction(evt, itemId)}
      >
        {t('modal.save')}
      </Button>
      <Button
        color="secondary"
        variant="outlined"
        onClick={() => uiStore.toggleActionModal()}
      >
        {t('modal.cancel')}
      </Button>
    </>
  )

  const handleItemChange = (event) => {
    const { value } = event.target;

    setItemId(value)
  }

  const selectField = (data, required) => {
    const { type } = props;

    return (
      <FormControl
        fullWidth
        variant="outlined"
        className={classes.formControl}
      >
        <InputLabel
          id="category-label"
        >
          {t(`input_label.${type}`)}
        </InputLabel>
        <Select
          labelId="category-label"
          required={required}
          value={`${itemId}`}
          label={t(`input_label.${type}`)}
          onChange={handleItemChange}
        >
          {data && (data.map((item) => (
            <MenuItem
              key={`item_${item.id}`}
              value={item.id}
              disabled={item.closed}
            >
              {`${item.name} ${item.closed ? t('dashboard.closed') : ''}`}
            </MenuItem>
          )))
          }
        </Select>
      </FormControl>
    )
  }

  return (
    <Modal
      className={classes.modal}
      open={uiStore.openActionModal}
      onClose={() => uiStore.toggleActionModal()}
    >
      <form
        className={classes.form}
      >
        <div
          className={classes.content}
        >
          <Typography
            variant="h5"
          >
            {title}
          </Typography>
          {
            selectField(data)
          }
        </div>
        <div
          className={classes.bottomActions}
        >
          {bottomButtons()}
        </div>
      </form>
    </Modal>
  )
})

export default ActionModal;