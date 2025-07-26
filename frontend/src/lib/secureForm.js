import { writable } from 'svelte/store';
import zxcvbn from 'zxcvbn';

/**
 * Secure form utility for handling sensitive deployment configuration
 * Implements security best practices for frontend form handling
 */

// List of field types that contain sensitive data
const SENSITIVE_FIELD_TYPES = ['password'];

// List of field IDs that contain sensitive data (even if type isn't password)
const SENSITIVE_FIELD_IDS = [
	'adminPassword',
	'dbPassword',
	'adminToken',
	'smtpPassword',
	'secretKey',
	'apiKey',
	'token'
];

/**
 * Encryption utilities for sensitive data
 */
export const EncryptionUtils = {
	/**
	 * Generate a random encryption key for AES-GCM
	 * @returns {Promise<CryptoKey>} Generated key
	 */
	async generateKey() {
		return await crypto.subtle.generateKey(
			{
				name: 'AES-GCM',
				length: 256
			},
			true,
			['encrypt', 'decrypt']
		);
	},

	/**
	 * Import a key from raw key material
	 * @param {ArrayBuffer} keyMaterial - Raw key bytes
	 * @returns {Promise<CryptoKey>} Imported key
	 */
	async importKey(keyMaterial) {
		return await crypto.subtle.importKey(
			'raw',
			keyMaterial,
			{
				name: 'AES-GCM',
				length: 256
			},
			false,
			['encrypt', 'decrypt']
		);
	},

	/**
	 * Encrypt sensitive data using AES-GCM
	 * @param {string} plaintext - Data to encrypt
	 * @param {CryptoKey} key - Encryption key
	 * @returns {Promise<Object>} Encrypted data with IV
	 */
	async encryptData(plaintext, key) {
		const encoder = new TextEncoder();
		const data = encoder.encode(plaintext);

		// Generate a random IV for each encryption
		const iv = crypto.getRandomValues(new Uint8Array(12));

		const encryptedData = await crypto.subtle.encrypt(
			{
				name: 'AES-GCM',
				iv: iv
			},
			key,
			data
		);

		return {
			encrypted: Array.from(new Uint8Array(encryptedData)),
			iv: Array.from(iv)
		};
	},

	/**
	 * Decrypt data using AES-GCM
	 * @param {Object} encryptedData - Encrypted data with IV
	 * @param {CryptoKey} key - Decryption key
	 * @returns {Promise<string>} Decrypted plaintext
	 */
	async decryptData(encryptedData, key) {
		const iv = new Uint8Array(encryptedData.iv);
		const encrypted = new Uint8Array(encryptedData.encrypted);

		const decryptedData = await crypto.subtle.decrypt(
			{
				name: 'AES-GCM',
				iv: iv
			},
			key,
			encrypted
		);

		const decoder = new TextDecoder();
		return decoder.decode(decryptedData);
	},

	/**
	 * Derive an encryption key from a password using PBKDF2
	 * @param {string} password - Master password
	 * @param {Uint8Array} salt - Salt for key derivation
	 * @returns {Promise<CryptoKey>} Derived key
	 */
	async deriveKeyFromPassword(password, salt) {
		const encoder = new TextEncoder();
		const passwordBuffer = encoder.encode(password);

		const baseKey = await crypto.subtle.importKey('raw', passwordBuffer, 'PBKDF2', false, [
			'deriveKey'
		]);

		return await crypto.subtle.deriveKey(
			{
				name: 'PBKDF2',
				salt: salt,
				iterations: 100000,
				hash: 'SHA-256'
			},
			baseKey,
			{
				name: 'AES-GCM',
				length: 256
			},
			false,
			['encrypt', 'decrypt']
		);
	}
};

/**
 * Check if a field contains sensitive data
 * @param {Object} field - The field configuration
 * @returns {boolean} True if the field is sensitive
 */
export function isSensitiveField(field) {
	return (
		SENSITIVE_FIELD_TYPES.includes(field.type) ||
		SENSITIVE_FIELD_IDS.some((id) => field.id.toLowerCase().includes(id.toLowerCase()))
	);
}

/**
 * Create a secure form store that handles sensitive data properly
 * @param {Array} fields - The form field configurations
 * @returns {Object} Form store and utility functions
 */
