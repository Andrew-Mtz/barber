import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { styles } from './infoMessage.styles.js';
import PropTypes from 'prop-types';

const ErrorMessage = ({ title, message }) => {
  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <Box sx={styles.card}>
        <Box sx={styles.header}>
          <Box sx={styles.imageError}>
            <svg
              style={styles.svgError}
              aria-hidden="true"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
            </svg>
          </Box>
          <Box sx={styles.content}>
            <Typography sx={styles.title}>{title}</Typography>
            <Typography sx={styles.message}>{message}</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

ErrorMessage.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
};

export default ErrorMessage;
