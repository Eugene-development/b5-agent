/**
 * Server-side load function for dashboard page with SSR
 * Data is rendered on the server using JWT token from httpOnly cookies
 */

import { makeServerGraphQLRequest, categorizeError, getUserFriendlyErrorMessage } from '$lib/api/server.js';

/**
 * GraphQL query to fetch projects by agent
 */
const PROJECTS_BY_AGENT_QUERY = `
	query GetProjectsByAgent($user_id: ID!) {
		projectsByAgent(user_id: $user_id) {
			id
			value
			is_active
			contract_amount
			totalAgentBonus
			totalCuratorBonus
			created_at
			updated_at
		}
	}
`;

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
		// Check for active projects
		if (project?.is_active === true || project?.is_active === 1 || project?.is_active === '1') {
			stats.activeProjects++;
		} else {
			stats.completedProjects++;
		}

		// Sum up total payouts (agent bonuses)
		const agentBonus = Number(project?.totalAgentBonus) || 0;
		if (agentBonus > 0) {
			stats.totalPayouts += agentBonus;
		}
	}

	return stats;
}

/**
 * Load dashboard statistics from GraphQL API
 */
async function loadDashboardStats(token, userId, fetch) {
	const startTime = Date.now();

	try {
		console.log('📊 Dashboard SSR: Starting data load for user:', userId);

		// Load projects
		const projectsData = await makeServerGraphQLRequest(
			token, 
			PROJECTS_BY_AGENT_QUERY, 
			{ user_id: String(userId) }, 
			fetch
		);

		const projects = projectsData?.projectsByAgent || [];

		// Calculate stats
		const stats = calculateProjectStats(projects);

		const loadTime = Date.now() - startTime;
		console.log(`✅ Dashboard SSR: Loaded stats in ${loadTime}ms`, stats);

		return {
			...stats,
			error: null,
			errorType: null,
			canRetry: false
		};
	} catch (error) {
		const errorType = categorizeError(error);
		const userMessage = getUserFriendlyErrorMessage(errorType, error.message);

		console.error('❌ Dashboard SSR: Failed to load stats:', {
			error: error.message,
			type: errorType,
			loadTime: Date.now() - startTime
		});

		return {
			activeProjects: 0,
			completedProjects: 0,
			totalPayouts: 0,
			error: userMessage,
			errorType,
			canRetry: errorType !== 'auth'
		};
	}
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, fetch, depends }) {
	// Mark this load function as dependent on 'dashboard' invalidation
	depends('dashboard');

	try {
		console.log('🚀 Dashboard SSR: Starting server-side load', {
			hasLocals: !!locals,
			hasUser: !!locals?.user,
			hasToken: !!locals?.token
		});

		// Check if user is authenticated via httpOnly cookie
		if (!locals?.user || !locals?.token) {
			console.log('⚠️ Dashboard SSR: No authentication token found in httpOnly cookie');
			return {
				user: null,
				isAuthenticated: false,
				stats: {
					activeProjects: 0,
					completedProjects: 0,
					totalPayouts: 0,
					error: null,
					errorType: null,
					canRetry: false
				},
				needsClientLoad: true
			};
		}

		console.log('👤 Dashboard SSR: Loading stats for user:', locals.user.email);

		// Load stats with streaming support
		return {
			user: locals.user,
			isAuthenticated: true,
			stats: loadDashboardStats(locals.token, locals.user.id, fetch)
		};
	} catch (err) {
		console.error('❌ Dashboard SSR: Server load error:', {
			error: err.message,
			stack: err.stack
		});

		return {
			user: locals.user || null,
			isAuthenticated: !!locals?.user,
			stats: {
				activeProjects: 0,
				completedProjects: 0,
				totalPayouts: 0,
				error: 'Внутренняя ошибка при загрузке статистики',
				errorType: 'unknown',
				canRetry: true
			}
		};
	}
}
