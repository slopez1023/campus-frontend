// src/hooks/useToast.js - VERSIÓN MEJORADA
import { useState, useCallback } from 'react';

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000, options = {}) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      message,
      type,
      duration,
      isVisible: true,
      ...options // ← NUEVO: Permite pasar título, campus, etc.
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove después de la duración + tiempo de animación
    setTimeout(() => {
      removeToast(id);
    }, duration + 500);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Funciones básicas existentes
  const showSuccess = useCallback((message, duration = 4000, options = {}) => 
    addToast(message, 'success', duration, options), [addToast]);
  
  const showError = useCallback((message, duration = 4000, options = {}) => 
    addToast(message, 'error', duration, options), [addToast]);
  
  const showWarning = useCallback((message, duration = 4000, options = {}) => 
    addToast(message, 'warning', duration, options), [addToast]);
  
  const showInfo = useCallback((message, duration = 4000, options = {}) => 
    addToast(message, 'info', duration, options), [addToast]);

  // ← NUEVA FUNCIÓN: Toast específico para sede creada
  const showCampusCreated = useCallback((campus, customMessage = null) => {
    const message = customMessage || `La sede "${campus.name}" ha sido creada exitosamente y está lista para usar.`;
    
    return addToast(message, 'campus_created', 6000, {
      title: '¡Nueva Sede Creada!',
      campus: campus
    });
  }, [addToast]);

  // ← NUEVA FUNCIÓN: Toast específico para sede actualizada
  const showCampusUpdated = useCallback((campus, customMessage = null) => {
    const message = customMessage || `Los cambios en "${campus.name}" han sido guardados correctamente.`;
    
    return addToast(message, 'success', 5000, {
      title: '¡Sede Actualizada!',
      campus: campus
    });
  }, [addToast]);

  // ← NUEVA FUNCIÓN: Toast específico para cambio de estado
  const showCampusStatusChanged = useCallback((campus, wasEnabled) => {
    const action = wasEnabled ? 'habilitada' : 'inhabilitada';
    const message = `La sede "${campus.name}" ha sido ${action} exitosamente.`;
    
    return addToast(message, 'success', 5000, {
      title: `¡Sede ${wasEnabled ? 'Habilitada' : 'Inhabilitada'}!`,
      campus: campus
    });
  }, [addToast]);

  // ← NUEVA FUNCIÓN: Toast con información detallada
  const showDetailedSuccess = useCallback((title, message, details = null) => {
    return addToast(message, 'success', 5000, {
      title: title,
      campus: details
    });
  }, [addToast]);

  // ← NUEVA FUNCIÓN: Toast con información detallada de error
  const showDetailedError = useCallback((title, message, details = null) => {
    return addToast(message, 'error', 6000, {
      title: title,
      campus: details
    });
  }, [addToast]);

  return {
    toasts,
    
    // Funciones básicas
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    
    // ← NUEVAS FUNCIONES: Específicas para sedes
    showCampusCreated,
    showCampusUpdated,
    showCampusStatusChanged,
    showDetailedSuccess,
    showDetailedError,
    
    // Función genérica avanzada
    addToast
  };
};

export default useToast;