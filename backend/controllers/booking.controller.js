import pool from "../db.js";
import { sendBookingCanceledEmail, sendBookingEmail } from "../utils/nodemailer.js";

const getAllBookings = async (req, res) => {
  try {
    const allBookings = await pool.query('SELECT * FROM booking')

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
      b.name as barber_name, 
      b.last_name as barber_lastname, 
      b.phone as barber_phone, 
      h.name as haircut_name, 
      h.price as haircut_price, 
      s.date as booking_date, 
      avs.hour as booking_hour
    FROM booking
    INNER JOIN clients as c ON booking.client_id = c.id
    INNER JOIN barbers as b ON booking.barber_id = b.id
    INNER JOIN haircuts as h ON booking.haircut_id = h.id
    INNER JOIN schedules as s ON booking.date_id = s.id
    INNER JOIN available_schedules as avs ON booking.schedule_id = avs.id
    WHERE c.user_id = $1 AND booking.status = 'scheduled'
    `;
    const result = await pool.query(query, [user_id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ response: [], error: 'Aún no tiene ninguna reserva' });
    }
    res.json({ response: result.rows, error: '' });
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
      b.name as barber_name, 
      b.last_name as barber_lastname, 
      b.phone as barber_phone, 
      h.name as haircut_name, 
      h.price as haircut_price, 
      s.date as booking_date, 
      avs.hour as booking_hour,
      r.id as review_id,
      r.is_pending as pending
    FROM booking
    INNER JOIN clients as c ON booking.client_id = c.id
    INNER JOIN barbers as b ON booking.barber_id = b.id
    INNER JOIN haircuts as h ON booking.haircut_id = h.id
    INNER JOIN schedules as s ON booking.date_id = s.id
    INNER JOIN available_schedules as avs ON booking.schedule_id = avs.id
    INNER JOIN reviews as r ON booking.id = r.booking_id
    WHERE c.user_id = $1 AND booking.status = 'completed'
    ORDER BY booking_date DESC;
    `;
    const result = await pool.query(query, [user_id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ response: [], error: 'No hay reservas pasadas' });
    }
    res.json({ response: result.rows, error: '' });
  } catch (error) {
    console.log(error)
  }
}

