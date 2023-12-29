import { Avatar, Box, Rating, Typography } from '@mui/material'
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale'
import React from 'react'
import './cardReview.css'

const CardReview = ({ review }) => {
  const createdAt = parseISO(review?.created_at); // Convierte la cadena de fecha a un objeto Date

  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true, locale: es });

  const stringToColor = (string) => {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

  const stringAvatar = (name) => {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }
  return (
    <Box className={'card-review-container'}>
      <Box className={'card-review-container-title'}>
      <Avatar {...stringAvatar(`${review?.user_name} ${review?.user_last_name}`)} sx={{ width: 40, height: 40 }} />
        <Box className={'card-review-container-user-info'}>
          <Typography sx={{ ml: 2 }} variant='h6' color="white">{review?.user_name} {review?.user_last_name}</Typography>
          <Rating id='modal-modal-rating' className='rating' name="read-only" value={review?.rating} readOnly />
        </Box>
      </Box>
      <Box className={'card-review-container-description'}>
        <Typography sx={{ lineHeight: 1.2 }} variant="body1" color="text.secondary">{review?.comment}</Typography>
      </Box>
      <Box className={'card-review-container-footer'}>
        <Typography variant="body2" color="text.secondary">{timeAgo}</Typography>
      </Box>
    </Box>
  )
}

export default CardReview