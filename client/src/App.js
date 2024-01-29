import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

//All
import Navbar from './components/navbar/Navbar'
import Home from './pages/home/Home'
import Account from './pages/account/Account'

//User
import Booking from './pages/userPages/booking/Booking'
import MyBooking from './pages/userPages/MyBooking'
import OurTeam from './pages/userPages/OurTeam'
import Contact from './pages/userPages/Contact'
import Reviews from './pages/userPages/reviews/Reviews'

//Admin
import ManagePage from './pages/adminPages/ManagePage'
import { useAuth } from './context/ValidationContext.jsx'
import { Container } from '@mui/material'

const App = () => {
  const { isAdmin, isBarber } = useAuth();

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: '15vh',
    width: '100%',
    overflow: 'hidden'
  }

  return (
    <BrowserRouter>
      <Navbar isAdmin={isAdmin} isBarber={isBarber} />
      <Container sx={containerStyle}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/booking' element={<Booking />} />
          <Route path='/my-booking' element={<MyBooking />} />
          <Route path='/our-team' element={<OurTeam />} />
          <Route path='/our-team/barber/:id' element={<OurTeam />} />
          <Route path='/reviews' element={<Reviews />} />
          <Route path='/contact' element={<Contact />} />
          {isAdmin ? (
            <>
              <Route path='/manage-page' element={<ManagePage />} />
              <Route path='/*' element={<Navigate to='/manage-page' />} />
            </>
          ) : (
            <>
              <Route path='/manage-page' element={<Navigate to='/' />} />
              <Route path='/account' element={<Account />} />
            </>
          )}
        </Routes>
      </Container>

    </BrowserRouter>
  )
}

export default App