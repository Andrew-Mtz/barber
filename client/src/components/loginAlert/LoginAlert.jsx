import React from 'react'
import { Box, Button, Paper, Typography } from '@mui/material'
import { styles } from './loginAlert.styles'
import { useNavigate } from 'react-router-dom'

const LoginAlert = () => {
  const navigate = useNavigate()

  return (
    <Paper sx={styles.container}>
      <Box sx={styles.card}>
        <Box sx={styles.header}>
          <Box sx={styles.image}>
            <svg style={styles.svg} aria-hidden="true" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" strokeLinejoin="round" strokeLinecap="round"></path>
            </svg>
          </Box>
          <Box sx={styles.content} >
            <Typography sx={styles.title}>
              Cuenta necesaria
            </Typography>
            <Typography sx={styles.message}>
              Debes tener una cuenta para ver tus reservas o para agendar un corte!
            </Typography>
          </Box>
          <Box sx={styles.actions}>
            <Button onClick={() => navigate("/account")} variant="contained">Crear cuenta</Button>
            <Button onClick={() => navigate("/")} variant="outlined">Ir al inicio</Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default LoginAlert