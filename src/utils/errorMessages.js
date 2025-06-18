// src/utils/errorMessages.js
export const errorMessages = {
  campus: {
    // Errores de validación del nombre
    nameRequired: 'El nombre de la sede es obligatorio',
    nameMinLength: 'El nombre debe tener al menos 3 caracteres',
    nameMaxLength: 'El nombre no puede exceder 100 caracteres',
    nameInvalid: 'El nombre solo puede contener letras, números, espacios, puntos y guiones',
    nameDuplicate: 'Ya existe una sede con este nombre',
    
    // Errores de validación de dirección
    addressRequired: 'La dirección es obligatoria',
    addressMinLength: 'La dirección debe ser más específica (mínimo 10 caracteres)',
    addressMaxLength: 'La dirección es demasiado larga (máximo 200 caracteres)',
    addressInvalid: 'La dirección contiene caracteres no válidos (&%$#@!). Use solo letras, números, espacios, puntos, comas y guiones',
    
    // Errores de validación de ciudad
    cityRequired: 'La ciudad es obligatoria',
    cityMinLength: 'El nombre de la ciudad debe tener al menos 2 caracteres',
    cityMaxLength: 'El nombre de la ciudad no puede exceder 50 caracteres',
    cityInvalid: 'El nombre de la ciudad solo puede contener letras, espacios, puntos y guiones',
    
    // Errores de validación de contacto
    phoneInvalid: 'El teléfono debe tener exactamente 10 dígitos',
    emailInvalid: 'El formato del email no es válido',
    
    // Mensajes de estado
    notFound: 'La sede que busca no existe',
    createSuccess: '¡Sede creada exitosamente!',
    updateSuccess: '¡Sede actualizada exitosamente!',
    deleteSuccess: '¡Sede eliminada exitosamente!',
    enableSuccess: '¡Sede habilitada exitosamente!',
    disableSuccess: '¡Sede deshabilitada exitosamente!',
    
    // Errores de operación
    createError: 'Error al crear la sede',
    updateError: 'Error al actualizar la sede',
    deleteError: 'Error al eliminar la sede',
    loadError: 'Error al cargar las sedes',
    connectionError: 'Error de conexión con el servidor'
  }
};