import React from 'react'
import { Box, IconButton, Typography, Modal } from '@mui/material'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './barberItem.css';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarRateIcon from '@mui/icons-material/StarRate';
import CloseIcon from '@mui/icons-material/Close';
import CardReview from '../../cardReview/CardReview';


const BarberItem = ({ barber, expanded, oneSelected, toggleExpanded, reviews }) => {
  const [selectedMedia, setSelectedMedia] = React.useState(null);
  const openMediaModal = (mediaUrl) => {
    setSelectedMedia(mediaUrl);
  };

  const closeMediaModal = () => {
    setSelectedMedia(null);
  };

  const getMediaType = (url) => {
    const fileExtension = url?.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
      return 'image';
    } else if (['mp4', 'avi', 'mov'].includes(fileExtension)) {
      return 'video';
    } else {
      return 'unknown'; // Tipo de medio desconocido
    }
  };

  const settings = {
    className: "center",
    centerMode: true,
    centerPadding: "0px",
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
          className: "center",
          centerMode: true,
          centerPadding: "0px",
          slidesToShow: reviews?.length >= 2 ? 2 : reviews?.length,
          dots: true,
          speed: 500,
          autoplay: true,
          autoplaySpeed: 3000,
          pauseOnHover: true,
          arrows: false
        }
      },
      {
        breakpoint: 925,
        settings: {
          className: "center",
          centerMode: true,
          centerPadding: '0px',
          slidesToShow: 1,
          dots: true,
          speed: 500,
          autoplay: true,
          autoplaySpeed: 3000,
          pauseOnHover: true,
          arrows: false
        }
      }
    ]
  };

  return (
    <Box
      className={`barber-card ${oneSelected ? expanded ? 'expanded' : 'minimal' : ''}`}
    >
      <Box className={'img-section'} sx={{ backgroundImage: `url(${barber.barber_image_url})` }}>
        {!expanded && <Box className={`card-container-text ${oneSelected ? 'minimal' : ''}`}>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Typography gutterBottom variant="h5">
              {barber.name} {barber.last_name}
            </Typography>
          </Box>
          <Typography variant="body1">
            {barber.description}
          </Typography>
        </Box>}
      </Box>
      {expanded && (
        <Box className="barber-expanded">
          <Box className="barber-data-section">
            <Box sx={{display: 'flex', alignItems: 'baseline'}}>
              <Typography variant='h4' mr={4} color="text.secondary">{barber.name} {barber.last_name}</Typography>
              <Typography variant="h5" color="text.secondary"><StarRateIcon sx={{ color: '#faaf00' }} /> {parseFloat(barber.average_rating).toFixed(1)}</Typography>
            </Box>
            <Typography gutterBottom variant="body2" color="text.secondary">{barber.full_description}</Typography>
          </Box>
          <Box className="barber-reviews-section" sx={{ width: '100%' }}>
            <Typography gutterBottom variant="h5" color="text.secondary">Opiniones de la gente:</Typography>
            <Slider {...settings}>
              {reviews?.length > 0 && reviews?.map((review) => {
                return (
                  <CardReview key={review.id} review={review} />
                )
              })}
            </Slider>
          </Box>
          <Box className="barber-gallery">
            <Typography gutterBottom variant="h5" color="text.secondary">Algunos cortes realizados:</Typography>
            {barber?.haircut_image_urls?.map((mediaUrl, index) => {
              const mediaType = getMediaType(mediaUrl);

              return (
                <div
                  key={index}
                  className="media-item"
                >
                  {mediaType === 'image' ? (
                    <img
                      src={mediaUrl}
                      style={{ width: '100%' }}
                      alt={`Imagen ${index + 1}`}
                      onClick={() => openMediaModal(mediaUrl)}
                    />
                  ) : mediaType === 'video' ? (
                    <video
                      controls
                      src={mediaUrl}
                      style={{ width: '100%' }}
                      alt={`Video ${index + 1}`}
                    />
                  ) : null}
                </div>
              );
            })}
          </Box>
        </Box>
      )}
      <Modal
        open={selectedMedia !== null}
        onClose={closeMediaModal}
        aria-labelledby="image-modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: 24,
            maxWidth: '90vw',
            maxHeight: '90vh',
          }}
        >
          <IconButton
            aria-label="Cerrar"
            onClick={closeMediaModal}
            sx={{ position: 'absolute', top: 0, right: 0, color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={selectedMedia}
            alt="Imagen seleccionada"
            style={{ minWidth: '400px', minHeight: '500px', maxWidth: '100%', maxHeight: '100%' }}
          />
        </Box>
      </Modal>
      <Box className={`expand-button ${expanded && 'active'}`}>
        <IconButton onClick={toggleExpanded}>
          {expanded ? <ExpandLessIcon sx={{ color: 'white' }} /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
    </Box>
  )
}

export default BarberItem