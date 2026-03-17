# AI Middleware

Middleware en Node.js + TypeScript que recibe una petición en lenguaje natural y devuelve una consulta SQL `SELECT` generada con OpenAI. El servicio expone un endpoint HTTP protegido con API key, aplica rate limiting y valida que la salida no contenga operaciones peligrosas.

## Flujo

1. El cliente envía un texto en `message`.
2. El middleware construye un prompt con el esquema de base de datos.
3. OpenAI genera una consulta SQL.
4. El resultado se valida para permitir solo `SELECT`.
5. El servicio responde con `{ "query": "..." }`.

## Requisitos

- Node.js 18 o superior
- npm
- Credenciales válidas para OpenAI

## Instalación

```bash
npm install
```

Crea tu archivo `.env` tomando como base `.env.example` y reemplaza los valores:

```env
OPENAI_API_KEY=tu_api_key
APP_API_KEY=tu_api_key_interna
PORT=3000
```

## Scripts

```bash
npm run dev
```

Inicia el servidor en modo desarrollo con `nodemon` y `ts-node`.

```bash
npm run build
```

Compila TypeScript a `dist/`.

```bash
npm start
```

Ejecuta la versión compilada desde `dist/index.js`.

## Uso de la API

### `POST /query`

Headers:

```http
x-api-key: tu_api_key_interna
Content-Type: application/json
```

Body:

```json
{
  "message": "Muéstrame los proyectos activos con su cliente"
}
```

Respuesta exitosa:

```json
{
  "query": "SELECT ..."
}
```

Errores comunes:

- `401 Unauthorized`: falta `x-api-key` o no coincide.
- `400 Message is required`: no se envió `message`.
- `422`: la consulta generada no pasó la validación.
- `429`: se excedió el límite de 20 solicitudes por minuto.

## Estructura del proyecto

```text
src/
  index.ts            # servidor Express y endpoint /query
  ai.ts               # integración con OpenAI
  promp.ts            # construcción del prompt
  schema.ts           # esquema SQL usado en el prompt
  validator.ts        # validación de consultas
  middleware/auth.ts  # autenticación por API key
```

## Limitaciones actuales

- No hay pruebas automatizadas configuradas.
- El endpoint solo devuelve la consulta; no la ejecuta.
- La validación es básica y depende de reglas por palabras clave.

## Seguridad

- No subas `.env` al repositorio.
- Usa una `APP_API_KEY` larga y aleatoria.
- Mantén la restricción a consultas `SELECT` si modificas el prompt o el validador.
