import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { useTranslation } from 'react-i18next';

import {
  Button,
  Grid,
  Modal,
  Typography,
} from '@material-ui/core';

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
}));

function ConfirmModal(props) {
  const { t } = useTranslation();
  const classes = useStyles();

  const {
    confirmAction,
    confirmMethod,
    openConfirmModal,
    target,
    toggleConfirmModal
  } = props;

  const bottomButtons = () => (
    <>
      <Button
        color="primary"
        variant="contained"
        type="submit"
        onClick={(evt) => confirmAction(evt)}
      >
        {t("modal.delete")}
      </Button>
      <Button
        color="secondary"
        variant="outlined"
        onClick={() => toggleConfirmModal()}
      >
        {t("modal.cancel")}
      </Button>
    </>
  )

  const renderConfirmationText = () => {
    switch (confirmMethod) {
      case "delete":
        return (
          t("modal.confirmation_delete_text", { target: target })
        )
      default:
        return null
    }
  }

  return (
    <Modal
      className={classes.modal}
      open={openConfirmModal}
      disableEscapeKeyDown={true}
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
              {t(`modal.confirm_${confirmMethod}`)}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
          >
            {renderConfirmationText()}
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
}

export default ConfirmModal;