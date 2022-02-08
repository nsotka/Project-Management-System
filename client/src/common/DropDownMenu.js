import React from 'react'

import {
  Menu,
  MenuItem
} from '@material-ui/core'

export default function DropDownMenu(props) {
  const { items, anchorEl, handleCloseMenu } = props;

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleCloseMenu}
    >
      {items.map((item, index) => (
        <MenuItem
          key={`menuItem_${index}`}
          onClick={(evt) => item.action(evt)}
        >
          {item.text}
        </MenuItem>
      ))}
    </Menu>
  )
}
