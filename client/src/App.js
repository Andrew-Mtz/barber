import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Booking from './pages/booking/Booking'
import MyBooking from './pages/MyBooking'
import Courses from './pages/Courses'
import OurTeam from './pages/OurTeam'
import Contact from './pages/Contact'
import Account from './pages/account/Account'
import { Container } from '@mui/material'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const checkToken = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/is-verify`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const dataResponse = await response.json();
      if (dataResponse === true) return setIsLoggedIn(true)
      setIsLoggedIn(false)
    } catch (error) {
      console.log(error)
    }
  }

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      checkToken();
    } else {
      setIsLoggedIn(false);
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

  return (
    <BrowserRouter>
      <Navbar />
      <Container sx={{ marginTop: 20, width: 'fit-content' }}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/booking' element={<Booking isLoggedIn={isLoggedIn} />} />
          <Route path='/my-booking' element={<MyBooking isLoggedIn={isLoggedIn} />} />
          <Route path='/courses' element={<Courses isLoggedIn={isLoggedIn} />} />
          <Route path='/our-team' element={<OurTeam />} />
          <Route path='/contact' element={<Contact isLoggedIn={isLoggedIn} />} />
          <Route path='/account' element={<Account isLoggedIn={isLoggedIn} checkAuth={checkAuth} />} />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}

export default App