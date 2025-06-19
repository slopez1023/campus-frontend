// src/components/ConfirmationModal.jsx
import React from 'react';
import PropTypes from 'prop-types';

const ConfirmationModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title, 
  message, 
  confirmText = "Confirmar", 
  cancelText = "Cancelar",
  type = "warning", // warning, danger, info, success
  isLoading = false,
  campus = null // Para mostrar detalles específicos de la sede
}) => {
  if (!isOpen) return null;

  // Configuración por tipo de acción
  const typeConfig = {
    warning: {
      icon: '⚠️',
      iconBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
      confirmBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
      borderColor: '#fbbf24'
    },
    danger: {
      icon: '🗑️',
      iconBg: 'linear-gradient(135deg, #ef4444, #dc2626)',
      confirmBg: 'linear-gradient(135deg, #ef4444, #dc2626)',
      borderColor: '#f87171'
    },
    success: {
      icon: '✅',
      iconBg: 'linear-gradient(135deg, #10b981, #059669)',
      confirmBg: 'linear-gradient(135deg, #10b981, #059669)',
      borderColor: '#34d399'
    },
    info: {
      icon: 'ℹ️',
      iconBg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      confirmBg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      borderColor: '#60a5fa'
    }
  };

  const config = typeConfig[type] || typeConfig.warning;

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onCancel();
    }
  };

  // Prevenir cierre al hacer clic en el contenido del modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

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
          zIndex: 2000,
          animation: 'overlayFadeIn 0.3s ease-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div 
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2001,
          width: '90%',
          maxWidth: '500px',
          animation: 'modalSlideIn 0.4s ease-out'
        }}
        onClick={handleModalClick}
      >
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: `3px solid ${config.borderColor}`
        }}>
          {/* Header con ícono */}
          <div style={{
            background: config.iconBg,
            padding: '2rem',
            textAlign: 'center',
            position: 'relative'
          }}>
            {/* Efecto de brillo sutil */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)'
            }} />
            
            <div style={{
              fontSize: '4rem',
              marginBottom: '1rem',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              animation: 'iconPulse 2s ease-in-out infinite'
            }}>
              {config.icon}
            </div>
            
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              margin: '0',
              color: 'white',
              textShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }}>
              {title}
            </h2>
          </div>

          {/* Contenido */}
          <div style={{ padding: '2rem' }}>
            {/* Mensaje principal */}
            <div style={{
              fontSize: '1.125rem',
              color: '#374151',
              lineHeight: '1.6',
              marginBottom: campus ? '1.5rem' : '2rem',
              textAlign: 'center'
            }}>
              {message}
            </div>

            {/* Información de la sede si está disponible */}
            {campus && (
              <div style={{
                background: '#f8fafc',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: campus.active ? 
                      'linear-gradient(135deg, #10b981, #059669)' : 
                      'linear-gradient(135deg, #ef4444, #dc2626)'
                  }} />
                  <span style={{
                    fontWeight: '600',
                    color: '#1f2937',
                    fontSize: '1.125rem'
                  }}>
                    {campus.name}
                  </span>
                </div>
                
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  📍 {campus.address}
                </div>
                
                {campus.telephone && (
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280'
                  }}>
                    📞 {campus.telephone}
                  </div>
                )}
                
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: campus.active ? '#dcfce7' : '#fee2e2',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: campus.active ? '#166534' : '#991b1b',
                  textAlign: 'center'
                }}>
                  Estado actual: {campus.active ? 'ACTIVA' : 'INACTIVA'}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              {/* Botón Cancelar */}
              <button
                onClick={handleCancel}
                disabled={isLoading}
                style={{
                  background: 'white',
                  color: '#374151',
                  border: '2px solid #e5e7eb',
                  padding: '0.875rem 2rem',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '120px',
                  fontFamily: 'inherit',
                  opacity: isLoading ? 0.6 : 1
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.target.style.background = '#f9fafb';
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    e.target.style.background = 'white';
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {cancelText}
              </button>

              {/* Botón Confirmar */}
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                style={{
                  background: config.confirmBg,
                  color: 'white',
                  border: 'none',
                  padding: '0.875rem 2rem',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  minWidth: '120px',
                  boxShadow: `0 4px 15px ${config.borderColor}40`,
                  fontFamily: 'inherit',
                  opacity: isLoading ? 0.8 : 1
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = `0 6px 20px ${config.borderColor}60`;
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = `0 4px 15px ${config.borderColor}40`;
                  }
                }}
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
                    }} />
                    Procesando...
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
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

        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 480px) {
          .modal-buttons {
            flex-direction: column;
          }
          
          .modal-button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(['warning', 'danger', 'info', 'success']),
  isLoading: PropTypes.bool,
  campus: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    address: PropTypes.string,
    telephone: PropTypes.string,
    active: PropTypes.bool
  })
};

export default ConfirmationModal;