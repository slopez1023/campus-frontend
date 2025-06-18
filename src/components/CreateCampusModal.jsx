// src/components/CreateCampusModal.jsx
import React, { useState, useEffect } from 'react';
import { useCampusValidation } from '../hooks/useCampusValidation';
import { errorMessages } from '../utils/errorMessages';

const CreateCampusModal = ({ isOpen, onClose, onSubmit, isLoading = false, campusList = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    telephone: '',
    active: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  
  // Hook de validación personalizado
  const { 
    errors, 
    validateForm, 
    validateSingleField, 
    clearFieldError, 
    clearAllErrors,
    hasErrors 
  } = useCampusValidation(campusList);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        address: '',
        city: '',
        telephone: '',
        active: true
      });
      clearAllErrors();
      setSubmitAttempted(false);
      setIsSubmitting(false);
    }
  }, [isOpen, clearAllErrors]);

  // Manejar cambios en inputs con validación en tiempo real
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Validar campo individual solo después del primer intento de envío
    if (submitAttempted && name !== 'active') {
      setTimeout(() => {
        validateSingleField(name, newValue);
      }, 300); // Debounce de 300ms
    } else if (errors[name]) {
      // Limpiar error si el usuario empieza a escribir
      clearFieldError(name);
    }
  };

  // Formatear teléfono mientras escribe
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo números
    let formattedValue = value;
    
    if (value.length >= 6) {
      formattedValue = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6, 10)}`;
    } else if (value.length >= 3) {
      formattedValue = `${value.slice(0, 3)} ${value.slice(3)}`;
    }
    
    setFormData(prev => ({
      ...prev,
      telephone: formattedValue
    }));

    // Validar teléfono si ya se intentó enviar
    if (submitAttempted) {
      setTimeout(() => {
        validateSingleField('telephone', formattedValue);
      }, 300);
    } else if (errors.telephone) {
      clearFieldError('telephone');
    }
  };

  // Enviar formulario con validación completa
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    
    // Validar formulario completo
    const isValid = validateForm(formData);
    
    if (!isValid) {
      console.log('Formulario inválido:', errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Limpiar y preparar datos antes de enviar
      const cleanData = {
        ...formData,
        name: formData.name.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        telephone: formData.telephone.replace(/\D/g, '') || null // Solo números para API
      };

      console.log('Enviando datos de sede:', cleanData);
      await onSubmit(cleanData);
      
      // Si llegamos aquí, la creación fue exitosa
      handleClose();
    } catch (error) {
      console.error('Error en formulario:', error);
      
      // Manejar errores específicos del servidor
      if (error.message && error.message.includes('duplicate') || error.message.includes('duplicado')) {
        validateSingleField('name', formData.name); // Esto detectará el duplicado
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; // No cerrar si está guardando
    
    setFormData({
      name: '',
      address: '',
      city: '',
      telephone: '',
      active: true
    });
    clearAllErrors();
    setSubmitAttempted(false);
    setIsSubmitting(false);
    onClose();
  };

  // Obtener clase CSS para input con error
  const getInputClassName = (fieldName) => {
    const baseClass = "create-modal-input";
    return errors[fieldName] ? `${baseClass} create-modal-input-error` : baseClass;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          animation: 'overlayFadeIn 0.3s ease-out'
        }}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1001,
        width: '90%',
        maxWidth: '700px',
        maxHeight: '95vh',
        overflowY: 'auto',
        animation: 'modalSlideIn 0.4s ease-out'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #3730a3 0%, #4c1d95 100%)',
            color: 'white',
            padding: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              margin: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              ➕ Nueva Sede
            </h2>
            <button 
              type="button"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.25rem',
                transition: 'all 0.2s ease'
              }}
              onClick={handleClose}
              disabled={isSubmitting}
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {/* Nombre */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="create-modal-label">
                  Nombre de la Sede *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={getInputClassName('name')}
                  placeholder="Ej: Sede Principal Armenia"
                  disabled={isSubmitting}
                  autoFocus
                  maxLength={100}
                />
                {errors.name && (
                  <span className="create-modal-error">
                    ⚠️ {errors.name}
                  </span>
                )}
              </div>

              {/* Ciudad */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="create-modal-label">
                  Ciudad *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={getInputClassName('city')}
                  placeholder="Ej: Armenia"
                  disabled={isSubmitting}
                  maxLength={50}
                />
                {errors.city && (
                  <span className="create-modal-error">
                    ⚠️ {errors.city}
                  </span>
                )}
              </div>

              {/* Dirección - span completo */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.5rem',
                gridColumn: '1 / -1'
              }}>
                <label className="create-modal-label">
                  Dirección Completa *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={getInputClassName('address')}
                  placeholder="Ej: Cra. 13 N° 15 Norte- 46 Ed. Anova"
                  disabled={isSubmitting}
                  maxLength={200}
                />
                {errors.address && (
                  <span className="create-modal-error">
                    ⚠️ {errors.address}
                  </span>
                )}
              </div>

              {/* Teléfono */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="create-modal-label">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handlePhoneChange}
                  className={getInputClassName('telephone')}
                  placeholder="310 804 9716"
                  maxLength={13}
                  disabled={isSubmitting}
                />
                {errors.telephone && (
                  <span className="create-modal-error">
                    ⚠️ {errors.telephone}
                  </span>
                )}
              </div>

              {/* Estado */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="create-modal-label">
                  Estado
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '0.5rem'
                }}>
                  <label className="create-modal-checkbox-label">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                      className="create-modal-checkbox"
                      disabled={isSubmitting}
                    />
                    <span className="create-modal-checkbox-text">
                      Sede Activa
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Resumen de errores si hay muchos */}
            {hasErrors && submitAttempted && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  color: '#dc2626',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem'
                }}>
                  Por favor, corrija los siguientes errores:
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

            {/* Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem',
              paddingTop: '2rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button
                type="button"
                onClick={handleClose}
                className="create-modal-btn-secondary"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="create-modal-btn-primary"
                disabled={isSubmitting || (submitAttempted && hasErrors)}
              >
                {isSubmitting ? (
                  <>
                    <div className="create-modal-spinner"></div>
                    Creando...
                  </>
                ) : (
                  'Crear Sede'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Estilos CSS embebidos */}
      <style jsx>{`
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes modalSlideIn {
          from { 
            opacity: 0;
            transform: translate(-50%, -60%) scale(0.9);
          }
          to { 
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .create-modal-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        .create-modal-input {
          padding: 0.875rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          background: white;
          color: #1f2937;
          font-family: inherit;
        }

        .create-modal-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .create-modal-input-error {
          border-color: #ef4444;
          background: #fef2f2;
        }

        .create-modal-input-error:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
        }

        .create-modal-error {
          color: #ef4444;
          font-size: 0.75rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.25rem;
        }

        .create-modal-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
        }

        .create-modal-checkbox {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .create-modal-checkbox-text {
          font-size: 0.875rem;
          color: #374151;
          font-weight: 500;
        }

        .create-modal-btn-secondary {
          background: white;
          color: #374151;
          border: 2px solid #e5e7eb;
          padding: 0.875rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 120px;
          font-family: inherit;
        }

        .create-modal-btn-secondary:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .create-modal-btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .create-modal-btn-primary {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 0.875rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 120px;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          font-family: inherit;
        }

        .create-modal-btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        .create-modal-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .create-modal-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default CreateCampusModal;