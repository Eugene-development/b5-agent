/**
 * Client-side load function for projects page
 * Handles data loading and statistics calculation on the client side
 * Requirements: 2.2, 3.2, 5.2, 6.1, 7.2, 7.3
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
 */
function categorizeError(err) {
	const message = err.message?.toLowerCase() || '';

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
 * Safely calculate project statistics
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
		if (project?.is_active === true) {
			stats.active++;
		} else {
			stats.inactive++;
		}

		const contractAmount = Number(project?.contract_amount) || 0;
		if (contractAmount > 0) {
			stats.totalContractAmount += contractAmount;
		}
	}

	if (stats.total > 0) {
		stats.averageContractAmount = stats.totalContractAmount / stats.total;
	}

	return stats;
}

/**
 * Load projects data asynchronously for streaming
 * @param {Object} projectsApi - Projects API client
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Projects data object
 */
async function loadProjectsData(projectsApi, userId) {
	try {
		console.log('📊 Projects: Loading projects data for user:', userId);

		// Add timeout to prevent hanging requests
		const timeoutPromise = new Promise((_, reject) => {
			setTimeout(() => reject(new Error('Request timeout')), 30000);
		});

		// Load projects data and statuses in parallel with timeout
		const [projectsData, statusesData] = await Promise.race([
			Promise.all([projectsApi.getByAgent(userId), projectsApi.getStatuses()]),
			timeoutPromise
		]);

		// Validate data structure
		if (!Array.isArray(projectsData)) {
			throw new Error('Invalid data format received from API');
		}

		console.log(`✅ Projects: Loaded ${projectsData.length} projects`);

		// Sort projects by created_at descending (newest first)
		const sortedProjectsData = [...projectsData].sort((a, b) => {
			const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
			const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
			return dateB - dateA;
		});

		// Add sequential number to each project
		const projects = sortedProjectsData.map((project, index) => ({
			...project,
			sequentialNumber: index + 1
		}));

		// Calculate statistics
		const stats = calculateProjectStats(projects);

		// Create pagination info
		const pagination = {
			currentPage: 1,
			lastPage: 1,
			total: projects.length,
			perPage: projects.length,
			hasMorePages: false
		};

		// Filter only active statuses
		const activeStatuses = Array.isArray(statusesData)
			? statusesData.filter((status) => status.is_active)
			: [];

		return {
			projects,
			stats,
			pagination,
			statuses: activeStatuses,
			error: null,
			errorType: null,
			canRetry: false,
			isLoading: false
		};
	} catch (apiError) {
		const errorType = categorizeError(apiError);
		const userMessage = getUserFriendlyErrorMessage(errorType, apiError.message);

		console.error('❌ Projects: Failed to load projects data:', {
			error: apiError.message,
			type: errorType,
			stack: apiError.stack
		});

		// Return error state
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
			statuses: [],
			error: userMessage,
			errorType,
			canRetry: errorType !== ERROR_TYPES.AUTH,
			isLoading: false
		};
	}
}

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, depends }) {
	// Mark this load function as dependent on 'projects' invalidation
	depends('projects');

	try {
		console.log('📄 Projects: Client-side page load started');

		// Import authState dynamically to get user data
		const { authState } = await import('$lib/auth/auth.svelte.js');

		// Get user from authState (it should be initialized by the layout)
		const user = authState.user;

		// If no user yet, return empty data - the layout will redirect
		if (!user) {
			console.log('⚠️ Projects: No user found, returning empty data');
			return {
				projectsData: Promise.resolve({
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
					statuses: [],
					error: null,
					errorType: null,
					canRetry: false,
					isLoading: true
				})
			};
		}

		// Get user ID
		const userId = user?.id;
		if (!userId) {
			throw error(400, {
				message: 'Не удалось получить идентификатор пользователя'
			});
		}

		console.log('👤 Projects: Loading data for user ID:', userId);

		// Create projects API client
		const projectsApi = createProjectsApi(fetch);

		// Return immediately with streamed projects Promise
		// SvelteKit will render the page and stream the data when ready
		return {
			// Don't await - return Promise for streaming!
			projectsData: loadProjectsData(projectsApi, userId)
		};
	} catch (err) {
		console.error('❌ Projects: Client load error:', {
			error: err.message,
			stack: err.stack
		});

		throw error(500, {
			message: 'Внутренняя ошибка при загрузке страницы проектов'
		});
	}
}
