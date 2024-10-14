import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

const DialogConfirm = ({
  open,
  handleClose,
  specificFuncion,
  title,
  message,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const doSpecificFunction = () => {
    specificFuncion();
    handleClose();
  };
  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="error" variant="contained" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="contained" onClick={doSpecificFunction}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogConfirm.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  specificFuncion: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
};

export default DialogConfirm;
