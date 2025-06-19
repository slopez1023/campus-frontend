class CampusFacade {
  constructor(apiService, validationService, eventService) {
    this.api = apiService;
    this.validator = validationService;
    this.events = eventService;
  }

  // Crear sede con validación completa y notificaciones
  async createCampus(campusData, existingCampuses = []) {
    try {
      // 1. Validar datos
      const validation = this.validator.validate('create', campusData, { existingCampuses });
      
      if (!validation.isValid) {
        this.events.emit(CampusEventService.EVENTS.VALIDATION_ERROR, {
          errors: validation.errors,
          operation: 'create'
        });
        throw new ValidationError('Datos inválidos', validation.errors);
      }

      // 2. Limpiar y preparar datos
      const cleanData = this.prepareDataForAPI(campusData);

      // 3. Llamar API
      const response = await this.api.post('/campuses', cleanData);
      
      if (!response.ok) {
        throw new Error('Error del servidor al crear la sede');
      }

      const newCampus = await response.json();

      // 4. Notificar éxito
      this.events.emit(CampusEventService.EVENTS.CAMPUS_CREATED, {
        campus: newCampus,
        message: '¡Sede creada exitosamente!'
      });

      return newCampus;

    } catch (error) {
      // Manejar diferentes tipos de errores
      if (error instanceof ValidationError) {
        throw error; // Re-throw validation errors
      }

      // Errores de red o servidor
      this.events.emit(CampusEventService.EVENTS.NETWORK_ERROR, {
        error: error.message,
        operation: 'create'
      });

      throw new Error('Error al crear la sede: ' + error.message);
    }
  }

  // Actualizar sede con validación y notificaciones
  async updateCampus(campusId, campusData, existingCampuses = []) {
    try {
      // 1. Obtener datos actuales para comparación
      const currentCampus = await this.getCampus(campusId);
      
      // 2. Validar datos de actualización
      const validation = this.validator.validate('edit', campusData, { 
        existingCampuses, 
        currentCampusId: campusId 
      });

      if (!validation.isValid) {
        this.events.emit(CampusEventService.EVENTS.VALIDATION_ERROR, {
          errors: validation.errors,
          operation: 'update'
        });
        throw new ValidationError('Datos inválidos', validation.errors);
      }

      // 3. Preparar datos para API
      const cleanData = this.prepareDataForAPI(campusData);

      // 4. Actualizar en servidor
      const response = await this.api.put(`/campuses/${campusId}`, cleanData);
      
      if (!response.ok) {
        throw new Error('Error del servidor al actualizar la sede');
      }

      const updatedCampus = await response.json();

      // 5. Notificar actualización
      this.events.emit(CampusEventService.EVENTS.CAMPUS_UPDATED, {
        campus: updatedCampus,
        previousData: currentCampus,
        message: '¡Sede actualizada exitosamente!'
      });

      return updatedCampus;

    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }

      this.events.emit(CampusEventService.EVENTS.NETWORK_ERROR, {
        error: error.message,
        operation: 'update'
      });

      throw new Error('Error al actualizar la sede: ' + error.message);
    }
  }

  // Cambiar estado de sede
  async toggleCampusStatus(campus) {
    try {
      const updatedData = { ...campus, active: !campus.active };
      const updatedCampus = await this.updateCampus(campus.id, updatedData);

      // Notificación específica para cambio de estado
      this.events.emit(CampusEventService.EVENTS.CAMPUS_STATUS_CHANGED, {
        campus: updatedCampus,
        previousStatus: campus.active,
        newStatus: updatedCampus.active,
        message: updatedCampus.active ? 
          '¡Sede habilitada exitosamente!' : 
          '¡Sede deshabilitada exitosamente!'
      });

      return updatedCampus;

    } catch (error) {
      throw new Error('Error al cambiar estado de la sede: ' + error.message);
    }
  }

  // Obtener todas las sedes
  async getAllCampuses() {
    try {
      const response = await this.api.get('/campuses');
      
      if (!response.ok) {
        throw new Error('Error al cargar las sedes');
      }

      return await response.json();

    } catch (error) {
      this.events.emit(CampusEventService.EVENTS.NETWORK_ERROR, {
        error: error.message,
        operation: 'fetch'
      });

      throw new Error('Error al cargar las sedes: ' + error.message);
    }
  }

  // Obtener sede específica
  async getCampus(campusId) {
    try {
      const response = await this.api.get(`/campuses/${campusId}`);
      
      if (!response.ok) {
        throw new Error('Sede no encontrada');
      }

      return await response.json();

    } catch (error) {
      throw new Error('Error al obtener la sede: ' + error.message);
    }
  }

  // Preparar datos para API (limpiar y formatear)
  prepareDataForAPI(data) {
    return {
      name: data.name?.trim(),
      address: data.address?.trim(),
      city: data.city?.trim(),
      telephone: data.telephone?.replace(/\D/g, '') || null,
      active: data.active !== undefined ? data.active : true
    };
  }
}

// Error personalizado para validaciones
class ValidationError extends Error {
  constructor(message, errors = {}) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}