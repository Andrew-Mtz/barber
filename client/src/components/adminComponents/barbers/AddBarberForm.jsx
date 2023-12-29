import React from 'react'
import { Alert, Box, Button, TextField } from '@mui/material';

const baseUrl = process.env.REACT_APP_BASEURL

const AddBarberForm = () => {
  const [newBarber, setNewBarber] = React.useState({ name: "", last_name: "", description: "", full_description: "", phone: "", image: null })
  const [errors, setErrors] = React.useState({ name: "", last_name: "", description: "", full_description: "", phone: "", image: "" });
  const [formError, setFormError] = React.useState("")

  const handleBarber = (property, event) => {
    setNewBarber((prevBarber) => ({
      ...prevBarber,
      [property]: event.target.value
    }));
  };

  const handleImage = (property, event) => {
    setNewBarber((prevBarber) => ({
      ...prevBarber,
      [property]: event.target.files[0]
    }));
  };

  const validateFields = (property) => {
    if (newBarber[property] === "") {
      return setErrors((prevErrors) => ({ ...prevErrors, [property]: "Este campo es requerido" }));
    }
    setErrors((prevErrors) => ({ ...prevErrors, [property]: "" }));
  };

  const saveChanges = async (newBarber) => {
    try {
      const formData = new FormData();
      for (let key in newBarber) {
        formData.append(key, newBarber[key]);
      }
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/barber`, {
        method: "POST",
        headers:
        {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      })

      const parseRes = await response.json()
      if (response.status === 409) return setFormError(parseRes)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    validateFields("name")
    validateFields("last_name")
    validateFields("description")
    validateFields("full_description")
    validateFields("phone")
    validateFields("image")

    if (!!errors.name || !!errors.last_name || !!errors.description || !!errors.full_description) return console.log("invalid")

    saveChanges(newBarber)
  };

  return (
    <>
      <form onSubmit={handleSubmit} >
        <Box className="cp-form-image-container">
          <input type='file' name='image' className='file-input' onChange={(event) => { handleImage("image", event) }} />
        </Box>
        <Box className="cp-form-inputs-container">
          {formError !== "" && <Alert variant="filled" severity="error">
            {formError}
          </Alert>}
          <TextField
            onChange={(event) => { handleBarber("name", event); setFormError(""); }}
            onBlur={() => validateFields("name")}
            variant="outlined"
            margin="normal"
            fullWidth
            id="name"
            label="Nombre*"
            name="name"
            type='text'
            helperText={errors.name}
            error={!!errors.name}
            value={newBarber.name || ''}
          />
          <TextField
            onChange={(event) => { handleBarber("last_name", event); setFormError(""); }}
            onBlur={() => validateFields("last_name")}
            variant="outlined"
            margin="normal"
            fullWidth
            id="name"
            label="Apellido*"
            name="last_name"
            type='text'
            helperText={errors.last_name}
            error={!!errors.last_name}
            value={newBarber.last_name || ''}
          />
          <TextField
            onChange={(event) => { handleBarber("description", event); setFormError(""); }}
            onBlur={() => validateFields("description")}
            variant="outlined"
            margin="normal"
            fullWidth
            id="description"
            label="Descripcion*"
            name="description"
            type='text'
            helperText={errors.description}
            error={!!errors.description}
            value={newBarber.description || ''}
          />
          <TextField
            onChange={(event) => { handleBarber("full_description", event); setFormError(""); }}
            onBlur={() => validateFields("full_description")}
            variant="outlined"
            margin="normal"
            fullWidth
            id="full_description"
            label="Descripcion completa*"
            name="full_description"
            type='text'
            helperText={errors.full_description}
            error={!!errors.full_description}
            value={newBarber.full_description || ''}
          />
          <TextField
            onChange={(event) => { handleBarber("phone", event); setFormError(""); }}
            onBlur={() => validateFields("phone")}
            variant="outlined"
            margin="normal"
            fullWidth
            id="phone"
            label="Celular*"
            name="phone"
            type='text'
            helperText={errors.phone}
            error={!!errors.phone}
            value={newBarber.phone || ''}
          />
          <Button
            className='btn-save-changes'
            type="submit"
            variant="contained"
            color="primary"
          >
            Agregar Barbero
          </Button>
        </Box>
      </form>
    </>
  )
}

export default AddBarberForm