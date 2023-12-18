import pool from "../db.js";

const getUser = async (req, res) => {
  try {
    const user_id = req.user
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [user_id])

    if (result.rows.length === 0) return res.status(404).json({ message: "Usuario no encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    console.log(error)
  }
}

const editUserData = async (req, res) => {
  try {
    const user_id = req.user;
    const { name, last_name, phone, email } = req.body;
    const result = await pool.query(
      'UPDATE users SET name = $1, last_name = $2, phone = $3, email = $4 WHERE id = $5 RETURNING *',
      [name, last_name, phone, email, user_id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
} 

export {
  getUser,
  editUserData
}