//iconos
import GroupsIcon from '@mui/icons-material/Groups';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import JoinInnerIcon from '@mui/icons-material/JoinInner';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import MailIcon from '@mui/icons-material/Mail';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

//components
import Barbers from '../../components/adminComponents/barbers/Barbers.jsx';
import Haircuts from '../../components/adminComponents/haircuts/Haircuts.jsx';
import LinkBarberAndHaircut from '../../components/adminComponents/linkBandH/LinkBarber&Haircut.jsx';
import Schedules from '../../components/adminComponents/schedules/Schedules.jsx';
import Emails from '../../components/adminComponents/Emails.jsx';
import Income from '../../components/adminComponents/income/Income.jsx';


export const cpMenu = [
  {
    "title": "Administrar barberos",
    "icon": GroupsIcon
  },
  {
    "title": "Administrar cortes",
    "icon": ContentCutIcon
  },
  {
    "title": "Vincular barberos con cortes",
    "icon": JoinInnerIcon
  },
  {
    "title": "Administrar horarios",
    "icon": EditCalendarIcon
  },
  {
    "title": "Enviar correos",
    "icon": MailIcon
  },
  {
    "title": "Ver ingresos",
    "icon": MonetizationOnIcon
  }
]

export const cpBody = [
  {
    "title": "Administrar barberos",
    "component": Barbers
  },
  {
    "title": "Administrar cortes",
    "component": Haircuts
  },
  {
    "title": "Vincular barberos con cortes",
    "component": LinkBarberAndHaircut
  },
  {
    "title": "Administrar horarios",
    "component": Schedules
  },
  {
    "title": "Enviar correos",
    "component": Emails
  },
  {
    "title": "Ver ingresos",
    "component": Income
  }
]