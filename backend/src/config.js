import { config } from 'dotenv'
config()

export const db = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE
}

export const FRONTEND_URL = process.env.FRONTEND_URL
export const PORT = 8080