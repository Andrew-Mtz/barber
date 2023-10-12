import React from 'react'
import { Box, Card, CardActionArea, CardContent, CardMedia, IconButton, Typography, Modal } from '@mui/material'
import './barberItem.css';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';

const BarberItem = ({ barber, expanded, toggleExpanded }) => {
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

  return (
    <Box
      className={`barber-card ${expanded ? 'expanded' : ''}`}
    >
      <Card>
        <CardActionArea onClick={toggleExpanded}>
          <CardMedia
            component="img"
            height="450"
            image={barber.barber_image_url}
            alt={`Foto de ${barber.name} ${barber.last_name}`}
          />
          {!expanded && <CardContent>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography gutterBottom variant="h5" component="div">
                {barber.name} {barber.last_name}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {barber.description}
            </Typography>
          </CardContent>}
        </CardActionArea>
      </Card>

      {expanded && (
        <Box className="barber-expanded">
          <Typography gutterBottom variant='h5' color="text.secondary">{barber.name} {barber.last_name}</Typography>
          <Typography gutterBottom variant="body2" color="text.secondary">{barber.full_description}</Typography>
          {barber?.haircut_image_urls[0] != null && <Typography gutterBottom variant='h5' color="text.secondary">Algunos trabajos:</Typography>}
          <Box className="barber-gallery">
            {barber?.haircut_image_urls?.map((mediaUrl, index) => {
              const mediaType = getMediaType(mediaUrl);

              return (
                <div
                  key={index}
                  className="media-item"
                  onClick={() => openMediaModal(mediaUrl)}
                >
                  {mediaType === 'image' ? (
                    <img
                      src={mediaUrl}
                      alt={`Imagen ${index + 1}`}
                    />
                  ) : mediaType === 'video' ? (
                    <video
                      controls
                      src={mediaUrl}
                      poster
                      style={{ width: '100%', height: '100%' }}
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
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        </Box>
      </Modal>

      <Box className="expand-button">
        <IconButton onClick={toggleExpanded}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
    </Box>
  )
}

export default BarberItem