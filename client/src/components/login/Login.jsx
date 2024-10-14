import React from 'react';
import { loginStyles } from './login.style.js';
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '../../context/ValidationContext.jsx';
import Spinner from '../spinner/Spinner.jsx';

const baseUrl = process.env.REACT_APP_BASEURL;

const Login = () => {
  const { checkAuth } = useAuth();
  const [account, setAccount] = React.useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = React.useState({ email: '', password: '' });
  const [formError, setFormError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleAccount = (property, event) => {
    const accountCopy = { ...account };
    accountCopy[property] = event.target.value;
    setAccount(accountCopy);
    setFormError('');
  };

  const handleRemember = event => {
    setAccount({ ...account, rememberMe: event.target.checked });
  };

  const validateFields = async property => {
    const { email } = account;
    const errorMessages = {
      email: 'Formato de email invalido',
      default: 'Este campo es requerido',
    };

    if (!account[property]) {
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

    setErrors(prevErrors => ({ ...prevErrors, [property]: '' }));
  };

  const isEmailValid = email => {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
  };

  const logUser = async (email, password, rememberMe) => {
    try {
      const body = { email, password, rememberMe };

      const response = await fetch(`${baseUrl}/login`, {
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
      localStorage.setItem('userType', parseRes.userType);
      setLoading(false);
      checkAuth();
    } catch (error) {
      alert(error);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await Promise.all([validateFields('email'), validateFields('password')])
      .then(() => logUser(account.email, account.password, account.rememberMe))
      .catch(err => {
        alert(err);
        setLoading(false);
      });
  };
  return (
    <form style={loginStyles.form} onSubmit={handleSubmit}>
      {formError !== '' && (
        <Alert variant="filled" severity="error">
          {formError}
        </Alert>
      )}
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
      <Typography>{errors.form}</Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={account.rememberMe}
            onChange={handleRemember}
            color="primary"
          />
        }
        label="Recuerdame"
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
        {loading && <Spinner styles={{ marginLeft: '50px' }} />}
      </Button>
    </form>
  );
};

export default Login;
