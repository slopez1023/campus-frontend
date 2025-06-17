import React, { useState, useEffect, useCallback } from 'react';
import Toast from './Toast';
import useToast from '../hooks/useToast';
import CampusAssignment from './CampusAssignment';
import CreateCampusModal from './CreateCampusModal';
import SedeDetailView from './SedeDetailView';

const CampusTest = () => {
  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [currentView, setCurrentView] = useState('campus');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const loadCampuses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/campuses');
      if (!response.ok) {
        throw new Error('Error al conectar con el servidor');
      }
      const data = await response.json();
      setCampuses(data);
      console.log('✅ Sedes cargadas:', data);
    } catch (err) {
      setError(err.message);
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCampuses();
  }, [loadCampuses]);

  // Navegación
  useEffect(() => {
    const handleNavigateToHome = () => {
      setCurrentView('campus');
      setViewMode('grid');
    };

    const handleNavigateToCreate = () => {
      setShowCreateModal(true);
    };

    const handleNavigateToEdit = () => {
      setCurrentView('campus');
      setViewMode('grid');
    };

    const handleNavigateToSedes = () => {
      setCurrentView('campus');
      setViewMode('grid');
    };

    const handleNavigateToAssignment = () => {
      setCurrentView('assignment');
    };

    window.addEventListener('navigateToHome', handleNavigateToHome);
    window.addEventListener('navigateToCreate', handleNavigateToCreate);
    window.addEventListener('navigateToEdit', handleNavigateToEdit);
    window.addEventListener('navigateToSedes', handleNavigateToSedes);
    window.addEventListener('navigateToAssignment', handleNavigateToAssignment);
    
    return () => {
      window.removeEventListener('navigateToHome', handleNavigateToHome);
      window.removeEventListener('navigateToCreate', handleNavigateToCreate);
      window.removeEventListener('navigateToEdit', handleNavigateToEdit);
      window.removeEventListener('navigateToSedes', handleNavigateToSedes);
      window.removeEventListener('navigateToAssignment', handleNavigateToAssignment);
    };
  }, []);

  const handleCampusSelect = useCallback((campus) => {
    setSelectedCampus(campus);
    setViewMode('detail');
  }, []);

  const handleSave = useCallback(async (campusId, formData) => {
  if (!formData.name?.trim() || !formData.address?.trim()) {
    showError('El nombre y la dirección son requeridos', 3000);
    return;
  }

  try {
    // Limpiar y preparar datos
    const cleanFormData = {
      ...formData,
      name: formData.name.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      telephone: formData.telephone || null,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
      email: formData.email || null,
      inauguratedDate: formData.inauguratedDate || null,
      active: formData.active
    };

    console.log('Enviando datos:', cleanFormData); // Para debug

    const response = await fetch(`http://localhost:8080/api/campuses/${campusId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanFormData),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar la sede');
    }

    const updatedCampus = await response.json();
    console.log('Sede actualizada:', updatedCampus); // Para debug
    
    setSelectedCampus(updatedCampus);
    await loadCampuses();
    showSuccess('¡Sede actualizada exitosamente!', 3000);
  } catch (err) {
    console.error('Error en handleSave:', err);
    showError('Error al actualizar la sede: ' + err.message, 4000);
    throw err;
  }
}, [loadCampuses, showSuccess, showError]);

  const handleToggleStatus = useCallback(async (campus) => {
    const action = campus.active ? 'inhabilitar' : 'habilitar';
    const confirmMessage = campus.active 
      ? `¿Seguro que quieres inhabilitar la sede "${campus.name}"?`
      : `¿Seguro que quieres habilitar la sede "${campus.name}"?`;

    if (window.confirm(confirmMessage)) {
      try {
        const updatedCampus = { ...campus, active: !campus.active };
        
        const response = await fetch(`http://localhost:8080/api/campuses/${campus.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedCampus),
        });

        if (!response.ok) {
          throw new Error(`Error al ${action} la sede`);
        }

        await loadCampuses();
        
        if (selectedCampus?.id === campus.id) {
          setSelectedCampus(updatedCampus);
        }
        
        const successMessage = campus.active 
          ? '¡Sede inhabilitada exitosamente!' 
          : '¡Sede habilitada exitosamente!';
        
        showSuccess(successMessage, 3000);
      } catch (err) {
        showError(`Error al ${action} la sede: ` + err.message, 4000);
      }
    }
  }, [selectedCampus, loadCampuses, showSuccess, showError]);

  const handleCreateCampus = useCallback(async (formData) => {
    setCreateLoading(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/campuses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al crear la sede');
      }

      await loadCampuses();
      setShowCreateModal(false);
      showSuccess('¡Sede creada exitosamente!', 3000);
    } catch (err) {
      showError('Error al crear la sede: ' + err.message, 4000);
      throw err;
    } finally {
      setCreateLoading(false);
    }
  }, [loadCampuses, showSuccess, showError]);

  const filteredCampuses = campuses.filter(campus => {
    const matchesSearch = campus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campus.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = showInactive ? !campus.active : campus.active;
    
    return matchesSearch && matchesStatus;
  });

  // Header unificado
  const UnifiedHeader = () => (
    <header style={{
      background: 'linear-gradient(135deg, #3730a3 0%, #4c1d95 100%)',
      color: 'white',
      padding: '0.75rem 2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      height: '70px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '16px',
            width: '140px',
            height: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
            position: 'relative',
            top: '25px',
            border: '3px solid rgba(255,255,255,0.1)'
          }}>
            <img src="/logoU.png" alt="Logo Universidad" style={{
              width: '150%',
              height: '150%',
              objectFit: 'contain'
            }} />
          </div>
        </div>

        <nav>
          <div style={{
            display: 'flex',
            gap: '2rem',
            listStyle: 'none',
            height: '100%',
            alignItems: 'center'
          }}>
            {[
              { key: 'home', label: 'Home', event: 'navigateToHome' },
              { key: 'assignment', label: 'Asignaciones', event: 'navigateToAssignment' },
              { key: 'create', label: 'Crear', event: 'navigateToCreate' },
              { key: 'edit', label: 'Editar', event: 'navigateToEdit' },
              { key: 'campus', label: 'Sedes', event: 'navigateToSedes' }
            ].map(({ key, label, event }) => (
              <button 
                key={key}
                style={{
                  background: currentView === key ? 'rgba(255, 255, 255, 0.2)' : 'none',
                  border: 'none',
                  color: 'white',
                  fontWeight: '500',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer',
                  fontSize: 'inherit',
                  fontFamily: 'inherit'
                }}
                onClick={() => window.dispatchEvent(new CustomEvent(event))}
                onMouseOver={(e) => {
                  if (currentView !== key) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseOut={(e) => {
                  if (currentView !== key) {
                    e.target.style.background = 'none';
                  }
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 1rem',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '25px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          flexShrink: '0'
        }}>
          <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}></div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>Santiago</div>
            <div style={{ fontSize: '0.75rem', opacity: '0.8' }}>Administrador</div>
          </div>
        </div>
      </div>
    </header>
  );

  const SedesGridView = () => (
    <div className="sedes-main-view">
      <UnifiedHeader />
      
      <div className="section-title-header">
        <div className="section-title-container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}>
          <h1 className="section-title">Gestión Sedes</h1>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <button 
              style={{
                background: showInactive ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #6b7280, #4b5563)',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: '500',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
              onClick={() => setShowInactive(!showInactive)}
            >
              {showInactive ? '👁️ Mostrando Inactivas' : '🔍 Ver Inactivas'}
            </button>

            <button 
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                whiteSpace: 'nowrap'
              }}
              onClick={() => setShowCreateModal(true)}
              disabled={loading}
            >
              ➕ Nueva Sede
            </button>
          </div>
        </div>
      </div>

      <div className="sedes-grid-container">
        <div className="sedes-grid-content">
          {loading && (
            <div className="sedes-grid-loading">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="sede-card-skeleton"></div>
              ))}
            </div>
          )}

          {error && (
            <div className="sedes-grid-error">
              <div className="sedes-grid-error-icon">⚠️</div>
              <div className="sedes-grid-error-title">Error de Conexión</div>
              <div className="sedes-grid-error-message">{error}</div>
              <button className="sedes-grid-error-button" onClick={loadCampuses}>
                🔄 Reintentar
              </button>
            </div>
          )}

          {!loading && !error && filteredCampuses.length === 0 && (
            <div className="sedes-grid-empty">
              <div className="sedes-grid-empty-icon">📭</div>
              <div className="sedes-grid-empty-title">No hay sedes disponibles</div>
              <div className="sedes-grid-empty-subtitle">
                No se encontraron sedes que coincidan con tu búsqueda
              </div>
            </div>
          )}

          {!loading && !error && filteredCampuses.length > 0 && (
            <div className="sedes-grid">
              {filteredCampuses.map((campus) => (
                <div key={campus.id} className="sede-card" onClick={() => handleCampusSelect(campus)}>
                  <div className={`sede-card-status ${campus.active ? 'sede-status-active' : 'sede-status-inactive'}`}>
                    {campus.active ? 'Activa' : 'Inactiva'}
                  </div>
                  <h3 className="sede-card-title">{campus.name}</h3>
                  <div className="sede-card-address">{campus.address}</div>
                  <div className="sede-card-phone">{campus.telephone || 'No especificado'}</div>
                  
                  <div style={{
                    marginTop: '1rem',
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    <button
                      style={{
                        background: campus.active ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        flex: 1
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(campus);
                      }}
                    >
                      {campus.active ? '🗑️ Inhabilitar' : '✅ Habilitar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {currentView === 'campus' ? (
        viewMode === 'grid' ? <SedesGridView /> : (
          <SedeDetailView
            selectedCampus={selectedCampus}
            onBack={() => setViewMode('grid')}
            onSave={handleSave}
            onToggleStatus={handleToggleStatus}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filteredCampuses={filteredCampuses}
            onCampusSelect={handleCampusSelect}
            UnifiedHeader={UnifiedHeader}
          />
        )
      ) : (
        <CampusAssignment />
      )}
      
      <CreateCampusModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCampus}
        isLoading={createLoading}
      />
      
      <div className="toast-container-wrapper">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            isVisible={toast.isVisible}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CampusTest;