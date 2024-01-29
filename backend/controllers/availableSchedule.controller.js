import pool from "../db.js";

const getAllAvailablesSchedule = async (req, res) => {
  try {
    const allBookings = await pool.query('SELECT * FROM available_schedules')
    res.json(allBookings.rows)
  } catch (error) {
    console.log(error)
  }
}

const getAvailableSchedule = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM available_schedules WHERE id = $1', [id])

    if (result.rows.length === 0) return res.status(404).json({ message: "Horario no encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    console.log(error)
  }
}

const getAllSchedules = async (req, res) => {
  try {
    // Obtener el valor del día seleccionado que llega en el parámetro "date".
    const selectedDate = req.query.date; // Por ejemplo, req.query.date sería "2022-08-17".
    const selectedBarberId = req.query.barber_id;
    const isoDate = new Date(selectedDate).toISOString();

    // Aquí, realiza las consultas necesarias en la base de datos para encontrar el ID del día correspondiente.
    const query = `SELECT id, status FROM schedules WHERE date = $1 AND barber_id = $2`;
    const result = await pool.query(query, [isoDate, selectedBarberId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: `No se encontró ningún registro para la fecha: ${isoDate}.` });
    }

    const dayId = result.rows[0].id;
    const dayStatus = result.rows[0].status;

    const availableScheduleQuery = `SELECT id, hour, status FROM available_schedules WHERE schedule_id = $1`;
    const availableScheduleResult = await pool.query(availableScheduleQuery, [dayId]);

    const availableSchedules = availableScheduleResult.rows;

    res.status(200).json({ id: dayId, status: dayStatus, availableSchedules });
  } catch (error) {
    console.error('Error al buscar la fecha:', error);
    return res.status(500).json({ error: "Hubo un error al buscar la fecha" });
  }
}

const getSchedulesByStatus = async (req, res) => {
  try {
    // Obtener el valor del día seleccionado que llega en el parámetro "date".
    const selectedDate = req.query.date; // Por ejemplo, req.query.date sería "2022-08-17".
    const selectedBarberId = req.query.barber_id;
    const isoDate = new Date(selectedDate).toISOString();

    // Aquí, realiza las consultas necesarias en la base de datos para encontrar el ID del día correspondiente.
    const query = `SELECT id, status FROM schedules WHERE date = $1 AND barber_id = $2`;
    const result = await pool.query(query, [isoDate, selectedBarberId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: `No se encontró ningún registro para la fecha: ${isoDate}.` });
    }

    const dayId = result.rows[0].id;
    const dayStatus = result.rows[0].status;

    const availableScheduleQuery = `SELECT id, hour, status FROM available_schedules WHERE schedule_id = $1 AND status = 1`;
    const availableScheduleResult = await pool.query(availableScheduleQuery, [dayId]);

    const reservedScheduleQuery = `SELECT id, hour, status FROM available_schedules WHERE schedule_id = $1 AND status = 2`;
    const reservedScheduleResult = await pool.query(reservedScheduleQuery, [dayId]);

    const unavailableScheduleQuery = `SELECT id, hour, status FROM available_schedules WHERE schedule_id = $1 AND status = 3`;
    const unavailableScheduleResult = await pool.query(unavailableScheduleQuery, [dayId]);

    const availableSchedules = availableScheduleResult.rows;
    const reservedSchedules = reservedScheduleResult.rows;
    const unavailableSchedules = unavailableScheduleResult.rows;

    res.status(200).json({ id: dayId, status: dayStatus, availableSchedules, reservedSchedules, unavailableSchedules });
  } catch (error) {
    console.error('Error al buscar la fecha:', error);
    return res.status(500).json({ error: "Hubo un error al buscar la fecha" });
  }
}

const disableHour = async (req, res) => {
  try {
    const { ids } = req.body;
    console.log(req.body)
    // Comenzar la transacción
    await pool.query('BEGIN');

    for (const id of ids) {
      // Verificar si hay reservas para el horario
      const reservationsResult = await pool.query(
        'SELECT id FROM booking WHERE schedule_id = $1', [id]
      );

      if (reservationsResult.rows.length > 0) {
        // Eliminar las reservas asociadas al horario
        for (const reservation of reservationsResult.rows) {
          await pool.query(
            'DELETE FROM bookings WHERE id = $1', [reservation.id]
          );
        }
      }

      // Deshabilitar el horario en el calendario
      const calendarUpdateResult = await pool.query(
        'UPDATE available_schedules SET status = 3 WHERE id = $1 RETURNING *', [id]
      );

      if (calendarUpdateResult.rows.length === 0) {
        // No se encontró el horario en el calendario
        return res.status(404).json({ message: "Hora no encontrada" });
      }
    }

    // Commit la transacción si todo fue exitoso
    await pool.query('COMMIT');

    res.status(200).json({ message: 'Horas actualizadas correctamente.' });
  } catch (error) {
    console.error('Error al buscar la fecha:', error);
    return res.status(500).json({ error: "Hubo un error al buscar la fecha" });
  }
}

const enableHour = async (req, res) => {
  try {
    const { ids } = req.body;

    for (const id of ids) {
      const result = await pool.query(
        'UPDATE available_schedules SET status = 1 WHERE id = $1 RETURNING *', [id]
      );
      if (result.rows.length === 0) return res.status(404).json({ message: "Horas no encontrada", id });
    }

    res.status(200).json({ message: 'Horas actualizadas correctamente.' });
  } catch (error) {
    console.error('Error al buscar la fecha:', error);
    return res.status(500).json({ error: "Hubo un error al buscar la fecha" });
  }
}

export {
  getAllAvailablesSchedule, getAvailableSchedule, getAllSchedules, getSchedulesByStatus, disableHour, enableHour
}