import React from 'react'
import { registerStyles } from "./register.style.js"
import { Alert, Button, Checkbox, FormControlLabel, FormGroup, TextField, Typography } from '@mui/material'

const baseUrl = 'http://localhost:8080'; //http://localhost:8080

const Register = ({ checkAuth }) => {
  const [account, setAccount] = React.useState({ name: "", last_name: "", phone: "", email: "", password: "" });
  const [errors, setErrors] = React.useState({ name: "", last_name: "", email: "", password: "" });
  const [formError, setFormError] = React.useState("")

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

  const registerUser = async (name, last_name, phone, email, password) => {
    try {
      const body = { name, last_name, phone, email, password }

      const response = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(body)
      })

      const parseRes = await response.json()

      if (response.status === 409) return setFormError(parseRes)

      localStorage.setItem("token", parseRes.token)

      checkAuth()
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    validateFields("name")
    validateFields("last_name")
    validateFields("email")
    validateFields("password")

    if (!!errors.email || !!errors.password || !!errors.name || !!errors.last_name) return console.log("invalid")

    registerUser(account.name, account.last_name, account.phone, account.email, account.password)
  };
  return (
    <form style={registerStyles.form} onSubmit={handleSubmit}>
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
      />
      <TextField
        onChange={(event) => handelAccount("password", event)}
        onBlur={() => validateFields("password")}
        variant="outlined"
        margin="normal"
        fullWidth
        name="password"
        label="Password*"
        type="password"
        id="password"
        helperText={errors.password}
        error={!!errors.password}
        autoComplete="current-password"
      />
      <FormGroup>
        <FormControlLabel
          control={<Checkbox value="acceptEmails" color="primary" />}
          label="Acepto recibir correos con recordatorios y novedades"
          sx={registerStyles.rememberBtnContainer}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Recuerdame"
          sx={registerStyles.rememberBtnContainer}
        />
      </FormGroup>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={registerStyles.submit}
      >
        Sign Up
      </Button>
    </form>
  )
}

export default Register