export function createSecureFormStore(fields) {
	// Initialize form data
	const initialData = fields.reduce((acc, field) => {
		acc[field.id] = field.type === 'checkbox' ? false : '';
		return acc;
	}, {});

	const formData = writable(initialData);
	const sensitiveFields = new Set();

	// Track which fields are sensitive
	fields.forEach((field) => {
		if (isSensitiveField(field)) {
			sensitiveFields.add(field.id);
		}
	});

	/**
	 * Get sanitized form data for display purposes (hides sensitive values)
	 * @param {Object} data - The current form data
	 * @returns {Object} Sanitized data safe for display
	 */
	function getSanitizedData(data) {
		const sanitized = { ...data };

		sensitiveFields.forEach((fieldId) => {
			if (sanitized[fieldId]) {
				sanitized[fieldId] = '••••••••';
			}
		});

		return sanitized;
	}

	/**
	 * Prepare form data for secure transmission to backend
	 * @param {Object} data - The current form data
	 * @param {boolean} encryptSensitive - Whether to encrypt sensitive fields
	 * @returns {Promise<Object>} Data prepared for backend submission
	 */
	async function prepareForSubmission(data, encryptSensitive = true) {
		// Filter out empty values
		const prepared = {};

		Object.entries(data).forEach(([key, value]) => {
			// Only include non-empty values
			if (value !== '' && value !== false) {
				prepared[key] = value;
			}
		});

		// If encryption is disabled, return as-is
		if (!encryptSensitive) {
			return prepared;
		}

		// Generate a session key for encrypting sensitive data
		const sessionKey = await EncryptionUtils.generateKey();
		const exportedKey = await crypto.subtle.exportKey('raw', sessionKey);

		// Encrypt sensitive fields
		const encryptedFields = {};
		const sensitiveFieldsFound = [];

		for (const [key, value] of Object.entries(prepared)) {
			if (sensitiveFields.has(key) && typeof value === 'string' && value.length > 0) {
				try {
					encryptedFields[key] = await EncryptionUtils.encryptData(value, sessionKey);
					sensitiveFieldsFound.push(key);
					// Remove the plaintext value
					delete prepared[key];
				} catch (error) {
					console.error(`Failed to encrypt field ${key}:`, error);
					// Fall back to sending plaintext (still over HTTPS)
				}
			}
		}

		// Add encryption metadata if we encrypted anything
		if (sensitiveFieldsFound.length > 0) {
			prepared._encryption = {
				sessionKey: Array.from(new Uint8Array(exportedKey)),
				encryptedFields: encryptedFields,
				algorithm: 'AES-GCM',
				version: '1.0'
			};
		}

		return prepared;
	}

	/**
	 * Clear sensitive data from memory
	 */
	function clearSensitiveData() {
		formData.update((data) => {
			const cleared = { ...data };
			sensitiveFields.forEach((fieldId) => {
				cleared[fieldId] = '';
			});
			return cleared;
		});
	}

	/**
	 * Validate form data
	 * @param {Object} data - The current form data
	 * @param {Array} fields - The field configurations
	 * @returns {Object} Validation result
	 */
	function validateForm(data, fields) {
		const errors = [];
		const missingRequired = [];

		fields.forEach((field) => {
			if (field.required && (!data[field.id] || data[field.id] === '')) {
				missingRequired.push(field.label);
			}

			// Additional validation for sensitive fields
			if (isSensitiveField(field) && data[field.id]) {
				if (field.type === 'password' && data[field.id].length < 12) {
					errors.push(`${field.label} must be at least 12 characters long`);
				}
			}

			// Email validation
			if (field.type === 'email' && data[field.id]) {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(data[field.id])) {
					errors.push(`${field.label} must be a valid email address`);
				}
			}
		});

		if (missingRequired.length > 0) {
			errors.unshift(`Please fill in required fields: ${missingRequired.join(', ')}`);
		}

		return {
			isValid: errors.length === 0,
			errors
		};
	}

	return {
		formData,
		getSanitizedData,
		prepareForSubmission,
		clearSensitiveData,
		validateForm,
		isSensitiveField: (fieldId) => sensitiveFields.has(fieldId)
	};
}

/**
 * Security utility functions
 */
