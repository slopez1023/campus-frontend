// src/components/CampusTest.jsx - VERSIÓN COMPLETA FINAL
import React, { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import Toast from './Toast';
import useToast from '../hooks/useToast';
import useConfirmation from '../hooks/useConfirmation';
import ConfirmationModal from './ConfimationModal';
import CampusAssignment from './CampusAssignment';
import CreateCampusModal from './CreateCampusModal';
import SedeDetailView from './SedeDetailView';

// ============================================================================
// 1. OBSERVER PATTERN
// ============================================================================
class CampusEventService {
  constructor() {
    this.listeners = new Map();
  }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  emit(event, data) {
    console.log(`📡 Emitiendo evento: ${event}`, data);
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`❌ Error en listener para evento ${event}:`, error);
        }
      });
    }
  }

  static EVENTS = {
    CAMPUS_CREATED: 'campus:created',
    CAMPUS_UPDATED: 'campus:updated',
    CAMPUS_STATUS_CHANGED: 'campus:status_changed',
    VALIDATION_ERROR: 'campus:validation_error',
    NETWORK_ERROR: 'campus:network_error'
  };
}

const CampusEventContext = createContext(null);

const CampusEventProvider = ({ children }) => {
  const eventService = useMemo(() => new CampusEventService(), []);
  return (
    <CampusEventContext.Provider value={eventService}>
      {children}
    </CampusEventContext.Provider>
  );
};

const useCampusEvents = () => {
  const eventService = useContext(CampusEventContext);
  if (!eventService) {
    throw new Error('useCampusEvents debe usarse dentro de CampusEventProvider');
  }

  const subscribe = useCallback((event, callback) => {
    return eventService.subscribe(event, callback);
  }, [eventService]);

  const emit = useCallback((event, data) => {
    eventService.emit(event, data);
  }, [eventService]);

  return { subscribe, emit, EVENTS: CampusEventService.EVENTS };
};

// ============================================================================
// 2. STRATEGY PATTERN
// ============================================================================
class ValidationStrategy {
  validate(data, context = {}) {
    throw new Error('El método validate debe ser implementado');
  }
}

class CreateCampusStrategy extends ValidationStrategy {
  validate(data, { existingCampuses = [] } = {}) {
    const errors = {};

    if (!data.name?.trim()) {
      errors.name = 'El nombre es obligatorio para crear una sede';
    } else if (data.name.trim().length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres';
    } else {
      const isDuplicate = existingCampuses.some(campus => 
        campus.name.toLowerCase() === data.name.trim().toLowerCase()
      );
      if (isDuplicate) {
        errors.name = 'Ya existe una sede con este nombre';
      }
    }

    if (!data.address?.trim()) {
      errors.address = 'La dirección es obligatoria';
    } else if (data.address.trim().length < 10) {
      errors.address = 'La dirección debe ser más específica (mínimo 10 caracteres)';
    }

    if (!data.city?.trim()) {
      errors.city = 'La ciudad es obligatoria';
    }

    if (data.telephone && !this.isValidPhone(data.telephone)) {
      errors.telephone = 'El formato del teléfono no es válido (debe tener 10 dígitos)';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  isValidPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10;
  }
}

class EditCampusStrategy extends ValidationStrategy {
  validate(data, { existingCampuses = [], currentCampusId = null } = {}) {
    const errors = {};

    if (!data.name?.trim()) {
      errors.name = 'El nombre no puede estar vacío';
    } else if (data.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    } else {
      const isDuplicate = existingCampuses.some(campus => 
        campus.name.toLowerCase() === data.name.trim().toLowerCase() &&
        campus.id !== currentCampusId
      );
      if (isDuplicate) {
        errors.name = 'Ya existe otra sede con este nombre';
      }
    }

    if (!data.address?.trim()) {
      errors.address = 'La dirección no puede estar vacía';
    } else if (data.address.trim().length < 5) {
      errors.address = 'La dirección debe tener al menos 5 caracteres';
    }

    if (!data.city?.trim()) {
      errors.city = 'La ciudad no puede estar vacía';
    }

    if (data.telephone && data.telephone.trim() && !this.isValidPhone(data.telephone)) {
      errors.telephone = 'El formato del teléfono no es válido';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  isValidPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 7 && cleaned.length <= 10;
  }
}

class ValidationService {
  constructor() {
    this.strategies = {
      create: new CreateCampusStrategy(),
      edit: new EditCampusStrategy()
    };
  }

