import React, { useState, useEffect } from 'react';

const CampusForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  campus = null, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    telephone: '',
    active: true
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Llenar formulario si es edición
  useEffect(() => {
    if (campus) {
      setFormData({
        name: campus.name || '',
        address: campus.address || '',
        city: campus.city || '',
        telephone: campus.telephone || '',
        active: campus.active !== undefined ? campus.active : true
      });
    } else {
      // Reset para crear nueva sede
      setFormData({
        name: '',
        address: '',
        city: '',
        telephone: '',
        active: true
      });
    }
    setErrors({});
  }, [campus, isOpen]);

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

    setIsSubmitting(true);
    
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
      
      // Solo cerrar si fue exitoso (onSubmit no lanzó error)
      onClose();
    } catch (error) {
      // El error ya se maneja en el componente padre con toasts
      console.error('Error en formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="form-overlay" onClick={onClose} />
      
      {/* Modal */}
      <div className="form-modal">
        <div className="form-modal-content">
          {/* Header */}
          <div className="form-header">
            <h2 className="form-title">
              {campus ? '✏️ Editar Sede' : '➕ Nueva Sede'}
            </h2>
            <button 
              type="button"
              className="form-close-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="campus-form">
            <div className="form-grid">
              {/* Nombre */}
              <div className="form-field">
                <label htmlFor="name" className="form-label">
                  Nombre de la Sede *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'form-input-error' : ''}`}
                  placeholder="Ej: Sede Principal Armenia"
                  disabled={isSubmitting}
                  autoFocus
                />
                {errors.name && (
                  <span className="form-error-message">{errors.name}</span>
                )}
              </div>

              {/* Ciudad */}
              <div className="form-field">
                <label htmlFor="city" className="form-label">
                  Ciudad *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`form-input ${errors.city ? 'form-input-error' : ''}`}
                  placeholder="Ej: Armenia"
                  disabled={isSubmitting}
                />
                {errors.city && (
                  <span className="form-error-message">{errors.city}</span>
                )}
              </div>

              {/* Dirección - span completo */}
              <div className="form-field form-field-full">
                <label htmlFor="address" className="form-label">
                  Dirección Completa *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`form-input ${errors.address ? 'form-input-error' : ''}`}
                  placeholder="Ej: Cra. 13 N° 15 Norte- 46 Ed. Anova"
                  disabled={isSubmitting}
                />
                {errors.address && (
                  <span className="form-error-message">{errors.address}</span>
                )}
              </div>

              {/* Teléfono */}
              <div className="form-field">
                <label htmlFor="telephone" className="form-label">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handlePhoneChange}
                  className={`form-input ${errors.telephone ? 'form-input-error' : ''}`}
                  placeholder="310 804 9716"
                  maxLength={13}
                  disabled={isSubmitting}
                />
                {errors.telephone && (
                  <span className="form-error-message">{errors.telephone}</span>
                )}
              </div>

              {/* Estado */}
              <div className="form-field">
                <label className="form-label">Estado</label>
                <div className="form-checkbox-container">
                  <label className="form-checkbox-label">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                      className="form-checkbox"
                      disabled={isSubmitting}
                    />
                    <span className="form-checkbox-text">
                      Sede Activa
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="form-footer">
              <button
                type="button"
                onClick={onClose}
                className="form-btn-secondary"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="form-btn-primary"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? (
                  <>
                    <span className="form-loading-spinner"></span>
                    {campus ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : (
                  campus ? 'Actualizar Sede' : 'Crear Sede'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CampusForm;