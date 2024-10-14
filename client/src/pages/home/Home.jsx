import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Divider, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CommentIcon from '@mui/icons-material/Comment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InfoCard from '../../components/InfoCard';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { text, animations } from './homeUtils';
import './home.css';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  React.useEffect(() => {
    // Detectar si estás en un dispositivo de escritorio o móvil (puedes usar cualquier lógica que desees)
    const isMobile = window.innerWidth < 768; // Puedes ajustar este valor según tus necesidades

    // Seleccionar las animaciones según el dispositivo
    const selectedAnimations = isMobile
      ? animations.toMobile
      : animations.toDesktop;

    // Ejecutar las animaciones
    Object.values(selectedAnimations).forEach(animation => {
      gsap.fromTo(animation.target, animation.from, animation.to);
    });
  }, []);

  const navigate = useNavigate();

  const scrollDown = () => {
    const section2 = document.getElementById('section2');
    const section2Position = section2.offsetTop;
    window.scrollTo({
      top: section2Position - 100,
      behavior: 'smooth',
    });
  };

  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <Box className={'box-style'}>
        <Box className={'background-section'}>
          <Box className={'container-center-text'}>
            <Typography className={'welcome-text'}>
              {text.royalStudio.firstPartTitle}
            </Typography>
            <Typography data-text="Royal Studio" className={'glitch'}>
              {text.royalStudio.secondPartTitle}
            </Typography>
          </Box>
          <Box className={'container-text'}>
            <InfoCard
              url={text.royalStudio.infoCards.first.url}
              title={text.royalStudio.infoCards.first.title}
              text={text.royalStudio.infoCards.first.desc}
            />
            <InfoCard
              url={text.royalStudio.infoCards.second.url}
              title={text.royalStudio.infoCards.second.title}
              text={text.royalStudio.infoCards.second.desc}
            />
            <InfoCard
              url={text.royalStudio.infoCards.third.url}
              title={text.royalStudio.infoCards.third.title}
              text={text.royalStudio.infoCards.third.desc}
            />
          </Box>
          <Box className={'btn-scroll-container'}>
            <Button variant="contained" onClick={() => scrollDown()}>
              <ArrowDownwardIcon />
            </Button>
          </Box>
          <Divider sx={{ backgroundColor: 'white' }} />
        </Box>
        <Box id="section2" className={'background-section'}>
          <Typography variant="h1" component="h2" className="center-text">
            {text.ourServices.title}
          </Typography>
          <Box className={'container-left-text'}>
            <Box className={'divider-and-text'}>
              <Divider
                orientation="vertical"
                flexItem
                className={'vertical-divider-blue'}
              />
              <Typography
                variant="subtitle1"
                component="p"
                className={'left-text'}
              >
                {text.ourServices.book.paragraph}
              </Typography>
            </Box>
            <Button
              variant="contained"
              endIcon={<CalendarMonthIcon />}
              className={'left-action-btn'}
              onClick={() => navigate('/booking')}
            >
              {text.ourServices.book.btnText}
            </Button>
          </Box>
          <Box className={'container-right-text'}>
            <Button
              variant="contained"
              startIcon={<CommentIcon />}
              className={'right-action-btn'}
              onClick={() => navigate('/reviews')}
            >
              {text.ourServices.comments.btnText}
            </Button>
            <Box className={'text-and-divider'}>
              <Typography
                variant="subtitle1"
                component="p"
                className={'right-text'}
              >
                {text.ourServices.comments.paragraph}
              </Typography>
              <Divider
                orientation="vertical"
                flexItem
                className={'vertical-divider-red'}
              />
            </Box>
          </Box>
          <Box className={'btn-scroll-container'}>
            <Button variant="contained" onClick={() => scrollUp()}>
              <ArrowUpwardIcon />
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;
