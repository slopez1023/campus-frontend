import React, { useState, useCallback } from 'react';

const SedeDetailView = ({ 
  selectedCampus, 
  onBack, 
  onSave, 
  onToggleStatus,
  searchTerm,
  onSearchChange,
  filteredCampuses,
  onCampusSelect,
  UnifiedHeader 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const handleEdit = useCallback(() => {
    if (!selectedCampus) return;
    
    setEditForm({
      name: selectedCampus.name || '',
      address: selectedCampus.address || '',
      city: selectedCampus.city || '',
      telephone: selectedCampus.telephone || '',
      capacity: selectedCampus.capacity || '',
      email: selectedCampus.email || '',
      inauguratedDate: selectedCampus.inauguratedDate || '',
      active: selectedCampus.active !== undefined ? selectedCampus.active : true
    });
    setIsEditing(true);
  }, [selectedCampus]);

  const handleSave = useCallback(async () => {
    try {
      await onSave(selectedCampus.id, editForm);
      setIsEditing(false);
      setEditForm({});
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  }, [selectedCampus, editForm, onSave]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditForm({});
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const formatPhone = useCallback((value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 6) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
    } else if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    }
    return cleaned;
  }, []);

  const handlePhoneChange = useCallback((e) => {
    const formatted = formatPhone(e.target.value);
    handleInputChange('telephone', formatted);
  }, [handleInputChange, formatPhone]);

  if (!selectedCampus) {
    return null;
  }

  return (
    <div>
      <UnifiedHeader />

      <div className="main-layout">
        <div className="content-area">
          <div className="content-header">
            <div className="content-title">
              <button className="back-button" onClick={onBack}>
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
                  <button 
                    className={selectedCampus.active ? "btn-delete" : "btn-enable"}
                    onClick={() => onToggleStatus(selectedCampus)}
                  >
                    {selectedCampus.active ? '🗑️ Inhabilitar' : '✅ Habilitar'}
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-primary" onClick={handleSave}>
                    Guardar
                  </button>
                  <button className="btn-secondary" onClick={handleCancel}>
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="content-subtitle">{selectedCampus.name}</div>

          <div className="content-body">
            <div className="campus-grid">
              {/* ID de la Sede */}
              <div className="campus-field">
                <label className="field-label">ID de la Sede</label>
                <div className="field-value">{selectedCampus.id}</div>
              </div>

              {/* Estado */}
              <div className="campus-field">
                <label className="field-label">Estado</label>
                <div className="field-value">
                  <span className={`status-badge ${selectedCampus.active ? 'status-active' : 'status-inactive'}`}>
                    {selectedCampus.active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </div>

              {/* Nombre de la sede */}
              <div className="campus-field">
                <label className="field-label">Nombre de la Sede *</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="field-input"
                    value={editForm.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ej: Sede Principal Armenia"
                  />
                ) : (
                  <div className="field-value">{selectedCampus.name}</div>
                )}
              </div>

              {/* Ciudad */}
              <div className="campus-field">
                <label className="field-label">Ciudad *</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="field-input"
                    value={editForm.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Ej: Armenia"
                  />
                ) : (
                  <div className="field-value">{selectedCampus.city}</div>
                )}
              </div>

              {/* Dirección completa */}
              <div className="campus-field" style={{ gridColumn: '1 / -1' }}>
                <label className="field-label">Dirección Completa *</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="field-input"
                    value={editForm.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Ej: Cra. 13 N° 15 Norte- 46 Ed. Anova"
                  />
                ) : (
                  <div className="field-value">{selectedCampus.address}</div>
                )}
              </div>

              {/* Teléfono */}
              <div className="campus-field">
                <label className="field-label">Teléfono de Contacto</label>
                {isEditing ? (
                  <input
                    type="tel"
                    className="field-input"
                    value={editForm.telephone || ''}
                    onChange={handlePhoneChange}
                    placeholder="310 804 9716"
                    maxLength={13}
                  />
                ) : (
                  <div className="field-value">{selectedCampus.telephone || 'No especificado'}</div>
                )}
              </div>

{/* Capacidad */}
<div className="campus-field">
  <label className="field-label">Cantidad de aulas</label>
  {isEditing ? (
    <input
      type="number"
      className="field-input"
      value={editForm.capacity || ''}
      onChange={(e) => handleInputChange('capacity', e.target.value)}
      placeholder="50"
      min="1"
    />
  ) : (
    <div className="field-value">{selectedCampus.capacity || 'No especificado'} aulas</div>
  )}
</div>


{/* Email */}
<div className="campus-field">
  <label className="field-label">Email de Contacto</label>
  {isEditing ? (
    <input
      type="email"
      className="field-input"
      value={editForm.email || ''}
      onChange={(e) => handleInputChange('email', e.target.value)}
      placeholder="sede@universidad.edu.co"
    />
  ) : (
    <div className="field-value">{selectedCampus.email || 'No especificado'}</div>
  )}
</div>


{/* Fecha de inauguración */}
<div className="campus-field">
  <label className="field-label">Fecha de Inauguración</label>
  {isEditing ? (
    <input
      type="date"
      className="field-input"
      value={editForm.inauguratedDate || ''}
      onChange={(e) => handleInputChange('inauguratedDate', e.target.value)}
    />
  ) : (
    <div className="field-value">
      {selectedCampus.inauguratedDate 
        ? new Date(selectedCampus.inauguratedDate).toLocaleDateString('es-CO')
        : 'No especificada'
      }
    </div>
  )}
</div>

              {/* Estado activo/inactivo solo en edición */}
              {isEditing && (
                <div className="campus-field">
                  <label className="field-label">Estado de la Sede</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: '8px'
                    }}>
                      <input
                        type="checkbox"
                        checked={editForm.active}
                        onChange={(e) => handleInputChange('active', e.target.checked)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>
                        Sede Activa
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Información adicional */}
            <div className="schedule-section">
              <div className="schedule-grid">
                <div className="campus-field">
                  <label className="field-label">Fecha de Registro</label>
                  <div className="field-value">
                    {selectedCampus.createdAt 
                      ? new Date(selectedCampus.createdAt).toLocaleDateString('es-CO')
                      : '15/01/2025'
                    }
                  </div>
                </div>

                <div className="campus-field">
                  <label className="field-label">Última Actualización</label>
                  <div className="schedule-list">
                    {selectedCampus.updatedAt 
                      ? new Date(selectedCampus.updatedAt).toLocaleString('es-CO')
                      : 'Primera vez'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-title">Buscar Sedes</div>
            <input
              type="text"
              placeholder="Buscar..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="sidebar-body">
            <div className="campus-list">
              {filteredCampuses.map((campus) => (
                <div
                  key={campus.id}
                  className={`campus-item ${selectedCampus?.id === campus.id ? 'active' : ''}`}
                  onClick={() => onCampusSelect(campus)}
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
};

export default SedeDetailView;