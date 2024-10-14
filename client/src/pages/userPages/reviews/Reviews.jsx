import React from 'react';
import CardReview from '../../../components/reviews/cardReview/CardReview';
import { Box, Chip, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import FiltersReview from '../../../components/reviews/filtersReview/FiltersReview.jsx';
import './reviews.css';
import Loading from '../../../components/loading/Loading.jsx';

const baseUrl = process.env.REACT_APP_BASEURL;

const Reviews = () => {
  const location = useLocation();

  const [myBookingaPath, setMyBookingaPath] = React.useState(
    location.state && location.state.previousPath === 'my-booking',
  );
  const reviewId = location.state && location.state.reviewId;

  const [filters, setFilters] = React.useState({
    barber: 'all',
    haircut: 'all',
    type: 'default',
  });
  const [reviews, setReviews] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const getReviews = React.useCallback(async () => {
    try {
      setLoading(false);
      const response = await fetch(
        `${baseUrl}/reviews-by-params?barber=${filters.barber}&haircut=${filters.haircut}&type=${filters.type}`,
        {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
      const data = await response.json();
      if (data.error !== '') {
        setReviews(data.response);
        setError(data.error);
        return;
      }
      setReviews(data.response);
      setLoading(true);
    } catch (error) {
      alert('Error al obtener las reseñas:', error);
    }
  }, [filters.barber, filters.haircut, filters.type]);

  const getMyReview = async id => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/my-review?review_id=${id}`, {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      if (response.status === 404) {
        setReviews(response.statusText);
        return;
      }
      const data = await response.json();
      setReviews(data);
      setLoading(true);
    } catch (error) {
      alert('Error al obtener los barberos:', error);
    }
  };

  React.useEffect(() => {
    if (reviewId && myBookingaPath) getMyReview(reviewId);
    if (!myBookingaPath) getReviews();
  }, [myBookingaPath, reviewId, getReviews]);

  const handleFilters = (property, event) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [property]: event.target.value,
    }));
  };

  return (
    <Box className={'reviews-container'}>
      {!myBookingaPath && (
        <FiltersReview filters={filters} handleFilters={handleFilters} />
      )}
      {myBookingaPath && (
        <Box className={'search-parameters-reviews'}>
          <Chip
            label="Mi reseña"
            variant="outlined"
            onDelete={() => setMyBookingaPath(false)}
          />
        </Box>
      )}
      <Box className={'reviews-section-container'}>
        {loading &&
          reviews?.length > 0 &&
          reviews?.map(review => {
            return <CardReview key={review.id} review={review} />;
          })}
        {loading && reviews?.length === 0 && (
          <Typography variant="h5" component="p" color="text.secondary">
            Aun no hay opiniones
          </Typography>
        )}
        {!loading && <Loading />}
      </Box>
    </Box>
  );
};

export default Reviews;
