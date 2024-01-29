import React from 'react'
import dayjs from 'dayjs';
import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material'
import DialogConfirm from '../../components/infoMessage/DialogConfirm';
import LoginAlert from '../../components/loginAlert/LoginAlert';
import { useNavigate } from 'react-router-dom'
import ModalReview from '../../components/reviews/modalReview/ModalReview';
import { useAuth } from '../../context/ValidationContext';

const baseUrl = process.env.REACT_APP_BASEURL

const MyBooking = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate()

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [infoMessage, setInfoMessage] = React.useState("")
  const [booking, setBooking] = React.useState([])
  const [openReservationId, setOpenReservationId] = React.useState(null);
  const [myReservation, setMyReservation] = React.useState(true)

  const handleOpenDialog = (reservationId) => {
    setOpenReservationId(reservationId);
  };

  const handleCloseDialog = () => {
    setOpenReservationId(null);
  };

  React.useEffect(() => {
    getMyBooking()
  }, [])

  const getMyBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/my-booking`, {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const dataResponse = await response.json();

      if (response.status === 404) {
        setBooking([])
        setMyReservation(true)
        return setInfoMessage(dataResponse.message)
      }

      const formattedBookings = dataResponse?.map((booking) => ({
        ...booking,
        booking_date: dayjs(booking.booking_date).format('DD/MM/YYYY')
      }));
      setBooking(formattedBookings)
      setMyReservation(true)
    } catch (error) {
      console.error('Error al obtener las reservas:', error);
    }
  }

  const getLastsBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/my-lasts-booking`, {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const dataResponse = await response.json();

      if (response.status === 404) {
        setBooking([])
        setMyReservation(false)
        return setInfoMessage(dataResponse.message)
      }

      const formattedBookings = dataResponse.map((booking) => ({
        ...booking,
        booking_date: dayjs(booking.booking_date).format('DD/MM/YYYY')
      }));
      setBooking(formattedBookings)
      setMyReservation(false)
    } catch (error) {
      console.error('Error al obtener las reservas:', error);
    }
  }

  const canceleBooking = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/booking/${id}`, {
        method: 'delete',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      getMyBooking()
    } catch (error) {
      console.log(error)
    }
  }

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
    <>
      {!isLoggedIn ? <LoginAlert /> :
        <>
          <Stack direction="row" spacing={2} sx={{alignSelf: 'flex-start'}}>
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
          <TableContainer sx={{ borderTopLeftRadius: 0 }} component={Paper}>
            <Table sx={{ minWidth: 450, borderTopLeftRadius: 0 }} aria-label="simple table">
              <TableHead>
                {booking.length > 0 ?
                  <TableRow>
                    <TableCell align="center">Fecha</TableCell>
                    <TableCell align="center">Barbero</TableCell>
                    <TableCell align="center">Horario</TableCell>
                    <TableCell align="center">Tipo corte</TableCell>
                    <TableCell align="center">Precio</TableCell>
                    <TableCell align="center">Contacto</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  :
                  <TableRow>
                    <TableCell align="left">{infoMessage}</TableCell>
                  </TableRow>}
              </TableHead>
              <TableBody>
                {booking.length > 0 ?
                  booking.map((book) => (
                    <TableRow
                      key={book.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align="center">{book.booking_date}</TableCell>
                      <TableCell align="left">{book.barber_name} {book.barber_lastname}</TableCell>
                      <TableCell align="center">{book.booking_hour}</TableCell>
                      <TableCell align="left">{book.haircut_name}</TableCell>
                      <TableCell align="right">${book.haircut_price}</TableCell>
                      <TableCell align="center">{book.barber_phone}</TableCell>
                      <TableCell align="center">
                        {book.status === 'scheduled' ?
                          <Button
                            color="error"
                            variant='contained'
                            onClick={() => handleOpenDialog(book.id)}>Cancelar
                          </Button> :
                          book.pending ?
                            <>
                              <Button
                                variant='contained'
                                onClick={() => handleOpen(book.review_id)}>Dejar reseña
                              </Button>
                              <ModalReview review_id={book.review_id} open={open} handleClose={handleClose} />
                            </>
                            :
                            <Button
                              variant='contained'
                              onClick={
                                () => navigate(`/reviews`, {
                                  state: { 
                                    reviewId: book.review_id,
                                    previousPath: 'my-booking'
                                  }
                                })
                              }>
                              Ver reseña
                            </Button>
                        }
                      </TableCell>
                      <DialogConfirm
                        open={openReservationId === book.id}
                        handleClose={handleCloseDialog}
                        specificFuncion={() => canceleBooking(book.id)}
                        title='Cancelar reserva'
                        message={`Estas seguro que quieres cancelar la reserva para el dia ${book.booking_date} a las ${book.booking_hour}?`}></DialogConfirm>
                    </TableRow>
                  ))
                  :
                  myReservation &&
                  <TableRow>
                    <TableCell align="left">
                      <Button
                        variant='contained'
                        onClick={() => navigate("/booking")}>
                        Reservar ahora
                      </Button>
                    </TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
        </>}
    </>
  )
}

export default MyBooking