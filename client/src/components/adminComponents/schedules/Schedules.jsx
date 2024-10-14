import React from 'react';
import 'dayjs/locale/es';
import { Box } from '@mui/material';
import AddSchedule from './AddSchedule';
import './schedules.css';
import ManageSchedules from './ManageSchedules.jsx';

const baseUrl = process.env.REACT_APP_BASEURL;

const Schedules = () => {
  const [emptyDates, setEmptyDates] = React.useState(null);
  const [selectedMonth, setSelectedMonth] = React.useState(null);
  const [period, setPeriod] = React.useState(null);
  const [barbers, setBarbers] = React.useState([]);
  const [selectedBarber, setSelectedBarber] = React.useState(null);

  const getBarbers = async () => {
    try {
      const response = await fetch(`${baseUrl}/barber`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const data = await response.json();
      if (data.error !== '') {
        return alert(data.error);
      }
      setBarbers(data.response);
    } catch (error) {
      alert('Error al obtener los barberos:', error);
    }
  };

  const scheduleByBarber = async barberId => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${baseUrl}/schedule-by-barber?period=${period}&barberId=${barberId}`,
        {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        const data = await response.json();
        setEmptyDates(data.empty);
        setSelectedMonth(data.range);
      }
    } catch (error) {
      alert('Error al obtener el ID del día:', error);
    }
  };

  const handlePeriod = period => {
    setPeriod(period);
    setSelectedBarber(null);
  };

  const handleBarber = async barber => {
    if (selectedBarber?.id !== barber.id) {
      await scheduleByBarber(barber.id);
      setSelectedBarber(barber);
    }
  };

  React.useEffect(() => {
    getBarbers();
  }, []);

  return (
    <>
      <Box className="admin-scheduler-container">
        <Box display={'flex'} gap={2}>
          <div
            className={`btn-choose ${period === 'actual' && 'active'}`}
            onClick={() => handlePeriod('actual')}
          >
            Mes actual
          </div>
          <div
            className={`btn-choose ${period === 'siguiente' && 'active'}`}
            onClick={() => handlePeriod('siguiente')}
          >
            Mes Siguiente
          </div>
        </Box>
        {period && (
          <Box display={'flex'} gap={2}>
            {barbers?.map(barber => (
              <div
                className={`btn-choose ${selectedBarber?.id === barber.id && 'active'}`}
                key={barber.id}
                onClick={() => {
                  handleBarber(barber);
                }}
              >
                {barber.name} {barber.last_name}
              </div>
            ))}
          </Box>
        )}
        {selectedBarber && emptyDates && (
          <AddSchedule period={period} barberId={selectedBarber.id} />
        )}
        {selectedBarber && !emptyDates && (
          <ManageSchedules
            barberId={selectedBarber.id}
            selectedMonth={selectedMonth}
          />
        )}
      </Box>
    </>
  );
};

export default Schedules;
