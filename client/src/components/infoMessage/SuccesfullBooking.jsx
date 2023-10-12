import React from 'react'
import { Box, Paper, Typography } from '@mui/material'
import { styles } from './infoMessage.styles.js'

const SuccesfullBooking = ({ title, message }) => {
  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
      <Box sx={styles.card}>
        <Box sx={styles.header}>
          <Box sx={styles.imageSucces}>
            <svg style={styles.svgSucces} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M20 7L9.00004 18L3.99994 13" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              </g>
            </svg>
          </Box>
          <Box sx={styles.content} >
            <Typography sx={styles.title}>
              {title}
            </Typography>
            <Typography sx={styles.message}>
              {message}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default SuccesfullBooking