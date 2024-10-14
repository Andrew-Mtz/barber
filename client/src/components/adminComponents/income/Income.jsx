import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  MenuItem,
  OutlinedInput,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './income.css';

const baseUrl = process.env.REACT_APP_BASEURL;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const months = [
  { name: 'Enero', value: '01' },
  { name: 'Febrero', value: '02' },
  { name: 'Marzo', value: '03' },
  { name: 'Abril', value: '04' },
  { name: 'Mayo', value: '05' },
  { name: 'Junio', value: '06' },
  { name: 'Julio', value: '07' },
  { name: 'Agosto', value: '08' },
  { name: 'Septiembre', value: '09' },
  { name: 'Octubre', value: '10' },
  { name: 'Noviembre', value: '11' },
  { name: 'Diciembre', value: '12' },
];

const years = [
  { name: '2023', value: '2023' },
  { name: '2024', value: '2024' },
];

const Income = () => {
  const [barbers, setBarbers] = React.useState(null);
  const [expanded, setExpanded] = React.useState(false);
  const [selectedMonth, setSelectedMonth] = React.useState('');
  const [selectedYear, setSelectedYear] = React.useState('');

  const handleMonthChange = event => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = event => {
    setSelectedYear(event.target.value);
  };

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getData = async (year, month) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${baseUrl}/incomes?year=${year}&month=${month}`,
        {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      if (response.status === 200) {
        alert(data.length);
        setBarbers(data);
        return;
      }
    } catch (error) {
      alert('Error al obtener los barberos:', error);
    }
  };

  return (
    <>
      <Box className="income-search-container">
        <Typography component="span" sx={{ color: 'text.secondary' }}>
          Ver datos para el mes de
        </Typography>
        <Select
          labelId="select-month-label"
          id="select-month-label"
          value={selectedMonth}
          onChange={handleMonthChange}
          input={<OutlinedInput label="Mes" className="income-date-input" />}
          MenuProps={MenuProps}
        >
          {months.map(month => (
            <MenuItem key={month.name} value={month.value}>
              {month.name}
            </MenuItem>
          ))}
        </Select>
        <Typography component="span" sx={{ color: 'text.secondary' }}>
          del año
        </Typography>
        <Select
          labelId="select-year-label"
          id="select-year"
          value={selectedYear}
          onChange={handleYearChange}
          input={<OutlinedInput label="Año" className="income-date-input" />}
          MenuProps={MenuProps}
        >
          {years.map(year => (
            <MenuItem key={year.name} value={year.value}>
              {year.name}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          onClick={() => getData(selectedYear, selectedMonth)}
        >
          Buscar
        </Button>
      </Box>
      {barbers !== null &&
        Object.entries(barbers).map(([id, data]) => {
          return (
            <Box
              key={id}
              sx={{
                bgcolor: 'var(--secondary-color)',
                p: 2,
                m: 3,
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 1,
                  mb: 1,
                }}
              >
                <Typography sx={{ color: 'white' }}>
                  Trabajo de {data.barber_name} {data.barber_lastname}
                </Typography>
                <Typography sx={{ color: 'white' }}>
                  Total de ingresos obtenidos: ${data.total_monthly_income}
                </Typography>
              </Box>
              {Object.entries(data.dates).map(([date, dateInfo], index) => {
                return (
                  <Accordion
                    key={index}
                    expanded={expanded === `panel${id}${index}`}
                    onChange={handleChange(`panel${id}${index}`)}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${id}${index}bh-content`}
                      id={`panel${id}${index}bh-header`}
                    >
                      <Typography sx={{ width: '45%', flexShrink: 0 }}>
                        {date}
                      </Typography>
                      <Typography sx={{ color: 'black' }}>
                        Ingresos obtenidos: ${dateInfo.total_daily_income}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Table
                        sx={{ minWidth: 450, borderTopLeftRadius: 0 }}
                        aria-label="simple table"
                      >
                        <TableHead>
                          {dateInfo.date_info.length > 0 && (
                            <TableRow>
                              <TableCell align="center">Cliente</TableCell>
                              <TableCell align="center">Tipo corte</TableCell>
                              <TableCell align="center">Hora</TableCell>
                              <TableCell align="center">Precio</TableCell>
                            </TableRow>
                          )}
                        </TableHead>
                        <TableBody>
                          {dateInfo.date_info.length > 0 &&
                            dateInfo.date_info.map((dateInfoItem, index) => (
                              <TableRow
                                key={index}
                                sx={{
                                  '&:last-child td, &:last-child th': {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell align="center">
                                  {dateInfoItem.user_name}{' '}
                                  {dateInfoItem.user_lastname}
                                </TableCell>
                                <TableCell align="left">
                                  {dateInfoItem.haircut_name}{' '}
                                </TableCell>
                                <TableCell align="center">
                                  {dateInfoItem.hour}
                                </TableCell>
                                <TableCell align="left">
                                  ${dateInfoItem.price}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Box>
          );
        })}
      {barbers !== null && Object.entries(barbers).length === 0 && (
        <Typography sx={{ mt: 8, color: 'text.secondary' }}>
          No hay datos registrados para esta fecha
        </Typography>
      )}
    </>
  );
};

export default Income;
