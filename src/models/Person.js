const db = require('../config/db');
const table = '"Person"';
/**
 * Inserta una persona en la base de datos en la tabla "Person".
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

/**
 * TODO: 
 *  FUNCION PARA ACTUALIZAR UNA PERSONA
 *  FUNCION PARA ELIMINAR UNA PERSONA
 *  FUNCION PARA REACTIVAR UNA PERSONA
 *  FUNCION PARA OBTENER UNA PERSONA
 *  FUNCION PARA OBTENER TODAS LAS PERSONAS
 *  FUNCION PARA OBTENER TODAS LAS PERSONAS CON CUOTAS PAGADAS
 *  FUNCION PARA OBTENER TODAS LAS PERSONAS CON CUOTAS NO PAGADAS
 * **/

async function findByDniLast3({ last3, lastName }) {
  // Base de la consulta y parámetros
  let text = `
    SELECT
      "idPersona","dni","nombre","apellido",
      "telefono","estado","fechaDeAlta"
    FROM ${table}
    WHERE RIGHT(dni,3) = $1
  `;
  const values = [last3];

  // Si me pasaron apellido, lo agrego al WHERE
  if (lastName) {
    text += ` AND LOWER(apellido) LIKE LOWER($2) || '%'`;
    values.push(lastName);
  }

  text += ` ORDER BY "apellido","nombre";`;

  const { rows } = await db.query(text, values);
  return rows;
}
module.exports = {
  createPerson,
  findByDniLast3
};
