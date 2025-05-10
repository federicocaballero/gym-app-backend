# 🛒 Sistema de Gestión 
**Backend con Node.js/Express**  

[![Node.js](https://img.shields.io/badge/Node.js-18.x%2B-success)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-informational)](https://www.postgresql.org/)

Proyecto desarrollado para **Ingeniería de Software II** (Lic. en Sistemas - UNNE), implementando autenticación JWT y ABM con bajas lógicas.

---

## 🔧 Configuración

### Requisitos previos
- Node.js 18+
- PostgreSQL 15+ (o cuenta en [Tembo.io](https://tembo.io))
- Cuenta en [Supabase](https://supabase.com)

### 1. Clonar repositorio
```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```
### 2. Configurar variables de entorno
Crea un archivo .env basado en el template:
```bash
# DATABASE
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nombre_bd

# SUPABASE
SUPABASE_URL=https://tus_proyecto.supabase.co
SUPABASE_ANON_KEY=tu_key_publica
# NOTA: Estas keys cambiarán a 'publishable'/'secret' en Q2 2025
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Iniciar servidor
```bash
npm run dev
```

# 📚 Documentación API
Accede a la documentación interactiva en desarrollo:
```bash
http://localhost:3000/api-docs
```

