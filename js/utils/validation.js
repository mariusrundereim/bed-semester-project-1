export const ValidationRules = {
  name: {
    pattern: /^[A-Za-z\s]+$/,
    message: "Name should contain only letters",
  },
  telephone: {
    minLength: 7,
    message: "Phone number should be at least 7 digits",
  },
  address: {
    minLength: 5,
    message: "Please enter a valid delivery address",
  },
  time: {
    pattern: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
    message: "Please enter a valid time in HH:MM format",
  },
};

export class ValidationService {
  static validateField(value, rules) {
    if (rules.pattern && !rules.pattern.test(value)) {
      return { isValid: false, message: rules.message };
    }
    if (rules.minLength && value.length < rules.minLength) {
      return { isValid: false, message: rules.message };
    }
    return { isValid: true };
  }

  static validateRequiredFields(data) {
    const emptyField = Object.entries(data).find(([key, value]) => !value);
    if (emptyField) {
      return {
        isValid: false,
        message: `${
          emptyField[0].charAt(0).toUpperCase() + emptyField[0].slice(1)
        } is required`,
      };
    }
    return { isValid: true };
  }
}
