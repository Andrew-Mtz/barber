import pool from "../db.js";

const getAllHaircuts = async (req, res) => {
  try {
    const allBookings = await pool.query('SELECT * FROM haircuts')

    console.log(allBookings)
    res.json(allBookings.rows)
  } catch (error) {
    console.log(error)
  }
}

const getHaircut = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM haircuts WHERE id = $1', [id])

    console.log(result)

    if (result.rows.length === 0) return res.status(404).json({ message: "Barbero no encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    console.log(error)
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
  getAllHaircuts, getHaircut, createHaircut, deleteHaircut, updateHaircut
}