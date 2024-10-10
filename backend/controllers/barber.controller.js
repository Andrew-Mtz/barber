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
    AVG(r.rating) AS average_rating
  FROM barbers AS b
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
    if (result.rowCount === 0) {
      return res.status(404).json({response: [], error: ''});
    }
    res.json({response: result.rows, error: ''});
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: [], error: 'Error al obtener los barberos' });
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
    await pool.query('BEGIN');

    const { name, last_name, email, description, full_description, phone } = req.body;
    let image;

    if (req.files && req.files.image) {
      const result = await uploadBarberImage(req.files.image.tempFilePath);
      await fs.remove(req.files.image.tempFilePath);
      image = {
        url: result.secure_url,
        public_id: result.public_id
      };
    } else {
      return res.status(404).json({ message: 'Ha ocurrido un problema al guardar la foto' });
    }

    // Crear el usuario
    const userQuery = `
      INSERT INTO users (email, password, user_type)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    // Aquí podrías generar una contraseña aleatoria, por ejemplo:
    const password = generateRandomPassword();
    const userValues = [email, password, 'barber'];
    const userResult = await pool.query(userQuery, userValues);
    const userId = userResult.rows[0].id;

    // Crear el barbero
    const barberQuery = `
      INSERT INTO barbers (name, last_name, description, full_description, phone, image, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    const barberValues = [name, last_name, description, full_description, phone, image, userId];
    const barberResult = await pool.query(barberQuery, barberValues);
    const barberId = barberResult.rows[0].id;

    await pool.query('COMMIT');

    return res.status(201).json({ message: 'Barbero creado correctamente.', barberId });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error al intentar crear el barbero:', error);
    res.status(500).json({ error: 'Hubo un error al intentar crear el barbero.' });
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

const generateRandomPassword = (length = 10) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

export {
  getAllBarbers, getBarber, createBarber, deleteBarber, updateBarber, addHaircutsToBarber
}