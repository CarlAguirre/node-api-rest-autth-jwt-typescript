# Proyecto Node.js JWT TypeScript

API REST desarrollada con Node.js, TypeScript, Express y PostgreSQL que implementa un sistema completo de autenticación basado en JWT (JSON Web Tokens).

## 🚀 Características

- ✅ Autenticación con JWT (JSON Web Tokens)
- ✅ TypeScript para tipado estático
- ✅ PostgreSQL como base de datos
- ✅ Prisma ORM para gestión de base de datos
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Docker Compose para entorno de desarrollo
- ✅ Express.js como framework web
- ✅ Arquitectura modular y escalable

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Docker y Docker Compose (para la base de datos)
- PostgreSQL (si no usas Docker)

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd proyecto-node-jwt-ts
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   # Database
   POSTGRES_USER=your_user
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=your_database
   DATABASE_URL="postgresql://your_user:your_password@localhost:5432/your_database?schema=public"
   
   # JWT
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRES_IN=1d
   
   # Server
   PORT=3000
   NODE_ENV=development
   ```

4. **Iniciar la base de datos con Docker**
   ```bash
   docker-compose up -d
   ```

5. **Ejecutar migraciones de Prisma**
   ```bash
   npm run prisma:migrate
   ```

6. **Generar el cliente de Prisma**
   ```bash
   npm run prisma:generate
   ```

## 🚦 Uso

### Modo Desarrollo
```bash
npm run dev
```

### Compilar TypeScript
```bash
npm run build
```

### Modo Producción
```bash
npm run build
npm start
```

### Comandos de Prisma
```bash
# Crear y aplicar migraciones
npm run prisma:migrate

# Regenerar el cliente de Prisma
npm run prisma:generate

# Abrir Prisma Studio (GUI para la base de datos)
npm run prisma:studio
```

## 📁 Estructura del Proyecto

```
proyecto-node-jwt-ts/
├── prisma/
│   ├── schema.prisma           # Esquema de la base de datos
│   └── migrations/             # Migraciones de la base de datos
├── src/
│   ├── config/
│   │   └── database.ts         # Configuración de la base de datos
│   ├── controllers/
│   │   ├── authController.ts   # Controladores de autenticación
│   │   └── userController.ts   # Controladores de usuarios
│   ├── interfaces/
│   │   ├── jwt.interface.ts    # Interfaces de JWT
│   │   └── user.interface.ts   # Interfaces de usuario
│   ├── models/
│   │   └── user.ts             # Modelos de usuario
│   ├── routes/
│   │   ├── authRoutes.ts       # Rutas de autenticación
│   │   └── userRoutes.ts       # Rutas de usuarios
│   ├── services/
│   │   ├── auth.service.ts     # Servicios de autenticación
│   │   └── password.service.ts # Servicios de contraseñas
│   ├── app.ts                  # Configuración de Express
│   └── server.ts               # Punto de entrada del servidor
├── docker-compose.yml          # Configuración de Docker
├── tsconfig.json               # Configuración de TypeScript
├── package.json                # Dependencias del proyecto
└── README.md                   # Este archivo
```

## 🔐 API Endpoints

### Autenticación

#### Registro de Usuario
```http
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta exitosa:**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com"
  }
}
```

#### Inicio de Sesión
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta exitosa:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com"
  }
}
```

### Usuarios

#### Obtener Todos los Usuarios
```http
GET /users
Authorization: Bearer <token>
```

#### Obtener Usuario por ID
```http
GET /users/:id
Authorization: Bearer <token>
```

## 🛡️ Seguridad

- Las contraseñas se encriptan usando bcrypt con un factor de costo de 10
- Los tokens JWT expiran según la configuración en las variables de entorno
- Las rutas protegidas requieren un token JWT válido en el header Authorization

## 🗄️ Modelo de Base de Datos

### User
| Campo    | Tipo   | Restricciones              |
|----------|--------|----------------------------|
| id       | Int    | PK, Auto-increment         |
| email    | String | Único, Requerido           |
| password | String | Requerido, Encriptado      |

## 🧪 Testing

```bash
# Pendiente de implementar
npm test
```

## 📦 Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución de JavaScript
- **TypeScript** - Superset tipado de JavaScript
- **Express.js** - Framework web minimalista
- **Prisma** - ORM moderno para Node.js y TypeScript
- **PostgreSQL** - Base de datos relacional
- **JWT** - Estándar para tokens de autenticación
- **bcrypt** - Librería para encriptación de contraseñas
- **Docker** - Contenedorización de aplicaciones

## 📝 Próximas Mejoras

- [ ] Implementar refresh tokens
- [ ] Agregar validación de datos con Zod o Joi
- [ ] Implementar rate limiting
- [ ] Añadir tests unitarios y de integración
- [ ] Documentación de API con Swagger
- [ ] Implementar roles y permisos
- [ ] Agregar logger (Winston o Pino)
- [ ] Implementar CORS configurado
- [ ] Añadir middleware de manejo de errores centralizado

## 👤 Autor

**Carlos A. Aghuirre**

## 📄 Licencia

ISC

---

⭐ Si este proyecto te resultó útil, ¡no olvides darle una estrella!
