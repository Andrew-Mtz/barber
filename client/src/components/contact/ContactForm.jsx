import React from 'react'
import './contactForm.css'
import { Alert, Box, Button, IconButton, TextField, Typography } from '@mui/material';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import InstagramIcon from '@mui/icons-material/Instagram';

const baseUrl = process.env.REACT_APP_BASEURL

const ContactForm = () => {
  const [formData, setFormData] = React.useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = React.useState({ email: "" });
  const [formError, setFormError] = React.useState("")
  const [reverse, setReverse] = React.useState(false)

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
    setFormError("");
  }

  const validateFields = (property) => {
    if (formData[property] === "") {
      setErrors((prevErrors) => ({ ...prevErrors, [property]: "Este campo es requerido" }));
    } else {
      if (property === "email" && !isEmailValid(formData.email)) return setErrors((prevErrors) => ({ ...prevErrors, [property]: "Formato de email invalido" }));
      setErrors((prevErrors) => ({ ...prevErrors, [property]: "" }));
    }
  };

  const isEmailValid = (email) => {
    return /^\w+([.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateFields("name")
    validateFields("email")
    validateFields("message")

    if (!!errors.email || !!errors.password) return console.log("invalid")

    try {
      // Realiza una solicitud POST al backend para enviar el formulario
      const response = await fetch(`${baseUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: "", email: "", message: "" });
      } else {
        // Mostrar mensaje de error si la solicitud no fue exitosa
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };
  return (
    <Box className={'flip-card'}>
      <Box className={`flip-card-inner ${reverse ? 'rotate' : ''}`}>
        <Box className={'flip-card-front'}>
          <form className={'form-contact'} style={{ 'text-align': 'end' }} onSubmit={handleSubmit}>
            {formError !== "" && <Alert variant="filled" severity="error">
              {formError}
            </Alert>}
            <Typography variant='h3' color="primary" className={'title'}>Contactanos ✌️💈
              <IconButton aria-label="delete" onClick={() => { setReverse(!reverse) }}>
                <ChangeCircleIcon />
              </IconButton>
            </Typography>
            <TextField
              onChange={(event) => handleData("name", event)}
              onBlur={() => validateFields("name")}
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
              onChange={(event) => handleData("email", event)}
              onBlur={() => validateFields("email")}
              variant="outlined"
              margin="normal"
              fullWidth
              id="email"
              label="Email*"
              name="email"
              type='email'
              helperText={errors.email}
              error={!!errors.email}
              autoComplete='email'
              value={formData.email}
            />
            <TextField
              onChange={(event) => handleData("message", event)}
              onBlur={() => validateFields("message")}
              id="outlined-multiline-flexible"
              label="Mensaje*"
              name="message"
              type='text'
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
            </Button>
          </form>
        </Box>
        <Box className={'flip-card-back'}>
          <Box className={'form-contact'}>
            <Typography variant='h3' color="primary" className={'title'}>Encontranos📌☎️
              <IconButton aria-label="delete" onClick={() => { setReverse(!reverse) }}>
                <ChangeCircleIcon />
              </IconButton>
            </Typography>
            <Box>
              <Typography>
                Podes seguirnos en intagram
              </Typography>
              <IconButton aria-label="delete" onClick={openInstagram}>
                <InstagramIcon />
              </IconButton>
            </Box>
            <Typography>
              Podes comunicarte al
            </Typography>
            <Typography>
              098-xxx-xxx
            </Typography>
            <Typography>
              O podes encontrarnos en
            </Typography>
            <Typography>
              Ruta 1 vieja
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ContactForm