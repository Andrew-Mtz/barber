import pool from "../db.js";

const scheduleByBarber = async (req, res) => {
  try {
    const period = req.query.period;
    const barberId = req.query.barberId;
    // Obtén el año y mes actual y el siguiente
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0);
    const lastDayOfNextMonth = new Date(currentYear, nextMonth, 0);

    const targetMonth = period === 'actual' ? currentMonth : nextMonth;
    const targetYear = period === 'actual' ? currentYear : nextYear;
    const targetLastDay = period === 'actual' ? lastDayOfMonth : lastDayOfNextMonth;

    const sqlToCurrent = `
    SELECT * FROM schedules 
    WHERE barber_id = $1 
    AND EXTRACT(YEAR FROM date) = $2
    AND EXTRACT(MONTH FROM date) = $3`

    const result = await pool.query(sqlToCurrent, [barberId, targetYear, targetMonth])

    const startMonth = `${targetYear}-${targetMonth}-01`
    const endMonth = `${targetYear}-${targetMonth}-${targetLastDay.toLocaleDateString('en-US', { day: '2-digit' })}`

    if (result.rows.length === 0) return res.status(200).json({ empty: true, range: { startMonth: startMonth, endMonth: endMonth } })

    res.status(200).json({ empty: false, range: { startMonth: startMonth, endMonth: endMonth } })
  } catch (error) {
    console.log(error)
  }
}

const createSchedule = async (req, res) => {
  try {
    await pool.query('BEGIN');

    const startHour = new Date(req.query.startHour);
    const endHour = new Date(req.query.endHour);
    const period = req.query.period;
    const barberId = req.query.barberId;

    const availableHours = generateAvailableHours(startHour, endHour);

    // Obtén el año y mes actual y el siguiente
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0);
    const lastDayOfNextMonth = new Date(currentYear, nextMonth, 0);

    const targetMonth = period === 'actual' ? currentMonth : nextMonth;
    const targetYear = period === 'actual' ? currentYear : nextYear;
    const targetLastDay = period === 'actual' ? lastDayOfMonth : lastDayOfNextMonth;

    // Agregar horarios para el mes actual
    for (let day = 1; day <= targetLastDay.getDate(); day++) {
      const date = `${targetYear}-${targetMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const sql = `INSERT INTO schedules (date, barber_id)
                    VALUES ($1, $2)
                    ON CONFLICT (barber_id, date) DO NOTHING
                    RETURNING id;`;
      try {
        const scheduleResults = await pool.query(sql, [date, barberId]);
        const scheduleId = scheduleResults.rows[0].id;

        for (const hour of availableHours) {
          const sqlInsertAvailableSchedule = `INSERT INTO available_schedules (hour, schedule_id) VALUES ($1, $2)`;
          await pool.query(sqlInsertAvailableSchedule, [hour, scheduleId]);
        }
        console.log(`Horario agregado para el barbero ${barberId} en la fecha ${date}`);
      } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error al agregar horario:', err);
        console.log(barberId, date)
      }
    }
    await pool.query('COMMIT');
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error al agregar horario disponible', error);
  }
}

const generateAvailableHours = (startDateTime, endDateTime) => {
  const formattedHours = [];

  // Establecer la fecha y hora de inicio
  const currentHour = new Date(startDateTime);
  const endHour = new Date(endDateTime);

  // Lanzar un error si currentHour es mayor o igual a endHour
  if (currentHour >= endHour) {
    throw new Error('La hora actual supera o iguala la hora de finalización.');
  }

  while (currentHour <= endHour) {
    // Formatear la hora en formato 'HH:mm'
    const formattedHour = currentHour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    formattedHours.push(formattedHour);

    // Incrementar la hora en 1 hora
    currentHour.setHours(currentHour.getHours() + 1);
  }

  return formattedHours;
};

const getUnavailableDates = async (req, res) => {
  try {

    const selectedBarberId = req.query.barber_id;
    const year = req.query.year;
    const month = req.query.month;
    const query = `
    SELECT ARRAY_AGG(date) AS unavailable_dates
    FROM schedules
    WHERE EXTRACT(YEAR FROM date) = $1
      AND EXTRACT(MONTH FROM date) = $2
      AND barber_id = $3
      AND status = 2;`;
    const result = await pool.query(query, [year, month, selectedBarberId]);

    if (result.rowCount === 0 || !result.rows[0].unavailable_dates) {
      return res.status(404).json([]);
    }
    const unavailableDates = result.rows[0].unavailable_dates;
    res.status(200).json(unavailableDates);
  } catch (error) {
    console.error('Error al buscar la fecha:', error);
    return res.status(500).json({ error: "Hubo un error al buscar la fecha" });
  }
}

const disableDay = async (req, res) => {
  try {
    const { id } = req.params;

    // Comenzar la transacción
    await pool.query('BEGIN');

    // Verificar si hay reservas para el día
    const reservationsResult = await pool.query(
      'SELECT id FROM booking WHERE date_id = $1', [id]
    );

    if (reservationsResult.rows.length > 0) {
      // Eliminar las reservas asociadas al día
      for (const reservation of reservationsResult.rows) {
        await pool.query(
          'DELETE FROM bookings WHERE id = $1', [reservation.id]
        );
      }
    }
    // Deshabilitar el día en el calendario
    const calendarUpdateResult = await pool.query(
      'UPDATE schedules SET status = 2 WHERE id = $1 RETURNING *', [id]
    );

    if (calendarUpdateResult.rows.length === 0) {
      // No se encontró el día en el calendario
      return res.status(404).json({ message: "Día no encontrado" });
    }

    // Commit la transacción si todo fue exitoso
    await pool.query('COMMIT');

    res.status(200).json({ message: 'Día actualizado correctamente.', id });
  } catch (error) {
    console.error('Error al buscar la fecha:', error);
    return res.status(500).json({ error: "Hubo un error al buscar la fecha" });
  }
}

const enableDay = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE schedules SET status = 1 WHERE id = $1 RETURNING *', [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Día no encontrado" });

    res.status(200).json({ message: 'Día actualizado correctamente.', id });
  } catch (error) {
    console.error('Error al buscar la fecha:', error);
    return res.status(500).json({ error: "Hubo un error al buscar la fecha" });
  }
}

export {
  scheduleByBarber, createSchedule, getUnavailableDates, disableDay, enableDay
}
