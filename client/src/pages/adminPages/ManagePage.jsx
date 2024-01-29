import React from 'react';
import { cpBody, cpMenu } from './cpMenu';
import LogoutIcon from '@mui/icons-material/Logout';
import './managePage.css';
import { Box, Typography } from '@mui/material';

const ManagePage = () => {
  const [secTitle, setSecTitle] = React.useState("Administrar barberos")

  const logOut = () => {
    localStorage.removeItem("token")
    window.location.reload()
  }

  return (
    <Box className='container-control-panel'>
      <nav>
        <Box className="logo-name">
          <Typography component='span' className="logo_name">Panel administrador</Typography>
        </Box>
        <Box className="menu-items">
          <ul className="nav-links">
            {cpMenu.map((item, index) => (
              <li key={index} onClick={() => setSecTitle(item.title)}>
                <Typography>
                  <item.icon className={`icon ${secTitle === item.title && 'active'}`} />
                  <Typography component='span' className={`link-name ${secTitle === item.title && 'active'}`}>{item.title}</Typography>
                </Typography>
              </li>
            ))}
          </ul>
          <ul className="logout-mode">
            <li onClick={logOut}>
              <Typography>
                <LogoutIcon className='icon exit-icon' />
                <Typography component='span' className="link-name">Cerrar sesion</Typography>
              </Typography>
            </li>
          </ul>
        </Box>
      </nav>
      <Box component='section' className="cp-section">
        <Box className='cp-section-top'>
          <Typography className='title'>{secTitle}</Typography>
        </Box>
        {cpBody?.map((item, index) => (
          <Box key={index}>
            {item.title === secTitle && <item.component />}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default ManagePage