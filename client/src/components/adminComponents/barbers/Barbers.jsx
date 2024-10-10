import React from 'react'
import { Box } from '@mui/material'
import './barbers.css'
import EditBarberForm from './EditBarberForm'
import AddBarberForm from './AddBarberForm'

const baseUrl = process.env.REACT_APP_BASEURL

const Barbers = () => {
  const [barbers, setBarbers] = React.useState([])
  const [successfullyEdit, setSuccessfullyEdit] = React.useState(false)
  const [imagePreview, setImagePreview] = React.useState(null);
  const [selectedBarber, setSelectedBarber] = React.useState(null)
  const [addBarberActive, setAddBarberActive] = React.useState(false)

  React.useEffect(() => {
    getBarbers()
  }, [successfullyEdit])

  const getBarbers = async () => {
    try {
      const response = await fetch(`${baseUrl}/barber`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      if (data.error !== '') {
        return console.log(data.error)
      }
      setBarbers(data.response);
    } catch (error) {
      console.error('Error al obtener los barberos:', error);
    }
  }

  const toggleEdit = (barber) => {
    if (selectedBarber?.id === barber.id) {
      return setSelectedBarber(null)
    }
    setSelectedBarber(barber)
    setAddBarberActive(false)
  }

  const addBarber = () => {
    setAddBarberActive(!addBarberActive)
    setSelectedBarber(null)
  }

  const handleBarber = (property, event) => {
    setSelectedBarber((prevBarber) => ({
      ...prevBarber,
      [property]: event.target.value
    }));
  };

  const handleImage = (property, event) => {
    if (event.target.files[0]) return setImagePreview(null)
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedBarber((prevBarber) => ({
          ...prevBarber,
          [property]: selectedFile,
        }));

        setImagePreview(reader.result);
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <>
      <Box className='container-btn-choose-barber'>
        {barbers?.map((barber) => (
          <div
            className={`btn-choose-barber ${selectedBarber?.id === barber.id && 'active'}`}
            key={barber.id}
            onClick={() => { toggleEdit(barber) }}
          >
            {barber.name} {barber.last_name}
          </div>
        ))}
        <div
          className={`btn-add-barber ${addBarberActive && 'active'}`}
          onClick={() => { addBarber() }}
        >
          Agregar +
        </div>
      </Box>
      {selectedBarber &&
        <EditBarberForm
          selectedBarber={selectedBarber}
          handleBarber={handleBarber}
          handleImage={handleImage}
          successfullyEdit={successfullyEdit}
          setSuccessfullyEdit={setSuccessfullyEdit}
          imagePreview={imagePreview}
        />}
      {addBarberActive && <AddBarberForm />}
    </>
  )
}

export default Barbers