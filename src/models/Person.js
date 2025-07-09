const db = require('../config/db');
const table = '"Person"';
/**
 * Inserta una persona en la base de datos en la tabla "Person".
 */
async function createPerson({ dni, first_name, last_name, role, phone, state}, client = db) {
  const text = `
    INSERT INTO ${table}
      (dni, nombre, apellido, "idRol", telefono, estado)
    VALUES
      (
        $1, $2, $3,
        (SELECT "idRol" FROM "Role" WHERE rol = $4),
        $5, $6
      )
    RETURNING *;
  `;
  const values = [dni, first_name, last_name, role, phone, state];
  const { rows } = await client.query(text, values);
  return rows[0];
}
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
    text += ` AND LOWER(TRIM(apellido)) = LOWER(TRIM($2))`;
    values.push(lastName);
  }

  text += ` ORDER BY "apellido","nombre";`;

  const { rows } = await db.query(text, values);
  return rows;
}
async function getClientsByCuoteStatus({ quotaStatus = 'all' } = {}) {
  const values = ['cliente'];
  let text = `
    SELECT
      p."idPersona",
      p.dni,
      p.nombre,
      p.apellido,
      p.telefono,
      p.estado       AS client_estado,
      pay."fechaVencimiento",
      pay."estado"   AS pago_estado
    FROM ${table} p
    JOIN "Role" r
      ON p."idRol" = r."idRol"
    -- Lateral para traer el último pago de cada persona
    LEFT JOIN LATERAL (
      SELECT *
        FROM "Payments"
       WHERE "idPersona" = p."idPersona"
       ORDER BY "fechaVencimiento" DESC
       LIMIT 1
    ) pay ON true
    WHERE r.rol = $1
  `;

  if (quotaStatus === 'active') {
    text += ` AND pay."fechaVencimiento" >= CURRENT_DATE`;
  } else if (quotaStatus === 'expired') {
    text += ` AND pay."fechaVencimiento" < CURRENT_DATE`;
  }

  text += `
    ORDER BY p."apellido", p."nombre";
  `;

  const { rows } = await db.query(text, values);
  return rows;
}

module.exports = {
  createPerson,
  findByDniLast3,
  getClientsByCuoteStatus
};
