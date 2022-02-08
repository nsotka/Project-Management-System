import React, { useState } from 'react'
import { observer } from "mobx-react";

import { useTranslation } from 'react-i18next';

import ListCard from '../common/ListCard';

import { useStores } from '../stores';

import CustomTopBar from '../common/CustomTopBar';

import {
  Grid,
} from '@material-ui/core';

import {
  PeopleAlt,
} from '@material-ui/icons';

import AddMembersModal from './AddMembersModal';

const UserManagement = observer(function UserManagement() {
  const { t } = useTranslation();

  const [addMembersOpen, setAddMembersOpen] = useState(false);

  const { projectStore: { currentProject } } = useStores();

  const toggleAddMembersOpen = () => {
    setAddMembersOpen(!addMembersOpen);
  }

  const topBarItems = [
    {
      type: 'button',
      text: t('user_management.add_members'),
      action: () => toggleAddMembersOpen()
    }
  ];

  return (
    <Grid
      container
      spacing={2}
    >
      <CustomTopBar
        topBarItems={topBarItems}
      />
      <Grid
        container
        item
        direction="column"
        xs={12}
        md={6}
        lg={4}
      >
        <ListCard
          cardContent={currentProject?.members}
          icon={<PeopleAlt />}
          noContent={t('user_management.no_members')}
          title={t('user_management.project_members')}
          type={'member'}
        />
      </Grid>

      <Grid
        container
        item
        direction="column"
        xs={12}
        md={6}
        lg={4}
      >
        <ListCard
          cardContent={currentProject?.openInvitations}
          icon={<PeopleAlt />}
          noContent={t('dashboard.no_open_invitations')}
          title={t('dashboard.open_invitations')}
          type={'invitation'}
        />
      </Grid>
      {addMembersOpen && (
        <AddMembersModal
          addMembersOpen={addMembersOpen}
          toggleAddMembersOpen={toggleAddMembersOpen}
        />
      )}
    </Grid>
  )
})

export default UserManagement;
