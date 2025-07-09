const db = require('../config/db');
const { createPayment } = require('../models/Payments');
const { findByDniLast3 } = require('../models/Person');

async function registerPaymentHandler(req, res, next) {
  const { last3, apellido, amount, adminId, type } = req.body;

  // 1) Validaciones básicas
  if (!/^\d{3}$/.test(last3))
    return res.status(400).json({ error: 'last3 debe ser 3 dígitos.' });
  if (!['paid', 'trial'].includes(type))
    return res.status(400).json({ error: 'type debe ser "paid" o "trial".' });

  // Validación específica para cada tipo de pago
  if (type === 'trial' && amount !== 0) {
    return res.status(400).json({ error: 'Los pagos trial deben tener amount = 0.' });
  }
  if (type === 'paid' && !(amount > 0)) {
    return res.status(400).json({ error: 'Los pagos paid requieren amount > 0.' });
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // 2) Buscar al cliente
    const persons = await findByDniLast3({ last3, lastName: apellido });
    if (persons.length === 0)
      return res.status(404).json({ error: 'No se encontró ningún cliente.' });
    if (persons.length > 1)
      return res.status(400).json({
        error: 'Múltiples clientes coinciden. Reenvía apellido completo para filtrar.',
      });
    const clientId = persons[0].idPersona;

    // 3) Calcular el nuevo periodo
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

    // 4) Verificar que no haya ya un pago para este periodo
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

    // 5) Verificación opcional del último pago (solo informativa)
    if (type === 'paid') {
      const { rows: [lastPay] = [] } = await client.query(
        `SELECT * FROM "Payments"
         WHERE "idPersona" = $1 AND type = 'paid'
         ORDER BY "periodo" DESC
         LIMIT 1`,
        [clientId]
      );

      // Solo muestra advertencia pero no bloquea el pago
      if (lastPay && lastPay.fechaVencimiento >= new Date()) {
        console.warn(`El cliente ${clientId} está pagando antes del vencimiento`);
      }
    }

    // 6) Insertar el pago
    const payment = await createPayment(
      {
        clientId,
        amount,
        periodFor,
        adminId,
        expiresAt,
        type,
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