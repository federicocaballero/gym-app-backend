const db = require('../config/db');
const table = '"Person"';
/**
 * Inserta un nuevo alumno en la tabla students.
 * @param {Object} student
 * @param {string} student.first_name
 * @param {string} student.last_name
 * @param {string} student.dni
 * @param {string} [student.phone]
 * @returns {Promise<Object>} el alumno creado
 */
async function createPerson({ dni, first_name, last_name, role, phone, state }) {
  const text = `
    INSERT INTO ${table} (dni, nombre, apellido, "idRol", telefono, estado)
    VALUES (
    $1, 
    $2, 
    $3, 
    (SELECT "idRol" FROM "Role" WHERE rol = $4),
    $5, 
    $6
    )
    RETURNING *;
  `;
  const values = [dni, first_name, last_name, role, phone, state];
  const { rows } = await db.query(text, values);
  return rows[0];
}

module.exports = {
  createPerson,
};
