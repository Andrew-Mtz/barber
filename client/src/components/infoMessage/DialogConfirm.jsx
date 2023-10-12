import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import React from 'react'

const DialogConfirm = ({ open, handleClose, specificFuncion, title, message }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const doSpecificFunction = () => {
    specificFuncion()
    handleClose()
  }
  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' onClick={handleClose}>
          Cerrar
        </Button>
        <Button color='error' variant='contained' onClick={doSpecificFunction}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogConfirm