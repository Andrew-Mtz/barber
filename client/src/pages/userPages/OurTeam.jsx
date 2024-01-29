import React from 'react'
import BarbersFull from '../../components/barbers/fullDataList/BarbersFull';

const baseUrl = process.env.REACT_APP_BASEURL

const OurTeam = () => {
  const [barbers, setBarbers] = React.useState(null)

  React.useEffect(() => {
    getBarbers()
  }, [])

  const getBarbers = async () => {
    try {
      const response = await fetch(`${baseUrl}/barber`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (response.status === 404) {
        setBarbers(response.statusText)
        return
      }
      const data = await response.json();
      setBarbers(data);
    } catch (error) {
      console.error('Error al obtener los barberos:', error);
    }
  }
  return (
    <>
      <BarbersFull barbers={barbers} />
    </>
  )
}

export default OurTeam