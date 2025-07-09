const db = require('../config/db');
const { createPerson, findByDniLast3, getClientsByCuoteStatus } = require('../models/Person');
const { createAttendance } = require('../models/Attendance');
const { createPayment, getLastPaymentByPersonId } = require('../models/Payments');

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
        { clientId: person.idPersona, amount: 0, periodFor: startDate, expiresAt, adminId, type: 'trial' },
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

    if (!/^\d{3}$/.test(last3)) {
      return res.status(400).json({
        error: 'Debe proporcionar last3 de 3 dígitos en query string.'
      });
    }

    const persons = await findByDniLast3({
      last3,
      lastName: apellido
    });

    if (persons.length === 0) {
      return res.status(404).json({ error: 'No se encontró ningún cliente.' });
    }

    // Enriquecemos con datos de pago
    const personsWithPayment = await Promise.all(
      persons.map(async (person) => {
        const lastPayment = await getLastPaymentByPersonId(person.idPersona);

        let cuotaEstado = 'sin datos';
        if (lastPayment?.fechaVencimiento) {
          const hoy = new Date();
          const vencimiento = new Date(lastPayment.fechaVencimiento);
          cuotaEstado = vencimiento >= hoy ? 'activa' : 'vencida';
        }

        return {
          ...person,
          cuota: lastPayment,
          cuotaEstado
        };
      })
    );

    if (personsWithPayment.length === 1) {
      return res.json({ count: 1, person: personsWithPayment[0] });
    }

    return res.json({ count: personsWithPayment.length, persons: personsWithPayment });
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

async function registerAttendanceHandler(req, res, next) {
  const { personId, adminId } = req.body;

  // Validaciones básicas
  if (!personId) {
    return res.status(400).json({ error: 'Se requiere personId' });
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // 1. Verificar que el cliente existe
    const { rows: [person] } = await client.query(
      'SELECT * FROM "Person" WHERE "idPersona" = $1',
      [personId]
    );

    if (!person) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // 2. Verificar estado de la cuota
    const { rows: [lastPayment] } = await client.query(
      `SELECT * FROM "Payments" 
       WHERE "idPersona" = $1 
       ORDER BY "periodo" DESC 
       LIMIT 1`,
      [personId]
    );

    if (!lastPayment || new Date(lastPayment.fechaVencimiento) < new Date()) {
      return res.status(400).json({ 
        error: 'No se puede registrar asistencia: cuota vencida o sin pagos registrados' 
      });
    }

    // 3. Registrar asistencia
    const attendance = await createAttendance(
      { 
        personId, 
        status: 'present', 
        adminId 
      },
      client
    );

    await client.query('COMMIT');
    return res.status(201).json(attendance);

  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
}

module.exports = {
  createPersonHandler,
  findByDniLast3Handler,
  getClientsByCuote,
  registerAttendanceHandler
};
