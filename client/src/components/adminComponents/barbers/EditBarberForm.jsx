import React from 'react'
import { Alert, Box, Button, TextField } from '@mui/material'

const baseUrl = process.env.REACT_APP_BASEURL

const EditBarberForm = ({ selectedBarber, handleBarber, successfullyEdit, setSuccessfullyEdit }) => {
  const [errors, setErrors] = React.useState({ name: "", last_name: "", description: "", full_description: "" });
  const [formError, setFormError] = React.useState("")

  const validateFields = (property) => {
    if (selectedBarber[property] === "") {
      return setErrors((prevErrors) => ({ ...prevErrors, [property]: "Este campo es requerido" }));
    }
    setErrors((prevErrors) => ({ ...prevErrors, [property]: "" }));
  };

  const saveChanges = async (name, last_name, description, full_description, phone) => {
    try {
      const body = { name, last_name, description, full_description, phone }
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/barber/${selectedBarber.id}`, {
        method: "PUT",
        headers:
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body)
      })

      const parseRes = await response.json()
      if (response.status === 409) return setFormError(parseRes)
      setSuccessfullyEdit(!successfullyEdit)
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

    if (!!errors.name || !!errors.last_name || !!errors.description || !!errors.full_description) return console.log("invalid")

    console.log(selectedBarber.name, selectedBarber.last_name, selectedBarber.description, selectedBarber.full_description, selectedBarber.phone)
    saveChanges(selectedBarber.name, selectedBarber.last_name, selectedBarber.description, selectedBarber.full_description, selectedBarber.phone)
  };

  const deleteBarber = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/barber/${selectedBarber.id}`, {
        method: "DELETE",
        headers:
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })
      if (response.status === 204) {

        return setSuccessfullyEdit(!successfullyEdit)
      }
      setFormError('Error al eliminar el barbero')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box className="cp-form-image-container">
          <img src={selectedBarber.image.url} width={200} height={250} alt={`Foto de ${selectedBarber.name} ${selectedBarber.last_name}`} />
          <input type='file' name='barber_image_url' />
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
            value={selectedBarber.name || ''}
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
            value={selectedBarber.last_name || ''}
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
            value={selectedBarber.description || ''}
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
            value={selectedBarber.full_description || ''}
          />
          <TextField
            onChange={(event) => { handleBarber("phone", event); setFormError(""); }}
            onBlur={() => validateFields("phone")}
            variant="outlined"
            margin="normal"
            fullWidth
            id="phone"
            label="Celular"
            name="phone"
            type='text'
            value={selectedBarber.phone || ''}
          />
          <Button
            className='btn-save-changes'
            type="button"
            variant="contained"
            color="error"
            onClick={() => deleteBarber()}
          >
            Eliminar Barbero
          </Button>
          <Button
            className='btn-save-changes'
            type="submit"
            variant="contained"
            color="primary"
          >
            Guardar cambios
          </Button>
        </Box>
      </form>
    </>
  )
}

export default EditBarberForm