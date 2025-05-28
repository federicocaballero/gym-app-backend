// models/Attendance.js
const db = require('../config/db');
const table = `"Attendances"`;

//TODO REGISTRAR LA ASISTENCIA DE UN CLIENTE YA REGISTRADO. VALIDAR QUE TENGA LA CUOTA AL DIA, SI ESTA VENCIDA NO SE PUEDE REGISTRAR.
async function createAttendance({ personId, status, adminId }, client = db) {
  const text = `
    INSERT INTO ${table}
      ("idPersona", fecha, estado, "registradoPor")
    VALUES ($1, CURRENT_DATE, $2, $3)
    RETURNING *;
  `;
  const values = [personId, status, adminId || null];
  const { rows } = await client.query(text, values);
  return rows[0];
}


module.exports = { createAttendance };
