import React from 'react';
import { Alert, Button, TextField, Typography } from '@mui/material';

//const baseUrl = process.env.REACT_APP_BASEURL

const Emails = () => {
  const [formData, setFormData] = React.useState({ subject: "", message: "" });
  const [errors, setErrors] = React.useState({ subject: "", message: "" });
  const [formError, setFormError] = React.useState("")

  const handleData = (property, event) => {
    const formDataCopy = { ...formData };
    formDataCopy[property] = event.target.value;
    setFormData(formDataCopy);
    setFormError("");
  }

  const validateFields = async (property) => {
    const errorMessages = {
      default: "Este campo es requerido",
    };

    if (!formData[property]) {
      setErrors((prevErrors) => ({ ...prevErrors, [property]: errorMessages.default }));
      throw errorMessages.default;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [property]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await Promise.all([
      validateFields("message")
    ])
      .then(() => console.log(JSON.stringify(formData)))
      .catch((err) => { });

    /* try {
      // Realiza una solicitud POST al backend para enviar el formulario
      const response = await fetch(`${baseUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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
    } */
  };

  return (
    <>
      <form className={'form-contact'} style={{ 'textAlign': 'end' }} onSubmit={handleSubmit}>
        <Typography variant='h3' color="primary" className={'title'}>Dile algo a tus clientes🗣️</Typography>
        <Typography variant='body1' component='p' color="primary" className={'body'}>Este mensaje llegara a todos lo clientes que tengan habilitado recibir correos</Typography>
        {formError !== "" && <Alert variant="filled" severity="error">
          {formError}
        </Alert>}
        <TextField
          onChange={(event) => handleData("subject", event)}
          onBlur={() => validateFields("subject").catch(()=>{})}
          variant="outlined"
          margin="normal"
          fullWidth
          name="subject"
          label="Asunto*"
          type="text"
          id="subject"
          helperText={errors.subject}
          error={!!errors.subject}
          value={formData.subject}
        />
        <TextField
          onChange={(event) => handleData("message", event)}
          onBlur={() => validateFields("message").catch(()=>{})}
          id="outlined-multiline-flexible"
          label="Mensaje*"
          name="message"
          type='text'
          helperText={errors.message}
          error={!!errors.message}
          multiline
          fullWidth
          rows={6}
          value={formData.message}
        />
        <Typography component='span'>{errors.form}</Typography>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={'submit'}
        >
          Enviar
        </Button>
      </form>
    </>
  )
}

export default Emails;