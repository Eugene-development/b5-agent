/**
 * API Configuration
 * Reads configuration from browser environment or uses defaults
 */

import { browser } from '$app/environment';

// Default configuration for development
const DEFAULT_CONFIG = {
	API_BASE_URL: 'http://localhost:8000', // b5-api2 GraphQL server
	AUTH_API_URL: 'http://localhost:8001', // b5-auth-2 authentication server
	FRONTEND_URL: 'http://localhost:5040' // b5-agent frontend
};

/**
 * Get API configuration
 * In production, these values are set by entrypoint.sh via window.__APP_CONFIG__
 * In development, uses default values
 */
function getApiConfig() {
	if (browser && window.__APP_CONFIG__) {
		return {
			API_BASE_URL: window.__APP_CONFIG__.API_BASE_URL || DEFAULT_CONFIG.API_BASE_URL,
			AUTH_API_URL: window.__APP_CONFIG__.AUTH_API_URL || DEFAULT_CONFIG.AUTH_API_URL,
			FRONTEND_URL: window.__APP_CONFIG__.FRONTEND_URL || DEFAULT_CONFIG.FRONTEND_URL
		};
	}

	return DEFAULT_CONFIG;
}

export const config = getApiConfig();
export const { API_BASE_URL, AUTH_API_URL, FRONTEND_URL } = config;
