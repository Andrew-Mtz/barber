import { Card, CardHeader, Checkbox, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react'

const CustomList = ({ title, items, onFunction, checks }) => {
  return (
    <Card>
      <CardHeader
        className='card-header-link-list'
        sx={{ px: 2, py: 1 }}
        title={title}
      />
      <Divider />
      <List
        sx={{
          bgcolor: 'var(--panel-color)',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items?.map((value) => {
          const labelId = `list-${value.name}-label`;
          return (
            <ListItem
              key={value.id}
              role="listitem"
              button
              onClick={() => onFunction(value.id)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checks.includes(value.id)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.name} />
            </ListItem>
          );
        })}
      </List>
    </Card>
  )
}

export default CustomList