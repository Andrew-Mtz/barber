import { Box, IconButton, Typography } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './barberFullItem.css';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarRateIcon from '@mui/icons-material/StarRate';
import CardReview from '../../reviews/cardReview/CardReview';
import InstaFeed from '../instaFeed/InstaFeed';
import PropTypes from 'prop-types';

const BarberFullItem = ({
  barber,
  expanded,
  oneSelected,
  toggleExpanded,
  reviews,
}) => {
  const settings = {
    className: 'center',
    centerMode: true,
    centerPadding: '0px',
    minHeight: '100%',
    dots: true,
    speed: 500,
    slidesToShow: reviews?.length >= 2 ? 2 : reviews?.length,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          className: 'center',
          centerMode: true,
          centerPadding: '0px',
          slidesToShow: reviews?.length >= 2 ? 2 : reviews?.length,
          dots: true,
          speed: 500,
          autoplay: true,
          autoplaySpeed: 3000,
          pauseOnHover: true,
          arrows: false,
        },
      },
      {
        breakpoint: 925,
        settings: {
          className: 'center',
          centerMode: true,
          centerPadding: '0px',
          slidesToShow: 1,
          dots: true,
          speed: 500,
          autoplay: true,
          autoplaySpeed: 3000,
          pauseOnHover: true,
          arrows: false,
        },
      },
    ],
  };

  return (
    <Box
      className={`barber-card ${oneSelected ? (expanded ? 'expanded' : 'minimal') : ''}`}
    >
      <Box
        className={'img-section'}
        sx={{ backgroundImage: `url(${barber.image.url})` }}
      >
        {!expanded && (
          <Box
            className={`card-container-text ${oneSelected ? 'minimal' : ''}`}
          >
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography gutterBottom variant="h5">
                {barber.name} {barber.last_name}
              </Typography>
            </Box>
            <Typography variant="body1">{barber.description}</Typography>
          </Box>
        )}
      </Box>
      {expanded && (
        <Box className="barber-expanded">
          <Box className="barber-data-section">
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Typography variant="h4" mr={4} color="text.secondary">
                {barber.name} {barber.last_name}
              </Typography>
              {barber.average_rating && (
                <Typography variant="h5" color="text.secondary">
                  <StarRateIcon sx={{ color: 'var(--primary-color)' }} />{' '}
                  {parseFloat(barber.average_rating).toFixed(1)}
                </Typography>
              )}
            </Box>
            <Typography gutterBottom variant="body2" color="text.secondary">
              {barber.full_description}
            </Typography>
          </Box>
          <Box className="barber-reviews-section" sx={{ width: '100%' }}>
            <Typography gutterBottom variant="h5" color="text.secondary">
              Opiniones de la gente:
            </Typography>
            <Slider {...settings}>
              {reviews?.length > 0 &&
                reviews?.map(review => {
                  return <CardReview key={review.id} review={review} />;
                })}
            </Slider>
            {reviews?.length === 0 && (
              <Typography>Aún no hay reseñas hechas</Typography>
            )}
          </Box>
          <Box className="barber-gallery">
            <Typography gutterBottom variant="h5" color="text.secondary">
              Algunos cortes realizados:
            </Typography>
            <InstaFeed />
          </Box>
        </Box>
      )}
      <Box className={`expand-button ${expanded && 'active'}`}>
        <IconButton onClick={toggleExpanded}>
          {expanded ? (
            <ExpandLessIcon sx={{ color: 'white' }} />
          ) : (
            <ExpandMoreIcon />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

BarberFullItem.propTypes = {
  barber: PropTypes.object,
  expanded: PropTypes.bool,
  oneSelected: PropTypes.bool,
  toggleExpanded: PropTypes.func,
  reviews: PropTypes.array,
};

export default BarberFullItem;
