import { Box, Typography } from '@mui/material'
import React from 'react'
import Haircut from './Haircut'
import ListItemSkeleton from '../skeletons/ListItemSkeleton'

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
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(false)

  const getHaircuts = React.useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/haircut-by-barber?barber_id=${selectedBarberId}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      if (data.error !== '') {
        setHaircuts(data.response);
        setError(data.error)
        return
      }
      setHaircuts(data.response);
      setLoading(true)
    } catch (error) {
      console.error('Error al obtener los cortes de pelo:', error);
    }
  }, [selectedBarberId]);

  React.useEffect(() => {
    getHaircuts()
  }, [getHaircuts])

  return (
    <Box sx={boxStyle}>
      {error ? ( // Renderiza un mensaje de error si hay un error
        <Typography color="error">{error}</Typography>
      ) : loading ? ( // Muestra los barberos si está cargando
        haircuts?.map((haircut) => (
          <Haircut key={haircut.id}
            onSelect={onHaircutSelect}
            url={haircut.image.url}
            name={haircut.name}
            price={haircut.price}
            description={haircut.description}
            id={haircut.id}
            selected={haircut.id === selectedId ? true : false} />
        ))
      ) : (
        <ListItemSkeleton /> // Muestra el esqueleto de carga si no hay error y no está cargando
      )}
    </Box>
  )
}

export default HaircutList