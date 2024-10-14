import { Box, Button, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const AvailableHours = ({
  title,
  schedules,
  onHourSelect,
  selectedId,
  disUnavailable,
}) => {
  const buttonStyle = {
    padding: '0.5em 1.5em',
    textAlign: 'center',
    cursor: 'pointer',
  };

  const scheduleContainer = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 2,
    padding: 3,
    '@media (max-width: 745px)': {
      justifyContent: 'center',
    },
  };

  const isSelected = id => {
    if (typeof selectedId === 'number') {
      return selectedId === id;
    }
    return selectedId?.includes(id);
  };

  return (
    <Box sx={{ paddingTop: 3, flexGrow: 1 }}>
      <Typography variant="h6" component="p" textAlign={'center'}>
        {title}
      </Typography>
      {schedules?.length > 0 && (
        <>
          <Box sx={scheduleContainer}>
            {schedules.map(schedule => (
              <Box key={schedule.id}>
                <Button
                  disabled={disUnavailable && schedule.status !== 1}
                  variant={isSelected(schedule.id) ? 'contained' : 'outlined'}
                  sx={buttonStyle}
                  onClick={() =>
                    onHourSelect(schedule.id, schedule.hour, schedule.status)
                  }
                >
                  {schedule.hour}
                </Button>
              </Box>
            ))}
          </Box>
        </>
      )}
      {schedules?.length === 0 && (
        <Typography variant="body1" component="p" textAlign={'center'} mb={3}>
          No hay horarios disponibles para esta fecha
        </Typography>
      )}
    </Box>
  );
};

AvailableHours.propTypes = {
  title: PropTypes.string,
  schedules: PropTypes.array,
  onDaySelect: PropTypes.func,
  onHourSelect: PropTypes.func.isRequired,
  selectedId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
  ]).isRequired,
  disUnavailable: PropTypes.bool,
};

AvailableHours.defaultProps = {
  title: 'Horarios disponibles',
  schedules: [],
  disUnavailable: false,
};

export default AvailableHours;
