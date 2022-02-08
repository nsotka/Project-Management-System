import React from 'react';

import { Link } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';

import CancelIcon from '@material-ui/icons/Cancel';

import {
  CheckCircle,
} from '@material-ui/icons';

import {
  Avatar,
  IconButton,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Divider,
  List,
} from '@material-ui/core';
import MemberListItem from './MemberListItem';
import { observer } from 'mobx-react';

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
    height: '100%'
  },
  cardContent: {
    paddingTop: '0px'
  },
  inviteContainer: {
    display: 'flex',
  },
  inviteTitle: {
    alignSelf: 'center'
  },
  listContainer: {
    padding: '0px',
  },
  positive: {
    color: theme.palette.positive.main
  },
  negative: {
    color: theme.palette.negative.main
  },
  flexLarge: {
    flex: 3,

  },
  flexSmall: {
    flex: 1,
    textAlign: 'center',
  },
  titleSmall: {
    textAlign: 'center',
  }
}))

const ListCard = observer(function ListCard(props) {
  const classes = useStyles();

  const {
    cardContent,
    icon,
    handleAccept,
    handleDeny,
    noContent,
    path,
    type,
  } = props;

  const itemWithLink = (item) => {
    return (
      <Link
        key={item.id}
        to={`${path}${item.id}`}
      >
        <p>{item.name}</p>
      </Link>
    )
  }

  const approvalItem = (item) => {
    return (
      <div
        className={classes.inviteContainer}
        key={`approval_${item.id}`}
      >
        <Typography
          variant='subtitle1'
          className={`${classes.inviteTitle} ${classes.flexLarge}`}
        >
          {item?.title ? item.title : item.name}
        </Typography>
        <div
          className={classes.flexSmall}
        >
          <IconButton
            className={`${classes.positive}`}
            onClick={() => handleAccept(item.id)}
          >
            <CheckCircle />
          </IconButton>
        </div>
        <div
          className={classes.flexSmall}
        >
          <IconButton
            className={`${classes.negative} ${classes.flexSmall}`}
            onClick={() => handleDeny(item.id)}
          >
            <CancelIcon />
          </IconButton>
        </div>
      </div>
    )
  }

  const memberItem = (item, itemType) => {
    if (item) {
      return (
        <MemberListItem
          key={`member_${item.id}`}
          item={item}
          itemType={itemType}
        />
      )
    }
  }

  const planItem = (item) => {
    if (item) {
      return (
        <p>{item?.title ? item.title : item.name}</p>
      )
    }
  }

  const renderItem = (itemType, item) => {
    switch (itemType) {
      case 'link':
        return itemWithLink(item)
      case 'approval':
        return approvalItem(item)
      case 'member':
        return memberItem(item, itemType)
      case 'invitation':
        return memberItem(item, itemType)
      default:
        return planItem(item)
    }
  }

  const contentTitle = () => {
    return (
      <div
        className={classes.inviteContainer}
      >
        <Typography
          variant='subtitle1'
          className={`${classes.inviteTitle} ${classes.flexLarge}`}
        >
          {'Projektin nimi'}
        </Typography>
        <Typography
          variant='subtitle1'
          className={`${classes.titleSmall} ${classes.flexSmall}`}
        >
          {'Hyväksy'}
        </Typography>
        <Typography
          variant='subtitle1'
          className={`${classes.titleSmall} ${classes.flexSmall}`}
        >
          {'Hylkää'}
        </Typography>
      </div>
    )
  }

  return (
    <Card
      className={classes.card}
    >
      <CardHeader
        avatar={
          <Avatar>
            {icon}
          </Avatar>
        }
        title={props.title}
        titleTypographyProps={{
          variant: 'h6'
        }}
      />
      <CardContent
        className={classes.cardContent}
      >

        {cardContent?.length > 0
          ? (
            <>
              {type === 'approval' && (
                <>
                  {contentTitle()}
                  < Divider />
                </>
              )}
              <List className={classes.listContainer}>
                {cardContent?.map((item) => (
                  renderItem(type, item)
                ))}
              </List>
            </>
          )
          : noContent
        }
      </CardContent>
    </Card>
  )
})

export default ListCard;