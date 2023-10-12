import pool from "../db.js";
import { sendBookingCanceledEmail, sendBookingEmail } from "../utils/nodemailer.js";

const getAllBookings = async (req, res) => {
  try {
    const allBookings = await pool.query('SELECT * FROM booking')

    console.log(allBookings)
    res.json(allBookings.rows)
  } catch (error) {
    console.log(error)
  }
}

const getBooking = async (req, res) => {
  try {
    const user_id = req.user
    const query = `
    SELECT 
      booking.*, 
      barbers.name as barber_name, 
      barbers.last_name as barber_lastname, 
      barbers.phone as barber_phone, 
      haircuts.name as haircut_name, 
      haircuts.price as haircut_price, 
      schedules.date as booking_date, 
      available_schedules.hour as booking_hour
    FROM booking
    INNER JOIN barbers ON booking.barber_id = barbers.id
    INNER JOIN haircuts ON booking.haircut_id = haircuts.id
    INNER JOIN schedules ON booking.date_id = schedules.id
    INNER JOIN available_schedules ON booking.schedule_id = available_schedules.id
    WHERE booking.user_id = $1 AND booking.status = 'scheduled'
    `;
    const result = await pool.query(query, [user_id]);

    console.log(result)

    if (result.rows.length === 0) return res.status(404).json({ message: "Aún no tiene ninguna reserva" })
    res.json(result.rows)
  } catch (error) {
    console.log(error)
  }
}

const getLastsBooking = async (req, res) => {
  try {
    const user_id = req.user
    const query = `
    SELECT 
      booking.*, 
      barbers.name as barber_name, 
      barbers.last_name as barber_lastname, 
      barbers.phone as barber_phone, 
      haircuts.name as haircut_name, 
      haircuts.price as haircut_price, 
      schedules.date as booking_date, 
      available_schedules.hour as booking_hour
    FROM booking
    INNER JOIN barbers ON booking.barber_id = barbers.id
    INNER JOIN haircuts ON booking.haircut_id = haircuts.id
    INNER JOIN schedules ON booking.date_id = schedules.id
    INNER JOIN available_schedules ON booking.schedule_id = available_schedules.id
    WHERE booking.user_id = $1 AND booking.status = 'expired'
    ORDER BY booking_date DESC;
    `;
    const result = await pool.query(query, [user_id]);

    console.log(result)

    if (result.rows.length === 0) return res.status(404).json({ message: "No hay reservas pasadas" })
    res.json(result.rows)
  } catch (error) {
    console.log(error)
  }
}

const createBooking = async (req, res) => {
  try {
    const user_id = req.user

    const { status, barber_id, haircut_id, schedule_id, date_id } = req.body;

    // Verificar si el usuario ya tiene una reserva para esta fecha y horario
    const existingBookingQuery = `
      SELECT id FROM booking
      WHERE user_id = $1 AND status = 'scheduled'
    `;
    const existingBookingValues = [user_id];
    const existingBookingResult = await pool.query(existingBookingQuery, existingBookingValues);

    if (existingBookingResult.rows.length > 0) {
      return res.status(409).json({ error: 'Ya tienes una reserva hecha.' });
    }

    const query = `
      INSERT INTO booking (status, barber_id, user_id, haircut_id, schedule_id, date_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    const values = [status, barber_id, user_id, haircut_id, schedule_id, date_id];

    const result = await pool.query(query, values);
    const bookingId = result.rows[0].id;

    const updateQuery = `
    UPDATE available_schedules
    SET status = 2
    WHERE id = $1
    `;
    const updateValues = [schedule_id];

    await pool.query(updateQuery, updateValues);

    const userQuery = `
    SELECT name, email
    FROM users
    WHERE id = $1
    `;
    const userValues = [user_id];

    const userResult = await pool.query(userQuery, userValues);
    const user = userResult.rows[0];

    const user_name = user.name;
    const user_email = user.email;

    const dateQuery = `
    SELECT date
    FROM schedules
    WHERE id = $1
    `;
    const dateValues = [date_id];

    const dateResult = await pool.query(dateQuery, dateValues);
    const schedule_date = dateResult.rows[0].date;

    sendBookingEmail(user_email, user_name, schedule_date);

    res.status(201).json({ message: 'Agendado correctamente.', bookingId });
  } catch (error) {
    if (error.code === '23505' && error.constraint === 'unique_barber_schedule_date') {
      res.status(409).json({ error: 'La reserva para esta fecha y horario ya existe.' });
    } else {
      console.error('Error al intentar agendarte:', error);
      res.status(500).json({ error: 'Hubo un error al intentar hacer la reservación.' });
    }
  }
}

const canceleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)

    // Obtener el schedule_id del booking que se va a eliminar
    const bookingQuery = `
    SELECT b.schedule_id, u.email AS user_email, u.name AS name, s.date AS schedule_date
    FROM booking AS b
    JOIN users AS u ON b.user_id = u.id
    JOIN schedules AS s ON b.date_id = s.id
    WHERE b.id = $1;
    `;
    const bookingResult = await pool.query(bookingQuery, [id]);

    if (bookingResult.rowCount === 0) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    const schedule_id = bookingResult.rows[0].schedule_id;
    const user_email = bookingResult.rows[0].user_email;
    const name = bookingResult.rows[0].name;
    const schedule_date = bookingResult.rows[0].schedule_date;

    // Eliminar la reserva
    const deleteQuery = 'DELETE FROM booking WHERE id = $1';
    await pool.query(deleteQuery, [id]);

    // Actualizar el estado del horario en available_schedules
    const updateQuery = 'UPDATE available_schedules SET status = 1 WHERE id = $1';
    await pool.query(updateQuery, [schedule_id]);

    sendBookingCanceledEmail(user_email, name, schedule_date);

    return res.status(204).json("Reserva cancelada exitosamente");
  } catch (error) {
    return res.status(500).json({ error: "Hubo un error al cancelar la reserva" });
  }
}

const updateBooking = async (req, res) => {
  res.send('Editing a booking');
}

export {
  getAllBookings,
  getBooking,
  getLastsBooking,
  createBooking,
  canceleBooking,
  updateBooking
}