import jwt from "jsonwebtoken";
import { config } from 'dotenv'
config()

const jwtGenerator = (id) => {
  const payload = {
    user: id
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1hr" })
}

export default jwtGenerator