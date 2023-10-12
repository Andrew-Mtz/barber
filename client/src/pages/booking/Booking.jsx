import React from 'react'
import { Alert, Box, Button, Step, StepLabel, Stepper } from '@mui/material'
import { stepperStyle, steps } from './booking.style.js'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useLocation, useNavigate } from 'react-router-dom'
import BarberList from '../../components/barbers/list/BarberList.jsx';
import HaircutList from '../../components/haircuts/HaircutList.jsx';
import Calendar from '../../components/Calendar.jsx';
import DialogConfirm from '../../components/infoMessage/DialogConfirm.jsx';
import SuccesfullBooking from '../../components/infoMessage/SuccesfullBooking.jsx';
import ErrorBooking from '../../components/infoMessage/ErrorBooking.jsx';

const Booking = ({ isLoggedIn }) => {
  const navigate = useNavigate()
  const location = useLocation();

  const baseUrl = 'http://localhost:8080'; //http://localhost:8080

  const isAccountRoute = location.state && location.state.previousPath === '/account';

  const [succes, setSucces] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [bookingData, setBookingData] = React.useState({
    "status": "scheduled",
    "barber_id": 0,
    "haircut_id": 0,
    "schedule_id": 0,
    "date_id": 0
  })

  React.useEffect(() => {
    if (isAccountRoute) {
      const storedData = localStorage.getItem("Booking")
      return storedData ? setBookingData(JSON.parse(storedData)) : setBookingData({
        "status": "scheduled",
        "barber_id": 0,
        "haircut_id": 0,
        "schedule_id": 0,
        "date_id": 0
      });
    }
    localStorage.removeItem("Booking")
  }, [isAccountRoute])

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBarberSelect = (id) => {
    setBookingData((prevBookingData) => ({
      ...prevBookingData,
      barber_id: id,
    }));
  };

  const handleHaircutSelect = (id) => {
    setBookingData((prevBookingData) => ({
      ...prevBookingData,
      haircut_id: id,
    }));
  };

  const handleScheduleSelect = (scheduleId, dateId) => {
    setBookingData((prevBookingData) => ({
      ...prevBookingData,
      schedule_id: scheduleId,
      date_id: dateId
    }));
  };

  const handleNext = () => {
    if (activeStep === 0 && bookingData.barber_id === 0) {
      showError()
      setErrorMessage('Selecciona un barbero antes de continuar')
      return
    }
    if (activeStep === 1 && bookingData.haircut_id === 0) {
      showError()
      setErrorMessage('Selecciona un corte de pelo antes de continuar')
      return
    }
    setError(false);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const showError = () => {
    setError(true);
    setTimeout(() => {
      setError(false);
      setErrorMessage('')
    }, 5000);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    navigate("/my-booking")
  };

  const goToAccount = () => {
    localStorage.setItem("Booking", JSON.stringify(bookingData))
    navigate("/account", { state: { previousPath: "/booking" } })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeStep === 2 && bookingData.schedule_id === 0 && bookingData.date_id === 0) {
      showError()
      setErrorMessage('Selecciona un horario para poder agendarte')
      return
    }
    if (isLoggedIn) return scheduleCut(bookingData)
    handleOpen()
  }

  const scheduleCut = async (data) => {
    try {
      localStorage.removeItem("Booking")
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/booking`, {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (response.status === 409) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        return setSucces(false)
      }
      setSucces(true)
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } catch (error) {
      console.error('Error al completar la reserva:', error);
    }
  }

  const stepComponents = [
    <BarberList selectedId={bookingData.barber_id} onBarberSelect={handleBarberSelect} />,
    <HaircutList selectedId={bookingData.haircut_id} onHaircutSelect={handleHaircutSelect} />,
    <Calendar selectedBarberId={bookingData.barber_id} selectedId={bookingData.schedule_id} selectedDateId={bookingData.date_id} onScheduleSelect={handleScheduleSelect} />,
  ];
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={stepperStyle}>
        {steps.map((label) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Box sx={{
            height: '450px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {succes ? <SuccesfullBooking title={"Agendado correctamente"} message={'Puedes ver los detalles de la reserva en "Mi reserva"'} />
              : <ErrorBooking title={"Ya tienes una reserva hecha"} message={'Puedes cancelar tu reserva en "Mi reserva" y luego agendar una nueva'} />}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button variant='contained' onClick={handleReset}>Ver Reservas</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <form onSubmit={handleSubmit}>
            <Box sx={{
              minHeight: '450px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              {error && <Alert severity="info">{errorMessage}</Alert>}
              {stepComponents[activeStep]}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                variant='contained'
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1, padding: 1.5 }}
                startIcon={<ArrowBackIcon />}
              >
                Atras
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              {activeStep !== steps.length - 1 && (
                <Button
                  onClick={handleNext}
                  variant='contained'
                  type="button"
                  endIcon={<ArrowForwardIcon />}
                >
                  Siguiente
                </Button>
              )}
              {activeStep === steps.length - 1 && (
                <Button
                  variant='contained'
                  type="submit"
                  endIcon={<EventAvailableIcon />}
                >
                  Agendar
                </Button>
              )}
            </Box>
          </form>
          <DialogConfirm
            open={open}
            handleClose={handleClose}
            specificFuncion={goToAccount}
            title={"Cuenta necesaria para continuar"}
            message={"Para completar la reserva debes tener una cuenta. Presione en continuar para crear una cuenta o iniciar sesión si ya tiene una. Los datos seleccionados quedaran guardados "}
          />
        </React.Fragment>
      )}
    </Box>
  )
}

export default Booking