# Sistema de Reservas Hoteleras

Proyecto academico y funcional para reservas de hotel/hospedaje construido como monolito modular con:

- Backend: NestJS, TypeScript, PostgreSQL, TypeORM, JWT
- Frontend: Next.js, React, Tailwind CSS
- Arquitectura: capas separadas por presentacion, negocio, acceso a datos y base de datos
- Patron: Strategy aplicado a disponibilidad y validacion de reservas

## Estructura

```txt
backend/src
  modules/
    auth/
    users/
    rooms/
    reservations/
    availability/
  common/
  database/
  main.ts

frontend/src
  app/
  components/
  lib/
```

## Requisitos

- Node.js 20+
- npm

## Configuracion

Crear `backend/.env`:

```env
PORT=3001
DATABASE_TYPE=sqljs
DATABASE_FILE=data/hotel-reservations.sqlite
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=hotel_reservations
JWT_SECRET=super-secret-change-me
FRONTEND_URL=http://localhost:3000
```

Crear `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Por defecto el proyecto corre totalmente local con una base embebida en `backend/data/hotel-reservations.sqlite`, sin instalar PostgreSQL, Docker ni maquina virtual.

Si necesita usar PostgreSQL para despliegue o sustentacion, cambie:

```env
DATABASE_TYPE=postgres
```

Y cree la base:

```sql
CREATE DATABASE hotel_reservations;
```

El backend crea automaticamente un admin local y habitaciones de ejemplo.

## Instalacion y ejecucion

```bash
npm install
npm run dev:backend
npm run dev:frontend
```

Backend: `http://localhost:3001/api`

Frontend: `http://localhost:3000`

## Credenciales

Administrador local:

```txt
email: admin@hotel.com
password: 123456
```

## Endpoints principales

### Auth

`POST /api/auth/register`

```json
{
  "name": "Ana Perez",
  "email": "ana@mail.com",
  "password": "123456"
}
```

`POST /api/auth/login`

```json
{
  "email": "ana@mail.com",
  "password": "123456"
}
```

Respuesta:

```json
{
  "accessToken": "jwt-token",
  "user": {
    "id": "uuid",
    "name": "Ana Perez",
    "email": "ana@mail.com",
    "role": "guest"
  }
}
```

### Habitaciones

`GET /api/rooms`

`POST /api/rooms` requiere JWT admin:

```json
{
  "name": "Suite Vista Mar",
  "description": "Habitacion amplia con balcon",
  "capacity": 2,
  "pricePerNight": 180,
  "isActive": true,
  "imageUrl": "https://images.unsplash.com/photo-1566665797739-1674de7a421a"
}
```

### Disponibilidad

`GET /api/availability?roomId=uuid&checkIn=2026-06-01&checkOut=2026-06-05`

Respuesta:

```json
{
  "available": true,
  "strategy": "NORMAL",
  "reason": "La habitacion esta disponible para el rango solicitado."
}
```

### Reservas

`POST /api/reservations` requiere JWT:

```json
{
  "roomId": "uuid",
  "checkIn": "2026-06-01",
  "checkOut": "2026-06-05"
}
```

`PATCH /api/reservations/:id/status` requiere JWT admin:

```json
{
  "status": "confirmed"
}
```

## Despliegue gratis

Si Render no te permite desplegar gratis, usa la alternativa Vercel + Koyeb documentada en [docs/free-deployment.md](docs/free-deployment.md).

Si Render falla al iniciar el backend, revisa [docs/render-troubleshooting.md](docs/render-troubleshooting.md).

## Documentacion tecnica

La documentacion completa esta en [docs/technical-documentation.md](docs/technical-documentation.md).
