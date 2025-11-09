/**
 * Client-side load function for projects page with streaming
 * Allows instant page navigation with data loading in background
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
 */
async function loadProjectsData(projectsApi, userId) {
	try {
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

		console.error('Failed to load projects data:', {
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
export async function load({ fetch, parent }) {
	try {
		// Get authentication data from parent layout (fast)
		const { user, isAuthenticated } = await parent();

		// Check authentication
		if (!isAuthenticated || !user) {
			throw error(401, {
				message: 'Необходима авторизация для просмотра проектов'
			});
		}

		// Get user ID
		const userId = user?.id;
		if (!userId) {
			throw error(400, {
				message: 'Не удалось получить идентификатор пользователя'
			});
		}

		// Create projects API client
		const projectsApi = createProjectsApi(fetch);

		// Return immediately with streamed Promise
		// Page will render instantly, data will load in background
		return {
			// Don't await - return Promise for streaming!
			projectsData: loadProjectsData(projectsApi, userId)
		};
	} catch (err) {
		// Handle authentication errors
		if (err.status === 401) {
			throw err;
		}

		console.error('Client load error for projects page:', {
			error: err.message,
			stack: err.stack
		});

		throw error(500, {
			message: 'Внутренняя ошибка при загрузке страницы проектов'
		});
	}
}
