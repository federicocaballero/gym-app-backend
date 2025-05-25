// controllers/studentController.js

const { createStudent } = require('../models/Student');

/**
 * Controlador para crear un alumno.
 * Espera en el body: { first_name, last_name, dni, phone }
 */
async function createStudentHandler(req, res, next) {
  try {
    const { first_name, last_name, dni, phone } = req.body;

    // Validaciones básicas
    if (!first_name || !last_name || !dni) {
      return res
        .status(400)
        .json({ error: 'Los campos first_name, last_name y dni son obligatorios.' });
    }

    const student = await createStudent({ first_name, last_name, dni, phone });
    res.status(201).json(student);
  } catch (err) {
    next(err); // Pasa el error al middleware de manejo de errores
  }
}

module.exports = {
  createStudentHandler,
};
