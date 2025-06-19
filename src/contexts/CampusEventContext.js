// src/contexts/CampusEventContext.js - VERSIÓN CORREGIDA
import React, { createContext, useMemo } from 'react';
import PropTypes from 'prop-types';

class CampusEventService {
  constructor() {
    this.listeners = new Map();
  }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event).push(callback);
    
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

  static EVENTS = {
    CAMPUS_CREATED: 'campus:created',
    CAMPUS_UPDATED: 'campus:updated',
    CAMPUS_DELETED: 'campus:deleted',
    CAMPUS_STATUS_CHANGED: 'campus:status_changed',
    VALIDATION_ERROR: 'campus:validation_error',
    NETWORK_ERROR: 'campus:network_error'
  };
}

export const CampusEventContext = createContext(null);

export const CampusEventProvider = ({ children }) => {
  const eventService = useMemo(() => new CampusEventService(), []);
  
  return (
    <CampusEventContext.Provider value={eventService}>
      {children}
    </CampusEventContext.Provider>
  );
};

// PropTypes para validación
CampusEventProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export { CampusEventService };