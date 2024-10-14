import React from 'react';
import { Alert, Box, Button, TextField } from '@mui/material';
import { errorMessages } from './errors';

const baseUrl = process.env.REACT_APP_BASEURL;

const AddBarberForm = () => {
  const [newBarber, setNewBarber] = React.useState({
    name: '',
    last_name: '',
    email: '',
    description: '',
    full_description: '',
    phone: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = React.useState(null);
  const [errors, setErrors] = React.useState({
    name: '',
    last_name: '',
    email: '',
    description: '',
    full_description: '',
    phone: '',
    image: '',
  });
  const [formError, setFormError] = React.useState('');

  const handleBarber = (property, event) => {
    setNewBarber(prevBarber => ({
      ...prevBarber,
      [property]: event.target.value,
    }));
  };

  const handleImage = (property, event) => {
    if (!event.target.files[0]) return setImagePreview(null);
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBarber(prevBarber => ({
          ...prevBarber,
          [property]: selectedFile,
        }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const validateFields = async property => {
    const { email, phone, description, full_description } = newBarber;

    if (!newBarber[property]) {
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

    if (property === 'phone' && phone && !isPhoneValid(phone)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [property]: errorMessages.phone,
      }));
      throw errorMessages.phone;
    }

    if (property === 'description' && description.length > 50) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [property]: errorMessages.description,
      }));
      throw errorMessages.description;
    }

    if (property === 'full_description' && full_description.length < 100) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [property]: errorMessages.full_description,
      }));
      throw errorMessages.full_description;
    }
    setErrors(prevErrors => ({ ...prevErrors, [property]: '' }));
  };

  const saveChanges = async newBarber => {
    try {
      const formData = new FormData();
      for (let key in newBarber) {
        formData.append(key, newBarber[key]);
      }
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/barber`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const parseRes = await response.json();
      if (response.status === 409) return setFormError(parseRes);
    } catch (error) {
      alert(error);
    }
  };

  const isEmailValid = email => {
    return /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  };

  const isPhoneValid = phone => {
    return /^[0-9]{9}$/.test(phone);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    await Promise.all([
      validateFields('name'),
      validateFields('last_name'),
      validateFields('description'),
      validateFields('email'),
      validateFields('full_description'),
      validateFields('phone'),
      validateFields('image'),
    ])
      .then(() => saveChanges(newBarber))
      .catch(err => {
        alert(err);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box className="cp-form-image-container">
          {imagePreview && (
            <img
              src={imagePreview}
              width={200}
              height={250}
              alt={`Foto de ${newBarber.name} ${newBarber.last_name}`}
            />
          )}
          <input
            type="file"
            name="image"
            className="file-input"
            accept="image/jpeg, image/png"
            onChange={event => {
              handleImage('image', event);
            }}
          />
          <span>{errors.image}</span>
        </Box>
        <Box className="cp-form-inputs-container">
          {formError !== '' && (
            <Alert variant="filled" severity="error">
              {formError}
            </Alert>
          )}
          <TextField
            onChange={event => {
              handleBarber('name', event);
              setFormError('');
            }}
            onBlur={() => validateFields('name').catch(() => {})}
            variant="outlined"
            margin="normal"
            fullWidth
            id="name"
            label="Nombre*"
            name="name"
            type="text"
            helperText={errors.name}
            error={!!errors.name}
            value={newBarber.name || ''}
          />
          <TextField
            onChange={event => {
              handleBarber('last_name', event);
              setFormError('');
            }}
            onBlur={() => validateFields('last_name').catch(() => {})}
            variant="outlined"
            margin="normal"
            fullWidth
            id="name"
            label="Apellido*"
            name="last_name"
            type="text"
            helperText={errors.last_name}
            error={!!errors.last_name}
            value={newBarber.last_name || ''}
          />
          <TextField
            onChange={event => {
              handleBarber('email', event);
              setFormError('');
            }}
            onBlur={() => validateFields('email').catch(() => {})}
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Correo*"
            name="email"
            type="email"
            helperText={errors.email}
            error={!!errors.email}
            autoComplete="email"
            value={newBarber.email || ''}
          />
          <TextField
            onChange={event => {
              handleBarber('description', event);
              setFormError('');
            }}
            onBlur={() => validateFields('description').catch(() => {})}
            variant="outlined"
            margin="normal"
            fullWidth
            id="description"
            label="Descripcion*"
            name="description"
            type="text"
            helperText={errors.description}
            error={!!errors.description}
            value={newBarber.description || ''}
          />
          <TextField
            onChange={event => {
              handleBarber('full_description', event);
              setFormError('');
            }}
            onBlur={() => validateFields('full_description').catch(() => {})}
            variant="outlined"
            margin="normal"
            fullWidth
            id="full_description"
            label="Descripcion completa*"
            name="full_description"
            type="text"
            multiline
            rows={4}
            helperText={errors.full_description}
            error={!!errors.full_description}
            value={newBarber.full_description || ''}
          />
          <TextField
            onChange={event => {
              handleBarber('phone', event);
              setFormError('');
            }}
            onBlur={() => validateFields('phone').catch(() => {})}
            variant="outlined"
            margin="normal"
            fullWidth
            id="phone"
            label="Celular*"
            name="phone"
            type="tel"
            helperText={errors.phone}
            error={!!errors.phone}
            value={newBarber.phone || ''}
          />
          <Button
            className="btn-save-changes"
            type="submit"
            variant="contained"
            color="primary"
          >
            Agregar Barbero
          </Button>
        </Box>
      </form>
    </>
  );
};

export default AddBarberForm;
