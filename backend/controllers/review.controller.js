import pool from "../db.js";

const getReviewsByBarber = async (req, res) => {
  try {
    const existingReviewQuery = `
    SELECT r.id, r.comment, r.rating, r.created_at, c.name as user_name, r.last_name as user_last_name, b.name as barber_name, b.last_name as barber_last_name
    FROM reviews as r
    LEFT JOIN barbers as b ON r.barber_id = b.id
    LEFT JOIN clients as c ON r.client_id = c.id
    WHERE barber_id = $1 AND is_pending = false
    ORDER BY DATE(created_at) DESC, rating DESC
    LIMIT 10;
  `;
    const selectedBarberId = req.query.barber_id;
    const existingReviewResult = await pool.query(existingReviewQuery, [selectedBarberId]);
    res.json(existingReviewResult.rows)
  } catch (error) {
    console.log(error)
  }
}

const getMyReview = async (req, res) => {
  try {
    const existingReviewQuery = `
    SELECT r.id, r.comment, r.rating, r.created_at, c.name as user_name, r.last_name as user_last_name, b.name as barber_name, b.last_name as barber_last_name
    FROM reviews as r
    LEFT JOIN barbers as b ON r.barber_id = b.id
    LEFT JOIN clients as c ON r.client_id = c.id
    WHERE r.id = $1 
  `;
    const selectedReviewId = req.query.review_id;
    const existingReviewResult = await pool.query(existingReviewQuery, [selectedReviewId]);
    res.json(existingReviewResult.rows)
  } catch (error) {
    console.log(error)
  }
}

const createReview = async (req, res) => {
  try {
    const user_id = req.user

    const { reviewId, rating, comment } = req.body;

    // Verificar si el usuario ya tiene una reserva para esta fecha y horario
    const existingReviewQuery = `
      SELECT * FROM reviews
      WHERE id = $1
    `;
    const existingReviewValues = [reviewId];
    const existingReviewResult = await pool.query(existingReviewQuery, existingReviewValues);

    if (!existingReviewResult.rows[0].is_pending) {
      return res.status(409).json({ error: 'Ya reseñaste este corte' });
    }

    const query = `
      UPDATE  reviews 
      SET comment = $1, 
      rating = $2,
      created_at = CURRENT_TIMESTAMP,
      is_pending = false
      WHERE id = $3;
    `;
    const values = [comment, rating, reviewId];

    const result = await pool.query(query, values);
    res.status(201).json({ message: 'Reseña agregada correctamente.' });
  } catch (error) {
    console.error('Error al intentar guardar la reseña:', error);
    res.status(500).json({ error: 'Hubo un error al intentar hacer la reservación.' });
  }
}

const updateReview = async (hourToExpire) => {
  try {
    const actualDate = new Date().toISOString().split('T')[0];
    // Ejecuta una consulta SQL para actualizar las reservas
    const query = `
      UPDATE booking
      SET status = 'expired'
      FROM available_schedules AS a
      JOIN schedules AS s ON a.schedule_id = s.id
      WHERE
        booking.status <> 'expired'
        AND s.date = $1
        AND a.hour = $2
        AND booking.schedule_id = a.id
    `;

    const values = [actualDate, hourToExpire];
    const result = await pool.query(query, values);

    console.log(`Reservas actualizadas a "expiradas" para la fecha ${actualDate} y hora ${hourToExpire}.`);
  } catch (error) {
    console.error('Error al actualizar las reservas:', error);
  }
}

const getFilteredReviews = async (req, res) => {
  try {
    const barber = req.query.barber || 'all';
    const haircut = req.query.haircut || 'all';
    const type = req.query.type || 'default';

    let orderByClause;

    // Configurar el tipo de orden
    switch (type) {
      case 'recents':
        orderByClause = 'ORDER BY created_at DESC';
        break;
      case 'most_value':
        orderByClause = 'ORDER BY rating DESC';
        break;
      default:
        orderByClause = ''; // Orden por defecto o 'default'
        break;
    }

    // Configurar las condiciones WHERE
    const whereConditions = [];
    const whereParams = [];

    if (barber !== 'all') {
      whereConditions.push('barber_id = $1');
      whereParams.push(barber);
    }

    if (haircut !== 'all') {
      const haircutIndex = barber !== 'all' ? whereParams.length + 1 : 1;
      whereConditions.push(`haircuts_id = $${haircutIndex}`);
      whereParams.push(haircut);
    }

    whereConditions.push('is_pending = false');

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const existingReviewQuery = `
      SELECT r.id, r.comment, r.rating, r.created_at, c.name as user_name, c.last_name as user_last_name, b.name as barber_name, b.last_name as barber_last_name
      FROM reviews as r
      LEFT JOIN barbers as b ON r.barber_id = b.id
      LEFT JOIN clients as c ON r.client_id = c.id
      ${whereClause}
      ${orderByClause};
    `;
    const existingReviewResult = await pool.query(existingReviewQuery, whereParams);
    if (existingReviewResult.rowCount === 0) {
      return res.status(404).json({ response: [], error: '' });
    }
    res.json({ response: existingReviewResult.rows, error: '' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export {
  getReviewsByBarber,
  getMyReview,
  createReview,
  updateReview,
  getFilteredReviews
}