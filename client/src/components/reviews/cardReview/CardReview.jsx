import { Box, Rating, Typography } from '@mui/material';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import './cardReview.css';
import PropTypes from 'prop-types';

const CardReview = ({ review }) => {
  const createdAt = parseISO(review?.created_at); // Convierte la cadena de fecha a un objeto Date

  const timeAgo = formatDistanceToNow(createdAt, {
    addSuffix: true,
    locale: es,
  });

  return (
    <Box className={'card-review-container'}>
      <Box className={'card-review-container-title'}>
        {/*<Avatar {...stringAvatar(`${review?.user_name} ${review?.user_last_name}`)} sx={{ width: 40, height: 40 }} /> */}
        <Box className={'card-review-container-user-info'}>
          <Typography sx={{ ml: 2 }} variant="h6" color="white">
            {review?.user_name} {review?.user_last_name}
          </Typography>
          <Rating
            id="modal-modal-rating"
            className="rating"
            name="read-only"
            value={review?.rating}
            readOnly
          />
        </Box>
      </Box>
      <Box className={'card-review-container-description'}>
        <Typography
          sx={{ lineHeight: 1.2 }}
          variant="body1"
          color="text.secondary"
        >
          {review?.comment}
        </Typography>
      </Box>
      <Box className={'card-review-container-footer'}>
        <Typography variant="body2" component="span" color="text.secondary">
          Sobre {review.barber_name} {review.barber_last_name} {timeAgo}
        </Typography>
      </Box>
    </Box>
  );
};

CardReview.propTypes = {
  review: PropTypes.object,
};

export default CardReview;
