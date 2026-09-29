import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { fetchHorariosDisponibles } from '../services/api';

export default function DatePickerModal({ isOpen, onClose, onSelectDateTime }) {
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [step, setStep] = useState(1); // 1: Seleccionar fecha, 2: Seleccionar horario
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fecha && step === 2) {
      setLoading(true);
      fetchHorariosDisponibles(fecha).then(data => {
        setHorarios(data);
        setLoading(false);
      });
    }
  }, [fecha, step]);

  if (!isOpen) return null;

  const handleFechaSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSlotSelect = (hora) => {
    onSelectDateTime(`${fecha} ${hora}`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          {step === 2 && (
            <button
              className="close-btn"
              onClick={() => setStep(1)}
              title="Volver a seleccionar fecha"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h3>{step === 1 ? 'Seleccionar Fecha' : 'Horarios Disponibles'}</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleFechaSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Elija la fecha del turno:</label>
              <input
                type="date"
                className="form-input"
                value={fecha}
                min={new Date().toISOString().slice(0, 10)}
                onChange={e => setFecha(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Ver Horarios Disponibles <Clock size={18} />
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p>Horarios libres para el <strong>{fecha}</strong>:</p>

            {loading ? (
              <p>Cargando horarios...</p>
            ) : horarios.length === 0 ? (
              <p style={{ color: 'var(--accent-red)' }}>No hay horarios disponibles para esta fecha.</p>
            ) : (
              <div className="slots-grid">
                {horarios.map(hora => (
                  <button
                    key={hora}
                    className="slot-btn"
                    onClick={() => handleSlotSelect(hora)}
                  >
                    {hora} hs
                  </button>
                ))}
              </div>
            )}

            <button
              className="btn-secondary"
              onClick={() => setStep(1)}
              style={{ marginTop: 10 }}
            >
              ← Cambiar de fecha
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
