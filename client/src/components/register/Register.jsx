import React from 'react';
import { registerStyles } from './register.style.js';
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
} from '@mui/material';
import { useAuth } from '../../context/ValidationContext.jsx';
import Spinner from '../spinner/Spinner.jsx';

const baseUrl = process.env.REACT_APP_BASEURL;

const Register = () => {
  const { checkAuth } = useAuth();
  const [account, setAccount] = React.useState({
    name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
    acceptNotifications: false,
    rememberMe: false,
  });
  const [errors, setErrors] = React.useState({
    name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
  });
  const [formError, setFormError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleAccount = (property, event) => {
    const accountCopy = { ...account };
    accountCopy[property] = event.target.value;
    setAccount(accountCopy);
    setFormError('');
  };

  const handleAcceptNotification = event => {
    setAccount({ ...account, acceptNotifications: event.target.checked });
  };

  const handleRemember = event => {
    setAccount({ ...account, rememberMe: event.target.checked });
  };

  const validateFields = async property => {
    const { email, phone } = account;
    const errorMessages = {
      email: 'Formato de email invalido',
      phone: 'Formato de número celular invalido',
      default: 'Este campo es requerido',
    };

    if (property !== 'phone' && !account[property]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [property]: errorMessages.default,
      }));
      throw errorMessages.default;
    }

    if (property === 'email' && email && !isEmailValid(email)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [property]: errorMessages.email,
      }));
      throw errorMessages.email;
    }

    if (property === 'phone' && phone && !isPhoneValid(phone)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [property]: errorMessages.phone,
      }));
      throw errorMessages.phone;
    }

    setErrors(prevErrors => ({ ...prevErrors, [property]: '' }));
  };

  const isEmailValid = email => {
    return /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  };

  const isPhoneValid = phone => {
    return /^[0-9]{9}$/.test(phone);
  };

  const registerUser = async (
    name,
    last_name,
    phone,
    email,
    password,
    acceptNotifications,
    rememberMe,
  ) => {
    try {
      const body = {
        name,
        last_name,
        phone,
        email,
        password,
        acceptNotifications,
        rememberMe,
      };

      const response = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      });
      const parseRes = await response.json();
      if (response.status === 409) {
        setLoading(false);
        return setFormError(parseRes);
      }
      localStorage.setItem('token', parseRes.token);
      setLoading(false);
      checkAuth();
    } catch (error) {
      alert(error);
    }
  };

  const handleSubmit = async e => {
    setLoading(true);
    e.preventDefault();
    await Promise.all([
      validateFields('name'),
      validateFields('last_name'),
      validateFields('phone'),
      validateFields('email'),
      validateFields('password'),
    ])
      .then(() =>
        registerUser(
          account.name,
          account.last_name,
          account.phone,
          account.email,
          account.password,
          account.acceptNotifications,
          account.remember,
        ),
      )
      .catch(err => {
        alert(err);
        setLoading(false);
      });
  };
  return (
    <form style={registerStyles.form} onSubmit={handleSubmit}>
      {formError !== '' && (
        <Alert variant="filled" severity="error">
          {formError}
        </Alert>
      )}
      <Stack direction="row" gap={3}>
        <TextField
          onChange={event => handleAccount('name', event)}
          onBlur={() => validateFields('name').catch(() => {})}
          variant="outlined"
          margin="normal"
          fullWidth
          id="name"
          label="Name*"
          name="name"
          type="text"
          helperText={errors.name}
          error={!!errors.name}
          autoComplete="given-name"
        />
        <TextField
          onChange={event => handleAccount('last_name', event)}
          onBlur={() => validateFields('last_name').catch(() => {})}
          variant="outlined"
          margin="normal"
          fullWidth
          id="last_name"
          label="Last name*"
          name="last_name"
          type="text"
          helperText={errors.last_name}
          error={!!errors.last_name}
          autoComplete="family-name"
        />
      </Stack>
      <TextField
        onChange={event => handleAccount('phone', event)}
        onBlur={() => validateFields('phone').catch(() => {})}
        variant="outlined"
        margin="normal"
        fullWidth
        id="phone"
        label="Phone"
        name="phone"
        type="tel"
        helperText={errors.phone}
        error={!!errors.phone}
        autoComplete="tel-national"
      />
      <TextField
        onChange={event => handleAccount('email', event)}
        onBlur={() => validateFields('email').catch(() => {})}
        variant="outlined"
        margin="normal"
        fullWidth
        id="email"
        label="Email*"
        name="email"
        type="email"
        helperText={errors.email}
        error={!!errors.email}
        autoComplete="email"
      />
      <TextField
        onChange={event => handleAccount('password', event)}
        onBlur={() => validateFields('password').catch(() => {})}
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
          control={
            <Checkbox
              checked={account.acceptNotifications}
              onChange={handleAcceptNotification}
              value="acceptNotification"
              color="primary"
            />
          }
          label="Acepto recibir correos con recordatorios y novedades"
          sx={registerStyles.rememberBtnContainer}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={account.rememberMe}
              onChange={handleRemember}
              color="primary"
            />
          }
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
        {loading && <Spinner styles={{ marginLeft: '50px' }} />}
      </Button>
    </form>
  );
};

export default Register;
