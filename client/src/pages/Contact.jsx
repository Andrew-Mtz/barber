import { Paper } from '@mui/material'
import React from 'react'
import ContactForm from '../components/contact/ContactForm'


const Contact = ({ isLoggedIn }) => {

const containerForm = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  backgroundColor: 'transparent',
  borderRadius: '10px',
}

  return (
    <Paper sx={containerForm}>
      <ContactForm />
    </Paper>
  )
}

export default Contact