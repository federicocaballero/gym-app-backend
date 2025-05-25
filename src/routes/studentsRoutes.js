// routes/studentsRoutes.js
const express = require('express');
const { createStudentHandler } = require('../controllers/studentController');

const router = express.Router();

// POST /api/alumnos
router.post('/crearAlumno', createStudentHandler);

module.exports = router;
