import React from 'react'
import { observer } from 'mobx-react';

import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@material-ui/core';
import { useStores } from '../stores';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';


const DataTable = observer(function DataTable(props) {
  const {
    projectStore: {
      currentProject
    }
  } = useStores();

  const { t } = useTranslation();

  const getStatus = (sprint) => {

    switch (sprint.closed) {
      case true:
        return t('titles.closed')
      case false:
        if (sprint.active) {
          return t('titles.active')
        } else {
          return t('titles.open')
        }
      default:
        return null
    }
  }

  return (
    <TableContainer >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('titles.name')}</TableCell>
            <TableCell align="center">{t('titles.status')}</TableCell>
            <TableCell align="center">{t('titles.closed_tasks')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentProject && currentProject?.sprints.map((sprint) => (
            <TableRow
              key={`sprint_${sprint.id}`}
            >
              <TableCell>
                <Link
                  to={`${props.path}${sprint.id}`}
                >
                  {sprint.name}
                </Link>
              </TableCell>
              <TableCell align="center">
                {getStatus(sprint)}
              </TableCell>
              <TableCell align="center">
                {`${currentProject?.tasks.filter((task) => task.status === 'completed' && task.sprintId === sprint.id).length} / ${currentProject?.tasks.filter((task) => task.sprintId === sprint.id).length}`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
});

export default DataTable;
