import React from 'react';
import { Scissors, UserCheck, Shield, Calendar, PlusCircle, Clock } from 'lucide-react';

export default function Header({ mode, setMode, activeTab, setActiveTab, unapprovedCount }) {
  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand-logo">
          <Scissors size={24} color="var(--primary-color)" />
          <span>BARBERÍA & PELUQUERÍA</span>
        </div>
        <button
          className="mode-toggle"
          onClick={() => setMode(mode === 'client' ? 'admin' : 'client')}
        >
          {mode === 'client' ? (
            <>
              <Shield size={14} /> Modo Admin
            </>
          ) : (
            <>
              <UserCheck size={14} /> Modo Cliente
            </>
          )}
        </button>
      </div>

      {mode === 'admin' && (
        <div className="admin-nav-tabs">
          <button
            className={`tab-btn ${activeTab === 'todos' ? 'active' : ''}`}
            onClick={() => setActiveTab('todos')}
          >
            <Calendar size={16} />
            Ver Turnos
          </button>

          <button
            className={`tab-btn ${activeTab === 'pendientes' ? 'active' : ''}`}
            onClick={() => setActiveTab('pendientes')}
          >
            <Clock size={16} />
            Sin Aprobar
            {unapprovedCount > 0 && <span className="badge">{unapprovedCount}</span>}
          </button>

          <button
            className={`tab-btn ${activeTab === 'crear' ? 'active' : ''}`}
            onClick={() => setActiveTab('crear')}
          >
            <PlusCircle size={16} />
            Crear Turno
          </button>
        </div>
      )}
    </header>
  );
}
