import pool from "../db.js";

const getAllAvailablesSchedule = async (req, res) => {
  try {
    const allBookings = await pool.query('SELECT * FROM available_schedules')

    console.log(allBookings)
    res.json(allBookings.rows)
  } catch (error) {
    console.log(error)
  }
}

const getAvailableSchedule = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM available_schedules WHERE id = $1', [id])

    console.log(result)

    if (result.rows.length === 0) return res.status(404).json({ message: "Barbero no encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    console.log(error)
  }
}

const createAvailableSchedule = async (req, res) => {
  const { name, last_name, age, birthdate, description, phone } = req.body;

  try {
    const query = `
      INSERT INTO available_schedules (name, last_name, age, birthdate, description, phone)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    const values = [name, last_name, age, birthdate, description, phone];

    const result = await pool.query(query, values);
    const barberId = result.rows[0].id;

    res.status(201).json({ message: 'Barbero creado correctamente.', barberId });
  } catch (error) {
    if (error.code === '23505' && error.constraint === 'unique_barber_schedule_date') {
      res.status(409).json({ error: 'La reserva para esta fecha y horario ya existe.' });
    } else {
      console.error('Error al intentar agendarte:', error);
      res.status(500).json({ error: 'Hubo un error al intentar hacer la reservación.' });
    }
  }
}

const deleteAvailableSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = 'DELETE FROM available_schedules WHERE id = $1';
    const barberResult = await pool.query(deleteQuery, [id]);

    if (barberResult.rowCount === 0) {
      return res.status(404).json({ message: "Barbero no encontrado" });
    }

    return res.status(204).send("Barbero eliminado correctamente");
  } catch (error) {
    return res.status(500).json({ error: "Hubo un error al eliminar el barbero" });
  }
}

const getDayByBarberAndDay = async (req, res) => {
  try {
    // Obtener el valor del día seleccionado que llega en el parámetro "date".
    const selectedDate = req.query.date; // Por ejemplo, req.query.date sería "2022-08-17".
    const selectedBarberId = req.query.barber_id;
    const isoDate = new Date(selectedDate).toISOString();

    // Aquí, realiza las consultas necesarias en la base de datos para encontrar el ID del día correspondiente.
    const query = `SELECT id FROM schedules WHERE date = $1 AND barber_id = $2`;
    const result = await pool.query(query, [isoDate, selectedBarberId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: `No se encontró ningún registro para la fecha: ${isoDate}.` });
    }

    const dayId = result.rows[0].id;
    console.log('ID del día seleccionado:', dayId);

    const scheduleQuery = `SELECT id, hour, status FROM available_schedules WHERE schedule_id = $1 ORDER BY id ASC`;
    const scheduleResult = await pool.query(scheduleQuery, [dayId]);

    const schedules = scheduleResult.rows;
    console.log('Lista de horarios:', schedules);

    res.status(200).json({ id: dayId, schedules });
  } catch (error) {
    console.error('Error al buscar la fecha:', error);
    return res.status(500).json({ error: "Hubo un error al buscar la fecha" });
  }
}

export {
  getAllAvailablesSchedule, getAvailableSchedule, createAvailableSchedule, deleteAvailableSchedule, getDayByBarberAndDay
}