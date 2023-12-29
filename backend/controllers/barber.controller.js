import pool from "../db.js";
import { deleteBarberImage, uploadBarberImage } from "../libs/cloudinary.js";
import fs from "fs-extra"

const getAllBarbers = async (req, res) => {
  try {
    const query = `
    SELECT
    b.id,
    b.name,
    b.last_name,
    b.description,
    b.phone,
    b.image,
    b.full_description,
    ARRAY_AGG(DISTINCT  bhm.image) AS hc_by_barber,
    AVG(r.rating) AS average_rating
  FROM barbers AS b
  LEFT JOIN barber_haircuts_made AS bhm ON b.id = bhm.barber_id
  LEFT JOIN reviews AS r ON b.id = r.barber_id
  GROUP BY
    b.id,
    b.name,
    b.last_name,
    b.description,
    b.phone,
    b.image,
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
  try {
    const { name, last_name, description, full_description, phone } = req.body;
    let image

    if (req.files && req.files.image) {
      const result = await uploadBarberImage(req.files.image.tempFilePath);
      await fs.remove(req.files.image.tempFilePath)
      image = {
        url: result.secure_url,
        public_id: result.public_id
      }
    } else {
      res.status(404).json({ message: 'Ha ocurrido un problema al guardar la foto' });
    }

    const query = `
          INSERT INTO barbers (name, last_name, description, full_description, phone, image)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id
        `;
    const values = [name, last_name, description, full_description, phone, image];
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
    const deleteQuery = 'DELETE FROM barbers WHERE id = $1 RETURNING *';
    const barberResult = await pool.query(deleteQuery, [id]);

    if (barberResult.rowCount === 0) {
      return res.status(404).json({ message: "Barbero no encontrado" });
    }

    if (barberResult.rows[0].image.public_id) {
      await deleteBarberImage(barberResult.rows[0].image.public_id)
    }
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ error: "Hubo un error al eliminar el barbero" });
  }
}

const updateBarber = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, last_name, description, full_description, phone } = req.body;
    const result = await pool.query(
      'UPDATE barbers SET name = $1, last_name = $2, description = $3, full_description = $4, phone = $5 WHERE id = $6 RETURNING *',
      [name, last_name, description, full_description, phone, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Barbero no encontrado" });

    res.status(200).json({ message: 'Barbero editado correctamente.', id });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
}

const addHaircutsToBarber = async () => {
  try {
    const { barberId, haircutIds } = req.body;

    for (const haircutId of haircutIds) {
      const insertQuery = `INSERT INTO barber_haircuts (barber_id, haircut_id) VALUES ($1, $2)`;
      const values = [barberId, haircutId];
      const result = await pool.query(insertQuery, values);
    }
    if (result.rows.length === 0) return res.status(404).json({ message: "Barbero no encontrado" });
    res.status(200).json({ message: 'Cortes asignados correctamente.', id });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
}

export {
  getAllBarbers, getBarber, createBarber, deleteBarber, updateBarber, addHaircutsToBarber
}