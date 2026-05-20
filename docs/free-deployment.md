# Despliegue gratis alternativo

Si Render no permite crear el servicio gratuito o pide tarjeta, usa esta ruta:

```txt
Frontend: Vercel
Backend: Koyeb
Base de datos: Koyeb PostgreSQL o Supabase PostgreSQL
```

## Opcion A: Vercel + Koyeb

Koyeb tiene despliegue de servicios web y base PostgreSQL gratuita en el plan free. El backend ya incluye `backend/Dockerfile`, asi que Koyeb puede construirlo sin instalar nada manualmente.

### 1. Crear PostgreSQL en Koyeb

1. Entra a Koyeb.
2. Crea una Database PostgreSQL free.
3. Copia la connection string.

Debe verse parecido a:

```txt
postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

### 2. Crear backend en Koyeb

1. Crea un nuevo Web Service.
2. Conecta el repositorio `elizabethzi/sistema-reservas`.
3. Selecciona Dockerfile.
4. Dockerfile path:

```txt
backend/Dockerfile
```

5. Agrega variables:

```env
DATABASE_TYPE=postgres
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_SSL=true
JWT_SECRET=cambia-este-secreto
FRONTEND_URL=https://TU-FRONTEND.vercel.app
```

Koyeb asigna `PORT` automaticamente. El backend NestJS ya lee `process.env.PORT`.

La URL final de API quedara asi:

```txt
https://TU-BACKEND.koyeb.app/api
```

## 3. Frontend en Vercel

1. Importa el repo en Vercel.
2. Root Directory:

```txt
frontend
```

3. Agrega variable:

```env
NEXT_PUBLIC_API_URL=https://TU-BACKEND.koyeb.app/api
```

4. Deploy.

## Opcion B: Vercel + Supabase + backend gratuito

Tambien puedes crear una base gratis en Supabase y usar su connection string como `DATABASE_URL` en cualquier host de backend compatible con Node.

Variables del backend:

```env
DATABASE_TYPE=postgres
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:5432/postgres
DATABASE_SSL=true
JWT_SECRET=cambia-este-secreto
FRONTEND_URL=https://TU-FRONTEND.vercel.app
```

## Credenciales iniciales

El backend crea automaticamente:

```txt
admin@hotel.com
123456
```

## Nota

Render sigue siendo valido si tu cuenta permite Free Web Service, pero si no te aparece gratuito, no vale la pena pelearlo. Koyeb suele ser mas directo para este caso porque puedes correr backend y PostgreSQL en el mismo proveedor.
