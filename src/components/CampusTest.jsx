import React, { useState, useEffect } from 'react';

const CampusTest = () => {
  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'detail'

  useEffect(() => {
    loadCampuses();
  }, []);

  const loadCampuses = async () => {
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
  };

  const handleCampusSelect = (campus) => {
    setSelectedCampus(campus);
    setIsEditing(false);
    setEditForm({});
    setViewMode('detail');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      name: selectedCampus.name,
      address: selectedCampus.address,
      city: selectedCampus.city,
      telephone: selectedCampus.telephone || '',
      active: selectedCampus.active
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/campuses/${selectedCampus.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la sede');
      }

      setIsEditing(false);
      loadCampuses();
      alert('¡Sede actualizada exitosamente!');
    } catch (err) {
      alert('Error al actualizar la sede: ' + err.message);
    }
  };

  const handleDelete = async (campusToDelete) => {
    if (window.confirm(`¿Seguro que quieres eliminar la sede "${campusToDelete.name}"?`)) {
      try {
        const response = await fetch(`http://localhost:8080/api/campuses/${campusToDelete.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Error al eliminar la sede');
        }

        loadCampuses();
        if (selectedCampus?.id === campusToDelete.id) {
          setSelectedCampus(null);
          setViewMode('grid');
        }
        alert('¡Sede eliminada exitosamente!');
      } catch (err) {
        alert('Error al eliminar la sede: ' + err.message);
      }
    }
  };

  const filteredCampuses = campuses.filter(campus =>
    campus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campus.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Vista Grid de Sedes - Estilo Mockup
  const SedesGridView = () => (
    <div className="sedes-main-view">
      {/* Header Mockup */}
      <header className="mockup-header">
        <div className="mockup-header-content">
          <div className="mockup-logo-section">
            <div className="mockup-logo">
              <img src="/logoU.png" alt="Logo Universidad" />
            </div>
          </div>
          <nav>
            <div className="mockup-nav-menu">
              <a href="#" className="mockup-nav-item">Home</a>
              <a href="#" className="mockup-nav-item">Aulas</a>
              <a href="#" className="mockup-nav-item">Usuarios</a>
              <a href="#" className="mockup-nav-item">Automatización</a>
              <a href="#" className="mockup-nav-item active">Sedes</a>
            </div>
          </nav>
        <div className="user-section">
            <div className="user-icon"></div>
                <div className="user-info">
                    <div className="user-name">Santiago</div>
                    <div className="user-role">Administrador</div>
                </div>
        </div>
        </div>
      </header>

      {/* Título de la Sección */}
      <div className="section-title-header">
        <div className="section-title-container">
          <h1 className="section-title">
            Gestión Sedes
          </h1>
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
                  {/* Status Badge */}
                  <div className={`sede-card-status ${campus.active ? 'sede-status-active' : 'sede-status-inactive'}`}>
                    {campus.active ? 'Activa' : 'Inactiva'}
                  </div>
                  
                  <h3 className="sede-card-title">{campus.name}</h3>
                  
                  <div className="sede-card-address">
                    {campus.address}
                  </div>
                  
                  <div className="sede-card-phone">
                    {campus.telephone || 'No especificado'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Vista de Detalle (tu vista actual)
  const SedeDetailView = () => (
    <div>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">
              <img src="/logoU.png" alt="Logo Universidad" />
            </div>
          </div>
          <nav>
            <div className="nav-menu">
              <a href="#" className="nav-item">Home</a>
              <a href="#" className="nav-item">Aulas</a>
              <a href="#" className="nav-item">Usuarios</a>
              <a href="#" className="nav-item">Automatización</a>
              <a href="#" className="nav-item active">Sedes</a>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Content Area */}
        <div className="content-area">
          {/* View Toggle */}
          <div style={{padding: '1rem 2rem', borderBottom: '1px solid #e2e8f0'}}>
            <div className="view-toggle">
            </div>
          </div>

          {selectedCampus && (
            <>
              {/* Content Header */}
              <div className="content-header">
                <div className="content-title">
                  <button className="back-button" onClick={() => setViewMode('grid')}>
                    ←
                  </button>
                  {isEditing ? 'Editar sede' : 'Visualizar sede'}
                </div>
                <div className="action-buttons">
                  {!isEditing ? (
                    <>
                      <button className="btn-edit" onClick={handleEdit}>
                        ✏️ Editar
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(selectedCampus)}>
                        🗑️ Eliminar
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn-primary" onClick={handleSave}>
                        Guardar
                      </button>
                      <button className="btn-secondary" onClick={() => setIsEditing(false)}>
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Content Subtitle */}
              <div className="content-subtitle">
                {selectedCampus.name}
              </div>

              {/* Content Body */}
              <div className="content-body">
                <div className="campus-grid">
                  <div className="campus-field">
                    <label className="field-label">Código</label>
                    <div className="field-value">{selectedCampus.id}</div>
                  </div>

                  <div className="campus-field">
                    <label className="field-label">Cerrado</label>
                    <div className="field-value">{selectedCampus.active ? 'No' : 'Sí'}</div>
                  </div>

                  <div className="campus-field">
                    <label className="field-label">Sede - Jornada</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="field-input"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      />
                    ) : (
                      <div className="field-value">{selectedCampus.name}</div>
                    )}
                  </div>

                  <div className="campus-field">
                    <label className="field-label">Programa</label>
                    <div className="field-value">Gestión de Sedes Universitarias</div>
                  </div>

                  <div className="campus-field">
                    <label className="field-label">Dirección</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="field-input"
                        value={editForm.address}
                        onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                      />
                    ) : (
                      <div className="field-value">{selectedCampus.address}</div>
                    )}
                  </div>

                  <div className="campus-field">
                    <label className="field-label">Cupo (Max)</label>
                    <div className="field-value">50</div>
                  </div>

                  <div className="campus-field">
                    <label className="field-label">Docente</label>
                    <div className="field-value">Administrador de Sede</div>
                  </div>

                  <div className="campus-field">
                    <label className="field-label">Pensum</label>
                    <div className="field-value">SEDES</div>
                  </div>

                  <div className="campus-field">
                    <label className="field-label">Período</label>
                    <div className="field-value">2025-1</div>
                  </div>
                </div>

                {/* Schedule Section */}
                <div className="schedule-section">
                  <div className="schedule-grid">
                    <div className="campus-field">
                      <label className="field-label">Fecha Inicio</label>
                      <div className="field-value">15/01/2025</div>
                    </div>

                    <div className="campus-field">
                      <label className="field-label">Horario</label>
                      <div className="schedule-list">
                        Teléfono: {selectedCampus.telephone || 'No especificado'}
                        Ciudad: {selectedCampus.city}
                        Estado: {selectedCampus.active ? 'Activa' : 'Inactiva'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-title">Buscar Sedes</div>
            <input
              type="text"
              placeholder="Buscar..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sidebar-body">
            <div className="campus-list">
              {filteredCampuses.map((campus) => (
                <div
                  key={campus.id}
                  className={`campus-item ${selectedCampus?.id === campus.id ? 'active' : ''}`}
                  onClick={() => handleCampusSelect(campus)}
                >
                  <div className="campus-item-name">{campus.name}</div>
                  <div className="campus-item-code">{campus.city}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizado principal
  return (
    <div>
      {viewMode === 'grid' ? <SedesGridView /> : <SedeDetailView />}
    </div>
  );
};

export default CampusTest;