const db = require('../config/db');
const { createPerson, findByDniLast3 } = require('../models/Person');
const { createAttendance } = require('../models/Attendance');
/**
 * Controlador para crear un alumno.
 * Espera en el body: { dni, first_name, last_name, role, phone, state }
 */
async function createPersonHandler(req, res, next) {
  const { dni, first_name, last_name, role, phone, state, adminId } = req.body;
  const client = await db.connect();   // ①

  try {
    await client.query('BEGIN');        // ②

    // 1) Inserción de Person
    const { rows: [person] } = await client.query(
      `
      INSERT INTO "Person"
        (dni,nombre,apellido,"idRol",telefono,estado)
      VALUES
        (
          $1,$2,$3,
          (SELECT "idRol" FROM "Role" WHERE rol = $4),
          $5,$6
        )
      RETURNING *;
      `,
      [dni, first_name, last_name, role, phone, state]
    );

    // 2) Inserción en Attendances
    await client.query(
      `
      INSERT INTO "Attendances"
        ("idPersona", fecha, estado, "registradoPor")
      VALUES ($1, CURRENT_DATE, 'present', $2)
      `,
      [person.idPersona, adminId || null]
    );

    await client.query('COMMIT');       // ③

    // 3) Devuelve el objeto creado
    res.status(201).json(person);
  } catch (err) {
    await client.query('ROLLBACK');     // ④
    next(err);
  } finally {
    client.release();                   // ⑤
  }
}

// Busca personas por ultimos 3 numeros de DNI y opcional apellido
async function findByDniLast3Handler(req, res, next) {
  try {
    const { last3, apellido } = req.query;

    // last3 es obligatorio y debe ser 3 dígitos
    if (!/^\d{3}$/.test(last3)) {
      return res.status(400).json({
        error: 'Debe proporcionar last3 de 3 dígitos en query string.'
      });
    }

    // Llamo al modelo con opcional apellido
    const persons = await findByDniLast3({
      last3,
      lastName: apellido   // undefined si no está
    });

    if (persons.length === 0) {
      return res.status(404).json({ error: 'No se encontró ningún cliente.' });
    }
    if (persons.length === 1) {
      return res.json({ count: persons.length, person: persons[0] });
    }
    // Múltiples coincidencias
    return res.json({ count: persons.length, persons });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createPersonHandler,
  findByDniLast3Handler
};
