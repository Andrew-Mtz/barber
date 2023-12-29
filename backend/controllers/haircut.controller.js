import pool from "../db.js";
import { deleteHaircutImage, uploadHaircutsImage } from "../libs/cloudinary.js";
import fs from "fs-extra"

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
  try {
    const { name, price, description } = req.body;
    let image

    if (req.files && req.files.image) {
      const result = await uploadHaircutsImage(req.files.image.tempFilePath);
      await fs.remove(req.files.image.tempFilePath)
      image = {
        url: result.secure_url,
        public_id: result.public_id
      }
    } else {
      res.status(404).json({ message: 'Ha ocurrido un problema al guardar la foto' });
    }
    const query = `
      INSERT INTO haircuts (name, price, description, image)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
    const values = [name, price, description, image];

    const result = await pool.query(query, values);
    const haircutId = result.rows[0].id;

    res.status(201).json({ message: 'Corte creado correctamente.', haircutId });
  } catch (error) {
    console.error('Error al intentar agregar el corte:', error);
    res.status(500).json({ error: 'Hubo un error al intentar agregar el corte' });
  }
}

const deleteHaircut = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteQuery = 'DELETE FROM haircuts WHERE id = $1';
    const haircutResult = await pool.query(deleteQuery, [id]);

    if (haircutResult.rowCount === 0) {
      return res.status(404).json({ message: "Corte no encontrado" });
    }

    if (haircutResult.rows[0].image.public_id) {
      await deleteHaircutImage(barberResult.rows[0].image.public_id)
    }
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ error: "Hubo un error al eliminar el corte" });
  }
}

const updateHaircut = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const result = await pool.query(
      'UPDATE haircuts SET name = $1, price = $2, description = $3 WHERE id = $4 RETURNING *',
      [name, price, description, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Corte no encontrado" });

    res.status(200).json({ message: 'Corte editado correctamente.', id });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
}

export {
  getAllHaircuts, getHaircut, createHaircut, deleteHaircut, updateHaircut, getHaircutByBarber
}