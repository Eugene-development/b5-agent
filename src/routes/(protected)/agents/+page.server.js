/**
 * Server-side load function for agents page
 * Handles authentication checks and data loading on the server
 * Enhanced with comprehensive error handling and fallback states
 * Requirements: 3.1, 3.2, 5.3, 7.2
 */

import { error, redirect } from '@sveltejs/kit';
import { createAgentsApi } from '$lib/api/agents.js';

/**
 * Error types for better error categorization
 */
const ERROR_TYPES = {
	NETWORK: 'network',
	API: 'api',
	AUTH: 'auth',
	TIMEOUT: 'timeout',
	UNKNOWN: 'unknown'
};

/**
 * Categorize error based on error message and properties
 * @param {Error} error - The error to categorize
 * @returns {string} Error type
 */
function categorizeError(error) {
	const message = error.message?.toLowerCase() || '';
	
	if (message.includes('network') || message.includes('fetch')) {
		return ERROR_TYPES.NETWORK;
	}
	if (message.includes('timeout') || message.includes('aborted')) {
		return ERROR_TYPES.TIMEOUT;
	}
	if (message.includes('unauthorized') || message.includes('forbidden')) {
		return ERROR_TYPES.AUTH;
	}
	if (message.includes('graphql') || message.includes('api')) {
		return ERROR_TYPES.API;
	}
	
	return ERROR_TYPES.UNKNOWN;
}

/**
 * Get user-friendly error message based on error type
 * @param {string} errorType - Error type
 * @param {string} originalMessage - Original error message
 * @returns {string} User-friendly error message
 */
function getUserFriendlyErrorMessage(errorType, originalMessage) {
	switch (errorType) {
		case ERROR_TYPES.NETWORK:
			return 'Проблема с подключением к серверу. Проверьте интернет-соединение.';
		case ERROR_TYPES.TIMEOUT:
			return 'Превышено время ожидания ответа от сервера. Попробуйте еще раз.';
		case ERROR_TYPES.AUTH:
			return 'Ошибка авторизации. Пожалуйста, войдите в систему заново.';
		case ERROR_TYPES.API:
			return 'Ошибка при получении данных с сервера. Попробуйте обновить страницу.';
		default:
			return `Произошла неожиданная ошибка: ${originalMessage}`;
	}
}

/**
 * Create fallback data structure for agents page
 * @returns {Object} Fallback data structure
 */
function createAgentsFallbackData() {
	return {
		agents: [],
		stats: { 
			total: 0, 
			active: 0, 
			inactive: 0 
		},
		error: null,
		errorType: null,
		canRetry: false,
		isLoading: false
	};
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, locals, parent, url }) {
	const startTime = Date.now();
	
	try {
		// Get authentication data from parent layout
		const { user, isAuthenticated } = await parent();

		// Check authentication - redirect if not authenticated
		if (!isAuthenticated || !user) {
			const returnTo = url.pathname + (url.search || '');
			throw redirect(302, `/login?returnTo=${encodeURIComponent(returnTo)}`);
		}

		// Create agents API client with server-side fetch
		const agentsApi = createAgentsApi(fetch);

		try {
			// Add timeout to prevent hanging requests
			const timeoutPromise = new Promise((_, reject) => {
				setTimeout(() => reject(new Error('Request timeout')), 30000); // 30 seconds
			});

			// Load agents data on the server with timeout
			const agents = await Promise.race([
				agentsApi.getAllWithProjects(),
				timeoutPromise
			]);

			// Validate data structure
			if (!Array.isArray(agents)) {
				throw new Error('Invalid data format received from API');
			}

			// Calculate statistics with error handling
			const stats = {
				total: agents.length,
				active: agents.filter(agent => agent?.status === 'ACTIVE').length,
				inactive: agents.filter(agent => agent?.status !== 'ACTIVE').length
			};

			const loadTime = Date.now() - startTime;
			console.log(`Agents data loaded successfully in ${loadTime}ms`);

			return {
				agents,
				stats,
				error: null,
				errorType: null,
				canRetry: false,
				isLoading: false,
				loadTime
			};

		} catch (apiError) {
			const errorType = categorizeError(apiError);
			const userMessage = getUserFriendlyErrorMessage(errorType, apiError.message);
			
			console.error('Failed to load agents data:', {
				error: apiError.message,
				type: errorType,
				stack: apiError.stack,
				loadTime: Date.now() - startTime
			});
			
			// Return error state with detailed information for graceful error handling
			const fallbackData = createAgentsFallbackData();
			return {
				...fallbackData,
				error: userMessage,
				errorType,
				canRetry: errorType !== ERROR_TYPES.AUTH, // Don't allow retry for auth errors
				originalError: apiError.message, // For debugging
				loadTime: Date.now() - startTime
			};
		}

	} catch (err) {
		// Handle authentication redirects
		if (err.status === 302) {
			throw err;
		}

		// Handle other server errors
		const errorType = categorizeError(err);
		console.error('Server load error for agents page:', {
			error: err.message,
			type: errorType,
			stack: err.stack,
			loadTime: Date.now() - startTime
		});

		// For critical server errors, throw to show error page
		if (errorType === ERROR_TYPES.AUTH) {
			throw redirect(302, '/login?returnTo=/agents');
		}

		throw error(500, {
			message: 'Внутренняя ошибка сервера при загрузке страницы агентов',
			errorType,
			canRetry: true
		});
	}
}