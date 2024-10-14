import { Paper } from '@mui/material';
import ContactForm from '../../components/contact/ContactForm';

const Contact = () => {
  const containerForm = {
    backgroundColor: 'transparent',
    height: '80vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  };

  return (
    <Paper sx={containerForm}>
      <ContactForm />
    </Paper>
  );
};

export default Contact;
