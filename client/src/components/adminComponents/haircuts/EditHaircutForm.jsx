import React from 'react'
import { Alert, Box, Button, TextField } from '@mui/material';

const baseUrl = process.env.REACT_APP_BASEURL

const EditHaircutForm = ({ selectedHaircut, handleHaircut, successfullyEdit, setSuccessfullyEdit }) => {
  const [errors, setErrors] = React.useState({ name: "", price: "", description: "" });
  const [formError, setFormError] = React.useState("")

  const validateFields = (property) => {
    if (selectedHaircut[property] === "") {
      return setErrors((prevErrors) => ({ ...prevErrors, [property]: "Este campo es requerido" }));
    }
    setErrors((prevErrors) => ({ ...prevErrors, [property]: "" }));
  };

  const saveChanges = async (name, price, description) => {
    try {
      const body = { name, price, description }
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/haircut/${selectedHaircut.id}`, {
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
    validateFields("price")
    validateFields("description")

    if (!!errors.name || !!errors.price || !!errors.description) return console.log("invalid")

    console.log(selectedHaircut.name, selectedHaircut.price, selectedHaircut.description)
    saveChanges(selectedHaircut.name, selectedHaircut.price, selectedHaircut.description)
  };

  const deleteHaircut = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/haircut/${selectedHaircut.id}`, {
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
      setFormError('Error al eliminar el corte')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box className="cp-form-image-container">
          <img src={selectedHaircut.image.url} alt={selectedHaircut.name} width={200} height={250} />
          <input type='file' name='haircut_image_url' />
        </Box>
        <Box className="cp-form-inputs-container">
          {formError !== "" && <Alert variant="filled" severity="error">
            {formError}
          </Alert>}
          <TextField
            onChange={(event) => { handleHaircut("name", event); setFormError(""); }}
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
            value={selectedHaircut.name || ''}
          />
          <TextField
            onChange={(event) => { handleHaircut("price", event); setFormError(""); }}
            onBlur={() => validateFields("price")}
            variant="outlined"
            margin="normal"
            fullWidth
            id="name"
            label="Precio*"
            name="price"
            type='text'
            helperText={errors.price}
            error={!!errors.price}
            value={selectedHaircut.price || ''}
          />
          <TextField
            onChange={(event) => { handleHaircut("description", event); setFormError(""); }}
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
            value={selectedHaircut.description || ''}
          />
          <Box className='cp-form-btns-container'>
            <Button
              className='btn-save-changes'
              type="button"
              variant="contained"
              color="error"
              onClick={() => deleteHaircut()}
            >
              Eliminar Corte
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
        </Box>
      </form>
    </>
  )
}

export default EditHaircutForm