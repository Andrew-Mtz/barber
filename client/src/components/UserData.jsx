import { Alert, Avatar, Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import { styles } from './userData.styles.js'

const baseUrl = 'http://localhost:8080'; //http://localhost:8080

const UserData = ({ checkAuth, isBookingRoute }) => {
  const navigate = useNavigate()

  const [user, setUser] = React.useState(null);
  const [booking, setBooking] = React.useState(null);
  const [editMode, setEditMode] = React.useState(false);
  const [account, setAccount] = React.useState({ name: "", last_name: "", phone: "", email: "" });
  const [errors, setErrors] = React.useState({ name: "", last_name: "", email: "" });
  const [formError, setFormError] = React.useState("")

  const logOut = () => {
    localStorage.removeItem("token")
    checkAuth()
  }

  const editData = () => {
    setEditMode(true)
  }

  const exitEditMode = () => {
    setEditMode(false)
  }

  const handelAccount = (property, event) => {
    const accountCopy = { ...account };
    accountCopy[property] = event.target.value;
    setAccount(accountCopy);
    setFormError("")
  }

  const validateFields = (property) => {
    if (account[property] === "") {
      setErrors((prevErrors) => ({ ...prevErrors, [property]: "Este campo es requerido" }));
    } else {
      if (property === "email" && !isEmailValid(account.email)) return setErrors((prevErrors) => ({ ...prevErrors, [property]: "Formato de email invalido" }));
      setErrors((prevErrors) => ({ ...prevErrors, [property]: "" }));
    }
  };

  const isEmailValid = (email) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
  };

  const saveChanges = async (name, last_name, phone, email, password) => {
    try {
      const body = { name, last_name, phone, email, password }

      const response = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      })

      const parseRes = await response.json()

      if (response.status === 409) return setFormError(parseRes)

      setEditMode(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    validateFields("name")
    validateFields("last_name")
    validateFields("email")

    if (!!errors.email || !!errors.name || !!errors.last_name) return console.log("invalid")

    saveChanges(account.name, account.last_name, account.phone, account.email)
  };

  const getUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/user`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });
      const dataResponse = await response.json();

      setUser(dataResponse)
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    getUserData()
    if (isBookingRoute) {
      const storedData = localStorage.getItem("Booking")
      return storedData ? setBooking(JSON.parse(storedData)) : setBooking(null);
    }
    localStorage.removeItem("Booking")
  }, [isBookingRoute])

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
      <Paper sx={styles.container}>
        <Box sx={styles.card}>
          <Box sx={styles.header}>
            <Box sx={styles.image}>
              <Avatar {...stringAvatar(`${user?.name} ${user?.last_name}`)} sx={{ width: 56, height: 56 }} />
            </Box>
            {!editMode ? <Box sx={{ display: 'flex', marginTop: 5, marginBottom: 5, justifyContent: 'space-around' }}>
              <Box sx={styles.content} >
                <Typography sx={styles.title}>Nombre:</Typography>
                <Typography sx={styles.title}>Apellido:</Typography>
                <Typography sx={styles.title}>Correo:</Typography>
                <Typography sx={styles.title}>Celular:</Typography>
              </Box>
              <Box sx={styles.content} >
                <Typography sx={styles.message}>{user?.name}</Typography>
                <Typography sx={styles.message}>{user?.last_name}</Typography>
                <Typography sx={styles.message}>{user?.email}</Typography>
                <Typography sx={styles.message}>{user?.phone}</Typography>
              </Box>
            </Box> :
              <form sx={styles.content} onSubmit={handleSubmit}>
                {formError !== "" && <Alert variant="filled" severity="error">
                  {formError}
                </Alert>}
                <TextField
                  onChange={(event) => handelAccount("name", event)}
                  onBlur={() => validateFields("name")}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="name"
                  label="Name*"
                  name="name"
                  type='text'
                  helperText={errors.name}
                  error={!!errors.name}
                  autoComplete='given-name'
                  defaultValue={user.name}
                />
                <TextField
                  onChange={(event) => handelAccount("last_name", event)}
                  onBlur={() => validateFields("last_name")}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="last_name"
                  label="Last name*"
                  name="last_name"
                  type='text'
                  helperText={errors.last_name}
                  error={!!errors.last_name}
                  autoComplete='family-name'
                  defaultValue={user.last_name}
                />
                <TextField
                  onChange={(event) => handelAccount("phone", event)}
                  onBlur={() => validateFields("phone")}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="phone"
                  label="Phone"
                  name="phone"
                  type='number'
                  autoComplete='tel-national'
                  defaultValue={user.phone}
                />
                <TextField
                  onChange={(event) => handelAccount("email", event)}
                  onBlur={() => validateFields("email")}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email*"
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
              <Box sx={styles.actions}>
                <Button variant='contained' onClick={editData}>Editar datos</Button>
                <Button variant='contained' onClick={logOut}>Cerrar sesion</Button>
              </Box> :
              <Box sx={styles.actions}>
                <Button variant='contained' onClick={exitEditMode}>Descartar cambios</Button>
                <Button variant='contained' onClick={handleSubmit}>Guardar cambios</Button>
              </Box>}
          </Box>
        </Box>
      </Paper>
      {isBookingRoute && booking && <Box>
        <Typography>{booking?.barber_id}</Typography>
        <Typography>{booking?.haircut_id}</Typography>
        <Typography>{booking?.schedule_id}</Typography>
        <Button onClick={() => navigate("/booking", { state: { previousPath: "/account" } })}>Continuar con la reserva</Button>
      </Box>
      }
    </>
  )
}

export default UserData