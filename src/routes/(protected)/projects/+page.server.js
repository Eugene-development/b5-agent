/**
 * Server-side load function for projects page with SSR
 * Data is rendered on the server using JWT token from httpOnly cookies
 * Requirements: 2.2, 3.2, 5.2, 6.1
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
			user_id
			client_id
			status_id
			agent {
				id
				name
				email
			}
			client {
				id
				name
				phones {
					id
					value
					is_primary
				}
			}
			status {
				id
				value
				slug
				color
				icon
				is_active
			}
			region
			description
			is_active
			is_incognito
			contract_name
			contract_date
			contract_amount
			agent_percentage
			planned_completion_date
			totalAgentBonus
			totalCuratorBonus
			bonusDetails {
				totalAgentBonus
				totalCuratorBonus
				totalAvailableBonus
				contracts {
					id
					contract_number
					contract_amount
					agent_percentage
					curator_percentage
					agent_bonus
					curator_bonus
					is_active
				}
				orders {
					id
					order_number
					order_amount
					agent_percentage
					curator_percentage
					agent_bonus
					curator_bonus
					is_active
				}
			}
			created_at
			updated_at
		}
	}
`;

/**
 * GraphQL query to fetch project statuses
 */
const PROJECT_STATUSES_QUERY = `
	query GetProjectStatuses {
		projectStatuses {
			id
			value
			slug
			description
			color
			icon
			sort_order
			is_default
			is_active
			created_at
			updated_at
		}
	}
`;

/**
 * Calculate project statistics
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
 * Load projects data from GraphQL API
 */
async function loadProjectsData(token, userId, fetch) {
	const startTime = Date.now();

	try {
		console.log('📊 Projects SSR: Starting data load for user:', userId);

		// Load projects and statuses in parallel
		const [projectsData, statusesData] = await Promise.all([
			makeServerGraphQLRequest(token, PROJECTS_BY_AGENT_QUERY, { user_id: String(userId) }, fetch),
			makeServerGraphQLRequest(token, PROJECT_STATUSES_QUERY, {}, fetch)
		]);

		const rawProjects = projectsData?.projectsByAgent || [];

		// Sort projects by created_at descending (newest first)
		const sortedProjects = [...rawProjects].sort((a, b) => {
			const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
			const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
			return dateB - dateA;
		});

		// Add sequential numbers
		const projects = sortedProjects.map((project, index) => ({
			...project,
			sequentialNumber: index + 1
		}));

		// Calculate stats
		const stats = calculateProjectStats(projects);

		// Filter only active statuses
		const statuses = Array.isArray(statusesData?.projectStatuses)
			? statusesData.projectStatuses.filter((status) => status.is_active)
			: [];

		const loadTime = Date.now() - startTime;
		console.log(`✅ Projects SSR: Loaded ${projects.length} projects in ${loadTime}ms`);

		return {
			projects,
			stats,
			statuses,
			pagination: {
				currentPage: 1,
				lastPage: 1,
				total: projects.length,
				perPage: projects.length,
				hasMorePages: false
			},
			error: null,
			errorType: null,
			canRetry: false,
			isLoading: false
		};
	} catch (error) {
		const errorType = categorizeError(error);
		const userMessage = getUserFriendlyErrorMessage(errorType, error.message);

		console.error('❌ Projects SSR: Failed to load data:', {
			error: error.message,
			type: errorType,
			loadTime: Date.now() - startTime
		});

		return {
			projects: [],
			stats: { total: 0, active: 0, inactive: 0, totalContractAmount: 0, averageContractAmount: 0 },
			statuses: [],
			pagination: {
				currentPage: 1,
				lastPage: 1,
				total: 0,
				perPage: 100,
				hasMorePages: false
			},
			error: userMessage,
			errorType,
			canRetry: errorType !== 'auth',
			isLoading: false
		};
	}
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, fetch, depends }) {
	// Mark this load function as dependent on 'projects' invalidation
	depends('projects');

	try {
		console.log('🚀 Projects SSR: Starting server-side load', {
			hasLocals: !!locals,
			hasUser: !!locals?.user,
			hasToken: !!locals?.token
		});

		// Check if user is authenticated via httpOnly cookie
		if (!locals?.user || !locals?.token) {
			console.log('⚠️ Projects SSR: No authentication token found in httpOnly cookie');
			// Always return Promise for consistency with {#await} in template
			return {
				projectsData: Promise.resolve({
					projects: [],
					stats: { total: 0, active: 0, inactive: 0, totalContractAmount: 0, averageContractAmount: 0 },
					statuses: [],
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
					isLoading: false,
					needsClientLoad: true
				})
			};
		}

		console.log('👤 Projects SSR: Loading data for user:', locals.user.email);

		// Return Promise for streaming - page renders immediately with skeleton
		// Data streams in when ready
		return {
			projectsData: loadProjectsData(locals.token, locals.user.id, fetch)
		};
	} catch (err) {
		console.error('❌ Projects SSR: Server load error:', {
			error: err.message,
			stack: err.stack
		});

		// Always return Promise for consistency with {#await} in template
		return {
			projectsData: Promise.resolve({
				projects: [],
				stats: { total: 0, active: 0, inactive: 0, totalContractAmount: 0, averageContractAmount: 0 },
				statuses: [],
				pagination: {
					currentPage: 1,
					lastPage: 1,
					total: 0,
					perPage: 100,
					hasMorePages: false
				},
				error: 'Внутренняя ошибка при загрузке данных проектов',
				errorType: 'unknown',
				canRetry: true,
				isLoading: false
			})
		};
	}
}
