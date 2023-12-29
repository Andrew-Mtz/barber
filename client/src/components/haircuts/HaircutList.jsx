import { Alert, Box } from '@mui/material'
import React from 'react'
import Haircut from './Haircut'

const boxStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-evenly',
  gap: 4,
  padding: 3
}

const baseUrl = process.env.REACT_APP_BASEURL

const HaircutList = ({ onHaircutSelect, selectedId, selectedBarberId }) => {
  const [haircuts, setHaircuts] = React.useState([])

  React.useEffect(() => {
    getHaircuts()
  }, [])

  const getHaircuts = async () => {
    try {
      const response = await fetch(`${baseUrl}/haircut-by-barber?barber_id=${selectedBarberId}`, {
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
  }

  return (
    <Box sx={boxStyle}>
      {haircuts?.map((haircut) => (
        <Haircut key={haircut.id}
          onSelect={onHaircutSelect}
          url={haircut.image.url}
          name={haircut.name}
          price={haircut.price}
          description={haircut.description}
          id={haircut.id}
          selected={haircut.id === selectedId ? true : false} />
      ))}
    </Box>
  )
}

export default HaircutList