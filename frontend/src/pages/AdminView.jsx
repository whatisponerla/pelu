import React, { useState, useEffect } from 'react';
import { fetchTurnos, updateTurnoAPI, deleteTurnoAPI, createTurnoAPI } from '../services/api';
import TurnoCard from '../components/TurnoCard';
import TurnoModal from '../components/TurnoModal';
import DatePickerModal from '../components/DatePickerModal';
import { PlusCircle, Calendar } from 'lucide-react';

export default function AdminView({ activeTab, setActiveTab, setUnapprovedCount }) {
  const [turnos, setTurnos] = useState([]);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estado para formulario de creación administrativa
  const [newTurno, setNewTurno] = useState({
    nombre: '',
    telefono: '',
    email: '',
    observaciones: '',
    estado: 'Confirmado'
  });
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const loadData = async () => {
    setLoading(true);
    const data = await fetchTurnos();
    setTurnos(data);
    const pending = data.filter(t => t.estado === 'Reservado').length;
    setUnapprovedCount(pending);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    await updateTurnoAPI(id, { estado: newStatus });
    setSelectedTurno(null);
    loadData();
  };

  const handleModify = async (id, data) => {
    await updateTurnoAPI(id, data);
    setSelectedTurno(null);
    loadData();
  };

  const handleDelete = async (id) => {
    await deleteTurnoAPI(id);
    setSelectedTurno(null);
    loadData();
  };

  const handleCreateAdminTurno = async (e) => {
    e.preventDefault();
    if (!selectedDateTime) {
      setMsg({ type: 'error', text: 'Seleccione fecha y hora para el turno' });
      return;
    }

    const res = await createTurnoAPI({
      ...newTurno,
      fecha_hora: selectedDateTime
    });

    if (res.success) {
      setMsg({ type: 'success', text: 'Turno creado con éxito por el administrador' });
      setNewTurno({ nombre: '', telefono: '', email: '', observaciones: '', estado: 'Confirmado' });
      setSelectedDateTime('');
      loadData();
      setActiveTab('todos');
    } else {
      setMsg({ type: 'error', text: res.message || 'Error al crear turno' });
    }
  };

  // Filtrar según pestaña activa (boseto 2 u.png)
  const displayTurnos = activeTab === 'pendientes'
    ? turnos.filter(t => t.estado === 'Reservado')
    : turnos;

  return (
    <div className="main-content">
      {activeTab === 'crear' ? (
        <div>
          <h2>Crear Nuevo Turno (Admin)</h2>
          <p style={{ marginBottom: 14 }}>Agendar un turno manualmente desde la administración.</p>

          {msg.text && (
            <div style={{
              background: msg.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
              border: `1px solid ${msg.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
              color: msg.type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)',
              padding: 12,
              borderRadius: 8,
              marginBottom: 14,
              fontSize: '0.85rem'
            }}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleCreateAdminTurno}>
            <div className="form-group">
              <label className="form-label">Nombre del Cliente *</label>
              <input
                type="text"
                className="form-input"
                value={newTurno.nombre}
                onChange={e => setNewTurno({ ...newTurno, nombre: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono *</label>
              <input
                type="tel"
                className="form-input"
                value={newTurno.telefono}
                onChange={e => setNewTurno({ ...newTurno, telefono: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha y Hora *</label>
              <button
                type="button"
                className="btn-secondary"
                style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => setIsDatePickerOpen(true)}
              >
                <span>{selectedDateTime ? `📅 ${selectedDateTime}` : 'Seleccionar fecha y hora...'}</span>
                <Calendar size={18} color="var(--primary-color)" />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Estado Inicial</label>
              <select
                className="form-select"
                value={newTurno.estado}
                onChange={e => setNewTurno({ ...newTurno, estado: e.target.value })}
              >
                <option value="Confirmado">Confirmado</option>
                <option value="Reservado">Sin Aprobar / Pendiente</option>
                <option value="Atendido">Atendido</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Observaciones</label>
              <textarea
                className="form-textarea"
                rows="2"
                value={newTurno.observaciones}
                onChange={e => setNewTurno({ ...newTurno, observaciones: e.target.value })}
              />
            </div>

            <button type="submit" className="btn-primary">
              <PlusCircle size={18} /> Guardar Turno
            </button>
          </form>

          <DatePickerModal
            isOpen={isDatePickerOpen}
            onClose={() => setIsDatePickerOpen(false)}
            onSelectDateTime={dt => setSelectedDateTime(dt)}
          />
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2>{activeTab === 'pendientes' ? 'Turnos Sin Aprobar' : 'Agenda de Turnos'}</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total: {displayTurnos.length}
            </span>
          </div>

          {loading ? (
            <p>Cargando agenda...</p>
          ) : displayTurnos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
              {activeTab === 'pendientes' ? 'No hay turnos pendientes de aprobación.' : 'No hay turnos agendados.'}
            </div>
          ) : (
            <div className="turnos-grid">
              {displayTurnos.map(t => (
                <TurnoCard
                  key={t.id}
                  turno={t}
                  onClick={turno => setSelectedTurno(turno)}
                />
              ))}
            </div>
          )}

          {selectedTurno && (
            <TurnoModal
              turno={selectedTurno}
              onClose={() => setSelectedTurno(null)}
              onUpdateStatus={handleUpdateStatus}
              onModify={handleModify}
              onDelete={handleDelete}
            />
          )}
        </div>
      )}
    </div>
  );
}
