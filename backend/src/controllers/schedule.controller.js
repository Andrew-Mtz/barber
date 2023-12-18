import pool from "../db.js";

const getAllSchedules = async (req, res) => {
  try {
    const allBookings = await pool.query('SELECT * FROM schedules')
    res.json(allBookings.rows)
  } catch (error) {
    console.log(error)
  }
}

const getSchedule = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM schedules WHERE id = $1', [id])

    if (result.rows.length === 0) return res.status(404).json({ message: "Barbero no encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    console.log(error)
  }
}

const createSchedule = async (req, res) => {
  // Obtén el año y mes actual y el siguiente
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
  const lastDayOfMonth = new Date(currentYear, currentMonth, 0);
  const lastDayOfNextMonth = new Date(currentYear, nextMonth, 0);

  try {
    // Obtener los IDs de los barberos
    const barberIdsResult = await pool.query('SELECT id FROM barbers');
    const barberIds = barberIdsResult.rows.map(row => row.id);

    // Agregar horarios para el mes actual
    for (let barberId of barberIds) {
      for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const date = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const sql = `INSERT INTO schedules (date, barber_id) VALUES ($1, $2) RETURNING id`;

        try {
          const scheduleResults = await pool.query(sql, [date, barberId]);
          const scheduleId = scheduleResults.rows[0].id;

          const availableHours = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']

          for (const hour of availableHours) {
            const sqlInsertAvailableSchedule = `INSERT INTO available_schedules (hour, schedule_id) VALUES ($1, $2)`;
            await pool.query(sqlInsertAvailableSchedule, [hour, scheduleId]);
          }
          console.log(`Horario agregado para el barbero ${barberId} en la fecha ${date}`);
        } catch (err) {
          console.error('Error al agregar horario:', err);
        }
      }
    }

    /* // Agregar horarios para el mes siguiente
    for (let barberId of barberIds) {
      for (let day = 1; day <= lastDayOfNextMonth.getDate(); day++) {
        const date = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const sql = `INSERT INTO schedules (date, barber_id) VALUES ($1, $2) RETURNING id`;

        try {
          const scheduleResults = await pool.query(sql, [date, barberId]);
          const scheduleId = scheduleResults.rows[0].id;

          const availableHours = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

          for (const hour of availableHours) {
            const sqlInsertAvailableSchedule = `INSERT INTO available_schedules (hour, schedule_id) VALUES ($1, $2)`;
            await pool.query(sqlInsertAvailableSchedule, [hour, scheduleId]);
          }
          console.log(`Horario agregado para el barbero ${barberId} en la fecha ${date}`);
        } catch (err) {
          //console.error('Error al agregar horario:', err);
        }
      }
    } */
  } catch (error) {
    console.error('Error al agregar horario disponible catch:', error);
  }
}

const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = 'DELETE FROM schedules WHERE id = $1';
    const barberResult = await pool.query(deleteQuery, [id]);

    if (barberResult.rowCount === 0) {
      return res.status(404).json({ message: "Barbero no encontrado" });
    }

    return res.status(204).send("Barbero eliminado correctamente");
  } catch (error) {
    return res.status(500).json({ error: "Hubo un error al eliminar el barbero" });
  }
}

const generateHourRange = (startHour, endHour) => {
  const start = new Date(`2000-01-01T${startHour}:00:00`);
  const end = new Date(`2000-01-01T${endHour}:00:00`);
  const hourRange = [];

  while (start <= end) {
    const formattedHour = start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    hourRange.push(formattedHour);
    start.setHours(start.getHours() + 1);
  }

  return hourRange;
}

export {
  getAllSchedules, getSchedule, createSchedule, deleteSchedule
}
