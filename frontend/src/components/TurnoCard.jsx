import React from 'react';
import { Calendar, Clock, Phone, ChevronRight } from 'lucide-react';

export default function TurnoCard({ turno, onClick }) {
  // Formatear fecha y hora
  const fechaObj = new Date(turno.fecha_hora);
  const isValidDate = !isNaN(fechaObj.getTime());
  const fechaFormatted = isValidDate ? fechaObj.toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }) : turno.fecha_hora;
  const horaFormatted = isValidDate ? fechaObj.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit'
  }) : '';

  return (
    <div className="turno-card" onClick={() => onClick(turno)}>
      <div className="turno-info">
        <div className="turno-cliente">{turno.nombre}</div>
        <div className="turno-meta">
          <span><Phone size={12} style={{ display: 'inline', marginRight: 4 }} />{turno.telefono}</span>
          <span>•</span>
          <span><Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />{fechaFormatted} {horaFormatted}</span>
        </div>
        {turno.observaciones && (
          <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: 4 }}>
            "{turno.observaciones}"
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className={`turno-status status-${turno.estado}`}>
          {turno.estado}
        </span>
        <ChevronRight size={18} color="var(--text-muted)" />
      </div>
    </div>
  );
}
