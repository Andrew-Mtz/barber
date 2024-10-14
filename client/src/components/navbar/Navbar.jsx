import React from 'react';
import {
  AppBar,
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { costumerMenu } from './menus/costumerMenu';
import { barberMenu } from './menus/barberMenu';
import { adminMenu } from './menus/adminMenu';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/ValidationContext';

const Navbar = () => {
  const { isAdmin, isBarber } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = React.useState(false);

  const toggleDrawer = () => {
    setState(!state);
  };

  const papperStyle = {
    '& .MuiDrawer-paperAnchorRight': {
      backgroundColor: '#1a1a1a',
    },
  };

  const logoContainer = {
    width: '15em',
    height: 'auto',
    marginTop: 3,
    '@media (max-width: 425px)': {
      width: '10em',
    },
  };

  const logoStyle = {
    width: '100%',
    height: 'auto',
  };

  const menuItems = isAdmin ? adminMenu : isBarber ? barberMenu : costumerMenu;

  const list = () => (
    <Box
      sx={{ width: 350 }}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: 5,
          color: 'white',
        }}
      >
        <Typography variant="h6" component="p">
          MENU
        </Typography>
        <CloseIcon onClick={toggleDrawer} sx={{ cursor: 'pointer' }} />
      </Box>
      <Divider sx={{ backgroundColor: 'white' }} />
      <List>
        {menuItems.map(item => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton onClick={() => navigate(item.link)}>
              <ListItemIcon sx={{ color: 'white' }}>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.title} sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: '#000000ed' }}>
        <Container>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Link to="/">
                <Box sx={logoContainer}>
                  <img
                    src="/logo header.avif"
                    alt="Barber logo"
                    style={logoStyle}
                  />
                </Box>
              </Link>
            </Box>

            <IconButton
              onClick={toggleDrawer}
              aria-label="Menu"
              style={{ color: '#ffffff' }}
            >
              <MenuIcon sx={{ fontSize: 40 }} />
            </IconButton>
            <Drawer
              anchor="right"
              open={state}
              onClose={toggleDrawer}
              sx={papperStyle}
            >
              {list()}
            </Drawer>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Navbar;
