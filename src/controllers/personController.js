const { createPerson, findByDniLast3 } = require('../models/Person');
const db = require('../config/db');
/**
 * Controlador para crear un alumno.
 * Espera en el body: { dni, first_name, last_name, role, phone, state }
 */
async function createPersonHandler(req, res, next) {
  try {
    const { dni, first_name, last_name, role, phone, state } = req.body;

    // Validaciones básicas
    if (!first_name || !last_name || !dni || !role || !state || !phone) {
      return res
        .status(400)
        .json({ error: 'Todos los campos son obligatorios.' });
    }
    // 1️⃣ Inserta la persona en la base de datos
    const person = await createPerson({ dni, first_name, last_name, role, phone, state });

    // 2️⃣ Recupera el texto del rol
    const {
      rows: [roleRow]
    } = await db.query(
      `SELECT rol 
         FROM "Role" 
        WHERE "idRol" = $1`,
      [person.idRol]
    );

    // 3️⃣ Construye el objeto de respuesta reemplazando idRol por role
    const response = {
      idPersona: person.idPersona,
      dni: person.dni,
      nombre: person.nombre,
      apellido: person.apellido,
      role: roleRow ? roleRow.rol : null,
      telefono: person.telefono,
      estado: person.estado,
      fechaDeAlta: person.fechaDeAlta
    };


    res.status(201).json(response);
  } catch (err) {
    next(err); // Pasa el error al middleware de manejo de errores
  }
}

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
