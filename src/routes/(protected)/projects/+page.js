/**
 * Client-side load function for projects page
 * Handles data loading and error handling on the client side
 * Requirements: 3.1, 3.2, 5.3
 */

import { error } from '@sveltejs/kit';
import { createProjectsApi } from '$lib/api/projects.js';

/**
 * Error types for better error categorization
 */
const ERROR_TYPES = {
	NETWORK: 'network',
	API: 'api',
	AUTH: 'auth',
	TIMEOUT: 'timeout',
	VALIDATION: 'validation',
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
	if (message.includes('validation') || message.includes('invalid')) {
		return ERROR_TYPES.VALIDATION;
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
		case ERROR_TYPES.VALIDATION:
			return 'Получены некорректные данные с сервера. Обратитесь к администратору.';
		default:
			return `Произошла неожиданная ошибка: ${originalMessage}`;
	}
}

/**
 * Create fallback data structure for projects page
 * @returns {Object} Fallback data structure
 */
function createProjectsFallbackData() {
	return {
		projects: [],
		stats: {
			total: 0,
			active: 0,
			inactive: 0,
			totalContractAmount: 0,
			averageContractAmount: 0
		},
		pagination: {
			currentPage: 1,
			lastPage: 1,
			total: 0,
			perPage: 100,
			hasMorePages: false
		},
		error: null,
		errorType: null,
		canRetry: false,
		isLoading: false
	};
}

/**
 * Validate projects data structure
 * @param {any} projectsData - Projects data from API
 * @returns {boolean} Whether data is valid
 */
function validateProjectsData(projectsData) {
	// getByAgent returns array directly
	return Array.isArray(projectsData);
}

/**
 * Safely calculate project statistics
 * @param {Array} projects - Array of projects
 * @returns {Object} Statistics object
 */
function calculateProjectStats(projects) {
	if (!Array.isArray(projects)) {
		return {
			total: 0,
			active: 0,
			inactive: 0,
			totalContractAmount: 0,
			averageContractAmount: 0
		};
	}

	const stats = {
		total: projects.length,
		active: 0,
		inactive: 0,
		totalContractAmount: 0,
		averageContractAmount: 0
	};

	for (const project of projects) {
		// Safely check project properties
		if (project?.is_active === true) {
			stats.active++;
		} else {
			stats.inactive++;
		}

		// Safely add contract amount
		const contractAmount = Number(project?.contract_amount) || 0;
		if (contractAmount > 0) {
			stats.totalContractAmount += contractAmount;
		}
	}

	// Calculate average contract amount
	if (stats.total > 0) {
		stats.averageContractAmount = stats.totalContractAmount / stats.total;
	}

	return stats;
}

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, parent, url }) {
	const startTime = Date.now();

	try {
		// Get authentication data from parent layout
		const { user, isAuthenticated } = await parent();

		// Check authentication - redirect if not authenticated
		if (!isAuthenticated || !user) {
			const returnTo = url.pathname + (url.search || '');
			throw error(401, {
				message: 'Необходима авторизация для просмотра проектов',
				redirect: `/login?returnTo=${encodeURIComponent(returnTo)}`
			});
		}

		// Get user ID for filtering projects
		const userId = user?.id;
		if (!userId) {
			throw error(400, {
				message: 'Не удалось получить идентификатор пользователя'
			});
		}

		// Create projects API client with fetch function
		const projectsApi = createProjectsApi(fetch);

		// Log API configuration for debugging
		console.log('🔧 Projects API Configuration:', {
			timestamp: new Date().toISOString(),
			user: user?.name || user?.email || 'Unknown',
			userId: userId,
			userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server'
		});

		// Import API config to log actual URLs and test connections
		import('$lib/config/api.js').then(({ API_BASE_URL, AUTH_API_URL }) => {
			console.log('🌐 API URLs:', {
				graphqlEndpoint: `${API_BASE_URL}/graphql`,
				authEndpoint: `${AUTH_API_URL}/api`,
				timestamp: new Date().toISOString()
			});
		});

		// Test API connectivity
		import('$lib/utils/api-test.js').then(({ testAllConnections }) => {
			testAllConnections();
		});

		try {
			// Add timeout to prevent hanging requests
			const timeoutPromise = new Promise((_, reject) => {
				setTimeout(() => reject(new Error('Request timeout')), 30000); // 30 seconds
			});

			// Load projects data for current user with timeout
			const projectsData = await Promise.race([projectsApi.getByAgent(userId), timeoutPromise]);

			// Validate data structure - getByAgent returns array directly
			if (!Array.isArray(projectsData)) {
				throw new Error('Invalid data format received from API');
			}

			const projects = projectsData;

			// Calculate statistics with error handling
			const stats = calculateProjectStats(projects);

			// Create pagination info for user's projects
			const pagination = {
				currentPage: 1,
				lastPage: 1,
				total: projects.length,
				perPage: projects.length,
				hasMorePages: false
			};

			const loadTime = Date.now() - startTime;
			console.log(`Projects data loaded successfully in ${loadTime}ms`);

			return {
				projects,
				stats,
				pagination,
				error: null,
				errorType: null,
				canRetry: false,
				isLoading: false,
				loadTime
			};
		} catch (apiError) {
			const errorType = categorizeError(apiError);
			const userMessage = getUserFriendlyErrorMessage(errorType, apiError.message);

			// Check for CORS issues
			if (apiError.message?.includes('CORS') || apiError.message?.includes('Access-Control')) {
				console.error('🚨 CORS Issue Detected:', {
					error: apiError.message,
					solution:
						'Server needs to set Access-Control-Allow-Origin to specific origin instead of *',
					temporaryFix: 'credentials temporarily set to omit',
					timestamp: new Date().toISOString()
				});
			}

			console.error('Failed to load projects data:', {
				error: apiError.message,
				type: errorType,
				stack: apiError.stack,
				loadTime: Date.now() - startTime
			});

			// Return error state with detailed information for graceful error handling
			const fallbackData = createProjectsFallbackData();
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
		// Handle authentication errors
		if (err.status === 401) {
			throw err;
		}

		// Handle other client errors
		const errorType = categorizeError(err);
		console.error('Client load error for projects page:', {
			error: err.message,
			type: errorType,
			stack: err.stack,
			loadTime: Date.now() - startTime
		});

		// For critical client errors, throw to show error page
		if (errorType === ERROR_TYPES.AUTH) {
			throw error(401, {
				message: 'Ошибка авторизации. Пожалуйста, войдите в систему заново.',
				redirect: '/login?returnTo=/projects'
			});
		}

		throw error(500, {
			message: 'Внутренняя ошибка при загрузке страницы проектов',
			errorType,
			canRetry: true
		});
	}
}
