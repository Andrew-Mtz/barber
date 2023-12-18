import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Container } from '@mui/material'
import Navbar from './components/navbar/Navbar'
import Home from './pages/Home'
import Booking from './pages/booking/Booking'
import MyBooking from './pages/MyBooking'
import OurTeam from './pages/OurTeam'
import Contact from './pages/Contact'
import Account from './pages/account/Account'
import ManageHaircuts from './pages/ManageHaircuts'
import Reviews from './pages/reviews/Reviews'

const baseUrl = process.env.REACT_APP_BASEURL

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isBarber, setIsBarber] = React.useState(false);
  const startHour = '11:00';
  const endHour = '11:00';

  const checkToken = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/is-verify`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const dataResponse = await response.json();
      if (dataResponse === true) return setIsLoggedIn(true)
      setIsLoggedIn(false);
      setIsAdmin(false)
      setIsBarber(false)
    } catch (error) {
      console.log(error)
    }
  }

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    if (token) {
      setIsLoggedIn(true);
      checkToken();
      if (userType === "barber") {
        setIsBarber(true)
      } else if (userType === "admin") {
        setIsAdmin(true)
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false)
      setIsBarber(false)
    }
  }

  React.useEffect(() => {
    checkAuth()
    const handleFocus = () => {
      checkToken(); // Comprobar si el token ha expirado mientras el usuario estaba ausente
    };
    window.addEventListener('focus', handleFocus);

    // Cleanup: Remover el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  /*   React.useEffect(() => {
      createSchedules(startHour, endHour)
    }, [])
  
    const createSchedules = async (startHour, endHour) => {
      try {
        const response = await fetch(`${baseUrl}/schedule?startHour=${startHour}&endHour=${endHour}`, {
          method: 'post',
        });
      } catch (error) {
        console.error('Error al obtener las reservas:', error);
      }
    } */

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
          <Route path='/booking' element={<Booking isLoggedIn={isLoggedIn} />} />
          <Route path='/my-booking' element={<MyBooking isLoggedIn={isLoggedIn} />} />
          <Route path='/our-team' element={<OurTeam />} />
          <Route path='/our-team/barber/:id' element={<OurTeam />} />
          <Route path='/reviews' element={<Reviews />} />
          <Route path='/contact' element={<Contact isLoggedIn={isLoggedIn} />} />
          <Route path='/account' element={<Account isLoggedIn={isLoggedIn} checkAuth={checkAuth} />} />
          <Route path='/manage-haircuts' element={<ManageHaircuts isLoggedIn={isLoggedIn} isBarber={isBarber} checkAuth={checkAuth} />} />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}

export default App