import pkg from 'pg';
import { db } from './config.js';

const { Pool } = pkg;

const pool = new Pool({
  user: db.user, 
  password: db.password,
  port: db.port,
  host: db.host,
  database: db.database
})

export default pool;