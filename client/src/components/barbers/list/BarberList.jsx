import { Box } from '@mui/material'
import React from 'react'
import BarberListItem from './BarberListItem'

const boxStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-evenly',
  gap: 4,
  padding: 3
}

const baseUrl = process.env.REACT_APP_BASEURL

const BarberList = ({ onBarberSelect, selectedId }) => {
  const [barbers, setBarbers] = React.useState(null)

  React.useEffect(() => {
    getBarbers()
  }, [])

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

  return (
    <Box sx={boxStyle}>
      {barbers?.map((barber) => (
        <BarberListItem key={barber.id}
          onSelect={onBarberSelect}
          url={barber.image.url}
          name={barber.name}
          lastName={barber.last_name}
          description={barber.description}
          id={barber.id}
          selected={barber.id === selectedId ? true : false} />
      ))}
    </Box>
  )
}

export default BarberList