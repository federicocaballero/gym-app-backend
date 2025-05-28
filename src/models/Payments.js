// models/Payments.js
const db = require('../config/db');
//TODO REGISTRAR EL PAGO DE UN CLIENTE YA REGISTRADO Y CON LA CUOTA VENCIDA. VERIFICAR QUE NO SE REGISTRE DOS CUOTAS PARA EL MISMO CLIENTE. VERIFICAR QUE EL CLIENTE NO TENGA UN PAGO PENDIENTE. VERIFICAR QUE EL CLIENTE NO TENGA UN PAGO VENCIDO.
/**
 * Inserta un pago o trial.
 * @param {Object} opts
 * @param {string} opts.clientId
 * @param {number} opts.amount
 * @param {string} opts.periodFor    // 'YYYY-MM-DD'
 * @param {string} opts.expiresAt    // 'YYYY-MM-DD'
 * @param {string} opts.type         // 'paid' o 'trial'
 * @param {object} [client]          // optional pg client (transaction)
 */
async function createPayment({ clientId, amount, periodFor, expiresAt, type }, client = db) {
  const text = `
    INSERT INTO "Payments"
      ("idPersona","monto","periodo","fechaVencimiento","estado","type")
    VALUES ($1,$2,$3,$4,'paid',$5)
    RETURNING *;
  `;
  const values = [clientId, amount, periodFor, expiresAt, type];
  const { rows } = await client.query(text, values);
  return rows[0];
}

module.exports = { createPayment };
