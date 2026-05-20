CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO rooms (id, name, description, capacity, price_per_night, is_active, image_url, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'Suite Vista Mar',
    'Habitacion amplia con balcon, cama king y vista exterior.',
    2,
    180.00,
    true,
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Habitacion Familiar',
    'Espacio comodo para familias con dos camas dobles y escritorio.',
    4,
    220.00,
    true,
    'https://images.unsplash.com/photo-1590490360182-c33d57733427',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Habitacion Ejecutiva',
    'Habitacion silenciosa para viajes de trabajo con zona de lectura.',
    1,
    140.00,
    true,
    'https://images.unsplash.com/photo-1598928636135-d146006ff4be',
    NOW(),
    NOW()
  );
