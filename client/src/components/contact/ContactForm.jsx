import React from 'react';
import './contactForm.css';
import {
  Alert,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import InstagramIcon from '@mui/icons-material/Instagram';
import Spinner from '../spinner/Spinner';

const baseUrl = process.env.REACT_APP_BASEURL;

const ContactForm = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = React.useState({ email: '' });
  const [formError, setFormError] = React.useState('');
  const [reverse, setReverse] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const openInstagram = () => {
    // URL de Instagram
    const instagramURL = 'https://www.instagram.com/royalstudiocdp/';

    // Abre la URL en una nueva pestaña o ventana
    window.open(instagramURL, '_blank');
  };

  const handleData = (property, event) => {
    const formDataCopy = { ...formData };
    formDataCopy[property] = event.target.value;
    setFormData(formDataCopy);
    setFormError('');
  };

  const validateFields = async property => {
    const { email } = formData;
    const errorMessages = {
      email: 'Formato de email invalido',
      default: 'Este campo es requerido',
    };

    if (!formData[property]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [property]: errorMessages.default,
      }));
      throw errorMessages.default;
    }

    if (property === 'email' && email && !isEmailValid(email)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [property]: errorMessages.email,
      }));
      throw errorMessages.email;
    }

    setErrors(prevErrors => ({ ...prevErrors, [property]: '' }));
  };

  const isEmailValid = email => {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
  };

  const sendContactMessage = async () => {
    try {
      const response = await fetch(`${baseUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', email: '', message: '' });
        setLoading(false);
      } else {
        // Mostrar mensaje de error si la solicitud no fue exitosa
        setLoading(false);
      }
    } catch (error) {
      alert('Error al enviar el formulario:', error);
    }
  };

  const handleSubmit = async e => {
    setLoading(true);
    e.preventDefault();
    await Promise.all([
      validateFields('name'),
      validateFields('email'),
      validateFields('message'),
    ])
      .then(() => sendContactMessage())
      .catch(err => {
        setLoading(false);
      });
  };
  return (
    <Box className={'flip-card'}>
      <Box className={`flip-card-inner ${reverse ? 'rotate' : ''}`}>
        <Box className={'flip-card-front'}>
          <form
            className={'form-contact'}
            style={{ textAlign: 'end' }}
            onSubmit={handleSubmit}
          >
            {formError !== '' && (
              <Alert variant="filled" severity="error">
                {formError}
              </Alert>
            )}
            <Typography variant="h3" color="primary" className={'title'}>
              Contactanos ✌️💈
              <IconButton
                aria-label="delete"
                onClick={() => {
                  setReverse(!reverse);
                }}
              >
                <ChangeCircleIcon />
              </IconButton>
            </Typography>
            <TextField
              onChange={event => handleData('name', event)}
              onBlur={() => validateFields('name').catch(() => {})}
              variant="outlined"
              margin="normal"
              fullWidth
              name="name"
              label="Name*"
              type="text"
              id="name"
              helperText={errors.name}
              error={!!errors.name}
              autoComplete="name"
              value={formData.name}
            />
            <TextField
              onChange={event => handleData('email', event)}
              onBlur={() => validateFields('email').catch(() => {})}
              variant="outlined"
              margin="normal"
              fullWidth
              id="email"
              label="Email*"
              name="email"
              type="email"
              helperText={errors.email}
              error={!!errors.email}
              autoComplete="email"
              value={formData.email}
            />
            <TextField
              onChange={event => handleData('message', event)}
              onBlur={() => validateFields('message').catch(() => {})}
              id="outlined-multiline-flexible"
              label="Mensaje*"
              name="message"
              type="text"
              helperText={errors.message}
              error={!!errors.message}
              multiline
              fullWidth
              rows={4}
              value={formData.message}
            />
            <Typography>{errors.form}</Typography>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={'submit'}
            >
              Enviar
              {loading && <Spinner styles={{ marginLeft: '50px' }} />}
            </Button>
          </form>
        </Box>
        <Box className={'flip-card-back'}>
          <Box className={'form-contact'}>
            <Typography variant="h3" color="primary" className={'title'}>
              Encontranos📌☎️
              <IconButton
                aria-label="delete"
                onClick={() => {
                  setReverse(!reverse);
                }}
              >
                <ChangeCircleIcon />
              </IconButton>
            </Typography>
            <Box>
              <Typography>Podes seguirnos en intagram</Typography>
              <IconButton aria-label="delete" onClick={openInstagram}>
                <InstagramIcon />
              </IconButton>
            </Box>
            <Typography>Podes comunicarte al</Typography>
            <Typography>098-xxx-xxx</Typography>
            <Typography>O podes encontrarnos en</Typography>
            <Typography>Ruta 1 vieja</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactForm;
