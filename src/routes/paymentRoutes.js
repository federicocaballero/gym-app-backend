const express = require('express');
const { registerPaymentHandler } = require('../controllers/paymentController');
const router = express.Router();
router.post('/pagar', registerPaymentHandler);

module.exports = router;
