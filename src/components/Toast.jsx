import React, { useState, useEffect } from 'react';

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 4000, 
  onClose,
  isVisible 
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
    }, 300); // Esperar animación de salida
  };

  const getToastStyles = () => {
    const baseStyles = {
      info: 'bg-blue-500 border-blue-600',
      success: 'bg-green-500 border-green-600', 
      error: 'bg-red-500 border-red-600',
      warning: 'bg-yellow-500 border-yellow-600'
    };
    return baseStyles[type] || baseStyles.info;
  };

  const getIcon = () => {
    const icons = {
      info: '💙',
      success: '✅',
      error: '❌', 
      warning: '⚠️'
    };
    return icons[type] || icons.info;
  };

  if (!isVisible) return null;

  return (
    <div className={`toast-notification ${show ? 'toast-show' : 'toast-hide'}`}>
      <div className={`toast-container ${getToastStyles()}`}>
        {/* Icono */}
        <div className="toast-icon">
          {getIcon()}
        </div>
        
        {/* Contenido */}
        <div className="toast-content">
          <p className="toast-message">{message}</p>
        </div>
        
        {/* Botón cerrar */}
        <button 
          className="toast-close-btn"
          onClick={handleClose}
          aria-label="Cerrar notificación"
        >
          ✕
        </button>
        
        {/* Barra de progreso */}
        <div className="toast-progress-bar">
          <div 
            className="toast-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Toast;