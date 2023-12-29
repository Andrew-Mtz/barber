import { Accordion, AccordionDetails, AccordionSummary, Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react'

const baseUrl = process.env.REACT_APP_BASEURL

const Income = () => {
  const [barbers, setBarbers] = React.useState([])
  const [infoMessage, setInfoMessage] = React.useState("")
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


  React.useEffect(() => {
    getBarbers()
  }, [])

  const getBarbers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/incomes?year=2023&month=12`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        const data = await response.json();
        setBarbers(data);
        return
      }
    } catch (error) {
      console.error('Error al obtener los barberos:', error);
    }
  }
  return (
    <>
      <Typography sx={{ color: 'text.secondary' }}>Ver datos para el mes Diciembre del año 2023</Typography>
      {Object.entries(barbers).map(([id, data], index) => {
        return (
          <Box key={id} sx={{bgcolor: 'var(--secondary-color)', p: 2, m: 3, borderRadius: 2}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 1, mb: 1}}>
              <Typography sx={{ color: 'white' }}>Trabajo de {data.barber_name} {data.barber_lastname}</Typography>
              <Typography sx={{ color: 'white' }}>Total de ingresos obtenidos: ${data.total_monthly_income}</Typography>
            </Box>
            {Object.entries(data.dates).map(([date, dateInfo], index) => {
              return (
                <Accordion key={index} expanded={expanded === `panel${id}${index}`} onChange={handleChange(`panel${id}${index}`)}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${id}${index}bh-content`}
                    id={`panel${id}${index}bh-header`}
                  >
                    <Typography sx={{ width: '45%', flexShrink: 0 }}>{date}</Typography>
                    <Typography sx={{ color: 'black' }}>Ingresos obtenidos: ${dateInfo.total_daily_income}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Table sx={{ minWidth: 450, borderTopLeftRadius: 0 }} aria-label="simple table">
                      <TableHead>
                        {dateInfo.date_info.length > 0 &&
                          <TableRow>
                            <TableCell align="center">Cliente</TableCell>
                            <TableCell align="center">Tipo corte</TableCell>
                            <TableCell align="center">Hora</TableCell>
                            <TableCell align="center">Precio</TableCell>
                          </TableRow>}
                      </TableHead>
                      <TableBody>
                        {dateInfo.date_info.length > 0 && dateInfo.date_info.map((dateInfoItem, index) => (
                          <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell align="center">{dateInfoItem.user_name} {dateInfoItem.user_lastname}</TableCell>
                            <TableCell align="left">{dateInfoItem.haircut_name} </TableCell>
                            <TableCell align="center">{dateInfoItem.hour}</TableCell>
                            <TableCell align="left">${dateInfoItem.price}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AccordionDetails>
                </Accordion>
              )
            })}
          </Box>
        )
      })}
    </>
  )
}

export default Income