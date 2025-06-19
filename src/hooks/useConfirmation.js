// src/hooks/useConfirmation.js
import { useState, useCallback } from 'react';

const useConfirmation = () => {
  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'warning',
    campus: null,
    onConfirm: null,
    isLoading: false
  });

  // Función para mostrar el modal de confirmación
  const showConfirmation = useCallback(({
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'warning',
    campus = null
  }) => {
    return new Promise((resolve) => {
      setConfirmationState({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        type,
        campus,
        onConfirm: resolve,
        isLoading: false
      });
    });
  }, []);

  // Función para confirmar la acción
  const handleConfirm = useCallback(() => {
    if (confirmationState.onConfirm) {
      setConfirmationState(prev => ({ ...prev, isLoading: true }));
      
      // Simular un pequeño delay para mejor UX
      setTimeout(() => {
        confirmationState.onConfirm(true);
        setConfirmationState(prev => ({ 
          ...prev, 
          isOpen: false, 
          isLoading: false,
          onConfirm: null 
        }));
      }, 300);
    }
  }, [confirmationState.onConfirm]);

  // Función para cancelar la acción
  const handleCancel = useCallback(() => {
    if (confirmationState.onConfirm && !confirmationState.isLoading) {
      confirmationState.onConfirm(false);
      setConfirmationState(prev => ({ 
        ...prev, 
        isOpen: false,
        onConfirm: null 
      }));
    }
  }, [confirmationState.onConfirm, confirmationState.isLoading]);

  // Función para cerrar el modal
  const closeConfirmation = useCallback(() => {
    if (!confirmationState.isLoading) {
      setConfirmationState(prev => ({ 
        ...prev, 
        isOpen: false,
        onConfirm: null 
      }));
    }
  }, [confirmationState.isLoading]);

  return {
    // Estado del modal
    confirmationState,
    
    // Funciones principales
    showConfirmation,
    handleConfirm,
    handleCancel,
    closeConfirmation,
    
    // Helpers específicos para diferentes tipos de confirmación
    confirmDelete: useCallback((campus) => {
      return showConfirmation({
        title: 'Inhabilitar Sede',
        message: `¿Estás seguro que deseas inhabilitar esta sede? Los usuarios no podrán acceder a ella hasta que sea habilitada nuevamente.`,
        confirmText: 'Sí, Inhabilitar',
        cancelText: 'Cancelar',
        type: 'danger',
        campus
      });
    }, [showConfirmation]),

    confirmEnable: useCallback((campus) => {
      return showConfirmation({
        title: 'Habilitar Sede',
        message: `¿Estás seguro que deseas habilitar esta sede? Los usuarios podrán acceder a ella inmediatamente.`,
        confirmText: 'Sí, Habilitar',
        cancelText: 'Cancelar',
        type: 'success',
        campus
      });
    }, [showConfirmation]),

    confirmSave: useCallback((campus) => {
      return showConfirmation({
        title: 'Guardar Cambios',
        message: `¿Estás seguro que deseas guardar los cambios realizados en esta sede?`,
        confirmText: 'Guardar',
        cancelText: 'Cancelar',
        type: 'info',
        campus
      });
    }, [showConfirmation]),

    confirmPermanentDelete: useCallback((campus) => {
      return showConfirmation({
        title: 'Eliminar Sede Permanentemente',
        message: `⚠️ ESTA ACCIÓN NO SE PUEDE DESHACER. ¿Estás completamente seguro que deseas eliminar permanentemente esta sede?`,
        confirmText: 'Sí, Eliminar Permanentemente',
        cancelText: 'Cancelar',
        type: 'danger',
        campus
      });
    }, [showConfirmation])
  };
};

export default useConfirmation;