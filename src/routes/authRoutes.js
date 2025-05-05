// Dependencias
const express = require("express");
const router = express.Router();

// Controladores
const { signInNewSession, signUpNewEmail } = require("../controllers/authController")

// Rutas
router.post("/signup", signUpNewEmail);
router.post("/signin", signInNewSession);

module.exports = router;
