// src/strategies/ValidationStrategies.js - VERSIÓN CORREGIDA

// Estrategia base
class ValidationStrategy {
  validate(data, context = {}) {
    throw new Error('El método validate debe ser implementado');
  }
}

// Estrategia para crear sedes
class CreateCampusStrategy extends ValidationStrategy {
  validate(data, { existingCampuses = [] } = {}) {
    const errors = {};

    // Validaciones específicas para creación
    if (!data.name?.trim()) {
      errors.name = 'El nombre es obligatorio para crear una sede';
    } else if (data.name.trim().length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres';
    } else {
      // Verificar duplicados
      const isDuplicate = existingCampuses.some(campus => 
        campus.name.toLowerCase() === data.name.trim().toLowerCase()
      );
      if (isDuplicate) {
        errors.name = 'Ya existe una sede con este nombre';
      }
    }

    if (!data.address?.trim()) {
      errors.address = 'La dirección es obligatoria';
    } else if (data.address.trim().length < 10) {
      errors.address = 'La dirección debe ser más específica (mínimo 10 caracteres)';
    }

    if (!data.city?.trim()) {
      errors.city = 'La ciudad es obligatoria';
    }

    // Validaciones opcionales más estrictas para creación
    if (data.telephone && !this.isValidPhone(data.telephone)) {
      errors.telephone = 'El formato del teléfono no es válido (debe tener 10 dígitos)';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  isValidPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10;
  }
}

// Estrategia para editar sedes
class EditCampusStrategy extends ValidationStrategy {
  validate(data, { existingCampuses = [], currentCampusId = null } = {}) {
    const errors = {};

    // Validaciones más flexibles para edición
    if (!data.name?.trim()) {
      errors.name = 'El nombre no puede estar vacío';
    } else if (data.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    } else {
      // Verificar duplicados excluyendo la sede actual
      const isDuplicate = existingCampuses.some(campus => 
        campus.name.toLowerCase() === data.name.trim().toLowerCase() &&
        campus.id !== currentCampusId
      );
      if (isDuplicate) {
        errors.name = 'Ya existe otra sede con este nombre';
      }
    }

    if (!data.address?.trim()) {
      errors.address = 'La dirección no puede estar vacía';
    } else if (data.address.trim().length < 5) {
      errors.address = 'La dirección debe tener al menos 5 caracteres';
    }

    if (!data.city?.trim()) {
      errors.city = 'La ciudad no puede estar vacía';
    }

    // Validaciones más permisivas para edición
    if (data.telephone?.trim() && !this.isValidPhone(data.telephone)) {
      errors.telephone = 'El formato del teléfono no es válido';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  isValidPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 7 && cleaned.length <= 10; // Más flexible para edición
  }
}

// Servicio de validación que maneja las estrategias
class ValidationService {
  constructor() {
    this.strategies = {
      create: new CreateCampusStrategy(),
      edit: new EditCampusStrategy()
    };
  }

  validate(mode, data, context = {}) {
    const strategy = this.strategies[mode];
    if (!strategy) {
      throw new Error(`Estrategia de validación no encontrada: ${mode}`);
    }
    
    return strategy.validate(data, context);
  }

  addStrategy(mode, strategy) {
    this.strategies[mode] = strategy;
  }
}

export { ValidationStrategy, CreateCampusStrategy, EditCampusStrategy, ValidationService };