import { sendContactEmail } from "../utils/nodemailer.js";

const getContactEmail = async (req, res) => {
  try {
    const { name, email, message } = req.body

    sendContactEmail(name, email, message)

    res.status(200).json({ message: "Correo de contacto enviado con éxito" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Hubo un error al enviar el correo de contacto" });
  }
}

export {
  getContactEmail
}