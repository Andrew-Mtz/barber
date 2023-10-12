import React from 'react'
import { Avatar, Box, Button, Grid, Paper, Typography, Divider } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { accountStyles } from "./account.style.js"
import { useLocation } from 'react-router-dom';
import Login from '../../components/login/Login.jsx';
import Register from '../../components/register/Register.jsx';
import UserData from '../../components/UserData.jsx';

const Account = ({ isLoggedIn, checkAuth }) => {
  const location = useLocation();

  const [display, setDisplay] = React.useState("Sign in");

  const isBookingRoute = location.state && location.state.previousPath === '/booking';

  return (
    <>
      {isLoggedIn ? <UserData checkAuth={checkAuth} isBookingRoute={isBookingRoute} /> :
        <Grid
          item
          sx={accountStyles.size}
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={1}
        >
          <Paper sx={accountStyles.paper}>
            <Box sx={accountStyles.headerContainer}>
              <Button sx={accountStyles.headerBtn} onClick={() => setDisplay("Sign in")}>
                <Avatar sx={display === "Sign in" ? accountStyles.avatar : accountStyles.inactiveAvatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography variant="body1" sx={display === "Sign in" ? accountStyles.activeText : accountStyles.inactiveText}>
                  Sign in
                </Typography>
              </Button>
              <Divider orientation="vertical" flexItem sx={{ width: '0.5px', backgroundColor: '#EEEDED' }} />
              <Button sx={accountStyles.headerBtn} onClick={() => setDisplay("Sign up")}>
                <Avatar sx={display === "Sign up" ? accountStyles.avatar : accountStyles.inactiveAvatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography variant="body1" sx={display === "Sign up" ? accountStyles.activeText : accountStyles.inactiveText}>
                  Sign up
                </Typography>
              </Button>
            </Box>
            {display === "Sign in" ? <Login checkAuth={checkAuth} /> : <Register checkAuth={checkAuth} />}
          </Paper>
        </Grid>}
    </>
  );
}

export default Account