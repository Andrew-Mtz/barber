import { Alert, Avatar, Box, Button, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import './userData.css'

const baseUrl = process.env.REACT_APP_BASEURL

const UserData = ({ isBookingRoute }) => {
  const navigate = useNavigate()
  const dateRef = React.useRef("");

  const [user, setUser] = React.useState(null);
  const [booking, setBooking] = React.useState(null);
  const [editMode, setEditMode] = React.useState(false);
  const [account, setAccount] = React.useState({ name: "", last_name: "", phone: "", email: "" });
  const [errors, setErrors] = React.useState({ name: "", last_name: "", phone: "", email: "" });
  const [formError, setFormError] = React.useState("")

  const logOut = () => {
    localStorage.removeItem("token")
    window.location.reload()
  }

  const editData = () => {
    setEditMode(true)
    setAccount({
      name: user.name,
      last_name: user.last_name,
      phone: user.phone,
      email: user.email,
    });
  }

  const exitEditMode = () => {
    setEditMode(false)
  }

  const handleAccount = (property, event) => {
    const accountCopy = { ...account };
    accountCopy[property] = event.target.value;
    setAccount(accountCopy);
    setFormError("")
  }

  const validateFields = async (property) => {
    const { email, phone } = account;
    const errorMessages = {
      email: "Formato de email invalido",
      phone: "Formato de número celular invalido",
      default: "Este campo es requerido",
    };

    if (property !== "phone" && !account[property]) {
      setErrors((prevErrors) => ({ ...prevErrors, [property]: errorMessages.default }));
      throw errorMessages.default;
    }

    if (property === "email" && email && !isEmailValid(email)) {
      setErrors((prevErrors) => ({ ...prevErrors, [property]: errorMessages.email }));
      throw errorMessages.email;
    }

    if (property === "phone" && phone && !isPhoneValid(phone)) {
      setErrors((prevErrors) => ({ ...prevErrors, [property]: errorMessages.phone }));
      throw errorMessages.phone;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [property]: "" }));
  };

  const isEmailValid = (email) => {
    return /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(email)
  };

  const isPhoneValid = (phone) => {
    return /^[0-9]{9}$/.test(phone)
  };

  const saveChanges = async (name, last_name, phone, email) => {
    try {
      const body = { name, last_name, phone, email }
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/edit-user`, {
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

      setEditMode(false)
      setUser(parseRes)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    await Promise.all([
      validateFields("name"),
      validateFields("last_name"),
      validateFields("email"),
    ])
      .then(() => saveChanges(account.name, account.last_name, account.phone, account.email))
      .catch((err) => console.log(err));
  };

  const getUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/user`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      const dataResponse = await response.json();

      setUser(dataResponse)
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  };

  React.useEffect(() => {
    getUserData()
    if (isBookingRoute) {
      const storedData = localStorage.getItem("Booking")
      storedData ? setBooking(JSON.parse(storedData)) : setBooking(null);
      const date = booking?.date.split('T')[0];
      dateRef.current = date;
      return;
    }
    localStorage.removeItem("Booking")
  }, [booking?.date, isBookingRoute])

  const stringToColor = (string) => {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

  const stringAvatar = (name) => {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

  return (
    <>
      <Box className={'card-booking'}>
        <Box className={'container-booking'}>
          <Box className={'user-avatar-image'}>
            <Avatar {...stringAvatar(`${user?.name} ${user?.last_name}`)} sx={{ width: 56, height: 56 }} />
          </Box>
          {!editMode ? <Box className={'container-booking-text'}>
            <Box className={'left-booking-text'} >
              <Typography className={'continue-booking-left'}>Nombre:</Typography>
              <Typography className={'continue-booking-left'}>Correo:</Typography>
              <Typography className={'continue-booking-left'}>Celular:</Typography>
            </Box>
            <Box className={'right-booking-text'} >
              <Typography className={'continue-booking-right'}>{user?.name} {user?.last_name}</Typography>
              <Typography className={'continue-booking-right'}>{user?.email}</Typography>
              <Typography className={'continue-booking-right'}>{user?.phone}</Typography>
            </Box>
          </Box> :
            <form className={'content'} onSubmit={handleSubmit}>
              {formError !== "" && <Alert variant="filled" severity="error">
                {formError}
              </Alert>}
              <TextField
                onChange={(event) => handleAccount("name", event)}
                onBlur={() => validateFields("name").catch(()=>{})}
                variant="outlined"
                margin="normal"
                fullWidth
                id="name"
                label="Nombre*"
                name="name"
                type='text'
                helperText={errors.name}
                error={!!errors.name}
                autoComplete='given-name'
                defaultValue={user.name}
              />
              <TextField
                onChange={(event) => handleAccount("last_name", event)}
                onBlur={() => validateFields("last_name").catch(()=>{})}
                variant="outlined"
                margin="normal"
                fullWidth
                id="last_name"
                label="Apellido*"
                name="last_name"
                type='text'
                helperText={errors.last_name}
                error={!!errors.last_name}
                autoComplete='family-name'
                defaultValue={user.last_name}
              />
              <TextField
                onChange={(event) => handleAccount("phone", event)}
                onBlur={() => validateFields("phone").catch(()=>{})}
                variant="outlined"
                margin="normal"
                fullWidth
                id="phone"
                label="Celular"
                name="phone"
                type='tel'
                helperText={errors.phone}
                error={!!errors.phone}
                autoComplete='tel-national'
                defaultValue={user.phone}
              />
              <TextField
                onChange={(event) => handleAccount("email", event)}
                onBlur={() => validateFields("email").catch(()=>{})}
                variant="outlined"
                margin="normal"
                fullWidth
                id="email"
                label="Correo*"
                name="email"
                type='email'
                helperText={errors.email}
                error={!!errors.email}
                autoComplete='email'
                defaultValue={user.email}
              />
            </form>
          }
          {!editMode ?
            <Box className={'continue-booking-btns'}>
              <Button variant='contained' onClick={editData}>Editar datos</Button>
              <Button variant='contained' color='error' onClick={logOut}>Cerrar sesion</Button>
            </Box> :
            <Box className={'continue-booking-btns'}>
              <Button variant='contained' onClick={handleSubmit}>Guardar cambios</Button>
              <Button variant='contained' color='error' onClick={exitEditMode}>Descartar cambios</Button>
            </Box>}
        </Box>
      </Box>
      {isBookingRoute && booking && <Box className={'card-booking'}>
        <Box className={'container-booking'}>
          <Typography variant='h5' component='h3' color={'black'} textAlign={'center'}>Reserva guardada para completar</Typography>
          <Box className={'container-booking-text'}>
            <Box className={'left-booking-text'}>
              <Typography className={'continue-booking-left'}>Barbero:</Typography>
              <Typography className={'continue-booking-left'}>Corte:</Typography>
              <Typography className={'continue-booking-left'}>Fecha:</Typography>
              <Typography className={'continue-booking-left'}>Hora:</Typography>
            </Box>
            <Box className={'right-booking-text'}>
              <Typography className={'continue-booking-right'}>{booking?.barber_name}</Typography>
              <Typography className={'continue-booking-right'}>{booking?.haircut_name}</Typography>
              <Typography className={'continue-booking-right'}>{dateRef?.current?.split('-')[2]}/{dateRef?.current?.split('-')[1]}/{dateRef?.current?.split('-')[0]}</Typography>
              <Typography className={'continue-booking-right'}>{booking?.hour}</Typography>
            </Box>
          </Box>
          <Box className={'continue-booking-btns'}>
            <Button variant='contained' onClick={() => navigate("/booking", { state: { previousPath: "/account" } })}>Continuar con la reserva</Button>
          </Box>
        </Box>
      </Box>
      }
    </>
  )
}

export default UserData