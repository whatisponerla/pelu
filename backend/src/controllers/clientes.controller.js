import { query } from '../config/db.js';

// GET /clientes/telefono/:telefono
export async function getClienteByTelefono(req, res) {
  try {
    const { telefono } = req.params;
    const rows = await query('SELECT * FROM clientes WHERE telefono = ?', [telefono]);
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    return res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al buscar cliente'
    });
  }
}

// POST /clientes
export async function createCliente(req, res) {
  try {
    const { nombre, telefono, email } = req.body;

    if (!nombre || !telefono) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y teléfono son obligatorios'
      });
    }

    // Verificar si ya existe
    const existing = await query('SELECT * FROM clientes WHERE telefono = ?', [telefono]);
    if (existing && existing.length > 0) {
      return res.json({
        success: true,
        data: existing[0],
        message: 'Cliente existente reutilizado'
      });
    }

    const result = await query(
      'INSERT INTO clientes (nombre, telefono, email) VALUES (?, ?, ?)',
      [nombre, telefono, email || null]
    );

    return res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        nombre,
        telefono,
        email: email || null
      }
    });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al registrar el cliente'
    });
  }
}
