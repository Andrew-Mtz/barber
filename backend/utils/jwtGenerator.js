import jwt from "jsonwebtoken";
import { config } from 'dotenv'
config()

const jwtGenerator = (id) => {
  const payload = {
    user: id
  }

  return jwt.sign(payload, process.env.JWT_SECRET || 'cat123', { expiresIn: "1hr" })
}

export default jwtGenerator