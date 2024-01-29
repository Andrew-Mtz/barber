import React from 'react'
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'

const baseUrl = process.env.REACT_APP_BASEURL

const FiltersReview = ({filters, handleFilters}) => {
  const [barbers, setBarbers] = React.useState([])
  const [haircuts, setHaircuts] = React.useState([])

  const getBarbers = async () => {
    try {
      const response = await fetch(`${baseUrl}/barber`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (response.status === 404) {
        setBarbers(response.statusText)
        return
      }
      const data = await response.json();
      setBarbers(data);
    } catch (error) {
      console.error('Error al obtener los barberos:', error);
    }
  }

  const getHaircuts = async () => {
    try {
      const response = await fetch(`${baseUrl}/haircut`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (response.status === 404) {
        return console.log(response.statusText) //a corregir
      }
      const data = await response.json();
      setHaircuts(data);
    } catch (error) {
      console.error('Error al obtener los cortes de pelo:', error);
    }
  };

  React.useEffect(() => {
    getHaircuts()
    getBarbers();
  }, [])

  return (
    <Box className={'search-parameters-reviews'}>
      <FormControl variant="outlined" margin="normal">
        <InputLabel id="barber-label">Por barbero</InputLabel>
        <Select
          labelId="barber-label"
          id="barber"
          label="Por barbero"
          value={filters.barber}
          onChange={(event) => handleFilters("barber", event)}
        >
          <MenuItem value={'all'}>
            Todos
          </MenuItem>
          {barbers.map((barber) => (
            <MenuItem key={barber.id} value={barber.id}>
              {barber.name} {barber.last_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl variant="outlined" margin="normal">
        <InputLabel id="haircut-label">Por corte</InputLabel>
        <Select
          labelId="haircut-label"
          id="haircut"
          label="Por corte"
          value={filters.haircut}
          onChange={(event) => handleFilters("haircut", event)}
        >
          <MenuItem value={'all'}>
            Todos
          </MenuItem>
          {haircuts.map((haircut) => (
            <MenuItem key={haircut.id} value={haircut.id}>
              {haircut.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl variant="outlined" margin="normal">
        <InputLabel id="type-label">Por tipo</InputLabel>
        <Select
          labelId="type-label"
          id="type"
          label="Por tipo"
          value={filters.type}
          onChange={(event) => handleFilters("type", event)}
        >
          <MenuItem value={'default'}>
            N/A
          </MenuItem>
          <MenuItem value={'recents'}>
            Mas recientes
          </MenuItem>
          <MenuItem value={'most_value'}>
            Mas valorados
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

export default FiltersReview