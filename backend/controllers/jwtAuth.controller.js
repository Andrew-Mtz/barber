import pool from "../db.js";
import bcrypt from "bcrypt"
import jwtGenerator from "../utils/jwtGenerator.js";
import { sendWelcomeEmail } from "../utils/nodemailer.js";

//Registering
const signUp = async (req, res) => {
  try {

    //destructure
    const { name, last_name, phone = null, email, password, profileImageUrl = null, acceptNotifications, rememberMe, userType = 'client' } = req.body

    //check if user exist
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email])

    if (user.rows.length !== 0) {
      return res.status(409).json("El correo proporcionado ya esta en uso")
    }

    //Encript
    const saltRound = 10
    const salt = await bcrypt.genSalt(saltRound)
    const bcryptPassword = await bcrypt.hash(password, salt)

    //enter the new user inside our database
    const newUser = await pool.query(
      "INSERT INTO users (name, last_name, email, phone, password, profile_image_url, accept_notifications, user_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [name, last_name, email, phone, bcryptPassword, profileImageUrl, acceptNotifications, userType])

    if (acceptNotifications) {
      sendWelcomeEmail(email, name);
    }

    const token = jwtGenerator(newUser.rows[0].id, rememberMe)

    res.json({ token })
  } catch (err) {
    console.log(err.message)
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