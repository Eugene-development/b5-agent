/**
 * Client-side load function for statistics page
 * Handles data loading and statistics calculation on the client side
 */

import { error } from '@sveltejs/kit';
import { createProjectsApi } from '$lib/api/projects.js';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, parent }) {
	const startTime = Date.now();

	try {
		// Get authentication data from parent layout
		const { user, isAuthenticated } = await parent();

		// Check authentication
		if (!isAuthenticated || !user) {
			throw error(401, {
				message: 'Необходима авторизация для просмотра статистики'
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

		try {
			// Fetch projects for current user
			const userProjects = await projectsApi.getByAgent(userId);

			// Calculate total projects count
			const totalProjects = Array.isArray(userProjects) ? userProjects.length : 0;

			return {
				user,
				totalProjects,
				isAuthenticated: true,
				error: null
			};
		} catch (apiError) {
			console.error('❌ Statistics: Failed to load projects:', {
				error: apiError.message,
				stack: apiError.stack
			});

			// Return error state with default stats
			return {
				user,
				totalProjects: 0,
				isAuthenticated: true,
				error: 'Не удалось загрузить статистику проектов'
			};
		}
	} catch (err) {
		// Handle authentication errors
		if (err.status === 401) {
			throw err;
		}

		console.error('❌ Statistics: Client load error:', {
			error: err.message,
			stack: err.stack
		});

		throw error(500, {
			message: 'Внутренняя ошибка при загрузке статистики'
		});
	}
}
