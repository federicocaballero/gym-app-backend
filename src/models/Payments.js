// models/Payments.js
const db = require('../config/db');
//TODO REGISTRAR EL PAGO DE UN CLIENTE YA REGISTRADO Y CON LA CUOTA VENCIDA. VERIFICAR QUE NO SE REGISTRE DOS CUOTAS PARA EL MISMO CLIENTE. VERIFICAR QUE EL CLIENTE NO TENGA UN PAGO PENDIENTE. VERIFICAR QUE EL CLIENTE NO TENGA UN PAGO VENCIDO.
async function createPayment({ clientId, amount, periodFor, expiresAt, adminId ,type}, client = db) {
  const text = `
    INSERT INTO "Payments"
      ("idPersona","monto","periodo","fechaVencimiento","estado", "registradoPor", "type")
    VALUES ($1,$2,$3,$4,'paid',$5, $6)
    RETURNING *;
  `;
  const values = [clientId, amount, periodFor, expiresAt,  adminId || null, type,];
  const { rows } = await client.query(text, values);
  return rows[0];
}

module.exports = { createPayment };
