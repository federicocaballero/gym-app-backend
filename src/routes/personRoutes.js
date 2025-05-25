const express = require('express');
const { createPersonHandler } = require('../controllers/personController');

const router = express.Router();

// POST /api/personas
router.post('/crearPersona', createPersonHandler);

module.exports = router;
