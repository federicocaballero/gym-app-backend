const express                   = require('express');
const { registerPaymentHandler } = require('../controllers/paymentController');
const router                    = express.Router();

// ... tus otras rutas ...

// POST /api/alumnos/pagar
router.post('/pagar', registerPaymentHandler);

module.exports = router;