export const SecurityUtils = {
	/**
	 * Generate a secure random password
	 * @param {number} length - Password length (default: 16)
	 * @returns {string} Generated password
	 */
	generateSecurePassword(length = 16) { // Can edit charset to remove uncompatible characters if needed
		const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
		const randomValues = new Uint32Array(length);
		window.crypto.getRandomValues(randomValues);
		let password = '';
		for (let i = 0; i < length; i++) {
			const randomIndex = randomValues[i] % charset.length;
			password += charset[randomIndex];
		}
		return password;
	},

	/**
	 * Generate a secure token
	 * @param {number} length - Token length (default: 32)
	 * @returns {string} Generated token
	 */
	generateSecureToken(length = 32) {
		const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
		const randomValues = new Uint32Array(length);
		window.crypto.getRandomValues(randomValues);
		let token = '';
		for (let i = 0; i < length; i++) {
			const randomIndex = randomValues[i] % charset.length;
			token += charset[randomIndex];
		}
		return token;
	},

	/**
	 * Check if password has been pwned using SHA-1 hash
	 * @param {string} password - Password to check
	 * @returns {Promise<Object>} Pwned status and breach count
	 */
	async checkPasswordPwned(password) {
		try {
			// Create SHA-1 hash of the password
			const encoder = new TextEncoder();
			const data = encoder.encode(password);
			const hashBuffer = await crypto.subtle.digest('SHA-1', data);
			const hashArray = Array.from(new Uint8Array(hashBuffer));
			const hashHex = hashArray
				.map((b) => b.toString(16).padStart(2, '0'))
				.join('')
				.toUpperCase();

			// Use k-anonymity: send only first 5 chars of hash
			const prefix = hashHex.substring(0, 5);
			const suffix = hashHex.substring(5);

			const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
			if (!response.ok) {
				throw new Error('Failed to check password');
			}

			const text = await response.text();
			const lines = text.split('\n');

			for (const line of lines) {
				const [hashSuffix, count] = line.split(':');
				if (hashSuffix === suffix) {
					return {
						isPwned: true,
						breachCount: parseInt(count, 10)
					};
				}
			}

			return { isPwned: false, breachCount: 0 };
		} catch (error) {
			console.warn('Could not check password against Pwned Passwords:', error);
			return { isPwned: false, breachCount: 0, error: true };
		}
	},

	/**
	 * Check password strength using zxcvbn and custom validation
	 * @param {string} password - Password to check
	 * @returns {Object} Comprehensive strength assessment
	 */
	checkPasswordStrength(password) {
		if (!password)
			return {
				strength: 'empty',
				score: 0,
				feedback: 'Password is required',
				zxcvbnScore: 0,
				meetsMinLength: false
			};

		// Use zxcvbn for advanced strength checking
		const zxcvbnResult = zxcvbn(password);

		// Custom validation
		const meetsMinLength = password.length >= 12;
		const feedback = [];

		// Only add length feedback if it's not already covered by the length indicator
		// and only for very short passwords or to encourage even longer ones
		if (password.length < 8) {
			feedback.push('Password is too short');
		} else if (password.length >= 15) {
			feedback.push('Great length! Very secure');
		}

		// Add zxcvbn feedback if available (these are usually more valuable than length warnings)
		if (zxcvbnResult.feedback.suggestions.length > 0) {
			feedback.push(...zxcvbnResult.feedback.suggestions);
		}

		if (zxcvbnResult.feedback.warning) {
			feedback.push(zxcvbnResult.feedback.warning);
		}

		// Map zxcvbn score (0-4) to our strength categories
		let strength;
		if (zxcvbnResult.score === 0) strength = 'very-weak';
		else if (zxcvbnResult.score === 1) strength = 'weak';
		else if (zxcvbnResult.score === 2) strength = 'fair';
		else if (zxcvbnResult.score === 3) strength = 'good';
		else strength = 'strong';

		// Downgrade if doesn't meet minimum length
		if (!meetsMinLength && strength !== 'very-weak') {
			if (strength === 'strong') strength = 'good';
			else if (strength === 'good') strength = 'fair';
			else if (strength === 'fair') strength = 'weak';
		}

		return {
			strength,
			score: zxcvbnResult.score,
			zxcvbnScore: zxcvbnResult.score,
			feedback: feedback.length > 0 ? feedback.join('. ') : 'Excellent password!',
			crackTime: zxcvbnResult.crack_times_display.offline_slow_hashing_1e4_per_second,
			meetsMinLength,
			guesses: zxcvbnResult.guesses
		};
	}
};
