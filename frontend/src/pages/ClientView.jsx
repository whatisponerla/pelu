import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, User, Phone, Mail, FileText, QrCode } from 'lucide-react';
import { getSavedClientData, createTurnoAPI } from '../services/api';
import DatePickerModal from '../components/DatePickerModal';

export default function ClientView() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    observaciones: ''
  });
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [submittedTurno, setSubmittedTurno] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar autocompletado desde LocalStorage (RN-05)
  useEffect(() => {
    const saved = getSavedClientData();
    if (saved.nombre || saved.telefono) {
      setFormData(prev => ({
        ...prev,
        nombre: saved.nombre || '',
        telefono: saved.telefono || '',
        email: saved.email || ''
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDateTime) {
      setErrorMsg('Por favor seleccione una fecha y horario para su turno.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await createTurnoAPI({
        ...formData,
        fecha_hora: selectedDateTime
      });

      if (res.success) {
        setSubmittedTurno(res.data);
      } else {
        setErrorMsg(res.message || 'Error al reservar el turno.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error de conexión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="main-content">
      {submittedTurno ? (
        <div className="success-card">
          <div className="success-icon">
            <CheckCircle2 size={32} />
          </div>
          <h2>¡Turno Reservado!</h2>
          <p>Tu solicitud fue registrada con éxito.</p>

          <div style={{ background: '#181c26', padding: 14, borderRadius: 10, width: '100%', textAlign: 'left' }}>
            <div style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '1.1rem' }}>
              {submittedTurno.nombre}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              📍 Fecha y Hora: <strong>{submittedTurno.fecha_hora}</strong>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              📞 Teléfono: {submittedTurno.telefono}
            </div>
          </div>

          <button
            className="btn-secondary"
            onClick={() => {
              setSubmittedTurno(null);
              setSelectedDateTime('');
            }}
          >
            Reservar otro turno
          </button>
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', marginBottom: 10 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(229,180,82,0.1)', color: 'var(--primary-color)', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>
              <QrCode size={14} /> Reserva vía QR / Web
            </div>
            <h2 style={{ marginTop: 6 }}>Reserva tu Turno</h2>
            <p>Ingresa tus datos para agendar tu cita rápido y fácil.</p>
          </div>

          {errorMsg && (
            <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: 'var(--accent-red)', padding: 12, borderRadius: 8, fontSize: '0.85rem' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nombre y Apellido *</label>
              <input
                type="text"
                name="nombre"
                className="form-input"
                placeholder="Ej: Carlos Rossi"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono (WhatsApp) *</label>
              <input
                type="tel"
                name="telefono"
                className="form-input"
                placeholder="Ej: 1122334455"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email (Opcional)</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="ejemplo@correo.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha y Horario *</label>
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
              <label className="form-label">Servicio / Observaciones</label>
              <textarea
                name="observaciones"
                className="form-textarea"
                rows="2"
                placeholder="Ej: Corte de pelo + perfilado de barba"
                value={formData.observaciones}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Procesando...' : 'Confirmar Reserva de Turno'}
            </button>
          </form>

          <DatePickerModal
            isOpen={isDatePickerOpen}
            onClose={() => setIsDatePickerOpen(false)}
            onSelectDateTime={(dt) => setSelectedDateTime(dt)}
          />
        </>
      )}
    </div>
  );
}
