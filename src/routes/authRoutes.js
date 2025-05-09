// Dependencias
const express = require("express");
const router = express.Router();

// Controladores
const { signInNewSession, signUpNewEmail, getProfiles } = require("../controllers/authController")

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Registro e inicio de sesión de usuarios
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error en los datos de entrada
 *       500:
 *         description: Error del servidor
 */
router.post("/signup", signUpNewEmail);

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Sesión iniciada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error del servidor
 */
router.post("/signin", signInNewSession);

/**
 * @swagger
 * /auth/categories:
 *   get:
 *     summary: Obtener todas las categorias
 *     tags: [Autenticación]
 *     responses:
 *       200:
 *         description: Lista de categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("/profiles", getProfiles);
module.exports = router;
