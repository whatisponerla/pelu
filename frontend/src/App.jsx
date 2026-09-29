import React, { useState } from 'react';
import Header from './components/Header';
import ClientView from './pages/ClientView';
import AdminView from './pages/AdminView';

export default function App() {
  const [mode, setMode] = useState('client'); // 'client' | 'admin'
  const [activeTab, setActiveTab] = useState('todos'); // 'todos' | 'pendientes' | 'crear'
  const [unapprovedCount, setUnapprovedCount] = useState(0);

  return (
    <>
      <Header
        mode={mode}
        setMode={setMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unapprovedCount={unapprovedCount}
      />

      {mode === 'client' ? (
        <ClientView />
      ) : (
        <AdminView
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setUnapprovedCount={setUnapprovedCount}
        />
      )}
    </>
  );
}
