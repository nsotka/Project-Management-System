import React, { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles';

import {
  Button,
  Grid,
  Checkbox,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Modal,
} from '@material-ui/core'

import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomActions: {
    backgroundColor: '#FFFFFF',
    display: 'flex',
    justifyContent: 'space-between',
  },
  content: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },
  textField: {
    width: '100%'
  }
}));

export default function AddUsersSelect(props) {
  const {
    addableMembers,
    usersOpen,
    toggleUsersOpen,
    handleUserSubmit,
  } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  const [users, setUsers] = useState([])

  useEffect(() => {
    let membersObj = {};

    addableMembers.forEach((member) => {
      membersObj[member.id] = { user: member, checked: false }
    })
    setUsers(membersObj)
  }, [addableMembers])

  const handleChange = (evt) => {
    let checkChange = users[evt.target.name];
    checkChange.checked = evt.target.checked;
    setUsers({
      ...users, [evt.target.name]: checkChange
    })
  }

  const bottomButtons = () => {
    return (
      <Grid
        item
        xs={12}
        className={classes.bottomActions}
      >
        <Button
          color="primary"
          variant="contained"
          type="submit"
          onClick={(evt) => handleUserSubmit(evt, users)}
        >
          {t("modal.add")}
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => toggleUsersOpen()}
        >
          {t("modal.cancel")}
        </Button>
      </Grid>
    )
  }

  return (
    <Modal
      className={classes.modal}
      open={usersOpen}
      onClose={() => toggleUsersOpen()}
    >
      <form>
        <Grid
          container
          className={classes.content}
          spacing={2}
        >
          <Grid
            item
          >
            <FormControl>
              <FormLabel>{t("modal.choose_task_users")}</FormLabel>
              <FormGroup>
                {
                  addableMembers.length > 0
                    ? (
                      addableMembers.map((member, index) => (
                        <FormControlLabel
                          key={`member_${member.id}`}
                          control={
                            <Checkbox
                              checked={users[member.id]?.checked}
                              onChange={handleChange}
                              name={`${member.id}`}
                            />
                          }
                          label={`${member.firstName} ${member.lastName}`}
                        />
                      ))
                    )
                    : (
                      <span>Ei valittavia käyttäjiä</span>
                    )
                }
              </FormGroup>
            </FormControl>
          </Grid>
          {bottomButtons()}
        </Grid>
      </form>
    </Modal>
  )
}
