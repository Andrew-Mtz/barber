import { Box, Button, Modal, Rating, TextField, Typography } from '@mui/material';
import React from 'react'

const baseUrl = process.env.REACT_APP_BASEURL

const ModalReview = ({ review_id, open, handleClose }) => {
  const [formData, setFormData] = React.useState({ value: null, message: "" });
  const [formError, setFormError] = React.useState({ value: "", message: "" });

  const handleData = (property, value) => {
    const formDataCopy = { ...formData };
    formDataCopy[property] = value;
    setFormData(formDataCopy);
    setFormError("")
  }

  const sendData = (reviewId) => {
    if (formData.value !== null && formData.message !== "") {
      return reviewBooking(reviewId)
    }
    formData.value === null && setFormError((prevErrors) => ({ ...prevErrors, value: "Debes puntar almenos con una estrella" }));
    formData.message === "" && setFormError((prevErrors) => ({ ...prevErrors, message: "Debes agregar un mensaje" }));
  }

  const reviewBooking = async (reviewId) => {
    try {
      const data = { reviewId, rating: formData.value, comment: formData.message }
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/create-review`, {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (response.status === 409) {
        return console.log('algo salio mal')
      }
      window.location.reload()
    } catch (error) {
      console.error('Error al completar la reserva:', error);
    }
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-rating"
      aria-label="modal-modal-multiline"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" mb={3} sx={{ color: 'black' }} variant="h5" component="h3">Evalua el corte y deja un comentario!</Typography>
        <Box>
          <Rating
            id='modal-modal-rating'
            name="simple-controlled"
            className='rating'
            value={formData.value}
            onChange={(event, newValue) => {
              handleData("value", newValue);
            }}
          />
          {formError.value && (
            <Typography variant='caption' sx={{ ml: 2, color: 'red' }}>{formError.value}</Typography>
          )}
        </Box>
        <TextField
          sx={{ mt: 2, mb: 3 }}
          onChange={(event) => handleData("message", event.target.value)}
          id="modal-modal-multiline"
          label="Comentario"
          name="message"
          type='text'
          placeholder='Deja un comentario...'
          multiline
          fullWidth
          rows={4}
          value={formData.message}
          helperText={formError.message}
          error={!!formError.message}
        />
        <Button
          sx={{ mr: 3 }}
          color="error"
          variant='contained'
          onClick={handleClose}>Cancelar
        </Button>
        <Button
          variant='contained'
          onClick={() => sendData(review_id)}>Agregar reseña
        </Button>
      </Box>
    </Modal>
  )
}

export default ModalReview