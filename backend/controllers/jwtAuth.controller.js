import pool from "../db.js";
import bcrypt from "bcrypt"
import jwtGenerator from "../utils/jwtGenerator.js";
import { sendWelcomeEmail } from "../utils/nodemailer.js";

//Registering
const signUp = async (req, res) => {
  try {
    const image = {
      "url": "https://res.cloudinary.com/dmusin0l0/image/upload/v1728531322/users/default_avatar_ej5arw.webp",
    }

    // Destructure
    const { name, last_name, phone = null, email, password, profileImageUrl = image, acceptNotifications, rememberMe, userType = 'client' } = req.body

    // Inicia la transacción
    await pool.query('BEGIN');

    // Verificar si el email ya existe en la tabla users
    const userByEmail = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userByEmail.rows.length !== 0) {
      await pool.query('ROLLBACK'); // Deshacer la transacción
      return res.status(409).json("El correo proporcionado ya está en uso");
    }

    // Verificar si el número de teléfono ya existe en la tabla clients
    const userByPhone = await pool.query('SELECT * FROM clients WHERE phone = $1', [phone]);
    if (userByPhone.rows.length !== 0) {
      await pool.query('ROLLBACK'); // Deshacer la transacción
      return res.status(409).json("El número de teléfono proporcionado ya está en uso");
    }

    // Encriptar la contraseña
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // Insertar el nuevo usuario en la tabla users
    const newUser = await pool.query(
      "INSERT INTO users (email, password, user_type) VALUES ($1, $2, $3) RETURNING *",
      [email, bcryptPassword, userType]
    );
    const userId = newUser.rows[0].id; // Obtener el id del nuevo usuario

    // Insertar los datos adicionales en la tabla clients
    const newClient = await pool.query(
      "INSERT INTO clients (user_id, name, last_name, phone, image, accept_notifications) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [userId, name, last_name, phone, profileImageUrl, acceptNotifications]
    );

    // Si todo sale bien, confirmar la transacción
    await pool.query('COMMIT');

    // Enviar email de bienvenida si corresponde
    if (acceptNotifications) {
      sendWelcomeEmail(email, name);
    }

    // Generar token JWT
    const token = jwtGenerator(userId, rememberMe);

    // Responder con el token
    res.json({ token });
  } catch (err) {
    await pool.query('ROLLBACK'); // Deshacer la transacción en caso de error
    console.log(err.message);
    res.status(500).json({ error: "Server Error" });
  }
}

//Login
const signIn = async (req, res) => {
  try {

    //destructure
    const { email, password, rememberMe } = req.body

    //check if user doesn't exist
    const user = await pool.query("SELECT * FROM users where email = $1", [email])

    if (user.rows.length === 0) return res.status(409).json("Los datos proporcionados son incorrectos")

    //check the passsword
    const validPassword = await bcrypt.compare(password, user.rows[0].password)

    if (!validPassword) return res.status(409).json("Los datos proporcionados son incorrectos")

    //return the token
    const token = jwtGenerator(user.rows[0].id, rememberMe)
    const userType = user.rows[0].user_type

    res.json({ token, userType })
  } catch (err) {
    console.log(err.message)
    res.status(500).send("Server Error")
  }
}

const isVerify = async (req, res) => {
  try {
    res.json(true)
  } catch (error) {
    console.log(err.message)
    res.status(500).send("Server Error")
  }
}

export {
  signUp, signIn, isVerify
}