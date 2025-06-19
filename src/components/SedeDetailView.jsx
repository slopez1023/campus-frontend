// src/components/SedeDetailView.jsx - VERSIÓN MEJORADA CON BUSCADOR INTEGRADO
import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCampusValidation } from '../hooks/useCampusValidation';

const SedeDetailView = ({ 
  selectedCampus, 
  onBack, 
  onSave, 
  onToggleStatus,
  searchTerm,
  onSearchChange,
  filteredCampuses,
  onCampusSelect,
  UnifiedHeader,
  campusList
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados para el buscador mejorado
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Hook de validación personalizado
  const { 
    errors, 
    validateForm, 
    validateSingleField, 
    clearFieldError, 
    clearAllErrors,
    hasErrors 
  } = useCampusValidation(campusList);

  // Sincronizar searchTerm con localSearchTerm
  useEffect(() => {
    setLocalSearchTerm(searchTerm || '');
  }, [searchTerm]);

  // Verificar si la sede existe
  useEffect(() => {
    if (searchTerm && !selectedCampus && filteredCampuses.length === 0) {
      console.log('Sede no encontrada para:', searchTerm);
    }
  }, [selectedCampus, filteredCampuses, searchTerm]);

  const handleEdit = useCallback(() => {
    if (!selectedCampus) return;
    
    setEditForm({
      name: selectedCampus.name || '',
      address: selectedCampus.address || '',
      city: selectedCampus.city || '',
      telephone: selectedCampus.telephone || '',
      active: selectedCampus.active !== undefined ? selectedCampus.active : true
    });
    setIsEditing(true);
    clearAllErrors();
    setSubmitAttempted(false);
  }, [selectedCampus, clearAllErrors]);

  const handleSave = useCallback(async () => {
    setSubmitAttempted(true);
    
    // Validar formulario completo
    const isValid = validateForm(editForm, selectedCampus?.id);
    
    if (!isValid) {
      console.log('Formulario de edición inválido:', errors);
      return;
    }

    setIsSaving(true);
    
    try {
      await onSave(selectedCampus.id, editForm);
      
      setIsEditing(false);
      setEditForm({});
      clearAllErrors();
      setSubmitAttempted(false);
    } catch (error) {
      console.error('Error al guardar:', error);
      
      // Manejar errores específicos del servidor
      if (error.message?.includes('duplicate') || error.message?.includes('duplicado')) {
        validateSingleField('name', editForm.name, selectedCampus?.id);
      }
    } finally {
      setIsSaving(false);
    }
  }, [selectedCampus, editForm, onSave, validateForm, errors, validateSingleField, clearAllErrors]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditForm({});
    clearAllErrors();
    setSubmitAttempted(false);
  }, [clearAllErrors]);

  const handleInputChange = useCallback((field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Validar campo individual solo después del primer intento de envío
    if (submitAttempted && field !== 'active') {
      setTimeout(() => {
        validateSingleField(field, value, selectedCampus?.id);
      }, 300);
    } else if (errors[field]) {
      clearFieldError(field);
    }
  }, [submitAttempted, validateSingleField, selectedCampus?.id, errors, clearFieldError]);

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

  // NUEVA FUNCIONALIDAD: Manejar búsqueda con botón
  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchPerformed(true);
    
    // Simular delay de búsqueda para mejor UX
    setTimeout(() => {
      onSearchChange(localSearchTerm.trim());
      setIsSearching(false);
    }, 300);
  }, [localSearchTerm, onSearchChange]);

  // Manejar cambio en el input de búsqueda
  const handleSearchInputChange = useCallback((e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    
    // Si el usuario borra todo el texto, limpiar búsqueda
    if (!value.trim()) {
      setSearchPerformed(false);
      onSearchChange('');
    }
  }, [onSearchChange]);

  // Limpiar búsqueda
  const handleClearSearch = useCallback(() => {
    setLocalSearchTerm('');
    setSearchPerformed(false);
    onSearchChange('');
  }, [onSearchChange]);

  // Obtener clase CSS para input con error
  const getInputClassName = useCallback((fieldName) => {
    const baseClass = "field-input";
    return errors[fieldName] ? `${baseClass} field-input-error` : baseClass;
  }, [errors]);

  // Componente para campo de entrada
  const InputField = ({ 
    label, 
    name, 
    value, 
    onChange, 
    placeholder, 
    type = "text", 
    maxLength, 
    disabled = false,
    required = false 
  }) => (
    <div className="campus-field">
      <label htmlFor={name} className="field-label">
        {label} {required && '*'}
      </label>
      {isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input
            id={name}
            type={type}
            className={getInputClassName(name)}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled}
          />
          {errors[name] && (
            <span className="field-error" role="alert">
              ⚠️ {errors[name]}
            </span>
          )}
        </div>
      ) : (
        <div className="field-value">{value || 'No especificado'}</div>
      )}
    </div>
  );

  // Componente mejorado para lista de sedes en sidebar
  const CampusList = ({ campuses, selectedCampusId, onSelect }) => (
    <div className="campus-list">
      {campuses.length === 0 && searchPerformed ? (
        <div className="no-results-message">
          <div className="no-results-icon">🔍</div>
          <div className="no-results-text">
            No se encontraron sedes para "{searchTerm}"
          </div>
          <button
            type="button"
            className="clear-search-btn"
            onClick={handleClearSearch}
          >
            Limpiar búsqueda
          </button>
        </div>
      ) : (
        campuses.map((campus) => (
          <button
            key={campus.id}
            type="button"
            className={`campus-item ${selectedCampusId === campus.id ? 'active' : ''}`}
            onClick={() => onSelect(campus)}
          >
            <div className="campus-item-name">{campus.name}</div>
            <div className="campus-item-code">{campus.city}</div>
          </button>
        ))
      )}
    </div>
  );

  // Vista de sede no encontrada mejorada
  const NotFoundView = () => (
    <div>
      <UnifiedHeader />
      <div className="main-layout">
        <div className="content-area">
          <div className="content-header">
            <div className="content-title">
              <button type="button" className="back-button" onClick={onBack}>
                ←
              </button>
              Resultado de búsqueda
            </div>
          </div>

          <div className="content-body" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ 
              fontSize: '4rem', 
              marginBottom: '1rem',
              opacity: 0.6 
            }}>
              🔍
            </div>
            <h3 style={{ 
              color: '#ef4444', 
              marginBottom: '1rem',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              No se encontraron resultados
            </h3>
            <p style={{ 
              color: '#6b7280', 
              marginBottom: '2rem',
              fontSize: '1rem'
            }}>
              No se encontró ninguna sede que coincida con el término "{searchTerm}"
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleClearSearch}
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                🔄 Nueva búsqueda
              </button>
              <button
                type="button"
                onClick={onBack}
                style={{
                  background: 'white',
                  color: '#374151',
                  border: '2px solid #e5e7eb',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                ← Volver a sedes
              </button>
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-title">Buscar Sedes</div>
            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Buscar sede por nombre..."
                  className="search-input"
                  value={localSearchTerm}
                  onChange={handleSearchInputChange}
                  disabled={isSearching}
                />
                <button 
                  type="submit" 
                  className="search-button"
                  disabled={isSearching || !localSearchTerm.trim()}
                  title="Buscar sede"
                >
                  {isSearching ? '⏳' : '🔍'}
                </button>
                {localSearchTerm && (
                  <button 
                    type="button" 
                    className="clear-button"
                    onClick={handleClearSearch}
                    title="Limpiar búsqueda"
                  >
                    ✕
                  </button>
                )}
              </div>
            </form>
          </div>
          <div className="sidebar-body">
            <CampusList 
              campuses={campusList.slice(0, 10)} 
              selectedCampusId={null}
              onSelect={onCampusSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Si hay búsqueda realizada pero no hay resultados
  if (searchPerformed && searchTerm && !selectedCampus && filteredCampuses.length === 0) {
    return <NotFoundView />;
  }

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
              <button type="button" className="back-button" onClick={onBack}>
                ←
              </button>
              {isEditing ? 'Editar sede' : 'Visualizar sede'}
            </div>
            <div className="action-buttons">
              {!isEditing ? (
                <>
                  <button type="button" className="btn-edit" onClick={handleEdit}>
                    ✏️ Editar
                  </button>
                  <button 
                    type="button"
                    className={selectedCampus.active ? "btn-delete" : "btn-enable"}
                    onClick={() => onToggleStatus(selectedCampus)}
                  >
                    {selectedCampus.active ? '🗑️ Inhabilitar' : '✅ Habilitar'}
                  </button>
                </>
              ) : (
                <>
                  <button 
                    type="button"
                    className="btn-primary" 
                    onClick={handleSave}
                    disabled={isSaving || (submitAttempted && hasErrors)}
                  >
                    {isSaving ? (
                      <>
                        <div className="loading-spinner" style={{ width: '16px', height: '16px', marginRight: '0.5rem' }}></div>
                        Guardando...
                      </>
                    ) : (
                      'Guardar'
                    )}
                  </button>
                  <button 
                    type="button"
                    className="btn-secondary" 
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="content-subtitle">{selectedCampus.name}</div>

          {/* Mostrar resumen de errores si hay muchos y se está editando */}
          {isEditing && hasErrors && submitAttempted && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '1rem',
              margin: '1rem 2rem',
              borderLeft: '4px solid #ef4444'
            }}>
              <div style={{
                color: '#dc2626',
                fontWeight: '600',
                fontSize: '0.875rem',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                ⚠️ Por favor, corrija los siguientes errores:
              </div>
              <ul style={{
                margin: '0',
                paddingLeft: '1.5rem',
                color: '#b91c1c',
                fontSize: '0.875rem'
              }}>
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

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

              {/* Campos editables usando el componente InputField */}
              <InputField
                label="Nombre de la Sede"
                name="name"
                value={editForm.name || selectedCampus.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: Sede Principal Armenia"
                maxLength={100}
                disabled={isSaving}
                required
              />

              <InputField
                label="Ciudad"
                name="city"
                value={editForm.city || selectedCampus.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Ej: Armenia"
                maxLength={50}
                disabled={isSaving}
                required
              />

              {/* Dirección completa */}
              <div className="campus-field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="address" className="field-label">Dirección Completa *</label>
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input
                      id="address"
                      type="text"
                      className={getInputClassName('address')}
                      value={editForm.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Ej: Cra. 13 N° 15 Norte- 46 Ed. Anova"
                      maxLength={200}
                      disabled={isSaving}
                    />
                    {errors.address && (
                      <span className="field-error" role="alert">
                        ⚠️ {errors.address}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="field-value">{selectedCampus.address}</div>
                )}
              </div>

              {/* Teléfono */}
              <div className="campus-field">
                <label htmlFor="telephone" className="field-label">Teléfono de Contacto</label>
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input
                      id="telephone"
                      type="tel"
                      className={getInputClassName('telephone')}
                      value={editForm.telephone || ''}
                      onChange={handlePhoneChange}
                      placeholder="310 804 9716"
                      maxLength={13}
                      disabled={isSaving}
                    />
                    {errors.telephone && (
                      <span className="field-error" role="alert">
                        ⚠️ {errors.telephone}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="field-value">{selectedCampus.telephone || 'No especificado'}</div>
                )}
              </div>

              {/* Estado activo/inactivo solo en edición */}
              {isEditing && (
                <div className="campus-field">
                  <label className="field-label">Estado de la Sede</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <label htmlFor="active-checkbox" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: '8px'
                    }}>
                      <input
                        id="active-checkbox"
                        type="checkbox"
                        checked={editForm.active}
                        onChange={(e) => handleInputChange('active', e.target.checked)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        disabled={isSaving}
                      />
                      <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>
                        Sede Activa
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-title">Buscar Sedes</div>
            {/* BUSCADOR MEJORADO CON BOTÓN */}
            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Buscar sede por nombre..."
                  className="search-input"
                  value={localSearchTerm}
                  onChange={handleSearchInputChange}
                  disabled={isSearching}
                />
                <button 
                  type="submit" 
                  className="search-button"
                  disabled={isSearching || !localSearchTerm.trim()}
                  title="Buscar sede"
                >
                  {isSearching ? '⏳' : '🔍'}
                </button>
                {localSearchTerm && (
                  <button 
                    type="button" 
                    className="clear-button"
                    onClick={handleClearSearch}
                    title="Limpiar búsqueda"
                  >
                    ✕
                  </button>
                )}
              </div>
            </form>
          </div>
          <div className="sidebar-body">
            <CampusList 
              campuses={filteredCampuses} 
              selectedCampusId={selectedCampus?.id}
              onSelect={onCampusSelect}
            />
          </div>
        </div>
      </div>

      {/* ESTILOS CSS EMBEBIDOS MEJORADOS */}
      <style jsx>{`
        .field-input-error {
          border-color: #ef4444 !important;
          background: #fef2f2 !important;
        }

        .field-input-error:focus {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }

        .field-error {
          color: #ef4444;
          font-size: 0.75rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.25rem;
        }

        .loading-spinner {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .campus-item {
          all: unset;
          display: block;
          width: 100%;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          cursor: pointer;
          transition: background-color 0.2s;
          text-align: left;
        }

        .campus-item:hover {
          background-color: #f8fafc;
        }

        .campus-item.active {
          background-color: #eff6ff;
          border-left: 4px solid #3b82f6;
          padding-left: calc(1.5rem - 4px);
        }

        /* NUEVOS ESTILOS PARA EL BUSCADOR MEJORADO */
        .search-form {
          margin-top: 1rem;
        }

        .search-input-container {
          position: relative;
          display: flex;
          align-items: center;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          background: white;
        }

        .search-input-container:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: none;
          outline: none;
          font-size: 0.875rem;
          background: transparent;
          color: #1f2937;
        }

        .search-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .search-button {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border: none;
          color: white;
          padding: 0.75rem 1rem;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 44px;
          height: 100%;
        }

        .search-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #1d4ed8, #1e40af);
          transform: scale(1.05);
        }

        .search-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .clear-button {
          background: #f3f4f6;
          border: none;
          color: #6b7280;
          padding: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 32px;
          height: 32px;
          border-radius: 6px;
          margin-right: 0.25rem;
        }

        .clear-button:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .no-results-message {
          padding: 2rem 1rem;
          text-align: center;
          color: #6b7280;
        }

        .no-results-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
          opacity: 0.6;
        }

        .no-results-text {
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          line-height: 1.4;
        }

        .clear-search-btn {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-search-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .search-input-container {
            flex-direction: column;
          }
          
          .search-button {
            width: 100%;
            margin-top: 0.5rem;
          }
          
          .clear-button {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

// PropTypes para validación de props
SedeDetailView.propTypes = {
  selectedCampus: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    telephone: PropTypes.string,
    active: PropTypes.bool.isRequired
  }),
  onBack: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  filteredCampuses: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCampusSelect: PropTypes.func.isRequired,
  UnifiedHeader: PropTypes.elementType.isRequired,
  campusList: PropTypes.arrayOf(PropTypes.object)
};

SedeDetailView.defaultProps = {
  selectedCampus: null,
  campusList: []
};

export default SedeDetailView;