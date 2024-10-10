import React from 'react'
import { Box, Button, Stack } from '@mui/material'
import dayjs from 'dayjs';

const baseUrl = process.env.REACT_APP_BASEURL

const StackButtons = ({ setBooking, setInfoMessage, setMyReservation, myReservation, setLoading }) => {
  const getLastsBooking = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/my-lasts-booking`, {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const data = await response.json();

      if (data.error !== '') {
        setBooking(data.response)
        setMyReservation(false)
        setLoading(false)
        return setInfoMessage(data.error)
      }

      const formattedBookings = data.response?.map((booking) => ({
        ...booking,
        booking_date: dayjs(booking.booking_date).format('DD/MM/YYYY')
      }));
      setBooking(formattedBookings)
      setMyReservation(false)
      setLoading(false)
    } catch (error) {
      console.error('Error al obtener las reservas:', error);
    }
  }

  const getMyBooking = React.useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/my-booking`, {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const data = await response.json();

      if (data.error !== '') {
        setBooking(data.response)
        setMyReservation(true)
        setLoading(false)
        return setInfoMessage(data.error)
      }
      const formattedBookings = data.response?.map((booking) => ({
        ...booking,
        booking_date: dayjs(booking.booking_date).format('DD/MM/YYYY')
      }));
      setBooking(formattedBookings)
      setMyReservation(true)
      setLoading(false)
    } catch (error) {
      console.error('Error al obtener las reservas:', error);
    }
  }, [setBooking, setInfoMessage, setLoading, setMyReservation])

  React.useEffect(() => {
    getMyBooking()
  }, [getMyBooking])

  const buttonStyles = {
    btnActive: {
      backgroundColor: myReservation ? '#fff' : '#878787',
      color: !myReservation && '#fff',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      width: '200px',
      '&:hover': {
        backgroundColor: myReservation ? '#fff' : 'rgba(25, 118, 210, 0.04)', // Establece el mismo color de fondo en hover
      },
      '@media (max-width: 425px)': {
        width: 'auto'
      }
    },
    btnInactive: {
      backgroundColor: !myReservation ? '#fff' : '#878787',
      color: myReservation && '#fff',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      width: '200px',
      '&:hover': {
        backgroundColor: !myReservation ? '#fff' : 'rgba(25, 118, 210, 0.04)', // Establece el mismo color de fondo en hover
      },
      '@media (max-width: 425px)': {
        width: 'auto'
      }
    }
  };

  return (
    <Stack direction="row" spacing={2} sx={{ alignSelf: 'flex-start' }}>
      <Box>
        <Button
          sx={buttonStyles.btnActive}
          onClick={() => getMyBooking()}>
          Mi reserva
        </Button>
      </Box>
      <Box>
        <Button
          sx={buttonStyles.btnInactive}
          onClick={() => getLastsBooking()}>
          Reservas pasadas
        </Button>
      </Box>
    </Stack>
  )
}

export default StackButtons