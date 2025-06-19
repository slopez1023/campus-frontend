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