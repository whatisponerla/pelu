import { query } from '../config/db.js';

// GET /turnos/disponibles?fecha=YYYY-MM-DD
export async function getTurnosDisponibles(req, res) {
  try {
    const { fecha } = req.query;
    // Slots de horario estándar de trabajo (ej: 09:00 a 19:00)
    const standardSlots = [
      '09:00', '10:00', '11:00', '12:00',
      '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    if (!fecha) {
      return res.json({
        success: true,
        data: standardSlots
      });
    }

    // Obtener turnos ya reservados para esa fecha
    const turnosOcupados = await query(
      `SELECT DATE_FORMAT(fecha_hora, '%H:%i') as hora 
       FROM turnos 
       WHERE DATE(fecha_hora) = ? AND estado NOT IN ('Cancelado')`,
      [fecha]
    );

    const horasOcupadas = turnosOcupados.map(t => t.hora);
    const disponibles = standardSlots.filter(slot => !horasOcupadas.includes(slot));

    return res.json({
      success: true,
      data: disponibles
    });
  } catch (error) {
    console.error('Error obteniendo horarios disponibles:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al consultar disponibilidad'
    });
  }
}

// GET /turnos (con clientes)
export async function getTurnos(req, res) {
  try {
    const { estado, fecha } = req.query;
    let sql = `
      SELECT t.id, t.cliente_id, c.nombre, c.telefono, c.email, 
             t.fecha_hora, t.estado, t.observaciones, t.fecha_creacion
      FROM turnos t
      JOIN clientes c ON t.cliente_id = c.id
    `;
    const params = [];
    const conditions = [];

    if (estado) {
      conditions.push('t.estado = ?');
      params.push(estado);
    }
    if (fecha) {
      conditions.push('DATE(t.fecha_hora) = ?');
      params.push(fecha);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY t.fecha_hora ASC';

    const turnos = await query(sql, params);

    return res.json({
      success: true,
      data: turnos
    });
  } catch (error) {
    console.error('Error al obtener turnos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al consultar agenda de turnos'
    });
  }
}

// POST /turnos (Cumple RN-09: Buscar/Crear cliente -> Crear turno)
export async function createTurno(req, res) {
  try {
    const { nombre, telefono, email, fecha_hora, observaciones, estado } = req.body;

    if (!nombre || !telefono || !fecha_hora) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, teléfono y fecha_hora son obligatorios'
      });
    }

    // 1. Buscar o crear cliente
    let clienteId = null;
    const existingClient = await query('SELECT * FROM clientes WHERE telefono = ?', [telefono]);

    if (existingClient && existingClient.length > 0) {
      clienteId = existingClient[0].id;
    } else {
      const newClient = await query(
        'INSERT INTO clientes (nombre, telefono, email) VALUES (?, ?, ?)',
        [nombre, telefono, email || null]
      );
      clienteId = newClient.insertId;
    }

    // 2. Verificar RN-01 / RN-07: Doble reserva para la misma fecha u hora
    const conflict = await query(
      `SELECT * FROM turnos 
       WHERE fecha_hora = ? AND estado NOT IN ('Cancelado')`,
      [fecha_hora]
    );

    if (conflict && conflict.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'El horario seleccionado ya ha sido reservado por otro cliente.'
      });
    }

    // 3. Crear el turno
    const estadoFinal = estado || 'Reservado';
    const result = await query(
      'INSERT INTO turnos (cliente_id, fecha_hora, estado, observaciones) VALUES (?, ?, ?, ?)',
      [clienteId, fecha_hora, estadoFinal, observaciones || null]
    );

    return res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        cliente_id: clienteId,
        nombre,
        telefono,
        email,
        fecha_hora,
        estado: estadoFinal,
        observaciones
      },
      message: 'Turno reservado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear turno:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno al procesar el turno'
    });
  }
}

// PUT /turnos/:id
export async function updateTurno(req, res) {
  try {
    const { id } = req.params;
    const { estado, fecha_hora, observaciones } = req.body;

    const updates = [];
    const params = [];

    if (estado !== undefined) {
      updates.push('estado = ?');
      params.push(estado);
    }
    if (fecha_hora !== undefined) {
      updates.push('fecha_hora = ?');
      params.push(fecha_hora);
    }
    if (observaciones !== undefined) {
      updates.push('observaciones = ?');
      params.push(observaciones);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos para actualizar'
      });
    }

    params.push(id);
    const sql = `UPDATE turnos SET ${updates.join(', ')} WHERE id = ?`;

    const result = await query(sql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Turno no encontrado'
      });
    }

    return res.json({
      success: true,
      message: 'Turno actualizado correctamente'
    });
  } catch (error) {
    console.error('Error actualizando turno:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el turno'
    });
  }
}

// DELETE /turnos/:id
export async function deleteTurno(req, res) {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM turnos WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Turno no encontrado'
      });
    }

    return res.json({
      success: true,
      message: 'Turno eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar turno:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar turno'
    });
  }
}
