import React from 'react'
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import PropTypes from 'prop-types';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Box, Paper } from '@mui/material';
import AvailableHours from './AvailableHours.jsx';

const baseUrl = process.env.REACT_APP_BASEURL

const Calendar = ({ onDaySelect, onHourSelect, selectedId, selectedBarberId }) => {
  const [value, setValue] = React.useState(dayjs());
  const [selectedDateData, setSelectedDateData] = React.useState({ id: 0, status: null, availableSchedules: [], unavailableSchedules: [] });
  const [unavailableDates, setUnavailableDates] = React.useState([]);
  const [programmaticChange, setProgrammaticChange] = React.useState(false);

  const month = dayjs().get('month') + 2;
  const year = dayjs().get('year');
  const date = `${year}-${month}`;
  const day = dayjs(date).daysInMonth();
  const finalDate = `${year}-${month}-${day}`;

  const getUnavailableDates = React.useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/unavailable-dates-by-barber?&barber_id=${selectedBarberId}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      setUnavailableDates(data);
    } catch (error) {
      console.error('Error al obtener el ID del día:', error);
    }
  }, [selectedBarberId]);

  const handleDateChange = React.useCallback(async (newValue) => {
    try {
      setProgrammaticChange(true);
      const selectedDate = newValue.format("YYYY-MM-DD");
      const response = await fetch(`${baseUrl}/all-schedules-by-date?date=${selectedDate}&barber_id=${selectedBarberId}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (response.status === 404) {
        setValue(newValue);
        setSelectedDateData({ id: 0, status: null, schedules: [] });
        return;
      }
      if (response.status === 200) {
        const data = await response.json();
        setSelectedDateData(data);
        setValue(newValue);
        return;
      }
    } catch (error) {
      console.error('Error al obtener el ID del día:', error);
    }
  }, [selectedBarberId]);

  React.useEffect(() => {
    getUnavailableDates();
  }, [getUnavailableDates]);

  React.useEffect(() => {
    if (!programmaticChange) {
      handleDateChange(value);
    }
  }, [handleDateChange, value, programmaticChange]);

  const shouldDisableDate = (day) => {
    const isSunday = dayjs(day).day() === 0;
    const isUnavailableDate = unavailableDates?.some(date => dayjs(date).format('YYYY-MM-DD') === dayjs(day).format('YYYY-MM-DD'));
    return isSunday || isUnavailableDate;
  };

  const paper = {
    display: 'flex',
    paddingRight: 3,
    paddingLeft: 3,
    marginTop: 3,
    justifyContent: 'center',
    '@media (max-width: 745px)': {
      flexWrap: 'wrap'
    },
  };

  return (
    <Paper sx={paper}>
      <Box>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DateCalendar value={value} views={['day']} onChange={handleDateChange} maxDate={dayjs(finalDate)} shouldDisableDate={shouldDisableDate} />
        </LocalizationProvider>
      </Box>
      <AvailableHours
        schedules={selectedDateData.availableSchedules}
        onHourSelect={onHourSelect}
        onDaySelect={onDaySelect}
        selectedId={selectedId}
        selectedDayId={selectedDateData.id}
        day={value}
        disUnavailable />
    </Paper>
  );
};

Calendar.propTypes = {
  onDaySelect: PropTypes.func,
  onHourSelect: PropTypes.func.isRequired,
  selectedId: PropTypes.number.isRequired,
  selectedBarberId: PropTypes.number
};

Calendar.defaultProps = {
  title: 'Horarios disponibles',
  schedules: []
};

export default Calendar;
