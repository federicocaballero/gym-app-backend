const db = require('../config/db');
const table = `"Attendances"`;

/**
 * Inserta un registro de asistencia.
 * @param {Object} opts
 * @param {string} opts.personId  UUID de la persona
 * @param {string} opts.status    'present' o 'absent'
 * @param {string} [opts.adminId] UUID de quien registra
 */
async function createAttendance({ personId, status, adminId }) {
  const text = `
    INSERT INTO ${table}
      ("idPersona", fecha, estado, registradoPor)
    VALUES ($1, CURRENT_DATE, $2, $3)
    RETURNING *;
  `;
  const values = [personId, status, adminId || null];
  const { rows } = await db.query(text, values);
  return rows[0];
}

module.exports = { createAttendance };
