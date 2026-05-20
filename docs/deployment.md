# Despliegue en Vercel y Render

## 1. Backend en Render

Opcion recomendada: usar el archivo `render.yaml` como Blueprint.

1. Subir este proyecto a GitHub.
2. Entrar a Render.
3. Crear `New -> Blueprint`.
4. Seleccionar el repositorio.
5. Render creara:
   - Web service `hotel-reservations-api`
   - PostgreSQL `hotel-reservations-db`

Variables importantes en Render:

```env
DATABASE_TYPE=postgres
DATABASE_URL=<la genera Render desde PostgreSQL>
DATABASE_SSL=true
JWT_SECRET=<la genera Render>
FRONTEND_URL=https://TU-PROYECTO.vercel.app
```

Cuando Render termine, copia la URL publica del backend. Ejemplo:

```txt
https://hotel-reservations-api.onrender.com
```

La API quedara en:

```txt
https://hotel-reservations-api.onrender.com/api
```

## 2. Frontend en Vercel

1. Entrar a Vercel.
2. Importar el mismo repositorio desde GitHub.
3. Configurar `Root Directory` como:

```txt
frontend
```

4. Agregar variable de entorno:

```env
NEXT_PUBLIC_API_URL=https://hotel-reservations-api.onrender.com/api
```

5. Deploy.

## 3. Ajustar CORS

Despues de conocer la URL final de Vercel, vuelve a Render y cambia:

```env
FRONTEND_URL=https://TU-PROYECTO.vercel.app
```

El backend tambien acepta previews de Vercel terminados en `.vercel.app`.

## 4. Credenciales iniciales

El backend crea automaticamente:

```txt
admin@hotel.com
123456
```

## 5. Nota sobre base de datos

Localmente el proyecto usa `sql.js` para no instalar PostgreSQL. En Render se usa PostgreSQL mediante `DATABASE_TYPE=postgres` y `DATABASE_URL`.
