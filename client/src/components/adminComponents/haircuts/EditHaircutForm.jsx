import React from 'react';
import { Alert, Box, Button, TextField } from '@mui/material';
import { errorMessages } from './errors';
import PropTypes from 'prop-types';

const baseUrl = process.env.REACT_APP_BASEURL;

const EditHaircutForm = ({
  selectedHaircut,
  successfullyEdit,
  setSuccessfullyEdit,
}) => {
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

  React.useEffect(() => {
    setNewHaircut({
      name: selectedHaircut.name || '',
      last_name: selectedHaircut.last_name || '',
      description: selectedHaircut.description || '',
      full_description: selectedHaircut.full_description || '',
      phone: selectedHaircut.phone || '',
      image: null,
    });
    setImagePreview(selectedHaircut.image ? selectedHaircut.image.url : null);
  }, [selectedHaircut]);

  const handleHaircut = (property, event) => {
    setNewHaircut(prevHaircut => ({
      ...prevHaircut,
      [property]: event.target.value,
    }));
  };

  const handleImage = (property, event) => {
    if (!event.target.files[0])
      return setImagePreview(
        selectedHaircut.image ? selectedHaircut.image.url : null,
      );
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
    if (!selectedHaircut[property]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [property]: errorMessages.default,
      }));
      throw errorMessages.default;
    }
    setErrors(prevErrors => ({ ...prevErrors, [property]: '' }));
  };

  const saveChanges = async (name, price, description) => {
    try {
      const body = { name, price, description };
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/haircut/${selectedHaircut.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();
      if (response.status === 409) return setFormError(parseRes);
      setSuccessfullyEdit(!successfullyEdit);
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
      .then(() =>
        saveChanges(newHaircut.name, newHaircut.price, newHaircut.description),
      )
      .catch(err => {});
  };

  const deleteHaircut = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/haircut/${selectedHaircut.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 204) {
        return setSuccessfullyEdit(!successfullyEdit);
      }
      setFormError('Error al eliminar el corte');
    } catch (error) {}
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
            name="haircut_image_url"
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
          <Box className="cp-form-btns-container">
            <Button
              className="btn-save-changes"
              type="button"
              variant="contained"
              color="error"
              onClick={() => deleteHaircut()}
            >
              Eliminar Corte
            </Button>
            <Button
              className="btn-save-changes"
              type="submit"
              variant="contained"
              color="primary"
            >
              Guardar cambios
            </Button>
          </Box>
        </Box>
      </form>
    </>
  );
};

EditHaircutForm.propTypes = {
  selectedHaircut: PropTypes.object,
  successfullyEdit: PropTypes.bool,
  setSuccessfullyEdit: PropTypes.func,
};

export default EditHaircutForm;
