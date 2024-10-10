INSERT INTO users (email, password, user_type)
VALUES
('barbero1@example.com', 'hashed_password_1', 'barbero'),
('barbero2@example.com', 'hashed_password_2', 'barbero'),
('barbero3@example.com', 'hashed_password_3', 'barbero');

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