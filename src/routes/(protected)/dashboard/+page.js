/**
 * Client-side load function for dashboard page
 * Handles data loading and statistics calculation on the client side
 */

import { error } from '@sveltejs/kit';
import { createProjectsApi } from '$lib/api/projects.js';

/**
 * Calculate project statistics from projects array
 * @param {Array} projects - Array of projects
 * @returns {Object} Statistics object
 */
function calculateProjectStats(projects) {
	if (!Array.isArray(projects)) {
		return {
			activeProjects: 0,
			completedProjects: 0,
			totalPayouts: 0
		};
	}

	const stats = {
		activeProjects: 0,
		completedProjects: 0,
		totalPayouts: 0
	};

	for (const project of projects) {
		// Check for active projects (handle different data types)
		if (project?.is_active === true || project?.is_active === 1 || project?.is_active === '1') {
			stats.activeProjects++;
		} else {
			stats.completedProjects++;
		}
	}

	return stats;
}

/**
 * Load statistics asynchronously for streaming
 * @param {Object} projectsApi - Projects API client
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Statistics object
 */
async function loadStats(projectsApi, userId) {
	try {
		const userProjects = await projectsApi.getByAgent(userId);
		const stats = calculateProjectStats(userProjects);
		return {
			...stats,
			error: null
		};
	} catch (apiError) {
		console.error('❌ Dashboard: Failed to load projects:', {
			error: apiError.message,
			stack: apiError.stack
		});

		return {
			activeProjects: 0,
			completedProjects: 0,
			totalPayouts: 0,
			error: 'Не удалось загрузить статистику проектов'
		};
	}
}

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, parent }) {
	try {
		// Get authentication data from parent layout (await this - it's fast)
		const { user, isAuthenticated } = await parent();

		// Check authentication
		if (!isAuthenticated || !user) {
			throw error(401, {
				message: 'Необходима авторизация для просмотра dashboard'
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

		// Return immediately with streamed stats Promise
		// SvelteKit will render the page and stream the stats when ready
		return {
			user,
			isAuthenticated: true,
			// Don't await - return Promise for streaming!
			stats: loadStats(projectsApi, userId)
		};
	} catch (err) {
		// Handle authentication errors
		if (err.status === 401) {
			throw err;
		}

		console.error('❌ Dashboard: Client load error:', {
			error: err.message,
			stack: err.stack
		});

		throw error(500, {
			message: 'Внутренняя ошибка при загрузке dashboard'
		});
	}
}
