// Form validation utility functions

export const validators = {
  required: (value, message = 'This field is required') => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return message;
    }
    return null;
  },

  email: (value, message = 'Please enter a valid email address') => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return message;
    }
    return null;
  },

  minLength: (min, message) => (value) => {
    if (value && value.length < min) {
      return message || `Must be at least ${min} characters long`;
    }
    return null;
  },

  maxLength: (max, message) => (value) => {
    if (value && value.length > max) {
      return message || `Must be no more than ${max} characters long`;
    }
    return null;
  },

  pattern: (regex, message = 'Invalid format') => (value) => {
    if (value && !regex.test(value)) {
      return message;
    }
    return null;
  },

  numeric: (value, message = 'Must be a number') => {
    if (value && isNaN(Number(value))) {
      return message;
    }
    return null;
  },

  range: (min, max, message) => (value) => {
    const num = Number(value);
    if (value && (num < min || num > max)) {
      return message || `Must be between ${min} and ${max}`;
    }
    return null;
  },

  dateRange: (startDate, endDate, message) => (value) => {
    if (value) {
      const date = new Date(value);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (date < start || date > end) {
        return message || `Date must be between ${startDate} and ${endDate}`;
      }
    }
    return null;
  },

  futureDate: (value, message = 'Date must be in the future') => {
    if (value) {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date <= today) {
        return message;
      }
    }
    return null;
  },

  pastDate: (value, message = 'Date must be in the past') => {
    if (value) {
      const date = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      if (date > today) {
        return message;
      }
    }
    return null;
  },

  deviceId: (value, message = 'Device ID must start with DEV followed by numbers') => {
    const deviceIdRegex = /^DEV\d+$/;
    if (value && !deviceIdRegex.test(value)) {
      return message;
    }
    return null;
  },

  serialNumber: (value, message = 'Invalid serial number format') => {
    // Basic serial number validation - alphanumeric, dashes, underscores
    const serialRegex = /^[A-Za-z0-9\-_]+$/;
    if (value && !serialRegex.test(value)) {
      return message;
    }
    return null;
  },

  phoneNumber: (value, message = 'Please enter a valid phone number') => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (value && !phoneRegex.test(value)) {
      return message;
    }
    return null;
  }
};

// Validation schema builder
export class ValidationSchema {
  constructor() {
    this.rules = {};
  }

  field(fieldName) {
    this.currentField = fieldName;
    if (!this.rules[fieldName]) {
      this.rules[fieldName] = [];
    }
    return this;
  }

  required(message) {
    if (this.currentField) {
      this.rules[this.currentField].push(validators.required(undefined, message));
    }
    return this;
  }

  email(message) {
    if (this.currentField) {
      this.rules[this.currentField].push(validators.email(undefined, message));
    }
    return this;
  }

  minLength(min, message) {
    if (this.currentField) {
      this.rules[this.currentField].push(validators.minLength(min, message));
    }
    return this;
  }

  maxLength(max, message) {
    if (this.currentField) {
      this.rules[this.currentField].push(validators.maxLength(max, message));
    }
    return this;
  }

  pattern(regex, message) {
    if (this.currentField) {
      this.rules[this.currentField].push(validators.pattern(regex, message));
    }
    return this;
  }

  custom(validatorFn) {
    if (this.currentField) {
      this.rules[this.currentField].push(validatorFn);
    }
    return this;
  }

  validate(data) {
    const errors = {};
    
    Object.keys(this.rules).forEach(fieldName => {
      const fieldRules = this.rules[fieldName];
      const fieldValue = data[fieldName];
      
      for (const rule of fieldRules) {
        const error = typeof rule === 'function' ? rule(fieldValue) : rule;
        if (error) {
          errors[fieldName] = error;
          break; // Stop at first error for this field
        }
      }
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

// Device form validation schemas
export const deviceValidationSchema = new ValidationSchema()
  .field('id')
    .required('Device ID is required')
    .custom(validators.deviceId)
  .field('type')
    .required('Device type is required')
  .field('facility')
    .required('Facility is required')
  .field('serialNumber')
    .required('Serial number is required')
    .custom(validators.serialNumber)
  .field('manufacturer')
    .required('Manufacturer is required')
    .minLength(2, 'Manufacturer must be at least 2 characters')
  .field('model')
    .required('Model is required')
    .minLength(1, 'Model is required')
  .field('battery')
    .custom(validators.range(0, 100, 'Battery level must be between 0 and 100'))
  .field('amcExpiry')
    .required('AMC expiry date is required')
    .custom(validators.futureDate('AMC expiry must be in the future'));

export const installationValidationSchema = new ValidationSchema()
  .field('deviceId')
    .required('Device ID is required')
    .custom(validators.deviceId)
  .field('deviceType')
    .required('Device type is required')
  .field('facilityName')
    .required('Facility name is required')
    .minLength(2, 'Facility name must be at least 2 characters')
  .field('staffName')
    .required('Staff name is required')
    .minLength(2, 'Staff name must be at least 2 characters');

export const alertValidationSchema = new ValidationSchema()
  .field('deviceId')
    .required('Device ID is required')
  .field('type')
    .required('Alert type is required')
  .field('title')
    .required('Alert title is required')
    .minLength(3, 'Title must be at least 3 characters')
    .maxLength(100, 'Title must be no more than 100 characters')
  .field('description')
    .required('Alert description is required')
    .minLength(10, 'Description must be at least 10 characters')
    .maxLength(500, 'Description must be no more than 500 characters');

export const photoValidationSchema = new ValidationSchema()
  .field('deviceId')
    .required('Device ID is required')
  .field('title')
    .required('Photo title is required')
    .minLength(3, 'Title must be at least 3 characters')
    .maxLength(100, 'Title must be no more than 100 characters')
  .field('category')
    .required('Category is required');

// Custom hook for form validation
export const useFormValidation = (schema, initialData = {}) => {
  const [data, setData] = React.useState(initialData);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  const validateField = (fieldName, value) => {
    const fieldSchema = new ValidationSchema();
    if (schema.rules[fieldName]) {
      fieldSchema.rules[fieldName] = schema.rules[fieldName];
      const result = fieldSchema.validate({ [fieldName]: value });
      return result.errors[fieldName] || null;
    }
    return null;
  };

  const handleChange = (fieldName, value) => {
    setData(prev => ({ ...prev, [fieldName]: value }));
    
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, data[fieldName]);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const validate = () => {
    const result = schema.validate(data);
    setErrors(result.errors);
    setTouched(Object.keys(schema.rules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));
    return result;
  };

  const reset = (newData = {}) => {
    setData(newData);
    setErrors({});
    setTouched({});
  };

  return {
    data,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    isValid: Object.values(errors).every(error => !error)
  };
};