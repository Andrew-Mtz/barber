import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React from 'react'
import ModalReview from '../reviews/modalReview/ModalReview'
import DialogConfirm from '../infoMessage/DialogConfirm'
import { useNavigate } from 'react-router-dom'
import Loading from '../loading/Loading'

const baseUrl = process.env.REACT_APP_BASEURL

const BookingTable = ({ booking, infoMessage, myReservation, loading }) => {
  const navigate = useNavigate()

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openReservationId, setOpenReservationId] = React.useState(null);

  const handleOpenDialog = (reservationId) => {
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

  return (
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
          {!loading ? booking.length > 0 ?
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
            :
            <TableRow>
              <TableCell align="left">
                <Loading />
              </TableCell>
            </TableRow>}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default BookingTable