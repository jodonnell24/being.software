/**
 * Themed validation utilities that provide consistent error messaging
 * and validation feedback across the application
 */

export class ThemeValidator {
	constructor() {
		this.errors = [];
		this.warnings = [];
		this.successes = [];
	}

	// Validation rules
	static rules = {
		required: (value, fieldName = 'Field') => {
			if (!value || (typeof value === 'string' && value.trim() === '')) {
				return `${fieldName} is required`;
			}
			return null;
		},

		email: (value, fieldName = 'Email') => {
			if (!value) return null;
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(value)) {
				return `${fieldName} must be a valid email address`;
			}
			return null;
		},

		minLength:
			(min) =>
			(value, fieldName = 'Field') => {
				if (!value) return null;
				if (value.length < min) {
					return `${fieldName} must be at least ${min} characters long`;
				}
				return null;
			},

		maxLength:
			(max) =>
			(value, fieldName = 'Field') => {
				if (!value) return null;
				if (value.length > max) {
					return `${fieldName} must be no more than ${max} characters long`;
				}
				return null;
			},

		url: (value, fieldName = 'URL') => {
			if (!value) return null;
			try {
				new URL(value);
				return null;
			} catch {
				return `${fieldName} must be a valid URL`;
			}
		},

		domain: (value, fieldName = 'Domain') => {
			if (!value) return null;
			// More flexible domain regex that allows single character domain parts and common TLDs
			const domainRegex =
				/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
			if (!domainRegex.test(value)) {
				return `${fieldName} must be a valid domain name`;
			}
			return null;
		},

		port: (value, fieldName = 'Port') => {
			if (!value) return null;
			const port = parseInt(value);
			if (isNaN(port) || port < 1 || port > 65535) {
				return `${fieldName} must be a valid port number (1-65535)`;
			}
			return null;
		},

		path: (value, fieldName = 'Path') => {
			if (!value) return null;
			if (!value.startsWith('/')) {
				return `${fieldName} must start with a forward slash (/)`;
			}
			return null;
		}
	};

	// Validate a single field
	validateField(value, rules, fieldName) {
		const errors = [];

		for (const rule of rules) {
			let error;
			if (typeof rule === 'function') {
				error = rule(value, fieldName);
			} else if (typeof rule === 'object' && rule.validator) {
				error = rule.validator(value, fieldName);
			}

			if (error) {
				errors.push(error);
			}
		}

		return errors;
	}

	// Validate multiple fields
	validateForm(formData, fieldConfigs) {
		const results = {
			isValid: true,
			errors: {},
			hasErrors: false
		};

		for (const fieldConfig of fieldConfigs) {
			const { id, label, required, validation = [] } = fieldConfig;
			const value = formData[id];
			const fieldName = label || id;

			const rules = [...validation];
			if (required) {
				rules.unshift(ThemeValidator.rules.required);
			}

			const fieldErrors = this.validateField(value, rules, fieldName);

			if (fieldErrors.length > 0) {
				results.errors[id] = fieldErrors[0]; // Show only first error
				results.isValid = false;
				results.hasErrors = true;
			}
		}

		return results;
	}

	// Create themed error message component data
	createErrorAlert(message, details = null) {
		return {
			variant: 'error',
			title: 'Validation Error',
			message,
			details,
			dismissible: true
		};
	}

	// Create themed success message component data
	createSuccessAlert(message) {
		return {
			variant: 'success',
			title: 'Success',
			message,
			dismissible: true
		};
	}

	// Create themed warning message component data
	createWarningAlert(message) {
		return {
			variant: 'warning',
			title: 'Warning',
			message,
			dismissible: true
		};
	}
}

// Pre-configured field validators for common deployment form fields
export const deploymentValidators = {
	domain: [
		ThemeValidator.rules.domain,
		ThemeValidator.rules.minLength(3),
		ThemeValidator.rules.maxLength(253)
	],

	port: [ThemeValidator.rules.port],

	path: [ThemeValidator.rules.path, ThemeValidator.rules.maxLength(1000)],

	email: [ThemeValidator.rules.email],

	url: [ThemeValidator.rules.url],

	password: [
		ThemeValidator.rules.minLength(8),
		(value, fieldName) => {
			if (!value) return null;
			if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
				return `${fieldName} must contain at least one uppercase letter, one lowercase letter, and one number`;
			}
			return null;
		}
	],

	apiKey: [
		ThemeValidator.rules.minLength(16),
		(value, fieldName) => {
			if (!value) return null;
			if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
				return `${fieldName} can only contain letters, numbers, hyphens, and underscores`;
			}
			return null;
		}
	]
};

// Helper function to get validation rules by field type
export function getValidationRules(fieldType) {
	return deploymentValidators[fieldType] || [];
}

export default ThemeValidator;
