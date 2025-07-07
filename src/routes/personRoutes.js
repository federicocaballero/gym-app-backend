const express = require('express');
const { createPersonHandler, findByDniLast3Handler, getClientsByCuote } = require('../controllers/personController');
const router = express.Router();

//RUTA: http://localhost:6543/api/personas/ 
// POST /api/personas
router.post('/crearPersona', createPersonHandler);

// GET /api/personas
router.get('/buscarPersona', findByDniLast3Handler);
router.get('/', getClientsByCuote); // quotaStatus = 'all' | 'active' | 'expired'
module.exports = router;
