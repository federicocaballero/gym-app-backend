const db = require('../config/db');
const { createPayment } = require('../models/Payments');

// controllers/paymentController.js
const { findByDniLast3 } = require('../models/Person');

/**
 * POST /api/alumnos/pagar
 * Body: { last3, [apellido], amount, adminId }
 */
async function registerPaymentHandler(req, res, next) {
  const { last3, apellido, amount, adminId } = req.body;

  // 1) Validaciones básicas
  if (!/^\d{3}$/.test(last3))
    return res.status(400).json({ error: 'last3 debe ser 3 dígitos.' });
  if (!(amount > 0))
    return res.status(400).json({ error: 'amount debe ser mayor a 0.' });

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // 2) Buscar al cliente
    const persons = await findByDniLast3({ last3, lastName: apellido });
    if (persons.length === 0)
      return res.status(404).json({ error: 'No se encontró ningún cliente.' });
    if (persons.length > 1)
      return res.status(400).json({
        error:
          'Múltiples clientes coinciden. Reenvía apellido completo para filtrar.',
      });
    const clientId = persons[0].idPersona;

    // 3) Obtener último pago
    const { rows: [lastPay] = [] } = await client.query(
      `SELECT * 
         FROM "Payments"
        WHERE "idPersona" = $1
        ORDER BY "periodo" DESC
        LIMIT 1`,
      [clientId]
    );

    if (!lastPay) {
      return res
        .status(400)
        .json({ error: 'Este cliente nunca ha registrado una cuota.' });
    }
    // 4) Verificar que esté vencida
    if (lastPay.fechaVencimiento >= new Date()) {
      return res
        .status(400)
        .json({ error: 'El cliente aún no tiene la cuota vencida.' });
    }

    // 5) Calcular el nuevo periodo
    const periodFor = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    )
      .toISOString()
      .slice(0, 10);
    const expiresAt = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1
    )
      .toISOString()
      .slice(0, 10);

    // 6) Verificar que no haya ya un pago para este periodo
    const { rowCount: dupCount } = await client.query(
      `SELECT 1 FROM "Payments"
         WHERE "idPersona" = $1 AND periodo = $2`,
      [clientId, periodFor]
    );
    if (dupCount > 0) {
      return res
        .status(400)
        .json({ error: 'Ya existe un registro de cuota para este periodo.' });
    }

    // 7) Insertar el pago
    const payment = await createPayment(
      {
        clientId,
        amount,
        periodFor,
        expiresAt,
        type: 'paid',
      },
      client
    );

    await client.query('COMMIT');
    return res.status(201).json(payment);
  } catch (err) {
    await client.query('ROLLBACK');
    return next(err);
  } finally {
    client.release();
  }
}
module.exports = { registerPaymentHandler };