const createBooking = async (req, res) => {
  try {
    await pool.query('BEGIN'); // Iniciar la transacción

    const user_id = req.user;

    console.log(user_id);
    // Obtener el client_id asociado al user_id
    const clientQuery = `SELECT id FROM clients WHERE user_id = $1`;
    const clientResult = await pool.query(clientQuery, [user_id]);

    if (clientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado.' });
    }

    const client_id = clientResult.rows[0].id;

    // Verificar si el cliente ya tiene una reserva para esta fecha y horario
    const existingBookingQuery = `
      SELECT id FROM booking
      WHERE client_id = $1 AND status = 'scheduled'
    `;
    const existingBookingValues = [client_id];
    const existingBookingResult = await pool.query(existingBookingQuery, existingBookingValues);

    if (existingBookingResult.rows.length > 0) {
      return res.status(409).json({ error: 'Ya tienes una reserva hecha.' });
    }

    const { status, barber_id, haircut_id, schedule_id, date_id } = req.body;

    const query = `
      INSERT INTO booking (status, barber_id, client_id, haircut_id, schedule_id, date_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    const values = [status, barber_id, client_id, haircut_id, schedule_id, date_id];

    const result = await pool.query(query, values);
    const bookingId = result.rows[0].id;

    // Obtener datos del cliente para enviar notificaciones
    const clientEmailQuery = `
      SELECT c.name, c.last_name, u.email, c.accept_notifications
      FROM clients c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = $1
    `;
    const clientValues = [client_id];
    const clientEmailResult = await pool.query(clientEmailQuery, clientValues);
    const client = clientEmailResult.rows[0];

    // Enviar notificación si el cliente acepta notificaciones
    if (client.accept_notifications) {
      const user_name = `${client.name} ${client.last_name}`;
      const user_email = client.email;

      const dateQuery = `
        SELECT date
        FROM schedules
        WHERE id = $1
      `;
      const dateValues = [date_id];
      const dateResult = await pool.query(dateQuery, dateValues);
      const schedule_date = dateResult.rows[0].date;

      sendBookingEmail(user_email, user_name, schedule_date);
    }

    await pool.query('COMMIT'); // Confirmar la transacción
    res.status(201).json({ message: 'Agendado correctamente.', bookingId });
  } catch (error) {
    await pool.query('ROLLBACK'); // Deshacer la transacción en caso de error
    if (error.code === '23505' && error.constraint === 'unique_barber_schedule_date') {
      res.status(409).json({ error: 'La reserva para esta fecha y horario ya existe.' });
    } else {
      console.error('Error al intentar agendarte:', error);
      res.status(500).json({ error: 'Hubo un error al intentar hacer la reservación.' });
    }
  }
};

const canceleBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener información de la reserva antes de eliminarla
    const bookingQuery = `
      SELECT
        b.schedule_id,
        u.email AS user_email,
        c.name,
        c.last_name,
        c.accept_notifications,
        s.date AS schedule_date
      FROM booking AS b
      JOIN clients AS c ON b.client_id = c.id
      JOIN users AS u ON c.user_id = u.id
      JOIN schedules AS s ON b.date_id = s.id
      WHERE b.id = $1;
    `;
    const bookingResult = await pool.query(bookingQuery, [id]);

    if (bookingResult.rowCount === 0) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    const { user_email, name, last_name, schedule_date, accept_notifications } = bookingResult.rows[0];

    const user_name = `${name} ${last_name}`;

    // Eliminar la reserva (el trigger manejará la actualización del estado del horario)
    const deleteQuery = 'DELETE FROM booking WHERE id = $1';
    await pool.query(deleteQuery, [id]);

    if (accept_notifications) {
      console.log('send email')
      //sendBookingCanceledEmail(user_email, user_name, schedule_date);
    }

    return res.status(204).json("Reserva cancelada exitosamente");
  } catch (error) {
    return res.status(500).json({ error: "Hubo un error al cancelar la reserva" });
  }
}

const updateBooking = async (hourToExpire) => {
  const actualDate = new Date().toISOString().split('T')[0];
  try {
    // Ejecuta una consulta SQL para actualizar las reservas
    const query = `
      UPDATE booking
      SET status = 'expired'
      FROM available_schedules AS a
      JOIN schedules AS s ON a.schedule_id = s.id
      WHERE
        booking.status <> 'expired'
        AND s.date = $1
        AND a.hour = $2
        AND booking.schedule_id = a.id
    `;

    const values = [actualDate, hourToExpire];
    const result = await pool.query(query, values);

    console.log(`Reservas actualizadas a "expiradas" para la fecha ${actualDate} y hora ${hourToExpire}.`);
  } catch (error) {
    console.error('Error al actualizar las reservas:', error);
  }
}

const updateAvailablesSchedules = async (hourToExpire) => {
  const actualDate = new Date().toISOString().split('T')[0];
  try {
    // Ejecuta una consulta SQL para actualizar las reservas
    const query = `
    UPDATE available_schedules AS a
    SET status = 2
    FROM schedules AS s
    WHERE
      a.status <> 2
      AND s.date = $1
      AND a.hour = $2
      AND a.schedule_id = s.id;
    `;
    const values = [actualDate, hourToExpire];
    const result = await pool.query(query, values);

    console.log(`Reservas actualizadas a "expiradas" para la fecha ${actualDate} y hora ${hourToExpire}.`);
  } catch (error) {
    console.error('Error al actualizar las reservas:', error);
  }
}

const bookingReminder = async (currentDate) => {
  try {
    // Ejecutar la consulta SQL para obtener reservas y usuarios
    const query = `
      SELECT
        b.id,
        c.name,
        c.email,
        u.accept_notifications,
        s.date,
        avs.hour
      FROM booking AS b
      JOIN clients AS c ON b.client_id = c.id
      JOIN available_schedules AS avs ON b.schedule_id = avs.id
      JOIN schedules AS s ON b.date_id = s.id
      WHERE s.date = $1
        AND u.accept_notifications = true;
    `;
    const values = [currentDate];
    const result = await pool.query(query, values);
    // Por ejemplo, podrías recorrer los resultados y enviar un correo a cada usuario:
    for (const row of result.rows) {
      const { name, email, accept_notifications, date, hour } = row;
      if (accept_notifications) {
        bookingReminder(name, email, hour);
      }
    }
  } catch (error) {
    console.error('Error al obtener reservas y usuarios para recordatorio:', error);
  }
}

const getBookingsByBarberAndDay = async (req, res) => {
  try {
    const userId = req.user
    const barberQuery = 'SELECT id FROM barbers WHERE user_id = $1';
    const barberResult = await pool.query(barberQuery, [userId]);
    const barber_id = barberResult.rows[0].id;

    const query = `
    SELECT 
      b.*, 
      u.name as user_name, 
      c.last_name as user_lastname, 
      c.phone as user_phone, 
      h.name as haircut_name, 
      h.price as haircut_price, 
      s.date as booking_date, 
      avs.hour as booking_hour
    FROM booking as b
    INNER JOIN clients as c ON b.client_id = c.id
    INNER JOIN haircuts as h ON b.haircut_id = h.id
    INNER JOIN schedules as s ON b.date_id = s.id
    INNER JOIN available_schedules as avs ON b.schedule_id = avs.id
    WHERE b.barber_id = $1 AND s.date = '2024-01-15';
    `;
    const result = await pool.query(query, [barber_id]);

    if (result.rows.length === 0) return res.status(404).json({ message: "No hay datos para esta fecha" })
    res.json(result.rows)
  } catch (error) {
    console.log(error)
  }
}

export {
  getAllBookings,
  getBooking,
  getLastsBooking,
  getBookingsByBarberAndDay,
  createBooking,
  canceleBooking,
  updateBooking,
  updateAvailablesSchedules,
  bookingReminder
}