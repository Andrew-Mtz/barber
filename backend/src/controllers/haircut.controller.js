import pool from "../db.js";

const getAllHaircuts = async (req, res) => {
  try {
    const allBookings = await pool.query('SELECT * FROM haircuts')
    res.json(allBookings.rows)
  } catch (error) {
    console.log(error)
  }
}

const getHaircut = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM haircuts WHERE id = $1', [id])

    if (result.rows.length === 0) return res.status(404).json({ message: "Corte no encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    console.log(error)
  }
}

const getHaircutByBarber = async (req, res) => {
  try {
    const selectedBarberId = req.query.barber_id;
    const result = await pool.query('SELECT * FROM barber_haircuts WHERE barber_id = $1', [selectedBarberId])

    if (result.rows.length === 0) return res.status(404).json({ message: "Cortes no encontrados para ese barbero" })
    // Mapea los IDs de cortes de pelo en un array
    const haircutIds = result.rows.map(row => row.haircut_id);

    // Obtiene la información completa de los cortes de pelo
    const haircuts = await pool.query('SELECT * FROM haircuts WHERE id = ANY($1)', [haircutIds]);
    res.json(haircuts.rows);
  } catch (error) {
    console.error('Error al intentar obtener cortes:', error);
    res.status(500).json({ error: 'Hubo un error al intentar obtener los cortes' });
  }
}

const createHaircut = async (req, res) => {
  const { name, last_name, age, birthdate, description, phone } = req.body;

  try {
    const query = `
      INSERT INTO haircuts (name, last_name, age, birthdate, description, phone)
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

const deleteHaircut = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = 'DELETE FROM haircuts WHERE id = $1';
    const barberResult = await pool.query(deleteQuery, [id]);

    if (barberResult.rowCount === 0) {
      return res.status(404).json({ message: "Barbero no encontrado" });
    }

    return res.status(204).send("Barbero eliminado correctamente");
  } catch (error) {
    return res.status(500).json({ error: "Hubo un error al eliminar el barbero" });
  }
}

const updateHaircut = async (req, res) => {
  res.send('Editing a booking');
}

export {
  getAllHaircuts, getHaircut, createHaircut, deleteHaircut, updateHaircut, getHaircutByBarber
}