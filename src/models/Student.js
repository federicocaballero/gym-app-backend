// models/studentModel.js

const db = require('../config/db');

/**
 * Inserta un nuevo alumno en la tabla students.
 * @param {Object} student
 * @param {string} student.first_name
 * @param {string} student.last_name
 * @param {string} student.dni
 * @param {string} [student.phone]
 * @returns {Promise<Object>} el alumno creado
 */
async function createStudent({ first_name, last_name, dni, phone }) {
  const text = `
    INSERT INTO clients (first_name, last_name, dni, phone)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [ first_name, last_name, dni, phone ];
  const { rows } = await db.query(text, values);
  return rows[0];
}

module.exports = {
  createStudent,
};
