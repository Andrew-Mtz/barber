import pool from "../db.js";

const getBarbersAndHaircuts = async (req, res) => {
  try {
    const resultsBarbers = await getBarbers();
    const resultsHaircuts = await getHaircuts()

    const organizedData = {
      barbers: [],
      haircuts: []
    };

    resultsBarbers.forEach(detail => {
      const { id, name, last_name } = detail;
      organizedData.barbers.push({
        id,
        name: `${name} ${last_name}`
      });
    });

    resultsHaircuts.forEach(detail => {
      const { id, name } = detail;
      organizedData.haircuts.push({
        id,
        name
      });
    });
    res.json(organizedData)
  } catch (error) {
    console.log(error)
  }
}

const getBarbers = async () => {
  try {
    const result = await pool.query(`SELECT id, name, last_name FROM barbers`);
    return result.rows
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getHaircuts = async (year, month) => {
  try {
    const result = await pool.query(`SELECT id, name FROM haircuts`);
    return result.rows
  } catch (error) {
    console.log(error);
    throw error
  }
}

const getLinkedHaircuts = async (req, res) => {
  try {
    const barberId = req.query.id
    const result = await pool.query(`SELECT ARRAY_AGG(haircut_id) AS id FROM barber_haircuts WHERE barber_id = $1`, [barberId]);
    const haircutIds = result.rows[0].id || [];
    res.json(haircutIds);
  } catch (error) {
    console.log(error)
  }
}

const associateHaircutsWithBarber = async (req, res) => {
  try {
    const { barberId, haircutIds, linkedHaircutsIds } = req.body;
    await pool.query('BEGIN');

    // Asociar nuevos cortes
    for (const newHaircutId of haircutIds) {
      // Verificar si el corte ya está vinculado
      if (!linkedHaircutsIds.includes(newHaircutId)) {
        await pool.query(
          'INSERT INTO barber_haircuts (barber_id, haircut_id) VALUES ($1, $2)',
          [barberId, newHaircutId]
        );
      }
    }

    // Desasociar cortes existentes que no están en la lista haircutIds
    for (const existingHaircutId of linkedHaircutsIds) {
      if (!haircutIds.includes(existingHaircutId)) {
        await pool.query(
          'DELETE FROM barber_haircuts WHERE barber_id = $1 AND haircut_id = $2',
          [barberId, existingHaircutId]
        );
      }
    }
    // Confirmar la transacción
    await pool.query('COMMIT');
    res.status(200).json({ success: true, message: 'Cortes asociados/desasociados correctamente.' });
  } catch (error) {
    // Si hay algún error, revertir la transacción
    await pool.query('ROLLBACK');
    console.error('Error en la transacción:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor.' });
  }
}

export {
  getBarbersAndHaircuts, getLinkedHaircuts, associateHaircutsWithBarber,
}