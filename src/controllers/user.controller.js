import pool from "../db.js";

const getUser = async (req, res) => {
  try {
    const user_id = req.user
    console.log(user_id)
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [user_id])

    if (result.rows.length === 0) return res.status(404).json({ message: "Usuario no encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    console.log(error)
  }
}

export {
  getUser
}