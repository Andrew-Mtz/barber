import pool from "../db.js";

const getUser = async (req, res) => {
  try {
    const user_id = req.user
    const query = `
    SELECT c.name, c.last_name, u.email, c.accept_notifications, c.phone
    FROM clients c
    JOIN users u ON c.user_id = u.id
    WHERE c.user_id = $1
  `;
    const result = await pool.query(query, [user_id]);

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

    // Inicia una transacción
    await pool.query('BEGIN');

    // Actualiza los datos en la tabla clients
    const clientResult = await pool.query(
      'UPDATE clients SET name = $1, last_name = $2, phone = $3 WHERE user_id = $4 RETURNING *',
      [name, last_name, phone, user_id]
    );

    if (clientResult.rows.length === 0) {
      await pool.query('ROLLBACK'); // Revierte la transacción si no se encuentra el cliente
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualiza el email en la tabla users
    const userResult = await pool.query(
      'UPDATE users SET email = $1 WHERE id = $2 RETURNING *',
      [email, user_id]
    );

    if (userResult.rows.length === 0) {
      await pool.query('ROLLBACK'); // Revierte la transacción si no se encuentra el usuario
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Si todo fue exitoso, confirma la transacción
    await pool.query('COMMIT');

    // Devuelve los datos actualizados del cliente
    res.json({ ...clientResult.rows[0], email: userResult.rows[0].email });

  } catch (error) {
    console.log(error);
    await pool.query('ROLLBACK'); // Revierte la transacción en caso de error
    res.status(500).send("Error en el servidor");
  }
};


export {
  getUser,
  editUserData
}