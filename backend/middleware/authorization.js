import jwt from "jsonwebtoken"
import { config } from 'dotenv'
config()

export default async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json("Not Authorized");
    }
    const jwtToken = authHeader.substring(7);
    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET || 'cat123');

    req.user = payload.user;
    next();
  } catch (error) {
    console.log(error.message)
    return res.status(403).json("Not Authorize")
  }
}