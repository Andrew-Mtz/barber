import React from 'react';
import { Alert, Box, Button, TextField } from '@mui/material';
import { errorMessages } from './errors';
import PropTypes from 'prop-types';

const baseUrl = process.env.REACT_APP_BASEURL;

const EditBarberForm = ({
  selectedBarber,
  successfullyEdit,
  setSuccessfullyEdit,
}) => {
  const [newBarber, setNewBarber] = React.useState({
    name: '',
    last_name: '',
    description: '',
    full_description: '',
    phone: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = React.useState(null);
  const [errors, setErrors] = React.useState({
    name: '',
    last_name: '',
    description: '',
    full_description: '',
    phone: '',
    image: '',
  });
  const [formError, setFormError] = React.useState('');

  React.useEffect(() => {
    setNewBarber({
      name: selectedBarber.name || '',
      last_name: selectedBarber.last_name || '',
      description: selectedBarber.description || '',
      full_description: selectedBarber.full_description || '',
      phone: selectedBarber.phone || '',
      image: null,
    });
    setImagePreview(selectedBarber.image ? selectedBarber.image.url : null);
  }, [selectedBarber]);

  const handleBarber = (property, event) => {
    setNewBarber(prevBarber => ({
      ...prevBarber,
      [property]: event.target.value,
    }));
  };

  const handleImage = (property, event) => {
    if (!event.target.files[0])
      return setImagePreview(
        selectedBarber.image ? selectedBarber.image.url : null,
      );
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
    const { phone, description, full_description } = newBarber;

    if (!selectedBarber[property]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [property]: errorMessages.default,
      }));
      throw errorMessages.default;
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

  const isPhoneValid = phone => {
    return /^[0-9]{9}$/.test(phone);
  };

  const saveChanges = async (
    name,
    last_name,
    description,
    full_description,
    phone,
  ) => {
    try {
      const body = { name, last_name, description, full_description, phone };
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/barber/${selectedBarber.id}`, {
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
      validateFields('last_name'),
      validateFields('description'),
      validateFields('full_description'),
      validateFields('phone'),
      validateFields('image'),
    ])
      .then(() =>
        saveChanges(
          newBarber.name,
          newBarber.last_name,
          newBarber.description,
          newBarber.full_description,
          newBarber.phone,
          newBarber.image,
        ),
      )
      .catch(err => {});
  };

  const deleteBarber = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/barber/${selectedBarber.id}`, {
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
      setFormError('Error al eliminar el barbero');
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
              alt={`Foto de ${newBarber.name} ${newBarber.last_name}`}
            />
          )}
          <input
            type="file"
            name="barber_image_url"
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
            label="Celular"
            name="phone"
            type="tel"
            helperText={errors.phone}
            error={!!errors.phone}
            value={newBarber.phone || ''}
          />
          <Button
            className="btn-save-changes"
            type="button"
            variant="contained"
            color="error"
            onClick={() => deleteBarber()}
          >
            Eliminar Barbero
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
      </form>
    </>
  );
};

EditBarberForm.propTypes = {
  selectedBarber: PropTypes.object,
  successfullyEdit: PropTypes.bool,
  setSuccessfullyEdit: PropTypes.func,
};

export default EditBarberForm;
