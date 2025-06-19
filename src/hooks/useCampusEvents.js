// src/hooks/useCampusEvents.js - VERSIÓN CORREGIDA
import { useContext, useCallback } from 'react';
import { CampusEventContext, CampusEventService } from '../contexts/CampusEventContext';

export const useCampusEvents = () => {
  const eventService = useContext(CampusEventContext);
  
  if (!eventService) {
    throw new Error('useCampusEvents debe usarse dentro de CampusEventProvider');
  }

  const subscribe = useCallback((event, callback) => {
    return eventService.subscribe(event, callback);
  }, [eventService]);

  const emit = useCallback((event, data) => {
    eventService.emit(event, data);
  }, [eventService]);

  return { 
    subscribe, 
    emit, 
    EVENTS: CampusEventService.EVENTS 
  };
};