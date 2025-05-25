// Dependencias
require("dotenv").config(); // Permite acceder a las variables de entorno
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const setupSwaggerDocs = require('./docs/swagger')
const PORT = process.env.DB_PORT || 3000;

// Rutas
studentsRoutes = require("./routes/studentsRoutes")

// Inicializaciones
const app = express();

// Configuraciones: cosas que usa la app

/**const corsOptions = {
    origin: "https://supabase.com", //controlo desde que dominio se pueden realizar peticiones
    methods: "GET,HEAD,PUT", //controlo que metodos se pueden realizar (solo estos)
    credentials: true // 
}
// asi se implementa cors con las configuraciones
app.use(cors(corsOptions));
**/

app.use(cors()); // Permite recibir peticiones de otros dominios
app.use(helmet()); // Seguridad: protege la app
app.use(morgan("dev")); // Muestra por consola las peticiones
app.use(bodyParser.json()); // Permite recibir JSON
app.use(bodyParser.urlencoded({ extended: true })); // Permite recibir formularios
app.use(errorHandler)//controlador de errores
// Rutas
app.get('/', (req, res) => {
  res.send('API GYM funcionando');
});
app.use("/api/alumnos", studentsRoutes);
setupSwaggerDocs(app)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});