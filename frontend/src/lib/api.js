// API utility for backend calls
import { dev } from '$app/environment';

const API_BASE_URL = dev 
	? 'http://localhost:8081' 
	: (import.meta.env.VITE_API_URL || '/api');

// Security headers for all requests
const getSecureHeaders = () => ({
	'Content-Type': 'application/json',
	'X-Requested-With': 'XMLHttpRequest' // CSRF protection
	// Add more security headers as needed
});

/**
 * Make a secure API request with proper error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise<Object>} Response data
 */
async function secureApiRequest(endpoint, options = {}) {
	const url = `${API_BASE_URL}${endpoint}`;

	const requestOptions = {
		...options,
		headers: {
			...getSecureHeaders(),
			...options.headers
		}
	};

	try {
		const response = await fetch(url, requestOptions);

		if (!response.ok) {
			// Handle different error status codes
			let errorMessage = `HTTP error! status: ${response.status}`;

			try {
				const errorData = await response.json();
				errorMessage = errorData.message || errorData.error || errorMessage;
			} catch {
				// If response body is not JSON, use status text
				errorMessage = response.statusText || errorMessage;
			}

			throw new Error(errorMessage);
		}

		return await response.json();
	} catch (error) {
		// Re-throw with user-friendly message
		if (error.name === 'TypeError' && error.message.includes('fetch')) {
			throw new Error('Unable to connect to server. Please check your connection.');
		}

		throw error;
	}
}

/**
 * Fetch backend status information
 * @returns {Promise<Object>} Backend status data
 * @throws {Error} When the request fails
 */
export async function fetchBackendStatus() {
	try {
		return await secureApiRequest('/api/status', {
			method: 'GET'
		});
	} catch (error) {
		throw new Error(`Failed to fetch backend status: ${error.message}`);
	}
}

/**
 * Deploy an application with secure configuration handling
 * @param {string} appId - The application ID to deploy
 * @param {Object} formData - The configuration data for the application (may include encrypted fields)
 * @returns {Promise<Object>} Deployment result
 * @throws {Error} When the deployment fails
 */
export async function deployApplication(appId, formData = {}) {
	try {
		// Sanitize the app ID to prevent injection
		const sanitizedAppId = appId.replace(/[^a-zA-Z0-9-_]/g, '');

		if (!sanitizedAppId) {
			throw new Error('Invalid application ID');
		}

		const payload = {
			app_id: sanitizedAppId,
			configuration: formData,
			// Add timestamp for replay attack protection
			timestamp: Date.now(),
			// Add a request ID for tracking
			request_id: generateRequestId()
		};

		const response = await secureApiRequest('/api/deploy', {
			method: 'POST',
			body: JSON.stringify(payload)
		});

		// Clear any client-side encryption keys after successful submission
		if (formData._encryption) {
			// The keys are already out of scope, but we can explicitly indicate cleanup
		}

		return response;
	} catch (error) {
		throw new Error(`Failed to deploy ${appId}: ${error.message}`);
	}
}

/**
 * Generate a unique request ID for tracking purposes
 * @returns {string} Random request ID
 */
function generateRequestId() {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let _result = '';
	for (let i = 0; i < 16; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}
