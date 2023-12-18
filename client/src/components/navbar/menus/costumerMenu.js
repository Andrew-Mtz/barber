import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventNoteIcon from '@mui/icons-material/EventNote';
import GroupIcon from '@mui/icons-material/Group';
import EmailIcon from '@mui/icons-material/Email';
import ReviewsIcon from '@mui/icons-material/Reviews';

export const costumerMenu = [
  {
    "title": "Inicio",
    "icon": HomeIcon,
    "link": "/"
  },
  {
    "title": "Reservar",
    "icon": CalendarMonthIcon,
    "link": "/booking"
  },
  {
    "title": "Mi reserva",
    "icon": EventNoteIcon,
    "link": "/my-booking"
  },
  {
    "title": "Nuestro equipo",
    "icon": GroupIcon,
    "link": "/our-team"
  },
  {
    "title": "Reseñas",
    "icon": ReviewsIcon,
    "link": "/reviews"
  },
  {
    "title": "Contacto",
    "icon": EmailIcon,
    "link": "/contact"
  },
  {
    "title": "Cuenta",
    "icon": AccountCircleIcon,
    "link": "/account"
  },
]