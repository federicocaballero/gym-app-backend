const db = require('../config/db');
const table = `"Attendances"`;

async function createAttendance({ personId, status, adminId }, client = db) {
  const text = `
    INSERT INTO ${table}
      ("idPersona", fecha, estado, "registradoPor")
    VALUES ($1, CURRENT_TIMESTAMP, $2, $3)
    RETURNING *;
  `;
  const values = [personId, status, adminId || null];
  const { rows } = await client.query(text, values);
  return rows[0];
}

module.exports = { createAttendance };