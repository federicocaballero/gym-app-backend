// Dependencias
require("dotenv").config(); // Permite acceder a las variables de entorno
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const PORT = process.env.DB_PORT || 3000;
// Rutas
const autRoutes = require("./routes/authRoutes")
// const cartRoutes = require("./routes/cartRoutes")
// const paymentRoutes = require("./routes/paymentRoutes")
// const productRoutes = require("./routes/productRoutes")

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

// Rutas
app.use("/api/auth", autRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/payment", paymentRoutes);
// app.use("/api/products", productRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});