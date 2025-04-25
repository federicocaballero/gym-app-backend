// Dependencias
const express = require("express");
const router = express.Router();

// Controladores
const { signInNewSession, signUpNewEmail } = require("../controllers/authController")

// Rutas
router.post("/signin", signInNewSession);
router.post("/signup", signUpNewEmail);

module.exports = router;
