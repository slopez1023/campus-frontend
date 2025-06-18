// src/hooks/useCampusValidation.js
import { useState, useCallback } from 'react';
import { validationUtils } from '../utils/validation';
import { errorMessages } from '../utils/errorMessages';

export const useCampusValidation = (campusList = []) => {
  const [errors, setErrors] = useState({});

  const validateField = useCallback((field, value, campusId = null) => {
    let error = '';

    switch (field) {
      case 'name':
        if (!value || !value.trim()) {
          error = errorMessages.campus.nameRequired;
        } else if (!validationUtils.isValidCampusName(value)) {
          if (value.trim().length < 3) {
            error = errorMessages.campus.nameMinLength;
          } else if (value.trim().length > 100) {
            error = errorMessages.campus.nameMaxLength;
          } else {
            error = errorMessages.campus.nameInvalid;
          }
        } else if (validationUtils.isDuplicateName(value, campusList, campusId)) {
          error = errorMessages.campus.nameDuplicate;
        }
        break;

      case 'address':
        if (!value || !value.trim()) {
          error = errorMessages.campus.addressRequired;
        } else if (value.trim().length < 10) {
          error = errorMessages.campus.addressMinLength;
        } else if (value.trim().length > 200) {
          error = errorMessages.campus.addressMaxLength;
        } else if (!validationUtils.isValidAddress(value)) {
          error = errorMessages.campus.addressInvalid;
        }
        break;

      case 'city':
        if (!value || !value.trim()) {
          error = errorMessages.campus.cityRequired;
        } else if (!validationUtils.isValidCity(value)) {
          if (value.trim().length < 2) {
            error = errorMessages.campus.cityMinLength;
          } else if (value.trim().length > 50) {
            error = errorMessages.campus.cityMaxLength;
          } else {
            error = errorMessages.campus.cityInvalid;
          }
        }
        break;

      case 'telephone':
        if (value && !validationUtils.isValidPhone(value)) {
          error = errorMessages.campus.phoneInvalid;
        }
        break;

      case 'email':
        if (value && !validationUtils.isValidEmail(value)) {
          error = errorMessages.campus.emailInvalid;
        }
        break;

      default:
        break;
    }

    return error;
  }, [campusList]);

  const validateForm = useCallback((formData, campusId = null) => {
    const newErrors = {};

    // Validar cada campo
    Object.keys(formData).forEach(field => {
      if (field !== 'active') { // Skip validation for boolean fields
        const error = validateField(field, formData[field], campusId);
        if (error) {
          newErrors[field] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validateField]);

  const validateSingleField = useCallback((field, value, campusId = null) => {
    const error = validateField(field, value, campusId);
    
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));

    return !error;
  }, [validateField]);

  const clearFieldError = useCallback((field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateForm,
    validateSingleField,
    clearFieldError,
    clearAllErrors,
    hasErrors: Object.keys(errors).length > 0
  };
};