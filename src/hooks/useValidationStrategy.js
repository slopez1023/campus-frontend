export const useValidationStrategy = () => {
  const [validationService] = useState(() => new ValidationService());

  const validate = useCallback((mode, data, context) => {
    return validationService.validate(mode, data, context);
  }, [validationService]);

  const validateCreate = useCallback((data, existingCampuses) => {
    return validate('create', data, { existingCampuses });
  }, [validate]);

  const validateEdit = useCallback((data, existingCampuses, currentCampusId) => {
    return validate('edit', data, { existingCampuses, currentCampusId });
  }, [validate]);

  return {
    validate,
    validateCreate,
    validateEdit
  };
};