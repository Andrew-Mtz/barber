import React from 'react'
import Box from '@mui/material/Box';
import BarberFullItem from './BarberFullItem';

const baseUrl = process.env.REACT_APP_BASEURL

const BarbersFull = ({ barbers }) => {
  const [selectedBarber, setSelectedBarber] = React.useState(null);
  const [reviews, setReviews] = React.useState([]);

  const getReviews = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/reviews-by-barber?barber_id=${id}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (response.status === 404) {
        setReviews(response.statusText)
        return
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error al obtener los barberos:', error);
    }
  }

  const toggleExpanded = (barber) => {
    setSelectedBarber(barber === selectedBarber ? null : barber);
    getReviews(barber.id)
  };
  return (
    <Box className={'container-card-list'}>
      {barbers?.map((barber) => (
        <BarberFullItem key={barber.id}
          barber={barber}
          expanded={barber === selectedBarber}
          oneSelected={selectedBarber != null}
          toggleExpanded={() => toggleExpanded(barber)}
          reviews={reviews}
        />
      ))}
    </Box>
  );
};

export default BarbersFull