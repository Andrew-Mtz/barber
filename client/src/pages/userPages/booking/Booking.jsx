import React from 'react'
import { Alert, Box, Button, Step, StepLabel, Stepper } from '@mui/material'
import { stepperStyle, steps } from './booking.style.js'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useLocation, useNavigate } from 'react-router-dom'
import BarberList from '../../../components/barbers/list/BarberList.jsx';
import HaircutList from '../../../components/haircuts/HaircutList.jsx';
import Calendar from '../../../components/calendar/Calendar.jsx';
import DialogConfirm from '../../../components/infoMessage/DialogConfirm.jsx';
import SuccesfullMessage from '../../../components/infoMessage/SuccesfullMessage.jsx';
import ErrorMessage from '../../../components/infoMessage/ErrorMessage.jsx';
import { useAuth } from '../../../context/ValidationContext.jsx';


const Booking = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate()
  const location = useLocation();

  const baseUrl = process.env.REACT_APP_BASEURL

  const isAccountRoute = location.state && location.state.previousPath === '/account';

  const [succes, setSucces] = React.useState(false);
  const [titleErMsgBooking, setTitleErMsgBooking] = React.useState('');
  const [erMsgBooking, setErMsgBooking] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [bookingData, setBookingData] = React.useState({
    "status": "scheduled",
    "barber_id": 0,
    "barber_name": "",
    "haircut_id": 0,
    "haircut_name": "",
    "schedule_id": 0,
    "date": "",
    "date_id": 0,
    "hour": ""
  })

  React.useEffect(() => {
    if (isAccountRoute) {
      const storedData = localStorage.getItem("Booking")
      return storedData ? (setActiveStep(2), setBookingData(JSON.parse(storedData))) : setBookingData({
        "status": "scheduled",
        "barber_id": 0,
        "barber_name": "",
        "haircut_id": 0,
        "haircut_name": "",
        "schedule_id": 0,
        "date": "",
        "date_id": 0,
        "hour": ""
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

  const handleBarberSelect = (id, name, lastName) => {
    setBookingData((prevBookingData) => ({
      ...prevBookingData,
      barber_id: id,
      barber_name: `${name} ${lastName}`
    }));
  };

  const handleHaircutSelect = (id, name) => {
    setBookingData((prevBookingData) => ({
      ...prevBookingData,
      haircut_id: id,
      haircut_name: name
    }));
  };

  const handleDaySelect = (dateId, date) => {
    setBookingData((prevBookingData) => ({
      ...prevBookingData,
      date: date,
      date_id: dateId,
      schedule_id: 0,
      hour: ""
    }));
  };

  const handleHourSelect = (scheduleId, hour) => {
    setBookingData((prevBookingData) => ({
      ...prevBookingData,
      schedule_id: scheduleId,
      hour: hour
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

    if (activeStep === 2 && bookingData.schedule_id === 0 && bookingData.hour === "") {
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
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        setSucces(true);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        if (response.status === 409) {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          setTitleErMsgBooking('Ya tienes una reserva hecha')
          setErMsgBooking('Puedes cancelar tu reserva hasta 2 horas antes en "Mi reserva" y luego agendar una nueva')
          return setSucces(false);
        }
        await response.json();
        setTitleErMsgBooking('Error al completar la reserva')
        setErMsgBooking('Ha ocurrido un error inesperado, espera unos minutos e intenta de nuevo. Si el error persiste hasnos saber!')
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        return setSucces(false);
      }
    } catch (error) {
      setTitleErMsgBooking('Error al completar la reserva')
      setErMsgBooking('Ha ocurrido un error inesperado, espera unos minutos e intenta de nuevo. Si el error persiste hasnos saber!')
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      return setSucces(false);
    }
  }

  const stepComponents = [
    <BarberList selectedId={bookingData.barber_id} onBarberSelect={handleBarberSelect} />,
    <HaircutList selectedId={bookingData.haircut_id} selectedBarberId={bookingData.barber_id} onHaircutSelect={handleHaircutSelect} />,
    <Calendar selectedBarberId={bookingData.barber_id} selectedId={bookingData.schedule_id} selectedDateId={bookingData.date_id} onDaySelect={handleDaySelect} onHourSelect={handleHourSelect} />,
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
        <>
          <Box sx={{
            height: '450px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {succes ? <SuccesfullMessage title={"Agendado correctamente"} message={'Puedes ver los detalles de la reserva o cancelarla hasta 2 horas antes en "Mi reserva"'} />
              : <ErrorMessage title={titleErMsgBooking} message={erMsgBooking} />}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            {succes ? <Button
              variant='contained'
              onClick={handleReset}
              sx={{ mr: 1, padding: 1.5 }}>
              Ver Reservas
            </Button>
              : <Button
                variant='contained'
                onClick={handleBack}
                sx={{ mr: 1, padding: 1.5 }}
                startIcon={<ArrowBackIcon />}>
                Volver
              </Button>}
          </Box>
        </>
      ) : (
        <>
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
        </>
      )}
    </Box>
  )
}

export default Booking