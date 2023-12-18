import pool from "../db.js";

const getAllBarbers = async (req, res) => {
  try {
    const query = `
    SELECT
    b.id,
    b.name,
    b.last_name,
    b.age,
    b.birthdate,
    b.description,
    b.phone,
    b.barber_image_url,
    b.full_description,
    ARRAY_AGG(DISTINCT  bhm.haircut_image_url) AS haircut_image_urls,
    AVG(r.rating) AS average_rating
  FROM barbers AS b
  LEFT JOIN barber_haircuts_made AS bhm ON b.id = bhm.barber_id
  LEFT JOIN reviews AS r ON b.id = r.barber_id
  GROUP BY
    b.id,
    b.name,
    b.last_name,
    b.age,
    b.birthdate,
    b.description,
    b.phone,
    b.barber_image_url,
    b.full_description;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los datos de barberos y cortes de pelo' });
  }
};

const getBarber = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM barbers WHERE id = $1', [id])

    if (result.rows.length === 0) return res.status(404).json({ message: "Barbero no encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    console.log(error)
  }
}

const createBarber = async (req, res) => {
  const { name, last_name, age, birthdate, description, phone } = req.body;

  try {
    const query = `
      INSERT INTO barbers (name, last_name, age, birthdate, description, phone)
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

const deleteBarber = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = 'DELETE FROM barbers WHERE id = $1';
    const barberResult = await pool.query(deleteQuery, [id]);

    if (barberResult.rowCount === 0) {
      return res.status(404).json({ message: "Barbero no encontrado" });
    }

    return res.status(204).send("Barbero eliminado correctamente");
  } catch (error) {
    return res.status(500).json({ error: "Hubo un error al eliminar el barbero" });
  }
}

const updateBarber = async (req, res) => {
  res.send('Editing a booking');
}

export {
  getAllBarbers, getBarber, createBarber, deleteBarber, updateBarber
}