import React from 'react'
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Box from '@mui/material/Box';
import BarberItem from './BarberItem'; // Importa tu componente BarberCard


const BarbersCarousel = ({ barbers }) => {
  const [selectedBarber, setSelectedBarber] = React.useState(null);
  const [carouselStopped, setCarouselStopped] = React.useState(false);

  const toggleExpanded = (barber) => {
    setSelectedBarber(barber === selectedBarber ? null : barber);
    setCarouselStopped(!!barber); // Detener el carrusel si un elemento está expandido
  };
  return (
    <Box>
      <Carousel showThumbs={false} autoPlay={!carouselStopped} infiniteLoop>
        {barbers?.map((barber) => (
          <BarberItem key={barber.id}
            barber={barber}
            expanded={barber === selectedBarber}
            toggleExpanded={() => toggleExpanded(barber)}
          />
        ))}
      </Carousel>
    </Box>
  );
};

export default BarbersCarousel 