import jwt from "jsonwebtoken";
import { config } from 'dotenv'
config()

const jwtGenerator = (id, rememberMe = false) => {
  const payload = {
    user: id
  };

  const expiresIn = rememberMe ? "7d" : "1hr";

  return jwt.sign(payload, process.env.JWT_SECRET || 'cat123', { expiresIn })
}

export default jwtGenerator