/**
 * Server-side data loading for dashboard page
 * Fetches user data and statistics on the server
 * Requirements: Server-side data fetching, user data management
 */

import { createApiClients } from '$lib/utils/http-client.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, parent }) {
	try {
		// Get authentication data from parent layout
		const { user, isAuthenticated } = await parent();

		if (!isAuthenticated || !user) {
			// Should not happen due to protected layout, but safety check
			return {
				user: null,
				stats: {
					activeProjects: 0,
					completedProjects: 0,
					totalPayouts: 0
				},
				error: 'Authentication required'
			};
		}

		// Create API clients with SvelteKit fetch
		const { auth } = createApiClients(fetch);

		// Fetch additional user data and statistics
		let stats = {
			activeProjects: 12,
			completedProjects: 0,
			totalPayouts: 0
		};

		try {
			// You can extend this to fetch real statistics from your API
			// For now, we'll use placeholder data
			// const statsResponse = await auth.get('/api/user/stats');
			// stats = statsResponse.data || stats;
		} catch (error) {
			console.log('Could not fetch user statistics:', error.message);
			// Continue with default stats
		}

		return {
			user,
			stats,
			isAuthenticated: true
		};
	} catch (error) {
		console.error('Dashboard server load error:', error);
		return {
			user: null,
			stats: {
				activeProjects: 0,
				completedProjects: 0,
				totalPayouts: 0
			},
			error: 'Failed to load dashboard data'
		};
	}
}
