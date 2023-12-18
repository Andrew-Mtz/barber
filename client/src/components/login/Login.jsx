import React from 'react'
import { loginStyles } from "./login.style.js"
import { Alert, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material'

const baseUrl = process.env.REACT_APP_BASEURL

const Login = ({ checkAuth }) => {
  const [account, setAccount] = React.useState({ email: "", password: "" });
  const [errors, setErrors] = React.useState({ email: "", password: "" });
  const [formError, setFormError] = React.useState("")

  const handleAccount = (property, event) => {
    const accountCopy = { ...account };
    accountCopy[property] = event.target.value;
    setAccount(accountCopy);
    setFormError("");
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

  const logUser = async (email, password) => {
    try {
      const body = { email, password }

      const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const parseRes = await response.json()

      if (response.status === 409) return setFormError(parseRes)

      localStorage.setItem("token", parseRes.token)
      localStorage.setItem("userType", parseRes.userType)

      checkAuth()
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    validateFields("email")
    validateFields("password")

    if (!!errors.email || !!errors.password) return console.log("invalid")

    logUser(account.email, account.password)
  };
  return (
    <form style={loginStyles.form} onSubmit={handleSubmit}>
      {formError !== "" && <Alert variant="filled" severity="error">
        {formError}
      </Alert>}
      <TextField
        onChange={(event) => handleAccount("email", event)}
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
        onChange={(event) => handleAccount("password", event)}
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
      <Typography>{errors.form}</Typography>
      <FormControlLabel
        control={<Checkbox value="remember" color="primary" />}
        label="Remember me"
        sx={loginStyles.rememberBtnContainer}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={loginStyles.submit}
      >
        Sign In
      </Button>
    </form>
  )
}

export default Login