import React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Box, Button, Paper, Typography } from '@mui/material';
import {
  DateCalendar,
  LocalizationProvider,
  PickersDay,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AvailableHours from '../../calendar/AvailableHours';
import PropTypes from 'prop-types';

const baseUrl = process.env.REACT_APP_BASEURL;

const paper = {
  display: 'flex',
  flexDirection: 'column',
  paddingRight: 3,
  paddingLeft: 3,
  marginTop: 3,
  backgroundColor: '#f9f9f9',
  justifyContent: 'center',
  '@media (max-width: 745px)': {
    flexWrap: 'wrap',
  },
};

const ManageSchedules = ({ barberId, selectedMonth }) => {
  const [value, setValue] = React.useState(null);
  const [unavailableDates, setUnavailableDates] = React.useState([]);
  const [selectedDateData, setSelectedDateData] = React.useState({
    id: 0,
    status: null,
    availableSchedules: [],
    reservedSchedules: [],
    unavailableSchedules: [],
  });
  const [selectedAvailableHours, setSelectedAvailableHours] = React.useState(
    [],
  );
  const [selectedReservedHours, setSelectedReservedHours] = React.useState([]);
  const [selectedUnavailableHours, setSelectedUnavailableHours] =
    React.useState([]);

  const handleDateChange = async newValue => {
    try {
      const selectedDate = newValue.format('YYYY-MM-DD');
      const response = await fetch(
        `${baseUrl}/diferents-schedules-by-date?date=${selectedDate}&barber_id=${barberId}`,
        {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
      setSelectedAvailableHours([]);
      setSelectedReservedHours([]);
      setSelectedUnavailableHours([]);
      if (response.status === 404) {
        setValue(newValue);
        setSelectedDateData({ id: 0, schedules: [] });
        return;
      }
      if (response.status === 200) {
        const data = await response.json();
        setSelectedDateData(data);
        setValue(newValue);
        return;
      }
    } catch (error) {
      alert('Error al obtener el ID del día:', error);
    }
  };

  const shouldDisableDate = day => {
    return dayjs(day).day() === 0;
  };

  const disableDay = async id => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${baseUrl}/disable-day/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      alert(error);
    }
  };

  const enableDay = async id => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${baseUrl}/enable-day/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      alert(error);
    }
  };

  const onHourSelect = (hourId, hour, status) => {
    switch (status) {
      case 1:
        handleHourSelection(
          hourId,
          selectedAvailableHours,
          setSelectedAvailableHours,
        );
        break;
      case 2:
        handleHourSelection(
          hourId,
          selectedReservedHours,
          setSelectedReservedHours,
        );
        break;
      case 3:
        handleHourSelection(
          hourId,
          selectedUnavailableHours,
          setSelectedUnavailableHours,
        );
        break;
      default:
    }
  };

  const disableHour = async ids => {
    try {
      const body = { ids };
      const token = localStorage.getItem('token');
      await fetch(`${baseUrl}/disable-hour`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      alert(error);
    }
  };

  const enableHour = async ids => {
    try {
      const body = { ids };
      const token = localStorage.getItem('token');
      await fetch(`${baseUrl}/enable-hour`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      alert(error);
    }
  };

  const handleHourSelection = (hourId, selectedHours, setSelectedHours) => {
    const isHourAdded = selectedHours.includes(hourId);

    if (isHourAdded) {
      const updatedHours = selectedHours.filter(
        haircutId => haircutId !== hourId,
      );
      setSelectedHours(updatedHours);
    } else {
      const updatedHours = [...selectedHours, hourId];
      setSelectedHours(updatedHours);
    }
  };

  const getUnavailableDates = async (barberId, date) => {
    try {
      const year = date.split('-')[0];
      const month = date.split('-')[1];
      const response = await fetch(
        `${baseUrl}/unavailable-dates-by-barber?&barber_id=${barberId}&year=${year}&month=${month}`,
        {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
      const data = await response.json();
      setUnavailableDates(data);
    } catch (error) {
      alert('Error al obtener el ID del día:', error);
    }
  };

  React.useEffect(() => {
    getUnavailableDates(barberId, selectedMonth.startMonth);
    setValue(null);
  }, [barberId, selectedMonth.startMonth]);

  function ServerDay(params) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = params;

    const isUnavailable =
      !outsideCurrentMonth && highlightedDays.indexOf(day.date()) >= 0;

    const dayStyle = {
      backgroundColor: isUnavailable && 'lightgray',
    };

    return (
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        style={dayStyle}
      />
    );
  }

  return (
    <Paper sx={paper}>
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-evenly'}
      >
        <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DateCalendar
              value={value}
              /*  disablePast */
              onChange={handleDateChange}
              minDate={dayjs(selectedMonth?.startMonth)}
              maxDate={dayjs(selectedMonth?.endMonth)}
              shouldDisableDate={shouldDisableDate}
              disableHighlightToday
              views={['day']}
              slots={{
                day: ServerDay,
              }}
              slotProps={{
                day: {
                  highlightedDays: unavailableDates?.map(date =>
                    dayjs(date).date(),
                  ),
                },
              }}
            />
          </LocalizationProvider>
        </Box>
        {value && (
          <Button
            variant="contained"
            onClick={
              selectedDateData.status === 1
                ? () => disableDay(selectedDateData.id)
                : () => enableDay(selectedDateData.id)
            }
          >
            {selectedDateData.status === 1
              ? 'Deshabilitar dia'
              : 'Habilitar dia'}
          </Button>
        )}
        {!value && <Typography>Selecciona un día</Typography>}
      </Box>
      {value && (
        <Box>
          <Box>
            <AvailableHours
              schedules={selectedDateData.availableSchedules}
              onHourSelect={onHourSelect}
              selectedId={selectedAvailableHours}
            />
            {selectedDateData?.availableSchedules?.length > 0 && (
              <Button
                variant="contained"
                onClick={() => disableHour(selectedAvailableHours)}
              >
                Deshabilitar horarios
              </Button>
            )}
          </Box>
          <Box>
            <AvailableHours
              title={'Horarios con reserva'}
              schedules={selectedDateData.reservedSchedules}
              onHourSelect={onHourSelect}
              selectedId={selectedReservedHours}
            />
            {selectedDateData?.reservedSchedules?.length > 0 && (
              <Button
                variant="contained"
                onClick={() => disableHour(selectedReservedHours)}
              >
                Deshabilitar horarios
              </Button>
            )}
          </Box>
          <Box>
            <AvailableHours
              title={'Horarios no disponibles'}
              schedules={selectedDateData.unavailableSchedules}
              onHourSelect={onHourSelect}
              selectedId={selectedUnavailableHours}
            />
            {selectedDateData?.unavailableSchedules?.length > 0 && (
              <Button
                variant="contained"
                onClick={() => enableHour(selectedUnavailableHours)}
              >
                Habilitar horarios
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

ManageSchedules.propTypes = {
  barberId: PropTypes.string,
  selectedMonth: PropTypes.object,
};

export default ManageSchedules;
