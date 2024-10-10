import React from 'react'
import LoginAlert from '../../components/loginAlert/LoginAlert';
import { useAuth } from '../../context/ValidationContext';
import StackButtons from '../../components/myBooking/StackButtons';
import BookingTable from '../../components/myBooking/Table';

const MyBooking = () => {
  const { isLoggedIn } = useAuth();

  const [infoMessage, setInfoMessage] = React.useState("")
  const [booking, setBooking] = React.useState([])
  const [myReservation, setMyReservation] = React.useState(true)
  const [loading, setLoading] = React.useState(false)

  return (
    <>
      {!isLoggedIn ? <LoginAlert /> :
        <>
          <StackButtons setBooking={setBooking} setInfoMessage={setInfoMessage} myReservation={myReservation} setMyReservation={setMyReservation} setLoading={setLoading} />
          <BookingTable booking={booking} infoMessage={infoMessage} myReservation={myReservation} loading={loading} />
        </>
      }
    </>
  )
}

export default MyBooking