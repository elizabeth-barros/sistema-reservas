# Solucion de errores en Render

El mensaje:

```txt
npm error Lifecycle script `start:prod` failed with error
npm error command sh -c node dist/main.js
```

es generico. El error real esta unas lineas arriba en los logs.

## Configuracion recomendada desde la raiz del repo

En Render crea un Web Service con:

```txt
Root Directory: dejar vacio
Build Command: npm run render:build
Start Command: npm run render:start
```

Variables:

```env
NODE_VERSION=20
DATABASE_TYPE=postgres
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_SSL=true
JWT_SECRET=un-secreto-largo
FRONTEND_URL=https://TU-FRONTEND.vercel.app
```

## Configuracion alternativa con Root Directory backend

```txt
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm run start:prod
```

Variables iguales:

```env
NODE_VERSION=20
DATABASE_TYPE=postgres
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_SSL=true
JWT_SECRET=un-secreto-largo
FRONTEND_URL=https://TU-FRONTEND.vercel.app
```

## Errores frecuentes

### Cannot find module dist/main.js

Render no construyo el backend. Usa:

```txt
Build Command: npm run render:build
Start Command: npm run render:start
Root Directory: vacio
```

### connect ECONNREFUSED 127.0.0.1:5432

Falta `DATABASE_URL` o `DATABASE_TYPE=postgres`. Render esta intentando conectarse a PostgreSQL local, que no existe.

### password authentication failed

La cadena `DATABASE_URL` esta mal copiada o pertenece a otra base de datos.

### SSL/TLS required

Agrega:

```env
DATABASE_SSL=true
```

### CORS error

Agrega la URL exacta del frontend:

```env
FRONTEND_URL=https://TU-FRONTEND.vercel.app
```

## Health check

Cuando el backend suba, prueba:

```txt
https://TU-BACKEND.onrender.com/api/rooms
```
