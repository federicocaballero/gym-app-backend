const express = require('express');
const { createPersonHandler, findByDniLast3Handler } = require('../controllers/personController');

const router = express.Router();

// POST /api/personas
router.post('/crearPersona', createPersonHandler);

// GET /api/alumnos/buscar?last3=123
// GET /api/alumnos/buscar?last3=123&apellido=Perez
router.get('/buscarPersona', findByDniLast3Handler);

module.exports = router;
