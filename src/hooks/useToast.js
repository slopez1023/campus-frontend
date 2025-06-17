import { useState, useCallback } from 'react';

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      message,
      type,
      duration,
      isVisible: true
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

  const showSuccess = useCallback((message, duration) => 
    addToast(message, 'success', duration), [addToast]);
  
  const showError = useCallback((message, duration) => 
    addToast(message, 'error', duration), [addToast]);
  
  const showWarning = useCallback((message, duration) => 
    addToast(message, 'warning', duration), [addToast]);
  
  const showInfo = useCallback((message, duration) => 
    addToast(message, 'info', duration), [addToast]);

  return {
    toasts,
    showSuccess,
    showError, 
    showWarning,
    showInfo,
    removeToast
  };
};

export default useToast;