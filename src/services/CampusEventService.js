class CampusEventService {
  constructor() {
    this.listeners = new Map();
  }

  // Suscribirse a eventos
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event).push(callback);
    
    // Retornar función de cleanup
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

  // Emitir eventos
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error en listener para evento ${event}:`, error);
        }
      });
    }
  }

  // Eventos disponibles
  static EVENTS = {
    CAMPUS_CREATED: 'campus:created',
    CAMPUS_UPDATED: 'campus:updated',
    CAMPUS_DELETED: 'campus:deleted',
    CAMPUS_STATUS_CHANGED: 'campus:status_changed',
    VALIDATION_ERROR: 'campus:validation_error',
    NETWORK_ERROR: 'campus:network_error'
  };
}
