import React from 'react'
import CardReview from '../../components/cardReview/CardReview';
import { Box } from '@mui/material';
import './reviews.css'

const baseUrl = process.env.REACT_APP_BASEURL
const headers = new Headers();
headers.append('ngrok-skip-browser-warning', 'true');

const Reviews = () => {
  const [reviews, setReviews] = React.useState([]);

  const getReviews = async () => {
    try {
      const response = await fetch(`${baseUrl}/reviews`, {
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

  React.useEffect(() => {
    getReviews()
  }, [])

  return (
    <Box className={'reviews-container'}>
      {reviews?.length > 0 && reviews?.map((review) => {
        return (
          <CardReview key={review.id} review={review} />
        )
      })}
    </Box>
  )
}

export default Reviews