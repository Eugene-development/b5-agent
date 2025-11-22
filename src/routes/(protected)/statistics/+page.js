/**
 * Client-side load function for statistics page
 * Handles data loading and statistics calculation on the client side
 */

import { error } from '@sveltejs/kit';
import { createProjectsApi } from '$lib/api/projects.js';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	try {
		console.log('📊 Statistics: Client-side page load started');

		// Import authState dynamically to get user data
		const { authState } = await import('$lib/auth/auth.svelte.js');

		// Get user from authState (it should be initialized by the layout)
		const user = authState.user;

		// If no user yet, return empty data - the layout will redirect
		if (!user) {
			console.log('⚠️ Statistics: No user found, returning empty data');
			return {
				user: null,
				totalProjects: 0,
				isAuthenticated: false,
				error: null
			};
		}

		// Get user ID
		const userId = user?.id;
		if (!userId) {
			throw error(400, {
				message: 'Не удалось получить идентификатор пользователя'
			});
		}

		console.log('👤 Statistics: Loading data for user ID:', userId);

		// Create projects API client
		const projectsApi = createProjectsApi(fetch);

		try {
			// Fetch projects for current user
			const userProjects = await projectsApi.getByAgent(userId);

			// Calculate total projects count
			const totalProjects = Array.isArray(userProjects) ? userProjects.length : 0;

			console.log(`✅ Statistics: Loaded ${totalProjects} projects`);

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
		console.error('❌ Statistics: Client load error:', {
			error: err.message,
			stack: err.stack
		});

		throw error(500, {
			message: 'Внутренняя ошибка при загрузке статистики'
		});
	}
}
