import cron from 'node-cron';
import { updateBooking, updateAvailablesSchedules } from '../controllers/booking.controller.js';

// Programar la tarea para ejecutarse a partir de las 10:00 y repetirse cada hora hasta las 22:00
const cronUpdateBooking = () => {
  cron.schedule('0 10-22 * * 1-6', async () => {
    const hourToExpire = obtenerHoraActual();
    console.log(`Ejecutando actualización de estado de reservas para el día actual a las ${hourToExpire}...`);
    await updateBooking(hourToExpire);
    await updateAvailablesSchedules(hourToExpire)
  });

  const obtenerHoraActual = () => {
    const today = new Date();
    const hour = today.getHours(); // Obtiene la hora en formato de 24 horas (0-23)

    // Formatea la hora y los minutos como una cadena (puedes personalizar el formato según tus necesidades)
    const horaActual = `${hour}:00`;

    return horaActual;
  };
};

export default cronUpdateBooking;
