# Safe Entry Backend - MongoDB Integration

## 📋 Requisitos

1. **Node.js** (v14+)
2. **MongoDB Atlas** (base de datos en la nube - gratis)
3. **npm** o **yarn**

## 🚀 Configuración Inicial

### 1. Crear MongoDB Atlas (Gratis)

1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea una cuenta gratis
3. Crea un cluster (M0 - Shared)
4. En "Database Access", crea un usuario con usuario/contraseña
5. En "Network Access", añade tu IP (o 0.0.0.0 para permitir todas)
6. Copia la connection string

### 2. Configurar Backend

```bash
cd backend
npm install
```

### 3. Editar `.env`

```env
MONGODB_URI=mongodb+srv://usuario:contraseña@tu-cluster.mongodb.net/safe_entry
JWT_SECRET=tu_super_secreto_cambiacambia
PORT=3000
```

### 4. Iniciar Servidor

```bash
npm start
# o para desarrollo con auto-reload:
npm run dev
```

Deberías ver:
```
✅ Conectado a MongoDB
🚀 Servidor ejecutándose en http://localhost:3000
```

## 🔧 Configurar Flutter App

### 1. Editar `auth_service.dart`

Cambia `YOUR_SERVER_IP` por tu dirección IP local:

```dart
static const String baseUrl = 'http://192.168.1.100:3000/api/auth';
```

Para encontrar tu IP:
- **Windows**: `ipconfig` en terminal (busca IPv4)
- **Mac/Linux**: `ifconfig` (busca inet)

### 2. Compilar APK

```bash
flutter build apk --release
```

## 📱 Crear usuarios de prueba

Usa cualquier herramienta HTTP (Postman, curl, etc):

```bash
# Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan",
    "email": "juan@example.com",
    "password": "password123",
    "role": "Residente"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan",
    "password": "password123",
    "role": "Residente"
  }'
```

## 🔐 API Endpoints

### POST `/api/auth/register`
Registra un nuevo usuario

**Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "Administrador|Residente|Portero"
}
```

### POST `/api/auth/login`
Inicia sesión

**Body:**
```json
{
  "username": "string",
  "password": "string",
  "role": "string"
}
```

**Response:**
```json
{
  "message": "Login exitoso",
  "token": "jwt_token_aqui",
  "user": {
    "id": "mongodb_id",
    "username": "string",
    "email": "string",
    "role": "string"
  }
}
```

### POST `/api/auth/verify-token`
Verifica si un token es válido

**Body:**
```json
{
  "token": "jwt_token"
}
```

## ⚠️ Notas Importantes

1. **En Producción:** 
   - Usa HTTPS, no HTTP
   - Usa un servidor real (Heroku, AWS, etc)
   - Cambia JWT_SECRET por algo más seguro
   - Habilita autenticación en MongoDB

2. **Para Testing Local:**
   - Asegúrate que celular y PC estén en la misma red
   - Usa la IP interna (192.168.x.x), no localhost

3. **Biometría:**
   - El token se envía a MongoDB cuando autenticas con huella
   - Puedes guardar el token con SharedPreferences para sesiones

## 📚 Estructura Backend

```
backend/
├── server.js           # Servidor principal
├── package.json        # Dependencias
├── .env               # Variables de entorno
├── models/
│   └── User.js        # Modelo de usuario
└── routes/
    └── auth.js        # Rutas de autenticación
```

## 🆘 Troubleshooting

**Error: "Cannot find module 'express'"**
```bash
npm install
```

**Error: "connection refused"**
- Revisa que MongoDB Atlas esté aceptando tu IP
- Verifica la connection string

**Error: "Token inválido"**
- Regenera el token haciendo login de nuevo

¡Listo! Tu app Flutter ahora está conectada a MongoDB 🎉
