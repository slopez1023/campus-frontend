
export const validationUtils = {
  // Validar formato de dirección (sin caracteres especiales problemáticos)
  isValidAddress: (address) => {
    if (!address || !address.trim()) return false;
    
    // Permitir letras, números, espacios, puntos, comas, guiones, y algunos caracteres específicos
    const validAddressRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s\.\,\-\#°]+$/;
    
    // Caracteres problemáticos que no se permiten
    const problematicChars = /[&%$@!~`^*+={}[\]|\\:;"'<>?]/;
    
    if (problematicChars.test(address)) {
      return false;
    }
    
    return validAddressRegex.test(address.trim());
  },

  // Validar nombre de sede
  isValidCampusName: (name) => {
    if (!name || !name.trim()) return false;
    
    const trimmedName = name.trim();
    
    // Mínimo 3 caracteres, máximo 100
    if (trimmedName.length < 3 || trimmedName.length > 100) return false;
    
    // Solo letras, números, espacios y algunos caracteres básicos
    const validNameRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s\.\-]+$/;
    return validNameRegex.test(trimmedName);
  },

  // Verificar si un nombre está duplicado
  isDuplicateName: (name, campusList, excludeId = null) => {
    if (!name || !name.trim()) return false;
    
    const trimmedName = name.trim().toLowerCase();
    return campusList.some(campus => 
      campus.name.toLowerCase() === trimmedName && 
      (excludeId ? campus.id !== excludeId : true)
    );
  },

  // Validar teléfono
  isValidPhone: (phone) => {
    if (!phone) return true; // Teléfono es opcional
    
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 10;
  },

  // Validar email
  isValidEmail: (email) => {
    if (!email) return true; // Email es opcional
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validar ciudad
  isValidCity: (city) => {
    if (!city || !city.trim()) return false;
    
    const trimmedCity = city.trim();
    if (trimmedCity.length < 2 || trimmedCity.length > 50) return false;
    
    // Solo letras, espacios y algunos caracteres básicos
    const validCityRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s\.\-]+$/;
    return validCityRegex.test(trimmedCity);
  }
};

