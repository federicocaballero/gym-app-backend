const db = require('../config/db');
const { createPerson, findByDniLast3, getClientsByCuoteStatus } = require('../models/Person');
const { createAttendance } = require('../models/Attendance');
const { createPayment } = require('../models/Payments');

//Crea una persona
async function createPersonHandler(req, res, next) {
  const {
    dni, first_name, last_name, role, phone, state,
    adminId,    // UUID del admin que registra (puede ser null)
    amount,     // si paga ahora (>0)
    trialDays   // si periodo de prueba (>0)
  } = req.body;

  // Validar campos obligatorios
  if (![first_name, last_name, dni, role, phone, state].every(Boolean)) {
    return res.status(400).json({ error: 'Faltan datos obligatorios.' });
  }
  if (!(amount > 0) && !(trialDays > 0)) {
    return res.status(400).json({ error: 'Debe enviar amount>0 o trialDays>0.' });
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // 1️⃣ Crear la persona
    const person = await createPerson(
      { dni, first_name, last_name, role, phone, state },
      client
    );

    // 2️⃣ Si paga ahora: registro asistencia + pago
    if (amount > 0) {
      await createAttendance(
        { personId: person.idPersona, status: 'present', adminId },
        client
      );

      const periodFor = new Date().toISOString().slice(0, 10);
      const exp = new Date();
      exp.setMonth(exp.getMonth() + 1);
      const expiresAt = exp.toISOString().slice(0, 10);

      await createPayment(
        { clientId: person.idPersona, amount, periodFor, expiresAt , adminId, type: 'paid', },
        client
      );

    } else {
      // 3️⃣ Periodo de prueba: solo pago tipo trial
      const startDate = new Date().toISOString().slice(0, 10);
      const exp = new Date();
      exp.setDate(exp.getDate() + trialDays);
      const expiresAt = exp.toISOString().slice(0, 10);

      await createPayment(
        { clientId: person.idPersona, amount: 0, periodFor: startDate, expiresAt, type: 'trial' },
        client
      );
    }

    await client.query('COMMIT');
    res.status(201).json(person);

  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
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

//Obtiene clientes filtrando por estado de la cuota
async function getClientsByCuote(req, res, next) {
  try {
    let { quotaStatus = 'all' } = req.query;
    quotaStatus = quotaStatus.toLowerCase();

    if (!['all', 'active', 'expired'].includes(quotaStatus)) {
      return res
        .status(400)
        .json({ error: "quotaStatus inválido. Usa 'all', 'active' o 'expired'." });
    }

    const clients = await getClientsByCuoteStatus({ quotaStatus });
    return res.json({
      count: clients.length,
      clients
    });
  } catch (err) {
    next(err);
  }
}


module.exports = {
  createPersonHandler,
  findByDniLast3Handler,
  getClientsByCuote
};
