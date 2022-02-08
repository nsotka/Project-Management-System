import React from 'react'
import { observer } from "mobx-react";
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Grid,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Divider,
} from '@material-ui/core';

import {
  DirectionsRun,
  Forum,
  PieChart,
} from '@material-ui/icons';

import DraftsIcon from '@material-ui/icons/Drafts';

import { makeStyles } from '@material-ui/core/styles';

import { useStores } from '../stores';
import ListCard from '../common/ListCard';
import Statistics from './Statistics';
import TableCard from './TableCard';

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
    height: '100%'
  },
  inviteContainer: {
    display: 'flex',
  },
  inviteTitle: {
    flex: 1,
    alignSelf: 'center'
  },
  positive: {
    color: theme.palette.positive.main
  },
  negative: {
    color: theme.palette.negative.main
  }
}))

const Dashboard = observer(function Dashboard() {
  const {
    uiStore: {
      currentUser,
      acceptInvitation,
      denyInvitation,
    }
  } = useStores();
  const { t } = useTranslation();

  const classes = useStyles();

  const handleAccept = (membershipId) => {
    acceptInvitation(membershipId)
  }

  const handleDeny = (membershipId) => {
    denyInvitation(membershipId)
  }

  return (
    <Grid
      container
      direction="row"
      spacing={2}
    >
      {currentUser?.invitations?.length > 0 && (
        <>
          <Grid
            item
            xs={12}
          >
            <Typography
              variant="h4"
            >
              {currentUser.invitations.length > 1
                ? t("dashboard.multiple_invitations", { count: currentUser.invitations.length })
                : t("dashboard.single_invitation", { count: currentUser.invitations.length })
              }
            </Typography>
          </Grid>
          <Grid
            container
            item
            direction="column"
            xs={12}
            md={7}
            lg={4}
          >
            <ListCard
              cardContent={currentUser?.invitations}
              icon={<DraftsIcon />}
              handleAccept={handleAccept}
              handleDeny={handleDeny}
              noContent={t('dashboard.no_open_invitations')}
              title={t('dashboard.open_invitations')}
              type={'approval'}
            />
          </Grid>
        </>
      )}

      <Grid
        container
        item
        xs={12}
      >
        <Typography
          variant="h4"
        >
          {t('navigation.active_project')}
        </Typography>
        <Divider />
      </Grid>
      <Grid
        container
        item
        direction="column"
        xs={12}
        md={12}
        lg={4}
      >
        <Grid
          container
          item
          spacing={2}
        >
          <Grid
            item
            xs={12}
            md={6}
            lg={12}
          >
            <TableCard
              icon={<DirectionsRun />}
              title={t('navigation.sprints')}
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            lg={12}
          >
            <Card
              className={classes.card}
            >
              <CardHeader
                avatar={
                  <Avatar>
                    <Forum />
                  </Avatar>
                }
                title={t('dashboard.project_chat')}
                titleTypographyProps={{
                  variant: 'h6'
                }}
              />
              <CardContent>
                {t('dashboard.under_development')}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        item
        direction="column"
        xs={12}
        md={12}
        lg={8}
      >
        <Card>
          <CardHeader
            avatar={
              <Avatar>
                <PieChart />
              </Avatar>
            }
            title={t('dashboard.statistics')}
            titleTypographyProps={{
              variant: 'h6'
            }}
          />
          <CardContent>
            <Grid
              container
              spacing={5}
            >
              <Grid
                item
                xs={12}
                md={6}
              >
                <Statistics
                  label="tasks"
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
                item
              >
                <Statistics
                  label="sprints"
                />
              </Grid>
            </Grid>

          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
});

export default Dashboard;
