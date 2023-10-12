import React from 'react'
import { Box, Button, Divider, Typography } from '@mui/material'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SchoolIcon from '@mui/icons-material/School';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate } from 'react-router-dom'
import InfoCard from '../components/InfoCard';
import './home.css'

const Home = () => {

  /* React.useEffect(() => {
    createSchedules()
  }, [])

  const createSchedules = async () => {
    try {
      const response = await fetch(`http://localhost:8080/schedule`, {
        method: 'post',
      });
    } catch (error) {
      console.error('Error al obtener las reservas:', error);
    }
  } */

  const navigate = useNavigate()

  const scrollDown = () => {
    const section2 = document.getElementById('section2');
    const section2Position = section2.offsetTop;
    console.log(section2Position)
    window.scrollTo({
      top: section2Position - 100,
      behavior: "smooth",
    });
  };


  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Box className={'box-style'}>
        <Box className={'background-section'}>
          <Box className={'container-center-text'}>
            <Typography className={'welcome-text'}>Bienvenido a</Typography><Typography data-text="Royal Studio" className={'glitch'}>Royal Studio</Typography>
          </Box>
          <Box className={'container-text'}>
            <InfoCard
              url="https://png.pngtree.com/thumb_back/fw800/background/20230407/pngtree-the-tools-of-a-barber-on-the-desktop-in-front-of-photo-image_2344581.jpg"
              title="Herramientas de Calidad"
              text="Contamos con las mejores herramientas y productos para el cuidado y el corte de cabello. Utilizamos productos de alta calidad que aseguran resultados impecables y duraderos." />
            <InfoCard url="https://ath2.unileverservices.com/wp-content/uploads/sites/13/2023/07/03194432/corte-de-pelo-hombre-segun-rostro.jpg" title="Barberos Expertos" text="Nuestros barberos son expertos en su oficio y están capacitados para cualquier estilo y tendencia. Su pasión por la barbería se refleja en cada corte y arreglo de barba que realizan." />
            <InfoCard url="https://cdn.shopify.com/s/files/1/0601/6037/7032/files/La-luz-correcta-para-el-look-correcto-1.jpg?v=1666992320" title="Buen Ambiente" text="Nuestro lugar es más que una barbería, es un espacio acogedor donde puedes relajarte y disfrutar. Contamos con cómodos asientos, entretenimiento como una PS4 para jugar, música y un equipo de cuatro barberos listos para atenderte." />
          </Box>
          <Box className={'btn-scroll-container'}>
            <Button variant='contained' onClick={() => scrollDown()}><ArrowDownwardIcon /></Button>
          </Box>
          <Divider sx={{ backgroundColor: 'white' }} />
        </Box>
        <Box id='section2' className={'background-section'}>
          <Typography variant='h1' className='center-text'>Nuestros servicios</Typography>
          <Box className={'container-left-text'}>
            <Divider orientation="vertical" flexItem className={'vertical-divider-blue'} />
            <Typography variant='subtitle1' className={'left-text'}>
              En nuestra barbería, los cortes de pelo son una verdadera expresión de arte. Nuestros talentosos barberos dominan una amplia variedad de estilos, desde los clásicos atemporales hasta las tendencias más vanguardistas.
              Cada corte es realizado con precisión y dedicación para resaltar tus rasgos faciales y realzar tu estilo único. Además, te ofrecemos asesoramiento personalizado para encontrar el corte perfecto que se adapte a tu personalidad, tipo de cabello y preferencias.
              Déjanos cuidar de tu cabello y experimenta la confianza que proviene de lucir un corte impecable.
            </Typography>
            <Button
              variant='contained'
              endIcon={<CalendarMonthIcon />}
              className={'left-action-btn'}
              onClick={() => navigate('/booking')}>Agendar</Button>
          </Box>
          <Box className={'container-right-text'}>
            <Button
              variant='contained'
              startIcon={<SchoolIcon />}
              className={'right-action-btn'}
              onClick={() => navigate('/courses')}>Ver cursos</Button>
            <Typography variant='subtitle1' className={'right-text'}>
              También ofrecemos cursos especializados para aquellos que desean adentrarse en el mundo de la barbería profesional.
              Nuestros cursos están diseñados para enseñar las técnicas más avanzadas de corte de cabello, arreglo de barba, afeitado y mucho más.
              Con la guía experta de nuestros maestros barberos, podrás desarrollar tus habilidades y perfeccionar tu oficio.
              Ya sea que desees iniciar una nueva carrera o mejorar tus habilidades actuales, nuestros cursos te brindarán el conocimiento y la confianza para destacar en este apasionante campo.
            </Typography>
            <Divider orientation="vertical" flexItem className={'vertical-divider-red'} />
          </Box>
          <Box className={'btn-scroll-container'}>
            <Button variant='contained' onClick={() => scrollUp()} ><ArrowUpwardIcon /></Button>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Home