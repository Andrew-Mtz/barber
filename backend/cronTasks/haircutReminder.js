import cron from 'node-cron';
import { bookingReminder } from '../controllers/booking.controller.js';

// Programar la tarea para ejecutarse a partir de las 08:00 de cada dia menos los domingos
const cronBookingReminder = () => {
  cron.schedule('0 16 * * 1-6', async () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Los meses comienzan en 0, por lo que se suma 1
    const day = String(currentDate.getDate()).padStart(2, '0');
    const currentDay = `${year}-${month}-${day}`;
    console.log(`Ejecutando recordatorio para el dia ${currentDay}`);
    await bookingReminder(currentDay);
  });
};

export default cronBookingReminder;
