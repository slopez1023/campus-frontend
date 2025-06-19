// src/components/Toast.jsx - VERSIÓN MEJORADA
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose,
  isVisible,
  campus = null, // ← NUEVO: Información de la sede para mensajes personalizados
  title = null // ← NUEVO: Título personalizado
}) => {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      setProgress(100);
      
      // Iniciar barra de progreso
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            clearInterval(progressInterval);
            return 0;
          }
          return prev - (100 / (duration / 100));
        });
      }, 100);

      // Auto-cerrar después del duration
      const timer = setTimeout(() => {
        handleClose();
        clearInterval(progressInterval);
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Configuración mejorada por tipo
  const getToastConfig = () => {
    const configs = {
      info: {
        icon: '💙',
        bgGradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        borderColor: '#3b82f6',
        shadowColor: 'rgba(59, 130, 246, 0.3)'
      },
      success: {
        icon: '🎉',
        bgGradient: 'linear-gradient(135deg, #10b981, #059669)',
        borderColor: '#10b981',
        shadowColor: 'rgba(16, 185, 129, 0.3)'
      },
      error: {
        icon: '❌',
        bgGradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
        borderColor: '#ef4444',
        shadowColor: 'rgba(239, 68, 68, 0.3)'
      },
      warning: {
        icon: '⚠️',
        bgGradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
        borderColor: '#f59e0b',
        shadowColor: 'rgba(245, 158, 11, 0.3)'
      },
      // ← NUEVO: Tipo especial para creación de sede
      campus_created: {
        icon: '🏢',
        bgGradient: 'linear-gradient(135deg, #10b981, #059669)',
        borderColor: '#10b981',
        shadowColor: 'rgba(16, 185, 129, 0.4)'
      }
    };
    return configs[type] || configs.info;
  };

  const config = getToastConfig();

  if (!isVisible) return null;

  // Renderizado especial para creación de sede
  const renderCampusCreatedContent = () => (
    <div className="toast-campus-content">
      <div className="toast-campus-header">
        <div className="toast-campus-icon">
          <span style={{ fontSize: '1.5rem' }}>🏢</span>
        </div>
        <div className="toast-campus-text">
          <div className="toast-campus-title">
            {title || '¡Sede Creada Exitosamente!'}
          </div>
          <div className="toast-campus-subtitle">
            {campus ? `"${campus.name}" está ahora disponible` : message}
          </div>
        </div>
      </div>
      
      {campus && (
        <div className="toast-campus-details">
          <div className="toast-campus-detail">
            <span className="toast-detail-icon">📍</span>
            <span className="toast-detail-text">{campus.address}</span>
          </div>
          {campus.telephone && (
            <div className="toast-campus-detail">
              <span className="toast-detail-icon">📞</span>
              <span className="toast-detail-text">{campus.telephone}</span>
            </div>
          )}
          <div className="toast-campus-status">
            <span className="toast-status-indicator"></span>
            <span className="toast-status-text">Estado: Activa</span>
          </div>
        </div>
      )}
    </div>
  );

  // Renderizado normal para otros tipos
  const renderNormalContent = () => (
    <div className="toast-content">
      <div className="toast-icon">
        {config.icon}
      </div>
      <div className="toast-message-container">
        {title && (
          <div className="toast-title">{title}</div>
        )}
        <div className="toast-message">{message}</div>
      </div>
    </div>
  );

  return (
    <div className={`toast-notification ${show ? 'toast-show' : 'toast-hide'}`}>
      <div 
        className="toast-container"
        style={{
          background: 'white',
          borderLeft: `4px solid ${config.borderColor}`,
          boxShadow: `0 10px 25px ${config.shadowColor}, 0 4px 12px rgba(0, 0, 0, 0.1)`
        }}
      >
        {type === 'campus_created' ? renderCampusCreatedContent() : renderNormalContent()}
        
        {/* Botón cerrar */}
        <button 
          className="toast-close-btn"
          onClick={handleClose}
          aria-label="Cerrar notificación"
        >
          ✕
        </button>
        
        {/* Barra de progreso mejorada */}
        <div className="toast-progress-bar">
          <div 
            className="toast-progress-fill"
            style={{ 
              width: `${progress}%`,
              background: config.bgGradient
            }}
          />
        </div>

        {/* Efecto de brillo */}
        <div 
          className="toast-shine-effect"
          style={{
            background: `linear-gradient(90deg, transparent, ${config.borderColor}20, transparent)`
          }}
        />
      </div>

      {/* Estilos CSS embebidos mejorados */}
      <style jsx>{`
        .toast-notification {
          pointer-events: auto;
          transform-origin: top right;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          min-width: 380px;
          max-width: 450px;
        }

        .toast-show {
          opacity: 1;
          transform: translateX(0) scale(1);
          animation: toastSlideIn 0.6s ease-out;
        }

        .toast-hide {
          opacity: 0;
          transform: translateX(100%) scale(0.9);
          animation: toastSlideOut 0.3s ease-in;
        }

        .toast-container {
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: toastBounce 0.6s ease-out;
        }

        .toast-container:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 35px ${config.shadowColor}, 0 6px 16px rgba(0, 0, 0, 0.12) !important;
        }

        /* ESTILOS PARA TOAST DE SEDE CREADA */
        .toast-campus-content {
          padding: 1.25rem;
        }

        .toast-campus-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .toast-campus-icon {
          background: ${config.bgGradient};
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px ${config.shadowColor};
        }

        .toast-campus-text {
          flex: 1;
          min-width: 0;
        }

        .toast-campus-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
          line-height: 1.3;
        }

        .toast-campus-subtitle {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }

        .toast-campus-details {
          background: #f8fafc;
          border-radius: 8px;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
        }

        .toast-campus-detail {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .toast-campus-detail:last-of-type {
          margin-bottom: 0;
        }

        .toast-detail-icon {
          font-size: 0.875rem;
          width: 16px;
          text-align: center;
        }

        .toast-detail-text {
          font-size: 0.8125rem;
          color: #475569;
          font-weight: 500;
        }

        .toast-campus-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e2e8f0;
        }

        .toast-status-indicator {
          width: 8px;
          height: 8px;
          background: ${config.bgGradient};
          border-radius: 50%;
          animation: statusPulse 2s ease-in-out infinite;
        }

        .toast-status-text {
          font-size: 0.8125rem;
          color: #059669;
          font-weight: 600;
        }

        /* ESTILOS PARA TOAST NORMAL */
        .toast-content {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
        }

        .toast-icon {
          font-size: 1.25rem;
          line-height: 1;
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .toast-message-container {
          flex: 1;
          min-width: 0;
        }

        .toast-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
          line-height: 1.3;
        }

        .toast-message {
          color: #374151;
          font-size: 0.875rem;
          font-weight: 500;
          line-height: 1.4;
          margin: 0;
          word-break: break-word;
        }

        /* ELEMENTOS COMUNES */
        .toast-close-btn {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: rgba(0, 0, 0, 0.05);
          border: none;
          color: #64748b;
          cursor: pointer;
          font-size: 0.875rem;
          line-height: 1;
          padding: 0.375rem;
          border-radius: 6px;
          transition: all 0.2s ease;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toast-close-btn:hover {
          background: rgba(0, 0, 0, 0.1);
          color: #374151;
          transform: scale(1.1);
        }

        .toast-progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .toast-progress-fill {
          height: 100%;
          transition: width 0.1s linear;
          border-radius: 0 2px 2px 0;
        }

        .toast-shine-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          animation: shine 3s ease-in-out infinite;
          pointer-events: none;
        }

        /* ANIMACIONES */
        @keyframes toastSlideIn {
          0% {
            opacity: 0;
            transform: translateX(100%) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes toastSlideOut {
          0% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(100%) scale(0.9);
          }
        }

        @keyframes toastBounce {
          0% {
            transform: scale(0.9);
          }
          50% {
            transform: scale(1.02);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes statusPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        /* RESPONSIVE */
        @media (max-width: 480px) {
          .toast-notification {
            min-width: auto;
            max-width: calc(100vw - 2rem);
          }
          
          .toast-campus-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['info', 'success', 'error', 'warning', 'campus_created']),
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  campus: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    address: PropTypes.string,
    telephone: PropTypes.string,
    active: PropTypes.bool
  }),
  title: PropTypes.string
};

export default Toast;