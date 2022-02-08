import { observer } from 'mobx-react';
import React from 'react'
import DataTable from './DataTable'

import {
  Avatar,
  Card,
  CardHeader,
} from '@material-ui/core';

const TableCard = observer(function TableCard(props) {

  const {
    icon,
    title,
  } = props;

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            {icon}
          </Avatar>
        }
        title={title}
        titleTypographyProps={{
          variant: 'h6'
        }}
      />
      <DataTable
        path={'/sprints/'}
      />
    </Card>
  )
});

export default TableCard;
