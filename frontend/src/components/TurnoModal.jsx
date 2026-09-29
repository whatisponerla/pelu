import React, { useState } from 'react';
import { X, CheckCircle, Edit, Trash2 } from 'lucide-react';

export default function TurnoModal({ turno, onClose, onUpdateStatus, onModify, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [estado, setEstado] = useState(turno.estado);
  const [observaciones, setObservaciones] = useState(turno.observaciones || '');

  if (!turno) return null;

  const handleSaveEdit = () => {
    onModify(turno.id, { estado, observaciones });
    setIsEditing(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Detalles del Turno #{turno.id}</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cliente:</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{turno.nombre}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--primary-color)' }}>{turno.telefono}</div>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fecha y Hora:</span>
            <div style={{ fontWeight: 600 }}>{turno.fecha_hora}</div>
          </div>

          {!isEditing ? (
            <>
              <div className="form-group">
                <label className="form-label">Estado actual:</label>
                <span className={`turno-status status-${turno.estado}`} style={{ width: 'fit-content' }}>
                  {turno.estado}
                </span>
              </div>

              {turno.observaciones && (
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Observaciones:</span>
                  <p>{turno.observaciones}</p>
                </div>
              )}

              {turno.estado === 'Reservado' && (
                <button
                  className="btn-primary"
                  onClick={() => onUpdateStatus(turno.id, 'Confirmado')}
                >
                  <CheckCircle size={18} /> Aprobar / Confirmar Turno
                </button>
              )}

              <button
                className="btn-secondary"
                onClick={() => setIsEditing(true)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <Edit size={16} /> Modificar Turno
              </button>

              <button
                className="btn-danger"
                onClick={() => onDelete(turno.id)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <Trash2 size={16} /> Eliminar Turno
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Estado:</label>
                <select
                  className="form-select"
                  value={estado}
                  onChange={e => setEstado(e.target.value)}
                >
                  <option value="Reservado">Reservado (Sin Aprobar)</option>
                  <option value="Confirmado">Confirmado</option>
                  <option value="Atendido">Atendido</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Observaciones:</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  value={observaciones}
                  onChange={e => setObservaciones(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-primary" onClick={handleSaveEdit}>
                  Guardar Cambios
                </button>
                <button className="btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
