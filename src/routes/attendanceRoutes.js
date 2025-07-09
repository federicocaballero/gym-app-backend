const express = require('express');
const router = express.Router();
const { registerAttendanceHandler } = require('../controllers/personController');
// Registrar asistencia
router.post('/register', registerAttendanceHandler);

module.exports = router;