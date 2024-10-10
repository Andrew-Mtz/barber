CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('client', 'barber', 'admin')),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE,
  accept_notifications BOOLEAN,
  image JSONB NOT NULL
);
CREATE TABLE barbers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  description TEXT CHECK (LENGTH(description) <= 50) NOT NULL,
  full_description TEXT CHECK (LENGTH(full_description) >= 100) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  image JSONB NOT NULL
);
CREATE TABLE haircuts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  image JSONB NOT NULL
);
CREATE TABLE barber_haircuts (
  barber_id INTEGER NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
  haircut_id INTEGER NOT NULL REFERENCES haircuts(id) ON DELETE CASCADE,
  PRIMARY KEY (barber_id, haircut_id)
);
CREATE TABLE schedules (
  id SERIAL PRIMARY KEY,
  barber_id INTEGER NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT unique_barber_date UNIQUE (barber_id, date)
);
CREATE TABLE available_schedules (
  id SERIAL PRIMARY KEY,
  hour VARCHAR(5) NOT NULL,
  status INTEGER NOT NULL DEFAULT 1,
  schedule_id INTEGER REFERENCES schedules(id) ON DELETE CASCADE,
  CONSTRAINT unique_date_hour UNIQUE (hour, schedule_id)
);
CREATE TABLE booking (
  id SERIAL PRIMARY KEY,
  status VARCHAR(20) NOT NULL,
  barber_id INTEGER REFERENCES barbers(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  haircut_id INTEGER REFERENCES haircuts(id) ON DELETE CASCADE,
  schedule_id INTEGER REFERENCES available_schedules(id) ON DELETE CASCADE,
  date_id INTEGER REFERENCES schedules(id) ON DELETE CASCADE,
  CONSTRAINT unique_barber_schedule_date UNIQUE (status, barber_id, schedule_id, date_id)
);
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
  barber_id INTEGER REFERENCES barbers(id) ON DELETE CASCADE,
  booking_id INTEGER REFERENCES booking(id) ON DELETE CASCADE,
  haircuts_id INTEGER REFERENCES haircuts(id) ON DELETE CASCADE,
  comment TEXT,
  rating INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_pending BOOLEAN DEFAULT true
);