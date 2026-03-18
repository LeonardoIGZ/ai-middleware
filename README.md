# AI Middleware

Middleware en Node.js + TypeScript que recibe una instruccion en lenguaje natural y devuelve una consulta SQL `SELECT` para SQL Server. El servicio expone un endpoint HTTP protegido con API key, aplica rate limiting, usa varios proveedores de IA y valida la salida antes de responder.

## Que hace

El endpoint `POST /query` recibe un `message`, construye un prompt con un esquema fijo de base de datos y envia la solicitud al proveedor de IA disponible en ese turno. La respuesta se valida para aceptar solo consultas `SELECT` y, si pasa las reglas, el middleware devuelve:

```json
{
    "query": "SELECT ..."
}
```

## Flujo de ejecucion

1. El cliente envia una peticion a `POST /query`.
2. `x-api-key` se valida con el middleware de autenticacion.
3. Se aplica `helmet` y rate limiting global.
4. El servicio selecciona el siguiente proveedor de IA en esquema round-robin.
5. Se construye un prompt con el esquema definido en `src/schema.ts`.
6. El proveedor genera una consulta SQL.
7. `src/validator.ts` permite solo `SELECT` y rechaza keywords peligrosas.
8. El servidor responde con el SQL o con un error HTTP.

## Proveedores soportados

Actualmente el proyecto rota automaticamente entre estos servicios:

- Gemini
- Groq
- Cerebras
- OpenRouter

La rotacion es round-robin en memoria del proceso. Eso significa:

- Cada request usa el siguiente proveedor de la lista.
- No existe afinidad por usuario o sesion.
- Si una clave de entorno obligatoria falta, la app no arranca.
- Si un proveedor falla en tiempo de ejecucion, hoy no existe fallback automatico al siguiente servicio dentro de la misma request.

## Requisitos

- Node.js 18 o superior
- npm
- Credenciales validas para todos los proveedores configurados

## Instalacion

```bash
npm install
```

Crea tu archivo `.env` en la raiz del proyecto.

## Variables de entorno

El archivo `src/config/env.ts` marca estas variables como obligatorias:

```env
GEMINI_API_KEY=tu_api_key_de_gemini
OPENROUTE_API_KEY=tu_api_key_de_openrouter
GROQ_API_KEY=tu_api_key_de_groq
CEREBRAS_API_KEY=tu_api_key_de_cerebras
APP_API_KEY=una_clave_interna_larga_y_aleatoria
PORT=3000
```

Notas importantes:

- `APP_API_KEY` protege el endpoint del middleware.
- `PORT` es opcional; si no existe, se usa `3000`.

## Scripts

```bash
npm run dev
```

Inicia el servidor en desarrollo con `nodemon` + `ts-node`.

```bash
npm run build
```

Compila TypeScript a `dist/`.

```bash
npm start
```

Ejecuta la version compilada desde `dist/index.js`.

## Uso de la API

### Endpoint

`POST /query`

### Headers requeridos

```http
x-api-key: tu_app_api_key
Content-Type: application/json
```

### Body

```json
{
    "message": "Muestrame los proyectos activos con su cliente"
}
```

### Ejemplo con cURL

```bash
curl -X POST http://localhost:3000/query ^
  -H "Content-Type: application/json" ^
  -H "x-api-key: tu_app_api_key" ^
  -d "{\"message\":\"Muestrame las cotizaciones activas con su proyecto\"}"
```

### Respuesta exitosa

```json
{
    "query": "SELECT ..."
}
```

## Validacion y restricciones

La capa de validacion actual hace lo siguiente:

- Rechaza respuestas iguales a `CANNOT_GENERATE`.
- Obliga a que la salida inicie con `SELECT`.
- Rechaza si detecta `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `CREATE`, `TRUNCATE`, `COMMIT`, `ROLLBACK` o `EXEC`.

Esto protege contra operaciones destructivas obvias, pero sigue siendo una validacion por reglas simples. No ejecuta analisis sintactico completo del SQL.

## Respuestas de error esperadas

- `400` si `message` no fue enviado.
- `401` si falta `x-api-key` o no coincide con `APP_API_KEY`.
- `422` si la consulta generada no pasa la validacion.
- `429` si se excede el limite de 20 requests por minuto.
- `500` si ocurre un error interno al generar o validar la consulta.

## Seguridad

- No subas `.env` al repositorio.
- Usa una `APP_API_KEY` larga y aleatoria.
- Manten la restriccion a consultas `SELECT` si cambias el prompt o el validador.
- Recuerda que el middleware genera SQL, pero no debe ejecutarse sin controles adicionales en el sistema consumidor.

## Estructura del proyecto

```text
src/
  config/
    env.ts
  middleware/
    auth.ts
  services/
    index.services.ts
    gemini.ts
    groq.ts
    cerebras.ts
    openrouter.ts
  index.ts
  prompt.ts
  schema.ts
  validator.ts
types.ts
```

## Observaciones operativas

- El esquema usado por el prompt esta hardcodeado en `src/schema.ts`.
- El servidor no expone endpoint de health check.
- No hay pruebas automatizadas configuradas.
- El endpoint devuelve SQL; no ejecuta consultas ni abre conexion a base de datos.
- El proceso registra en consola el proveedor usado por cada request.

## Mejoras recomendadas

- Agregar pruebas unitarias para `buildPrompt`, `validateQuery` y autenticacion.
- Agregar fallback por proveedor cuando uno falle.
- Exponer un endpoint de salud como `GET /health`.
- Registrar de forma estructurada errores y proveedor seleccionado.
