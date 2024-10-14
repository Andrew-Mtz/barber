import React from 'react';
import { Alert, Box, Button, TextField } from '@mui/material';
import { errorMessages } from './errors';

const baseUrl = process.env.REACT_APP_BASEURL;

const AddHaircutForm = () => {
  const [newHaircut, setNewHaircut] = React.useState({
    name: '',
    price: '',
    description: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = React.useState(null);
  const [errors, setErrors] = React.useState({
    name: '',
    price: '',
    description: '',
    image: '',
  });
  const [formError, setFormError] = React.useState('');

  const handleHaircut = (property, event) => {
    setNewHaircut(prevHaircut => ({
      ...prevHaircut,
      [property]: event.target.value,
    }));
  };

  const handleImage = (property, event) => {
    if (!event.target.files[0]) return setImagePreview(null);
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewHaircut(prevBarber => ({
          ...prevBarber,
          [property]: selectedFile,
        }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const validateFields = async property => {
    if (!newHaircut[property]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [property]: errorMessages.default,
      }));
      throw errorMessages.default;
    }
    setErrors(prevErrors => ({ ...prevErrors, [property]: '' }));
  };

  const saveChanges = async newHaircut => {
    try {
      const formData = new FormData();
      for (let key in newHaircut) {
        formData.append(key, newHaircut[key]);
      }
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/haircut`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const parseRes = await response.json();
      if (response.status === 409) return setFormError(parseRes);
    } catch (error) {}
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await Promise.all([
      validateFields('name'),
      validateFields('price'),
      validateFields('description'),
      validateFields('image'),
    ])
      .then(() => saveChanges(newHaircut))
      .catch(err => {});
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
              alt={`Foto ${newHaircut.name}`}
            />
          )}
          <input
            type="file"
            name="image"
            className="file-input"
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
              handleHaircut('name', event);
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
            value={newHaircut.name || ''}
          />
          <TextField
            onChange={event => {
              handleHaircut('price', event);
              setFormError('');
            }}
            onBlur={() => validateFields('price').catch(() => {})}
            variant="outlined"
            margin="normal"
            fullWidth
            id="name"
            label="Precio*"
            name="price"
            type="text"
            helperText={errors.price}
            error={!!errors.price}
            value={newHaircut.price || ''}
          />
          <TextField
            onChange={event => {
              handleHaircut('description', event);
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
            value={newHaircut.description || ''}
          />
          <Button
            className="btn-save-changes"
            type="submit"
            variant="contained"
            color="primary"
          >
            Agregar Corte
          </Button>
        </Box>
      </form>
    </>
  );
};

export default AddHaircutForm;
