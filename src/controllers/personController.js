const { createPerson } = require('../models/Person');
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

module.exports = {
  createPersonHandler,
};
