/**
 * Themed error handling system that provides consistent error presentation
 * across the entire application
 */

export class ThemedErrorHandler {
	constructor() {
		this.errors = new Map();
		this.callbacks = new Set();
	}

	// Error types with themed styling
	static ErrorTypes = {
		VALIDATION: {
			variant: 'error',
			icon: 'alert-circle',
			title: 'Validation Error',
			autoHide: false
		},
		NETWORK: {
			variant: 'error',
			icon: 'wifi-off',
			title: 'Connection Error',
			autoHide: true,
			hideAfter: 5000
		},
		PERMISSION: {
			variant: 'warning',
			icon: 'shield-alert',
			title: 'Permission Denied',
			autoHide: false
		},
		SERVER: {
			variant: 'error',
			icon: 'server',
			title: 'Server Error',
			autoHide: true,
			hideAfter: 8000
		},
		SECURITY: {
			variant: 'error',
			icon: 'alert-triangle',
			title: 'Security Error',
			autoHide: false,
			severity: 'high'
		},
		CONFIGURATION: {
			variant: 'warning',
			icon: 'settings',
			title: 'Configuration Issue',
			autoHide: false
		},
		DEPLOYMENT: {
			variant: 'error',
			icon: 'upload-cloud',
			title: 'Deployment Failed',
			autoHide: false
		}
	};

	// Add error with themed styling
	addError(id, type, message, details = null) {
		const errorType =
			ThemedErrorHandler.ErrorTypes[type] || ThemedErrorHandler.ErrorTypes.VALIDATION;

		const error = {
			id,
			type,
			message,
			details,
			timestamp: Date.now(),
			...errorType,
			dismissed: false
		};

		this.errors.set(id, error);
		this.notifyCallbacks();

		// Auto-hide if configured
		if (error.autoHide && error.hideAfter) {
			setTimeout(() => {
				this.dismissError(id);
			}, error.hideAfter);
		}

		return error;
	}

	// Dismiss error
	dismissError(id) {
		if (this.errors.has(id)) {
			this.errors.delete(id);
			this.notifyCallbacks();
		}
	}

	// Get all active errors
	getErrors() {
		return Array.from(this.errors.values()).filter((error) => !error.dismissed);
	}

	// Get errors by type
	getErrorsByType(type) {
		return this.getErrors().filter((error) => error.type === type);
	}

	// Check if there are any critical errors
	hasCriticalErrors() {
		return this.getErrors().some((error) => error.type === 'SECURITY' || error.severity === 'high');
	}

	// Clear all errors
	clearAll() {
		this.errors.clear();
		this.notifyCallbacks();
	}

	// Subscribe to error changes
	subscribe(callback) {
		this.callbacks.add(callback);
		return () => this.callbacks.delete(callback);
	}

	notifyCallbacks() {
		this.callbacks.forEach((callback) => callback(this.getErrors()));
	}

	// Predefined error creators
	static createValidationError(field, message) {
		return {
			id: `validation-${field}`,
			type: 'VALIDATION',
			message: `${field}: ${message}`,
			field
		};
	}

	static createNetworkError(operation) {
		return {
			id: `network-${Date.now()}`,
			type: 'NETWORK',
			message: `Failed to ${operation}. Please check your internet connection and try again.`
		};
	}

	static createDeploymentError(appName, message, details = null) {
		return {
			id: `deployment-${appName}`,
			type: 'DEPLOYMENT',
			message: `Failed to deploy ${appName}: ${message}`,
			details
		};
	}

	static createSecurityError(message, details = null) {
		return {
			id: `security-${Date.now()}`,
			type: 'SECURITY',
			message,
			details
		};
	}

	// Handle common error scenarios
	handleApiError(error, operation = 'perform operation') {
		let errorType = 'SERVER';
		let message = `Failed to ${operation}`;
		let details = null;

		if (error.status === 401) {
			errorType = 'PERMISSION';
			message = 'You are not authorized to perform this action';
		} else if (error.status === 403) {
			errorType = 'PERMISSION';
			message = 'You do not have permission to perform this action';
		} else if (error.status === 404) {
			message = 'The requested resource was not found';
		} else if (error.status >= 500) {
			message = 'Server error occurred. Please try again later';
		} else if (!navigator.onLine) {
			errorType = 'NETWORK';
			message = 'No internet connection. Please check your network and try again';
		}

		if (error.message) {
			details = error.message;
		}

		return this.addError(`api-${operation}-${Date.now()}`, errorType, message, details);
	}
}

// Global error handler instance
export const errorHandler = new ThemedErrorHandler();

// Error boundary helper for Svelte components
export function createErrorBoundary() {
	let hasError = false;
	let error = null;

	function handleError(event) {
		hasError = true;
		error = event.error;

		// Log to error handler
		errorHandler.addError(
			`boundary-${Date.now()}`,
			'SERVER',
			'An unexpected error occurred',
			error.message
		);
	}

	function reset() {
		hasError = false;
		error = null;
	}

	return {
		hasError: () => hasError,
		getError: () => error,
		handleError,
		reset
	};
}

// Form validation helpers with themed errors
export class ThemedFormValidator {
	constructor(errorHandler) {
		this.errorHandler = errorHandler;
		this.fieldErrors = new Map();
	}

	validateField(fieldId, value, rules, label) {
		this.clearFieldError(fieldId);

		for (const rule of rules) {
			const error = rule(value, label);
			if (error) {
				this.setFieldError(fieldId, error);
				return false;
			}
		}

		return true;
	}

	setFieldError(fieldId, message) {
		this.fieldErrors.set(fieldId, message);
		this.errorHandler.addError(`field-${fieldId}`, 'VALIDATION', message);
	}

	clearFieldError(fieldId) {
		this.fieldErrors.delete(fieldId);
		this.errorHandler.dismissError(`field-${fieldId}`);
	}

	getFieldError(fieldId) {
		return this.fieldErrors.get(fieldId);
	}

	hasErrors() {
		return this.fieldErrors.size > 0;
	}

	clearAllErrors() {
		this.fieldErrors.clear();
		// Clear validation errors from error handler
		const errors = this.errorHandler.getErrorsByType('VALIDATION');
		errors.forEach((error) => this.errorHandler.dismissError(error.id));
	}
}

export default ThemedErrorHandler;
