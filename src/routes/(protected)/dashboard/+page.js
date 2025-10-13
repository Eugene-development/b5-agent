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

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, parent }) {
	const startTime = Date.now();

	try {
		// Get authentication data from parent layout
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

		console.log('🔍 Dashboard: Fetching projects for user:', userId);

		try {
			// Fetch projects for current user
			const userProjects = await projectsApi.getByAgent(userId);

			console.log('📊 Dashboard: Projects fetched:', {
				userId,
				totalProjects: userProjects?.length || 0,
				isArray: Array.isArray(userProjects)
			});

			// Log project details for debugging
			if (Array.isArray(userProjects) && userProjects.length > 0) {
				console.log('📋 Dashboard: Project details:', {
					projects: userProjects.map((p) => ({
						id: p.id,
						value: p.value,
						is_active: p.is_active,
						is_active_type: typeof p.is_active
					}))
				});
			}

			// Calculate statistics
			const stats = calculateProjectStats(userProjects);

			console.log('✅ Dashboard: Stats calculated:', {
				activeProjects: stats.activeProjects,
				completedProjects: stats.completedProjects,
				totalProjects: userProjects?.length || 0,
				loadTime: Date.now() - startTime
			});

			return {
				user,
				stats,
				isAuthenticated: true,
				error: null
			};
		} catch (apiError) {
			console.error('❌ Dashboard: Failed to load projects:', {
				error: apiError.message,
				stack: apiError.stack
			});

			// Return error state with default stats
			return {
				user,
				stats: {
					activeProjects: 0,
					completedProjects: 0,
					totalPayouts: 0
				},
				isAuthenticated: true,
				error: 'Не удалось загрузить статистику проектов'
			};
		}
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
