/**
 * Server-side load function for agents page
 * Handles authentication checks and data loading on the server
 * Requirements: 3.1, 3.2, 5.3, 7.2
 */

import { error, redirect } from '@sveltejs/kit';
import { createAgentsApi } from '$lib/api/agents.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, locals, parent }) {
	try {
		// Get authentication data from parent layout
		const { user, isAuthenticated } = await parent();

		// Check authentication - redirect if not authenticated
		if (!isAuthenticated || !user) {
			throw redirect(302, '/login?returnTo=/agents');
		}

		// Create agents API client with server-side fetch
		const agentsApi = createAgentsApi(fetch);

		try {
			// Load agents data on the server
			const agents = await agentsApi.getAllWithProjects();

			// Calculate statistics
			const stats = {
				total: agents.length,
				active: agents.filter(agent => agent.status === 'ACTIVE').length,
				inactive: agents.filter(agent => agent.status !== 'ACTIVE').length
			};

			return {
				agents,
				stats,
				error: null
			};
		} catch (apiError) {
			console.error('Failed to load agents data:', apiError);
			
			// Return error state instead of throwing to allow graceful error handling
			return {
				agents: [],
				stats: { total: 0, active: 0, inactive: 0 },
				error: `Не удалось загрузить данные агентов: ${apiError.message}`
			};
		}
	} catch (err) {
		// Handle authentication redirects
		if (err.status === 302) {
			throw err;
		}

		console.error('Server load error for agents page:', err);
		throw error(500, 'Внутренняя ошибка сервера');
	}
}