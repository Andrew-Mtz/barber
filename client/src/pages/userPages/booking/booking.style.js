export const stepperStyle = {
  boxShadow: 2,
  backgroundColor: 'rgba(0,0,0,0.1)',
  paddingTop: 3,
  paddingBottom: 3,
  '& .Mui-active': {
    '& .MuiStepConnector-line': {
      borderColor: 'var(--primary-color)',
    },
  },
  '& .Mui-completed': {
    '& .MuiStepConnector-line': {
      borderColor: 'var(--primary-color)',
    },
  },
  '& .MuiStepLabel-labelContainer': {
    '& .MuiStepLabel-alternativeLabel': {
      color: 'white',
    },
  },
  '& .Mui-disabled': {
    '& .MuiStepIcon-root': {
      color: 'grey',
    },
  },
};

export const steps = [
  'Selecciona un barbero',
  'Selecciona un corte',
  'Selecciona un horario',
];
