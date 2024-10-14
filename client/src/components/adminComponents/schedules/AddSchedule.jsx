import React, { useState } from 'react';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Button, Typography } from '@mui/material';
import dayjs from 'dayjs'; // Asegúrate de tener dayjs instalado
import PropTypes from 'prop-types';

const baseUrl = process.env.REACT_APP_BASEURL;

const AddSchedule = ({ period, barberId }) => {
  const [fromValue, setFromValue] = useState(null);
  const [toValue, setToValue] = useState(null);

  const handleFromChange = newValue => {
    setFromValue(newValue);
  };

  const handleToChange = newValue => {
    setToValue(newValue);
  };

  const createSchedules = async () => {
    try {
      await fetch(
        `${baseUrl}/schedule?startHour=${fromValue}&endHour=${toValue}&period=${period}&barberId=${barberId}`,
        {
          method: 'post',
        },
      );
    } catch (error) {
      alert('Error al crear los horarios:', error);
    }
  };

  const sixAM = dayjs().set('hour', 6).set('minute', 0).set('second', 0); // Configura las 6:00 AM

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      gap={3}
      alignItems={'start'}
      bgcolor={'#f9f9f9'}
      p={4}
    >
      <Typography variant="h6" sx={{ color: 'text.secondary' }}>
        Crear horarios
      </Typography>
      <Box display={'flex'} gap={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Desde"
            ampm={false}
            views={['hours']}
            value={fromValue}
            onChange={handleFromChange}
            minTime={sixAM}
          />
          <TimePicker
            label="Hasta"
            ampm={false}
            views={['hours']}
            value={toValue}
            onChange={handleToChange}
            disabled={!fromValue}
            minTime={dayjs(fromValue).add(1, 'hour')}
          />
        </LocalizationProvider>
      </Box>
      <Button
        variant="contained"
        disabled={!fromValue || !toValue || fromValue >= toValue}
        onClick={createSchedules}
      >
        Crear
      </Button>
    </Box>
  );
};

AddSchedule.propTypes = {
  period: PropTypes.string,
  barberId: PropTypes.string,
};

export default AddSchedule;
