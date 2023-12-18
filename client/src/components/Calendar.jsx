import React from 'react'
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Box, Button, Paper, Typography } from '@mui/material';

const baseUrl = process.env.REACT_APP_BASEURL

const Calendar = ({ onScheduleSelect, selectedId, selectedBarberId }) => {
  const [value, setValue] = React.useState(dayjs());
  const [selectedDateData, setSelectedDateData] = React.useState({ id: 0, schedules: [] });

  const month = dayjs().get('month') + 2
  const year = dayjs().get('year')
  const date = `${year}-${month}`
  const day = dayjs(date).daysInMonth()
  const finalDate = `${year}-${month}-${day}`

  React.useEffect(() => {
    handleDateChange(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDateChange = async (newValue) => {
    try {
      const selectedDate = newValue.format("YYYY-MM-DD");
      const response = await fetch(`${baseUrl}/available-schedule-by-date?date=${selectedDate}&barber_id=${selectedBarberId}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (response.status === 404) {
        setValue(newValue);
        setSelectedDateData({ id: 0, schedules: [] });
        return
      }
      if (response.status === 200) {
        const data = await response.json();
        setSelectedDateData(data);
        setValue(newValue);
        return
      }
    } catch (error) {
      console.error('Error al obtener el ID del día:', error);
    }
    setValue(newValue);
  };

  const buttonStyle = {
    padding: '0.5em 1.5em',
    textAlign: 'center',
    cursor: 'pointer',
  }

  const scheduleContainer = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 2,
    padding: 3,
    '@media (max-width: 745px)': {
      justifyContent: 'center',
    },
  }

  const paper = {
    display: 'flex',
    paddingRight: 3,
    paddingLeft: 3,
    marginTop: 3,
    justifyContent: 'center',
    '@media (max-width: 745px)': {
      flexWrap: 'wrap'
    },
  }

  return (
    <Paper sx={paper}>
      <Box>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DateCalendar value={value} disablePast onChange={handleDateChange} maxDate={dayjs(finalDate)} />
        </LocalizationProvider>
      </Box>
      <Box sx={{ paddingTop: 3, flexGrow: 1 }}>
        {selectedDateData?.schedules?.length > 0 && (
          <>
            <Typography variant='h6' sx={{ textAlign: 'center' }}>Selecciona un horario</Typography>
            <Box sx={scheduleContainer}>
              {selectedDateData.schedules.map((schedule) => (
                schedule.status === 1 &&
                <Box key={schedule.id}>
                  <Button
                    variant={schedule.id === selectedId ? "contained" : "outlined"}
                    sx={buttonStyle}
                    onClick={() => onScheduleSelect(schedule.id, selectedDateData.id, value, schedule.hour)}
                  >{schedule.hour}
                  </Button>
                </Box>
              ))}
            </Box>
          </>)}
        {selectedDateData?.schedules?.length === 0 && <Typography variant='h6' sx={{ textAlign: 'center', marginBottom: 3 }}>No hay horarios disponibles para esta fecha</Typography>}
      </Box>
    </Paper>
  )
}

export default Calendar