  validate(mode, data, context = {}) {
    const strategy = this.strategies[mode];
    if (!strategy) {
      throw new Error(`Estrategia de validación no encontrada: ${mode}`);
    }
    return strategy.validate(data, context);
  }
}

// ============================================================================
// 3. FACADE PATTERN
// ============================================================================
class ValidationError extends Error {
  constructor(message, errors = {}) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

class CampusFacade {
  constructor(validationService, eventService) {
    this.validator = validationService;
    this.events = eventService;
    this.baseURL = 'http://localhost:8080/api';
  }

  async apiCall(url, options = {}) {
    const response = await fetch(`${this.baseURL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error en la comunicación con el servidor');
    }

    return response.json();
  }

  prepareDataForAPI(data) {
    return {
      name: data.name?.trim(),
      address: data.address?.trim(),
      city: data.city?.trim(),
      telephone: data.telephone?.replace(/\D/g, '') || null,
      active: data.active !== undefined ? data.active : true
    };
  }

  async createCampus(campusData, existingCampuses = []) {
    console.log('🏗️ Facade: Iniciando creación de sede', campusData);
    
    try {
      const validation = this.validator.validate('create', campusData, { existingCampuses });
      
      if (!validation.isValid) {
        console.log('❌ Facade: Validación fallida', validation.errors);
        this.events.emit(CampusEventService.EVENTS.VALIDATION_ERROR, {
          errors: validation.errors,
          operation: 'create'
        });
        throw new ValidationError('Datos inválidos', validation.errors);
      }

      const cleanData = this.prepareDataForAPI(campusData);
      console.log('📤 Facade: Enviando datos limpios', cleanData);

      const newCampus = await this.apiCall('/campuses', {
        method: 'POST',
        body: JSON.stringify(cleanData)
      });

      console.log('✅ Facade: Sede creada exitosamente', newCampus);

      setTimeout(() => {
        console.log('📡 Facade: Emitiendo evento CAMPUS_CREATED');
        this.events.emit(CampusEventService.EVENTS.CAMPUS_CREATED, {
          campus: newCampus,
          message: '¡Sede creada exitosamente!'
        });
      }, 50);

      return newCampus;

    } catch (error) {
      console.error('❌ Facade: Error en creación', error);
      
      if (error instanceof ValidationError) {
        throw error;
      }

      if (error.message.includes('duplicate') || error.message.includes('duplicado')) {
        this.events.emit(CampusEventService.EVENTS.VALIDATION_ERROR, {
          errors: { name: 'Ya existe una sede con este nombre' },
          operation: 'create'
        });
        throw new ValidationError('Sede duplicada', { name: 'Ya existe una sede con este nombre' });
      }

      this.events.emit(CampusEventService.EVENTS.NETWORK_ERROR, {
        error: error.message,
        operation: 'create'
      });

      throw new Error('Error al crear la sede: ' + error.message);
    }
  }

  async updateCampus(campusId, campusData, existingCampuses = []) {
    console.log('🔄 Facade: Actualizando sede', campusId);
    
    try {
      const validation = this.validator.validate('edit', campusData, { 
        existingCampuses, 
        currentCampusId: campusId 
      });

      if (!validation.isValid) {
        this.events.emit(CampusEventService.EVENTS.VALIDATION_ERROR, {
          errors: validation.errors,
          operation: 'update'
        });
        throw new ValidationError('Datos inválidos', validation.errors);
      }

      const cleanData = this.prepareDataForAPI(campusData);
      const updatedCampus = await this.apiCall(`/campuses/${campusId}`, {
        method: 'PUT',
        body: JSON.stringify(cleanData)
      });

      console.log('✅ Facade: Sede actualizada', updatedCampus);

      setTimeout(() => {
        this.events.emit(CampusEventService.EVENTS.CAMPUS_UPDATED, {
          campus: updatedCampus,
          message: '¡Sede actualizada exitosamente!'
        });
      }, 50);

      return updatedCampus;

    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }

      this.events.emit(CampusEventService.EVENTS.NETWORK_ERROR, {
        error: error.message,
        operation: 'update'
      });

      throw new Error('Error al actualizar la sede: ' + error.message);
    }
  }

  async toggleCampusStatus(campus) {
    console.log('🔄 Facade: Cambiando estado de sede', campus.name);
    
    try {
      const updatedData = { ...campus, active: !campus.active };
      const updatedCampus = await this.updateCampus(campus.id, updatedData, []);

      setTimeout(() => {
        this.events.emit(CampusEventService.EVENTS.CAMPUS_STATUS_CHANGED, {
          campus: updatedCampus,
          previousStatus: campus.active,
          newStatus: updatedCampus.active,
          message: updatedCampus.active ? 
            '¡Sede habilitada exitosamente!' : 
            '¡Sede deshabilitada exitosamente!'
        });
      }, 50);

      return updatedCampus;

    } catch (error) {
      throw new Error('Error al cambiar estado de la sede: ' + error.message);
    }
  }

  async getAllCampuses() {
    try {
      return await this.apiCall('/campuses');
    } catch (error) {
      this.events.emit(CampusEventService.EVENTS.NETWORK_ERROR, {
        error: error.message,
        operation: 'fetch'
      });
      throw new Error('Error al cargar las sedes: ' + error.message);
    }
  }
}

const useCampusFacade = () => {
  const { emit } = useCampusEvents();
  
  const facade = useMemo(() => {
    const validationService = new ValidationService();
    const eventService = { emit };
    return new CampusFacade(validationService, eventService);
  }, [emit]);

  return facade;
};

// ============================================================================
// 4. COMPONENTE PRINCIPAL
// ============================================================================
const CampusTestWithPatterns = () => {
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
  
  const { 
    toasts, 
    showSuccess, 
    showError, 
    removeToast,
    showCampusCreated,
    showCampusUpdated,
    showCampusStatusChanged,
    showDetailedError,
    addToast
  } = useToast();
  
const { subscribe, EVENTS } = useCampusEvents();
  const facade = useCampusFacade();
  
  const {
    confirmationState,
    handleConfirm,
    handleCancel,
    confirmDelete,
    confirmEnable
  } = useConfirmation();

  useEffect(() => {
    console.log('🎧 Configurando listeners de eventos');
    
    const unsubscribers = [
      subscribe(EVENTS.CAMPUS_CREATED, ({ campus, message }) => {
        console.log('🎉 Listener: CAMPUS_CREATED recibido', campus);
        
        setCampuses(prev => [...prev, campus]);
        setShowCreateModal(false);
        
        setTimeout(() => {
          console.log('🍞 Ejecutando showCampusCreated');
          if (showCampusCreated) {
            showCampusCreated(campus, "¡Tu nueva sede está lista y operativa!");
          } else {
            addToast(
              `¡Sede "${campus.name}" creada exitosamente!`, 
              'campus_created', 
              6000, 
              {
                title: '🏢 ¡Nueva Sede Creada!',
                campus: campus
              }
            );
          }
        }, 100);
      }),

      subscribe(EVENTS.CAMPUS_UPDATED, ({ campus, message }) => {
        console.log('🎉 Listener: CAMPUS_UPDATED recibido', campus);
        setCampuses(prev => prev.map(c => c.id === campus.id ? campus : c));
        setSelectedCampus(campus);
        
        if (showCampusUpdated) {
          showCampusUpdated(campus, "Todos los cambios han sido aplicados correctamente.");
        } else {
          showSuccess(`¡Sede "${campus.name}" actualizada exitosamente!`);
        }
      }),

      subscribe(EVENTS.CAMPUS_STATUS_CHANGED, ({ campus, message, previousStatus }) => {
        console.log('🎉 Listener: CAMPUS_STATUS_CHANGED recibido', campus);
        setCampuses(prev => prev.map(c => c.id === campus.id ? campus : c));
        if (selectedCampus?.id === campus.id) {
          setSelectedCampus(campus);
        }
        
        if (showCampusStatusChanged) {
          showCampusStatusChanged(campus, campus.active);
        } else {
          const statusText = campus.active ? 'habilitada' : 'inhabilitada';
          showSuccess(`¡Sede "${campus.name}" ${statusText} exitosamente!`);
        }
      }),

      subscribe(EVENTS.VALIDATION_ERROR, ({ errors, operation }) => {
        console.log('❌ Listener: VALIDATION_ERROR recibido', errors);
        const errorMessage = Object.values(errors)[0] || 'Error de validación';
        
        if (showDetailedError) {
          showDetailedError(
            'Error de Validación',
            errorMessage,
            operation === 'create' ? { name: 'Nueva Sede' } : selectedCampus
          );
        } else {
          showError(errorMessage);
        }
      }),

      subscribe(EVENTS.NETWORK_ERROR, ({ error, operation }) => {
        console.log('❌ Listener: NETWORK_ERROR recibido', error);
        
        if (showDetailedError) {
          showDetailedError(
            'Error de Conexión',
            `No se pudo ${operation === 'create' ? 'crear' : operation === 'update' ? 'actualizar' : 'cargar'} la sede. Verifica tu conexión.`,
            null
          );
        } else {
          showError(error);
        }
      })
    ];

    return () => {
      console.log('🔌 Desconectando listeners');
      unsubscribers.forEach(unsub => unsub());
    };
  }, [
    subscribe, 
    EVENTS, 
    showCampusCreated, 
    showCampusUpdated, 
    showCampusStatusChanged, 
    showDetailedError, 
    showSuccess,
    showError,
    addToast,
    selectedCampus
  ]);

  const loadCampuses = useCallback(async () => {
    console.log('📥 Cargando sedes...');
    setLoading(true);
    setError(null);
    try {
      const data = await facade.getAllCampuses();
      setCampuses(data);
      console.log('✅ Sedes cargadas:', data);
    } catch (err) {
      setError(err.message);
      console.error('❌ Error cargando sedes:', err);
    } finally {
      setLoading(false);
    }
  }, [facade]);

  useEffect(() => {
    loadCampuses();
  }, [loadCampuses]);

  const handleCreateCampus = useCallback(async (formData) => {
    console.log('🚀 Componente: Iniciando creación de sede', formData);
    setCreateLoading(true);
    
    try {
      const newCampus = await facade.createCampus(formData, campuses);
      console.log('✅ Componente: Sede creada a través del Facade', newCampus);
      
    } catch (error) {
      console.error('❌ Componente: Error en creación', error);
      
      if (!(error instanceof ValidationError)) {
        throw error;
      }
    } finally {
      setCreateLoading(false);
    }
  }, [facade, campuses]);

  const handleSave = useCallback(async (campusId, formData) => {
    try {
      return await facade.updateCampus(campusId, formData, campuses);
    } catch (error) {
      if (!(error instanceof ValidationError)) {
        throw error;
      }
    }
  }, [facade, campuses]);

  const handleToggleStatus = useCallback(async (campus) => {
    try {
      const confirmed = await (campus.active ? confirmDelete(campus) : confirmEnable(campus));
      
      if (confirmed) {
        await facade.toggleCampusStatus(campus);
      }
    } catch (error) {
      console.error('❌ Error al cambiar estado:', error);
    }
  }, [facade, confirmDelete, confirmEnable]);

  const handleCampusSelect = useCallback((campus) => {
    setSelectedCampus(campus);
    setViewMode('detail');
  }, []);

  const filteredCampuses = campuses.filter(campus => {
    const matchesSearch = campus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campus.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = showInactive ? !campus.active : campus.active;
    
    return matchesSearch && matchesStatus;
  });

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
                background: showInactive ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg,rgb(158, 164, 176),rgb(111, 120, 134))',
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
              <div className="sedes-grid-empty-title">
                {searchTerm ? 'No se encontraron sedes' : 'No hay sedes disponibles'}
              </div>
              <div className="sedes-grid-empty-subtitle">
                {searchTerm 
                  ? `No se encontraron sedes que coincidan con "${searchTerm}"`
                  : 'Comience creando una nueva sede'
                }
              </div>
              {searchTerm && (
                <button
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '1rem'
                  }}
                  onClick={() => setSearchTerm('')}
                >
                  Limpiar búsqueda
                </button>
              )}
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
            campusList={campuses}
          />
        )
      ) : (
        <CampusAssignment />
      )}
      
      {/* Modal de confirmación personalizado */}
      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title={confirmationState.title}
        message={confirmationState.message}
        confirmText={confirmationState.confirmText}
        cancelText={confirmationState.cancelText}
        type={confirmationState.type}
        campus={confirmationState.campus}
        isLoading={confirmationState.isLoading}
      />
      
      {/* Modal de creación */}
      <CreateCampusModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCampus}
        isLoading={createLoading}
        campusList={campuses}
      />
      
      {/* SISTEMA DE TOASTS CENTRADOS EN LA PANTALLA */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '90vw',
        width: '500px'
      }}>
        {toasts.map((toast) => {
          console.log('🍞 Renderizando toast centrado:', toast);
          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: 'auto',
                animation: toast.isVisible ? 'toastSlideInCenter 0.6s ease-out' : 'toastSlideOutCenter 0.3s ease-in'
              }}
            >
              <Toast
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                isVisible={toast.isVisible}
                onClose={() => removeToast(toast.id)}
                title={toast.title}
                campus={toast.campus}
              />
            </div>
          );
        })}
      </div>
      
      {/* BOTÓN DE DEBUG PARA TESTING */}
      <button
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          background: '#ff6b6b',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          zIndex: 9999,
          fontSize: '12px'
        }}
        onClick={() => {
          console.log('🧪 TEST: Probando toast centrado');
          if (showCampusCreated) {
            showCampusCreated(
              { 
                name: 'Sede de Prueba', 
                address: 'Calle Falsa 123', 
                telephone: '123456789',
                active: true 
              }, 
              "¡Esta es una prueba del toast centrado!"
            );
          } else {
            addToast('Toast de prueba centrado', 'success', 3000);
          }
        }}
      >
        🧪 TEST Toast
      </button>

      {/* ESTILOS CSS GLOBALES */}
      <style jsx global>{`
        @keyframes toastSlideInCenter {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes toastSlideOutCenter {
          0% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          100% {
            opacity: 0;
            transform: scale(0.8) translateY(-30px);
          }
        }

        .toast-center-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9999;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 90vw;
          width: 500px;
        }

        .toast-center-container .toast-notification {
          pointer-events: auto;
          animation: toastSlideInCenter 0.6s ease-out;
        }

        .toast-center-container .toast-notification.toast-hide {
          animation: toastSlideOutCenter 0.3s ease-in;
        }

        .toast-center-container .toast-container {
          backdrop-filter: blur(12px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3) !important;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
          .toast-center-container {
            width: 95vw !important;
            max-width: none !important;
            padding: 0 1rem;
          }

          .toast-center-container .toast-container {
            font-size: 0.875rem;
          }

          .toast-center-container .toast-campus-title {
            font-size: 1rem !important;
          }
        }

        @media (max-width: 480px) {
          .toast-center-container {
            width: 98vw !important;
            padding: 0 0.5rem;
          }

          .toast-center-container .toast-campus-header {
            flex-direction: column !important;
            text-align: center !important;
            gap: 0.75rem !important;
          }

          .toast-center-container .toast-campus-icon {
            align-self: center !important;
          }
        }

        .toast-center-container .toast-notification {
          filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
        }

        .toast-center-container .toast-notification:hover {
          transform: scale(1.02);
          transition: transform 0.2s ease;
        }

        .toast-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.1);
          z-index: 9998;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .toast-overlay.visible {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// 5. WRAPPER CON PROVIDER
// ============================================================================
const CampusTest = () => (
  <CampusEventProvider>
    <CampusTestWithPatterns />
  </CampusEventProvider>
);

export default CampusTest;