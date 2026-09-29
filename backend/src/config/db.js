import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de MySQL (XAMPP por defecto)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'peluqueria_turnos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;
let useFallbackMemory = false;

// Datos en memoria de respaldo si MySQL no está iniciado
const memoryStore = {
  clientes: [
    { id: 1, nombre: 'Juan Pérez', telefono: '1122334455', email: 'juan@example.com', fecha_creacion: new Date() },
    { id: 2, nombre: 'María Gómez', telefono: '1199887766', email: 'maria@example.com', fecha_creacion: new Date() }
  ],
  turnos: [
    { id: 1, cliente_id: 1, nombre: 'Juan Pérez', telefono: '1122334455', fecha_hora: new Date(Date.now() + 86400000).toISOString(), estado: 'Reservado', observaciones: 'Corte de pelo y barba', fecha_creacion: new Date() },
    { id: 2, cliente_id: 2, nombre: 'María Gómez', telefono: '1199887766', fecha_hora: new Date(Date.now() + 172800000).toISOString(), estado: 'Confirmado', observaciones: 'Tinte y peinado', fecha_creacion: new Date() }
  ],
  nextClienteId: 3,
  nextTurnoId: 3
};

try {
  pool = mysql.createPool(dbConfig);
} catch (err) {
  console.warn('⚠️ No se pudo crear el pool de MySQL, usando modo de prueba en memoria.', err.message);
  useFallbackMemory = true;
}

export async function query(sql, params) {
  if (useFallbackMemory) {
    return handleMemoryQuery(sql, params);
  }

  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (err) {
    console.warn('⚠️ Error ejecutando query en MySQL. Cambiando a modo de prueba en memoria:', err.message);
    useFallbackMemory = true;
    return handleMemoryQuery(sql, params);
  }
}

function handleMemoryQuery(sql, params = []) {
  const upperSql = sql.toUpperCase();

  // Buscar cliente por teléfono
  if (upperSql.includes('SELECT * FROM CLIENTES WHERE TELEFONO')) {
    const [telefono] = params;
    const found = memoryStore.clientes.filter(c => c.telefono === telefono);
    return found;
  }

  // Insertar cliente
  if (upperSql.includes('INSERT INTO CLIENTES')) {
    const [nombre, telefono, email] = params;
    const newCliente = {
      id: memoryStore.nextClienteId++,
      nombre,
      telefono,
      email,
      fecha_creacion: new Date()
    };
    memoryStore.clientes.push(newCliente);
    return { insertId: newCliente.id, affectedRows: 1 };
  }

  // Obtener turnos con clientes
  if (upperSql.includes('FROM TURNOS') && upperSql.includes('JOIN CLIENTES')) {
    return memoryStore.turnos.map(t => {
      const cliente = memoryStore.clientes.find(c => c.id === t.cliente_id) || {};
      return {
        ...t,
        nombre: cliente.nombre || t.nombre,
        telefono: cliente.telefono || t.telefono,
        email: cliente.email
      };
    });
  }

  // Insertar turno
  if (upperSql.includes('INSERT INTO TURNOS')) {
    const [cliente_id, fecha_hora, estado, observaciones] = params;
    const cliente = memoryStore.clientes.find(c => c.id === cliente_id);
    const newTurno = {
      id: memoryStore.nextTurnoId++,
      cliente_id,
      nombre: cliente ? cliente.nombre : 'Cliente',
      telefono: cliente ? cliente.telefono : '',
      fecha_hora,
      estado: estado || 'Reservado',
      observaciones,
      fecha_creacion: new Date()
    };
    memoryStore.turnos.push(newTurno);
    return { insertId: newTurno.id, affectedRows: 1 };
  }

  // Actualizar turno
  if (upperSql.includes('UPDATE TURNOS')) {
    const id = params[params.length - 1];
    const turno = memoryStore.turnos.find(t => t.id == id);
    if (turno) {
      if (upperSql.includes('ESTADO')) turno.estado = params[0];
      if (upperSql.includes('FECHA_HORA')) turno.fecha_hora = params[1] || params[0];
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // Eliminar turno
  if (upperSql.includes('DELETE FROM TURNOS')) {
    const [id] = params;
    const idx = memoryStore.turnos.findIndex(t => t.id == id);
    if (idx !== -1) {
      memoryStore.turnos.splice(idx, 1);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  return [];
}

export default pool;
