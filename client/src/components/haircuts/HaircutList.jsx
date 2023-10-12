import { Box } from '@mui/material'
import React from 'react'
import Haircut from './Haircut'

const boxStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-evenly',
  gap: 4,
  padding: 3
}

const baseUrl = 'http://localhost:8080'; //http://localhost:8080
const headers = new Headers();
headers.append('ngrok-skip-browser-warning', 'true');

const HaircutList = ({ onHaircutSelect, selectedId }) => {
  const [haircuts, setHaircuts] = React.useState(null)

  React.useEffect(() => {
    getHaircuts()
  }, [])

  const getHaircuts = async () => {
    try {
      const response = await fetch(`${baseUrl}/haircut`, {
        method: 'get',
        headers: headers,
      });
      if (response.status === 404) {
        setHaircuts(response.statusText)
        return
      }
      const data = await response.json();
      console.log(data)
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