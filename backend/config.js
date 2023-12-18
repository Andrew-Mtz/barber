import { config } from 'dotenv'
config()

export const db = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
  port: process.env.DB_PORT || 5432,
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'barberdb'
}

export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'