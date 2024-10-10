CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('cliente', 'barbero', 'admin')),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE,
  accept_notifications BOOLEAN,
  image JSONB NOT NULL
);
CREATE TABLE barbers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
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
INSERT INTO barbers (
    name,
    last_name,
    description,
	full_description,
    phone,
    image
  )
VALUES (
    'Maximiliano',
    'Sierra',
    'Me encanta jugar al futbol y rascarme las bolas',
	'Me encanta jugar al futbol y cortar pelo y estar siempre al dia con los nuevos cortes que van surgiendo, ademas aprender las mejores tecnicas que hay para ofrecer lo mejor a cada cliente',
    '092994277',
	'{
        "url": "http://localhost:3001/uploads/barbers/maxi.jpg",
        "width": 400,
        "height": 400,
        "size_in_kb": 120,
        "file_type": "jpeg",
        "uploaded_at": "2024-10-06T12:34:56"
    }'::jsonb
  );
  INSERT INTO barbers (
    name,
    last_name,
    description,
	full_description,
    phone,
    image
  )
VALUES (
    'Genaro',
    'Algo',
    'Me encanta jugar al futbol y rascarme las bolas',
	'Me encanta jugar al futbol y cortar pelo y estar siempre al dia con los nuevos cortes que van surgiendo, ademas aprender las mejores tecnicas que hay para ofrecer lo mejor a cada cliente',
    '092994278',
	'{
        "url": "http://localhost:3001/uploads/barbers/maxi.jpg",
        "width": 400,
        "height": 400,
        "size_in_kb": 120,
        "file_type": "jpeg",
        "uploaded_at": "2024-10-06T12:34:56"
    }'::jsonb
  );
  INSERT INTO barbers (
    name,
    last_name,
    description,
	full_description,
    phone,
    image
  )
VALUES (
    'Aldo',
    'Villafan',
    'Me encanta jugar al futbol y rascarme las bolas',
	'Me encanta jugar al futbol y cortar pelo y estar siempre al dia con los nuevos cortes que van surgiendo, ademas aprender las mejores tecnicas que hay para ofrecer lo mejor a cada cliente',
    '092994279',
	'{
        "url": "http://localhost:3001/uploads/barbers/maxi.jpg",
        "width": 400,
        "height": 400,
        "size_in_kb": 120,
        "file_type": "jpeg",
        "uploaded_at": "2024-10-06T12:34:56"
    }'::jsonb
  );
INSERT INTO haircuts (name, price, description, image)
VALUES (
    'Corte de cabello',
    300.00,
    'Asesoramiento, corte de cabello',
	'{
        "url": "http://localhost:3001/uploads/barbers/maxi.jpg",
        "width": 400,
        "height": 400,
        "size_in_kb": 120,
        "file_type": "jpeg",
        "uploaded_at": "2024-10-06T12:34:56"
    }'::jsonb
);
INSERT INTO haircuts (name, price, description, image)
VALUES (
    'Mechitas',
    1000.00,
    'Corte + mechas de color',
	'{
        "url": "http://localhost:3001/uploads/barbers/maxi.jpg",
        "width": 400,
        "height": 400,
        "size_in_kb": 120,
        "file_type": "jpeg",
        "uploaded_at": "2024-10-06T12:34:56"
    }'::jsonb
	
);
-- Agregar el día 31 de este mes a la tabla "horarios"
INSERT INTO schedules (date, barber_id)
VALUES ('2024-10-06', 1);
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

-- Asocia al barbero con ID 1 con los cortes de pelo 1 y 2
INSERT INTO barber_haircuts (barber_id, haircut_id)
VALUES (1, 1);
INSERT INTO barber_haircuts (barber_id, haircut_id)
VALUES (1, 2);
-- Asocia al barbero con ID 2 con los cortes de pelo 1, 2 y 3
INSERT INTO barber_haircuts (barber_id, haircut_id)
VALUES (2, 1);
INSERT INTO barber_haircuts (barber_id, haircut_id)
VALUES (2, 2);
INSERT INTO barber_haircuts (barber_id, haircut_id)
VALUES (3, 1);

-- Function to create the associated review when a booking is created
CREATE OR REPLACE FUNCTION create_initial_review()
RETURNS TRIGGER AS $$
BEGIN
    -- Insertar en la tabla reviews sin el nombre y apellido
    INSERT INTO reviews (client_id, barber_id, booking_id, haircuts_id, comment, rating, created_at, is_pending)
    VALUES (NEW.client_id, NEW.barber_id, NEW.id, NEW.haircut_id, null, null, NOW(), true);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

	-- Trigger to execute the create_initial_review function after a booking is created
CREATE TRIGGER create_review_trigger
AFTER INSERT ON booking
FOR EACH ROW
EXECUTE FUNCTION create_initial_review();


-- Function to delete the associated review when a booking is canceled
CREATE OR REPLACE FUNCTION delete_associated_review()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM reviews WHERE booking_id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger to execute the delete_associated_review function after a booking is deleted
CREATE TRIGGER delete_review_trigger
AFTER DELETE ON booking
FOR EACH ROW
EXECUTE FUNCTION delete_associated_review();

CREATE OR REPLACE FUNCTION update_schedule_status()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE available_schedules SET status = 2 WHERE id = NEW.schedule_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE available_schedules SET status = 1 WHERE id = OLD.schedule_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_schedule_trigger
AFTER INSERT OR DELETE ON booking
FOR EACH ROW
EXECUTE FUNCTION update_schedule_status();