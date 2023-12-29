import React from 'react'
import { Box, Card, CardHeader, Checkbox, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import './linkBarber&Haircut.css'

const baseUrl = process.env.REACT_APP_BASEURL

const LinkBarberAndHaircut = () => {
  const [checkedBarber, setCheckedBarber] = React.useState([0]);
  const [checkedHaircuts, setCheckedHaircuts] = React.useState([]);
  const [barbers, setBarbers] = React.useState([])
  const [haircuts, setHaircuts] = React.useState([])

  React.useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/barbersAndHaircuts`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        const data = await response.json();
        setBarbers(data.barbers);
        setHaircuts(data.haircuts);
        return
      }
      return //setBarbers(response.statusText)
    } catch (error) {
      console.error('Error al obtener los barberos:', error);
    }
  }

  const handleToggleBarber = (id) => {
    if (checkedBarber === id) {
      setCheckedBarber([0])
      return setCheckedHaircuts([])
    }
    setCheckedBarber([id])
    getLinkedHaircuts(id)
  };

  const handleToggleHaircut = (id) => {
    const isHaircutChecked = checkedHaircuts.includes(id);

    if (isHaircutChecked) {
      const updatedHaircuts = checkedHaircuts.filter(haircutId => haircutId !== id);
      setCheckedHaircuts(updatedHaircuts);
    } else {
      const updatedHaircuts = [...checkedHaircuts, id];
      setCheckedHaircuts(updatedHaircuts);
    }
  };

  const getLinkedHaircuts = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/linkedHaircuts?id=${id}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        const data = await response.json();
        console.log(data)
        setCheckedHaircuts(data)
      }
      return //setBarbers(response.statusText)
    } catch (error) {
      console.error('Error al obtener los barberos:', error);
    }
  }

  const customList = (title, items, onFunction, checks) => (
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
          const labelId = `transfer-list-all-item-${value.name}-label`;

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
  );


  return (
    <Box className='link-lists-container'>
      {customList('Barberos', barbers, handleToggleBarber, checkedBarber)}
      {customList('Cortes de pelo', haircuts, handleToggleHaircut, checkedHaircuts)}
    </Box>
  )
}

export default LinkBarberAndHaircut