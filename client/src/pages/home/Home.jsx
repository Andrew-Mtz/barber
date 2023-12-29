import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Divider, Typography } from '@mui/material'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SchoolIcon from '@mui/icons-material/School';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InfoCard from '../../components/InfoCard';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './home.css'
gsap.registerPlugin(ScrollTrigger);

const Home = () => {

  React.useEffect(() => {
    const infoCardsAnimation = gsap.fromTo('.container-text', { scale: 0.5, opacity: 0 }, {
      scale: 1,
      opacity: 1,
      duration: 5,
      scrollTrigger: {
        trigger: '.container-text',
        toggleActions: 'restart play reverse play',
        start: '-250px center',
        end: 'top center',
        scrub: 2
      }
    });
    const welcomeTextAnimation = gsap.fromTo('.welcome-text', { x: 0, opacity: 1 }, {
      x: -300, opacity: 0, scrollTrigger: {
        toggleActions: 'restart play reverse play',
        start: '20% center',
        end: '30% center',
        scrub: true,
      }
    });
    const glitchTextAnimation = gsap.fromTo('.glitch', { x: 0 }, {
      x: '-50%', y: '50%', scrollTrigger: {
        toggleActions: 'restart play reverse play',
        start: '20% center',
        end: '35% center',
        scrub: true,
      }
    });
    const leftText = gsap.fromTo('.divider-and-text', { x: '-100%', opacity: 0 }, {
      x: 0, opacity: 1, scrollTrigger: {
        toggleActions: 'restart play reverse play',
        start: '75% 90%',
        end: '85% 90%',
        scrub: 2,
      }
    });
    const leftBtn = gsap.fromTo('.left-action-btn', { x: '200%', opacity: 0 }, {
      x: 0, opacity: 1, scrollTrigger: {
        toggleActions: 'restart play reverse play',
        start: '75% 90%',
        end: '85% 90%',
        scrub: 2,
      }
    });
    const rightText = gsap.fromTo('.text-and-divider', { x: '100%', opacity: 0 }, {
      x: 0, opacity: 1, scrollTrigger: {
        toggleActions: 'restart play reverse play',
        start: '85% 90%',
        end: '95% 90%',
        scrub: 2,
      }
    });
    const rightBtn = gsap.fromTo('.right-action-btn', { x: '-200%', opacity: 0 }, {
      x: 0, opacity: 1, scrollTrigger: {
        toggleActions: 'restart play reverse play',
        start: '85% 90%',
        end: '95% 90%',
        scrub: 2,
      }
    });
    if (window.innerWidth < 768) {
      infoCardsAnimation.kill()
      welcomeTextAnimation.kill()
      glitchTextAnimation.kill()
      leftText.kill()
      leftBtn.kill()
      rightText.kill()
      rightBtn.kill()
      gsap.fromTo('.container-text', { scale: 0.3, opacity: 0 }, {
        scale: 0.8,
        opacity: 1,
        duration: 5,
        scrollTrigger: {
          trigger: '.container-text',
          toggleActions: 'restart play reverse play',
          start: '-450px 60%',
          end: 'top 60%',
          scrub: 2
        }
      })
      gsap.fromTo('.welcome-text', { opacity: 1 }, {
        y: -300, opacity: 0, scrollTrigger: {
          toggleActions: 'restart play reverse play',
          start: '10% 40%',
          end: '25% 40%',
          scrub: 2,
        }
      });
      gsap.fromTo('.glitch', { y: '-90%' }, {
        y: '50%', scrollTrigger: {
          toggleActions: 'restart play reverse play',
          start: '10% 40%',
          end: '25% 40%',
          scrub: 2,
        }
      });
      gsap.fromTo('.divider-and-text', { x: '-50%', opacity: 0 }, {
        x: 0, opacity: 1, scrollTrigger: {
          toggleActions: 'restart play reverse play',
          start: '65% 90%',
          end: '75% 90%',
          scrub: 2,
        }
      });
      gsap.fromTo('.left-action-btn', { x: '50%', opacity: 0 }, {
        x: 0, opacity: 1, scrollTrigger: {
          toggleActions: 'restart play reverse play',
          start: '65% 90%',
          end: '75% 90%',
          scrub: 2,
        }
      });
      gsap.fromTo('.text-and-divider', { x: '50%', opacity: 0 }, {
        x: 0, opacity: 1, scrollTrigger: {
          toggleActions: 'restart play reverse play',
          start: '85% 90%',
          end: '90% 90%',
          scrub: 2,
        }
      });
      gsap.fromTo('.right-action-btn', { x: '-50%', opacity: 0 }, {
        x: 0, opacity: 1, scrollTrigger: {
          toggleActions: 'restart play reverse play',
          start: '85% 90%',
          end: '95% 90%',
          scrub: 2,
        }
      });
    }
  }, []);

  const navigate = useNavigate()

  const scrollDown = () => {
    const section2 = document.getElementById('section2');
    const section2Position = section2.offsetTop;
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
            <Box className={'divider-and-text'}>
              <Divider orientation="vertical" flexItem className={'vertical-divider-blue'} />
              <Typography variant='subtitle1' className={'left-text'}>
                En nuestra barbería, los cortes de pelo son una verdadera expresión de arte. Nuestros talentosos barberos dominan una amplia variedad de estilos, desde los clásicos atemporales hasta las tendencias más vanguardistas.
                Cada corte es realizado con precisión y dedicación para resaltar tus rasgos faciales y realzar tu estilo único. Además, te ofrecemos asesoramiento personalizado para encontrar el corte perfecto que se adapte a tu personalidad, tipo de cabello y preferencias.
                Déjanos cuidar de tu cabello y experimenta la confianza que proviene de lucir un corte impecable.
              </Typography>
            </Box>
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
            <Box className={'text-and-divider'}>
              <Typography variant='subtitle1' className={'right-text'}>
                También ofrecemos cursos especializados para aquellos que desean adentrarse en el mundo de la barbería profesional.
                Nuestros cursos están diseñados para enseñar las técnicas más avanzadas de corte de cabello, arreglo de barba, afeitado y mucho más.
                Con la guía experta de nuestros maestros barberos, podrás desarrollar tus habilidades y perfeccionar tu oficio.
                Ya sea que desees iniciar una nueva carrera o mejorar tus habilidades actuales, nuestros cursos te brindarán el conocimiento y la confianza para destacar en este apasionante campo.
              </Typography>
              <Divider orientation="vertical" flexItem className={'vertical-divider-red'} />
            </Box>
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