import React from 'react'
import Box from '@mui/material/Box';
import BarberItem from './BarberItem'; // Importa tu componente BarberCard
import { useLocation } from 'react-router-dom';

const baseUrl = process.env.REACT_APP_BASEURL
const headers = new Headers();
headers.append('ngrok-skip-browser-warning', 'true');

const BarbersCarousel = ({ barbers }) => {
  const location = useLocation();

  const myBookingaPath = location.state && location.state.previousPath === 'my-booking';
  const barberId = location.state && location.state.barberId;
  const reviewId = location.state && location.state.reviewId;

  const [selectedBarber, setSelectedBarber] = React.useState(null);
  const [reviews, setReviews] = React.useState([]);

  const getReviews = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/reviews-by-barber?barber_id=${id}`, {
        method: 'get',
        headers: headers
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

  const getMyReview = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/my-review?review_id=${id}`, {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
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

  React.useEffect(() => {
    if (barberId && barbers && myBookingaPath) {
      setSelectedBarber(barbers.find(barber => barber.id === barberId));
      getMyReview(reviewId)
    }
  }, [barbers, barberId, reviewId, myBookingaPath])
  return (
    <Box className={'container-card-list'}>
      {barbers?.map((barber) => (
        <BarberItem key={barber.id}
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

export default BarbersCarousel 