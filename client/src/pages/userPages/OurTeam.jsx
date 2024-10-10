import React from 'react'
import BarbersFull from '../../components/barbers/fullDataList/BarbersFull';
import Loading from '../../components/loading/Loading';

const baseUrl = process.env.REACT_APP_BASEURL

const OurTeam = () => {
  const [barbers, setBarbers] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

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
      const data = await response.json();
      if (data.error !== '') {
        setBarbers(data.response)
        return
      }
      setBarbers(data.response);
      setLoading(true)
    } catch (error) {
      console.error('Error al obtener los barberos:', error);
    }
  }
  return (
    <>
      {loading ? <BarbersFull barbers={barbers} /> : <Loading />}
    </>
  )
}

export default OurTeam