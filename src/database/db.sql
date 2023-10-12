CREATE DATABASE barberdb; 
CREATE TABLE barbers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  age INTEGER,
  birthdate DATE,
  description TEXT,
  full_description TEXT,
  phone VARCHAR(20),
  barber_image_url VARCHAR(255)
);
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  profile_image_url VARCHAR(255)
);
CREATE TABLE haircuts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  haircut_image_url VARCHAR(255)
);
CREATE TABLE schedules (
  id SERIAL PRIMARY KEY,
  barber_id INTEGER NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
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
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  barber_id INTEGER REFERENCES barbers(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  rating INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE barber_haircuts (
  id SERIAL PRIMARY KEY,
  barber_id INTEGER REFERENCES barbers(id) ON DELETE CASCADE,
  haircut_image_url VARCHAR(255) NOT NULL
);
INSERT INTO barbers (
    name,
    last_name,
    age,
    birthdate,
    description,
    phone,
    barber_image_url
  )
VALUES (
    'Maximiliano',
    'Sierra',
    24,
    '1999-05-23',
    'Me encanta jugar al futbol y rascarme las bolas',
    '092994277',
    'http://localhost:3001/uploads/barbers/maxi.jpg'
  );
INSERT INTO barbers (
    name,
    last_name,
    age,
    birthdate,
    description,
    phone,
    barber_image_url
  )
VALUES (
    'Aldo',
    'Villafan',
    23,
    '2000-02-16',
    'Me encanta jugar al futbol y rascarme las bolas',
    '092876540',
    'http://localhost:3001/uploads/barbers/aldo.jpg'
  );
INSERT INTO barbers (
    name,
    last_name,
    age,
    birthdate,
    description,
    phone,
    barber_image_url
  )
VALUES (
    'Genaro',
    'Lecouna',
    22,
    '2001-09-20',
    'Me encanta jugar al futbol y rascarme las bolas',
    '092988230',
    'http://localhost:3001/uploads/barbers/genaro.jpg'
  );
INSERT INTO haircuts (name, price, description)
VALUES (
    'Corte de cabello',
    300.00,
    'Asesoramiento, corte de cabello'
  );

  
-- Agregar el día 31 de este mes a la tabla "horarios"
INSERT INTO schedules (date, barber_id)
VALUES ('2023-08-13', 1);
-- Agregar los horarios disponibles desde las 8:00 AM hasta las 10:00 PM con intervalo de 45 minutos
INSERT INTO available_schedules (hour, schedule_id)
VALUES ('11:00', 1),
  ('12:00', 1),
  ('13:00', 1),
  ('14:00', 1),
  ('15:00', 1),
  ('16:00', 1),
  ('17:00', 1),
  ('18:00', 1),
  ('19:00', 1),
  ('20:00', 1),
  ('21:00', 1),
  ('22:00', 1);