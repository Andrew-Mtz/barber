import React from 'react'
import BarbersCarousel from '../components/barbers/carousel/BarbersCarousel ';

const baseUrl = 'http://localhost:8080'; //http://localhost:8080
const headers = new Headers();
headers.append('ngrok-skip-browser-warning', 'true');

const OurTeam = () => {
  const [barbers, setBarbers] = React.useState(null)

  React.useEffect(() => {
    getBarbers()
  }, [])

  const getBarbers = async () => {
    try {
      const response = await fetch(`${baseUrl}/barber`, {
        method: 'get',
        headers: headers
      });
      if (response.status === 404) {
        setBarbers(response.statusText)
        return
      }
      const data = await response.json();
      console.log(data)
      setBarbers(data);
    } catch (error) {
      console.error('Error al obtener los barberos:', error);
    }
  }
  return (
    <>
      <BarbersCarousel barbers={barbers} />
    </>
  )
}

export default OurTeam