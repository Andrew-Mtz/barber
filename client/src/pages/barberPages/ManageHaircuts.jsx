import React from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import DialogConfirm from '../../components/infoMessage/DialogConfirm';
import Loading from '../../components/loading/Loading';
import dayjs from 'dayjs';

const baseUrl = process.env.REACT_APP_BASEURL

const ManageHaircuts = () => {
  const [infoMessage, setInfoMessage] = React.useState("")
  const [booking, setBooking] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [openReservationId, setOpenReservationId] = React.useState(null);
  const [dialogData, setDialogData] = React.useState({ title: '', message: '', fun: () => { } })

  const handleOpenDialog = (reservationId, property, booking_date, booking_hour) => {
    const dialog = {
      complete: {
        title: "Confirmar reserva",
        message: `Estas seguro que quieres completar la reserva para el dia ${booking_date} a las ${booking_hour}?`,
        fun: completeBooking
      },
      cancel: {
        title: "Cancelar reserva",
        message: `Estas seguro que quieres cancelar la reserva para el dia ${booking_date} a las ${booking_hour}?`,
        fun: canceleBooking
      },
      notCome: {
        title: "Finalizar reserva",
        message: `Estas seguro que quieres finalizar la reserva para el dia ${booking_date} a las ${booking_hour}?`,
        fun: finaliceBooking
      },
    };
    if (property === "complete") setDialogData(dialog.complete);
    if (property === "cancel") setDialogData(dialog.cancel);
    if (property === "notCome") setDialogData(dialog.notCome);
    setOpenReservationId(reservationId);
  };

  const handleCloseDialog = () => {
    setOpenReservationId(null);
  };

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
    } catch (error) {
      console.log(error)
    }
  }

  const completeBooking = async (id) => {
    try {
      const token = localStorage.getItem('token');
      console.log('complete')
    } catch (error) {
      console.log(error)
    }
  }

  const finaliceBooking = async (id) => {
    try {
      const token = localStorage.getItem('token');
      console.log('finalice')
    } catch (error) {
      console.log(error)
    }
  }

  const getBookingsByDay = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/bookings`, {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const dataResponse = await response.json();
      console.log(dataResponse)

      if (response.status === 404) {
        setBooking([])
        return setInfoMessage(dataResponse.message)
      }

      const formattedBookings = dataResponse.map((booking) => ({
        ...booking,
        booking_date: dayjs(booking.booking_date).format('DD/MM/YYYY')
      }));
      setBooking(formattedBookings)
      setLoading(true)
    } catch (error) {
      console.error('Error al obtener las reservas:', error);
    }
  }

  React.useEffect(() => {
    getBookingsByDay()
  }, [])

  return (
    <Box component='section' className="cp-section">
      <Box className='cp-section-top'>
        <Typography className='title'>hola</Typography>
      </Box>
      <Box>
        <TableContainer sx={{ borderTopLeftRadius: 0 }} component={Paper}>
          <Table sx={{ minWidth: 450, borderTopLeftRadius: 0 }} aria-label="simple table">
            <TableHead>
              {booking.length > 0 ?
                <TableRow>
                  <TableCell align="center">Horario</TableCell>
                  <TableCell align="center">Cliente</TableCell>
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
              {loading ?
                booking.map((book) => (
                  <TableRow
                    key={book.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="center">{book.booking_hour}</TableCell>
                    <TableCell align="left">{book.user_name} {book.user_lastname}</TableCell>
                    <TableCell align="left">{book.haircut_name}</TableCell>
                    <TableCell align="right">${book.haircut_price}</TableCell>
                    <TableCell align="center">{book.user_phone ? book.user_phone : 'No tiene'}</TableCell>
                    <TableCell align="center">
                      {book.status === 'scheduled' && <>
                        <Button
                          sx={{ mr: 2 }}
                          variant='contained'
                          onClick={() => handleOpenDialog(book.id, 'complete', book.booking_date, book.booking_hour)}>Completar
                        </Button>
                        <Button
                          sx={{ mr: 2 }}
                          color="warning"
                          variant='contained'
                          onClick={() => handleOpenDialog(book.id, 'notCome', book.booking_date, book.booking_hour)}>No vino
                        </Button>
                        <Button
                          color="error"
                          variant='contained'
                          onClick={() => handleOpenDialog(book.id, 'cancel', book.booking_date, book.booking_hour)}>Cancelar
                        </Button>
                      </>}
                      {book.status === 'completed' && 'Realizado'}
                      {book.status === 'notCome' && 'No se presento'}
                    </TableCell>
                    <DialogConfirm
                      open={openReservationId === book.id}
                      handleClose={handleCloseDialog}
                      specificFuncion={() => dialogData.fun()}
                      title={dialogData.title}
                      message={dialogData.message}></DialogConfirm>
                  </TableRow>
                ))
                :
                <TableRow>
                  <TableCell align="left">
                    <Loading />
                  </TableCell>
                </TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}

export default ManageHaircuts