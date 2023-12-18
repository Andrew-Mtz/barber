import { Paper } from '@mui/material'
import React from 'react'
import ContactForm from '../components/contact/ContactForm'


const Contact = ({ isLoggedIn }) => {

  const containerForm = {
    backgroundColor: 'transparent',
    height: '80vh',
  }

  return (
    <Paper sx={containerForm}>
      <ContactForm />
    </Paper>
  )
}

export default Contact