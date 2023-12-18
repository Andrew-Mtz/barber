import pool from "../db.js";

const getAllReviews = async (req, res) => {
  try {
    const allReviewsQuery = `
    SELECT r.id, r.comment, r.rating, r.created_at, r.user_name, r.user_last_name FROM reviews as r
    WHERE is_pending = false
    ORDER BY created_at DESC
    LIMIT 10;
  `;
    const allReviews = await pool.query(allReviewsQuery)
    res.json(allReviews.rows)
  } catch (error) {
    console.log(error)
  }
}

const getReviewsByBarber = async (req, res) => {
  try {
    const existingReviewQuery = `
    SELECT r.id, r.comment, r.rating, r.created_at, r.user_name, r.user_last_name FROM reviews as r
    WHERE barber_id = $1 AND is_pending = false
    ORDER BY created_at DESC
    LIMIT 9;
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
    SELECT r.id, r.comment, r.rating, r.created_at, r.user_name, r.user_last_name FROM reviews as r
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
  const actualDate = new Date().toISOString().split('T')[0];
  try {
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
export {
  getAllReviews,
  getReviewsByBarber,
  getMyReview,
  createReview,
  updateReview,
}