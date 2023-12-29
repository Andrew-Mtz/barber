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
    const id = req.query.id
    const result = await pool.query(`SELECT ARRAY_AGG(haircut_id) AS id FROM barber_haircuts WHERE barber_id = $1`, [id]);
    const haircutIds = result.rows[0].id || [];
    res.json(haircutIds);
  } catch (error) {
    console.log(error)
  }
}

const createLinkBarberHaircuts = async (req, res) => {
  try {
    const { barberId, haircutIds } = req.body;

    // Iterar sobre cada haircutId y realizar la inserción individual
    for (const haircutId of haircutIds) {
      const insertQuery = 'INSERT INTO barber_haircuts (barber_id, haircut_id) VALUES ($1, $2)';
      const params = [barberId, haircutId];

      try {
        await pool.query(insertQuery, params);
      } catch (error) {
        console.error(`Error al asignar corte ${haircutId} al barbero ${barberId}:`, error.message);
      }
    }
  } catch (error) {
    console.log(error)
  }
}

export {
  getBarbersAndHaircuts, getLinkedHaircuts, createLinkBarberHaircuts
}