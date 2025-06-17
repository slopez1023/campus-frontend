import React, { useState } from 'react';

const CreateCampusModal = ({ isOpen, onClose, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    telephone: '',
    active: true
  });
  
  const [errors, setErrors] = useState({});

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        address: '',
        city: '',
        telephone: '',
        active: true
      });
      setErrors({});
    }
  }, [isOpen]);

  // Validaciones
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la sede es requerido';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'La dirección debe ser más específica';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }

    if (formData.telephone && !/^\d{10}$/.test(formData.telephone.replace(/\D/g, ''))) {
      newErrors.telephone = 'El teléfono debe tener 10 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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

    if (errors.telephone) {
      setErrors(prev => ({
        ...prev,
        telephone: ''
      }));
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Limpiar datos antes de enviar
      const cleanData = {
        ...formData,
        name: formData.name.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        telephone: formData.telephone.replace(/\D/g, '') // Solo números para API
      };

      await onSubmit(cleanData);
    } catch (error) {
      console.error('Error en formulario:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      telephone: '',
      active: true
    });
    setErrors({});
    onClose();
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
        maxWidth: '600px',
        maxHeight: '90vh',
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
              disabled={isLoading}
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
                <label style={{
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.875rem'
                }}>
                  Nombre de la Sede *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    padding: '0.875rem 1rem',
                    border: `2px solid ${errors.name ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    background: errors.name ? '#fef2f2' : 'white',
                    color: '#1f2937'
                  }}
                  placeholder="Ej: Sede Principal Armenia"
                  disabled={isLoading}
                  autoFocus
                />
                {errors.name && (
                  <span style={{
                    color: '#ef4444',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    ⚠️ {errors.name}
                  </span>
                )}
              </div>

              {/* Ciudad */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.875rem'
                }}>
                  Ciudad *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  style={{
                    padding: '0.875rem 1rem',
                    border: `2px solid ${errors.city ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    background: errors.city ? '#fef2f2' : 'white',
                    color: '#1f2937'
                  }}
                  placeholder="Ej: Armenia"
                  disabled={isLoading}
                />
                {errors.city && (
                  <span style={{
                    color: '#ef4444',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
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
                <label style={{
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.875rem'
                }}>
                  Dirección Completa *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  style={{
                    padding: '0.875rem 1rem',
                    border: `2px solid ${errors.address ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    background: errors.address ? '#fef2f2' : 'white',
                    color: '#1f2937'
                  }}
                  placeholder="Ej: Cra. 13 N° 15 Norte- 46 Ed. Anova"
                  disabled={isLoading}
                />
                {errors.address && (
                  <span style={{
                    color: '#ef4444',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    ⚠️ {errors.address}
                  </span>
                )}
              </div>

              {/* Teléfono */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.875rem'
                }}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handlePhoneChange}
                  style={{
                    padding: '0.875rem 1rem',
                    border: `2px solid ${errors.telephone ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    background: errors.telephone ? '#fef2f2' : 'white',
                    color: '#1f2937'
                  }}
                  placeholder="310 804 9716"
                  maxLength={13}
                  disabled={isLoading}
                />
                {errors.telephone && (
                  <span style={{
                    color: '#ef4444',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    ⚠️ {errors.telephone}
                  </span>
                )}
              </div>

              {/* Estado */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.875rem'
                }}>
                  Estado
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '0.5rem'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '8px'
                  }}>
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer'
                      }}
                      disabled={isLoading}
                    />
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#374151',
                      fontWeight: '500'
                    }}>
                      Sede Activa
                    </span>
                  </label>
                </div>
              </div>
            </div>

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
                style={{
                  background: 'white',
                  color: '#374151',
                  border: '2px solid #e5e7eb',
                  padding: '0.875rem 1.5rem',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '120px'
                }}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  padding: '0.875rem 1.5rem',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  minWidth: '120px',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
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
    </>
  );
};

export default CreateCampusModal;