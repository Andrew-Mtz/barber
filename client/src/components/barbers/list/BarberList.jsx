import { Box, Typography } from '@mui/material';
import React from 'react';
import BarberListItem from './BarberListItem';
import ListItemSkeleton from '../../skeletons/ListItemSkeleton';
import PropTypes from 'prop-types';

const boxStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-evenly',
  gap: 4,
  padding: 3,
};

const baseUrl = process.env.REACT_APP_BASEURL;

const BarberList = ({ onBarberSelect, selectedId }) => {
  const [barbers, setBarbers] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    getBarbers();
  }, []);

  const getBarbers = async () => {
    try {
      const response = await fetch(`${baseUrl}/barber`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const data = await response.json();
      if (data.error !== '') {
        setError(data.error);
        setBarbers(data.response);
        return;
      }
      setBarbers(data.response);
      setLoading(true);
    } catch (error) {
      alert('Error al obtener los barberos:', error);
    }
  };

  return (
    <Box sx={boxStyle}>
      {error ? ( // Renderiza un mensaje de error si hay un error
        <Typography color="error">{error}</Typography>
      ) : loading ? ( // Muestra los barberos si está cargando
        barbers?.map(barber => (
          <BarberListItem
            key={barber.id}
            onSelect={onBarberSelect}
            url={barber.image.url}
            name={barber.name}
            lastName={barber.last_name}
            description={barber.description}
            id={barber.id}
            selected={barber.id === selectedId}
          />
        ))
      ) : (
        <ListItemSkeleton /> // Muestra el esqueleto de carga si no hay error y no está cargando
      )}
    </Box>
  );
};

BarberList.propTypes = {
  onBarberSelect: PropTypes.func,
  selectedId: PropTypes.string,
};

export default BarberList;
