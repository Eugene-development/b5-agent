/**
 * API client for projects management
 * Integrates with existing HTTP client system and GraphQL API
 * Requirements: 3.1, 3.2
 */

import { createApiClients } from '$lib/utils/http-client.js';

/**
 * GraphQL queries for projects
 */
const PROJECTS_QUERIES = {
	/**
	 * Get all projects with pagination
	 */
	GET_ALL_PROJECTS: `
		query GetAllProjects($first: Int!, $page: Int) {
			projects(first: $first, page: $page) {
				data {
					id
					value
					user_id
					agent {
						id
						name
						email
					}
					region
					description
					is_active
					contract_name
					contract_date
					contract_amount
					agent_percentage
					planned_completion_date
					created_at
					updated_at
				}
				paginatorInfo {
					currentPage
					lastPage
					total
					perPage
					hasMorePages
				}
			}
		}
	`,

	/**
	 * Get projects by agent ID
	 */
	GET_PROJECTS_BY_AGENT: `
		query GetProjectsByAgent($user_id: ID!) {
			projectsByAgent(user_id: $user_id) {
				id
				value
				user_id
				agent {
					id
					name
					email
				}
				city
				description
				is_active
				contract_name
				contract_date
				contract_amount
				agent_percentage
				planned_completion_date
				created_at
				updated_at
			}
		}
	`,

	/**
	 * Get single project by ID
	 */
	GET_PROJECT_BY_ID: `
		query GetProject($id: ID!) {
			project(id: $id) {
				id
				value
				user_id
				agent {
					id
					name
					email
				}
				city
				description
				is_active
				contract_name
				contract_date
				contract_amount
				agent_percentage
				planned_completion_date
				created_at
				updated_at
			}
		}
	`,

	/**
	 * Get projects by status
	 */
	GET_PROJECTS_BY_STATUS: `
		query GetProjectsByStatus($status: ProjectStatus!, $first: Int!, $page: Int) {
			projectsByStatus(status: $status, first: $first, page: $page) {
				data {
					id
					value
					user_id
					agent {
						id
						name
						email
					}
					region
					description
					is_active
					contract_name
					contract_date
					contract_amount
					agent_percentage
					planned_completion_date
					created_at
					updated_at
				}
				paginatorInfo {
					currentPage
					lastPage
					total
					perPage
					hasMorePages
				}
			}
		}
	`
};

/**
 * Projects API client class
 * Provides methods for working with projects data
 */
export class ProjectsApi {
	constructor(apiClients) {
		this.apiClients = apiClients;
	}

	/**
	 * Get all projects with optional pagination
	 * @param {Object} options - Query options
	 * @param {number} [options.first=50] - Number of items per page
	 * @param {number} [options.page=1] - Page number
	 * @returns {Promise<Object>} Projects data with pagination info
	 * @throws {Error} API error
	 */
	async getAll(options = {}) {
		const { first = 50, page = 1 } = options;

		console.log('📡 Making GraphQL request for projects:', {
			query: 'GET_ALL_PROJECTS',
			variables: { first, page },
			timestamp: new Date().toISOString()
		});

		try {
			const response = await this.apiClients.data.graphql(PROJECTS_QUERIES.GET_ALL_PROJECTS, {
				first,
				page
			});

			console.log('📡 GraphQL response received:', {
				hasData: !!response.data,
				hasErrors: !!response.errors,
				dataKeys: response.data ? Object.keys(response.data) : [],
				errorCount: response.errors ? response.errors.length : 0,
				timestamp: new Date().toISOString()
			});

			if (response.errors) {
				console.error('GraphQL errors:', response.errors);
				throw new Error(response.errors[0]?.message || 'GraphQL query failed');
			}

			const projectsData = response.data?.projects?.data || [];
			const paginatorInfo = response.data?.projects?.paginatorInfo || {
				currentPage: page,
				lastPage: 1,
				total: 0,
				perPage: first,
				hasMorePages: false
			};

			console.log('✅ Projects data processed:', {
				projectCount: projectsData.length,
				totalProjects: paginatorInfo.total,
				currentPage: paginatorInfo.currentPage,
				timestamp: new Date().toISOString()
			});

			return {
				data: projectsData,
				paginatorInfo
			};
		} catch (error) {
			console.error('❌ Failed to fetch projects:', {
				error: error.message,
				stack: error.stack,
				name: error.name,
				status: error.status,
				timestamp: new Date().toISOString()
			});
			throw new Error(`Failed to fetch projects: ${error.message}`);
		}
	}

	/**
	 * Get all projects without pagination (for simple lists)
	 * @returns {Promise<Array>} List of all projects
	 * @throws {Error} API error
	 */
	async getAllSimple() {
		try {
			const result = await this.getAll({ first: 1000, page: 1 });
			return result.data;
		} catch (error) {
			console.error('Failed to fetch all projects:', error);
			throw new Error(`Failed to fetch all projects: ${error.message}`);
		}
	}

	/**
	 * Get projects by agent ID
	 * @param {string|number} agentId - Agent ID
	 * @returns {Promise<Array>} List of projects for the agent
	 * @throws {Error} API error
	 */
	async getByAgent(agentId) {
		if (!agentId) {
			throw new Error('Agent ID is required');
		}

		try {
			const response = await this.apiClients.data.graphql(PROJECTS_QUERIES.GET_PROJECTS_BY_AGENT, {
				user_id: String(agentId)
			});

			if (response.errors) {
				throw new Error(response.errors[0]?.message || 'GraphQL query failed');
			}

			return response.data?.projectsByAgent || [];
		} catch (error) {
			console.error(`Failed to fetch projects for agent ${agentId}:`, error);
			throw new Error(`Failed to fetch projects for agent: ${error.message}`);
		}
	}

	/**
	 * Get single project by ID
	 * @param {string|number} projectId - Project ID
	 * @returns {Promise<Object|null>} Project data or null if not found
	 * @throws {Error} API error
	 */
	async getById(projectId) {
		if (!projectId) {
			throw new Error('Project ID is required');
		}

		try {
			const response = await this.apiClients.data.graphql(PROJECTS_QUERIES.GET_PROJECT_BY_ID, {
				id: String(projectId)
			});

			if (response.errors) {
				throw new Error(response.errors[0]?.message || 'GraphQL query failed');
			}

			return response.data?.project || null;
		} catch (error) {
			console.error(`Failed to fetch project ${projectId}:`, error);
			throw new Error(`Failed to fetch project: ${error.message}`);
		}
	}

	/**
	 * Get active projects only
	 * @param {Object} options - Query options
	 * @param {number} [options.first=50] - Number of items per page
	 * @param {number} [options.page=1] - Page number
	 * @returns {Promise<Array>} List of active projects
	 * @throws {Error} API error
	 */
	async getActive(options = {}) {
		try {
			const result = await this.getAll(options);
			return {
				...result,
				data: result.data.filter((project) => project.is_active)
			};
		} catch (error) {
			console.error('Failed to fetch active projects:', error);
			throw new Error(`Failed to fetch active projects: ${error.message}`);
		}
	}

	/**
	 * Get inactive projects only
	 * @param {Object} options - Query options
	 * @param {number} [options.first=50] - Number of items per page
	 * @param {number} [options.page=1] - Page number
	 * @returns {Promise<Array>} List of inactive projects
	 * @throws {Error} API error
	 */
	async getInactive(options = {}) {
		try {
			const result = await this.getAll(options);
			return {
				...result,
				data: result.data.filter((project) => !project.is_active)
			};
		} catch (error) {
			console.error('Failed to fetch inactive projects:', error);
			throw new Error(`Failed to fetch inactive projects: ${error.message}`);
		}
	}

	/**
	 * Search projects by name or region
	 * @param {string} searchTerm - Search term
	 * @param {Object} options - Query options
	 * @param {number} [options.first=50] - Number of items per page
	 * @param {number} [options.page=1] - Page number
	 * @returns {Promise<Object>} Filtered projects with pagination
	 * @throws {Error} API error
	 */
	async search(searchTerm, options = {}) {
		try {
			const result = await this.getAll(options);
			const term = searchTerm.toLowerCase();

			const filteredData = result.data.filter(
				(project) =>
					project.value?.toLowerCase().includes(term) ||
					project.region?.toLowerCase().includes(term) ||
					project.description?.toLowerCase().includes(term)
			);

			return {
				...result,
				data: filteredData
			};
		} catch (error) {
			console.error('Failed to search projects:', error);
			throw new Error(`Failed to search projects: ${error.message}`);
		}
	}

	/**
	 * Get project statistics
	 * @returns {Promise<Object>} Project statistics
	 * @throws {Error} API error
	 */
	async getStats() {
		try {
			const projects = await this.getAllSimple();

			const stats = {
				total: projects.length,
				active: projects.filter((p) => p.is_active).length,
				inactive: projects.filter((p) => !p.is_active).length,
				totalContractAmount: projects.reduce((sum, p) => sum + (p.contract_amount || 0), 0),
				averageContractAmount: 0
			};

			if (stats.total > 0) {
				stats.averageContractAmount = stats.totalContractAmount / stats.total;
			}

			return stats;
		} catch (error) {
			console.error('Failed to get project statistics:', error);
			throw new Error(`Failed to get project statistics: ${error.message}`);
		}
	}
}

/**
 * Create projects API client with SvelteKit fetch function
 * Use this in server-side load functions
 * @param {typeof fetch} fetch - SvelteKit fetch function
 * @returns {ProjectsApi} Configured projects API client
 */
export function createProjectsApi(fetch) {
	const apiClients = createApiClients(fetch);
	return new ProjectsApi(apiClients);
}

/**
 * Default projects API client for client-side usage
 * Uses the default HTTP client configuration
 */
export const projectsApi = new ProjectsApi(createApiClients(globalThis.fetch));

/**
 * Convenience functions for common operations
 */
export const projects = {
	/**
	 * Get all projects
	 * @param {Object} options - Query options
	 * @param {typeof fetch} [fetchFn] - Optional fetch function for server-side usage
	 * @returns {Promise<Object>} Projects data with pagination
	 */
	getAll: (options = {}, fetchFn) => {
		const api = fetchFn ? createProjectsApi(fetchFn) : projectsApi;
		return api.getAll(options);
	},

	/**
	 * Get all projects as simple array
	 * @param {typeof fetch} [fetchFn] - Optional fetch function for server-side usage
	 * @returns {Promise<Array>} List of all projects
	 */
	getAllSimple: (fetchFn) => {
		const api = fetchFn ? createProjectsApi(fetchFn) : projectsApi;
		return api.getAllSimple();
	},

	/**
	 * Get projects by agent
	 * @param {string|number} agentId - Agent ID
	 * @param {typeof fetch} [fetchFn] - Optional fetch function for server-side usage
	 * @returns {Promise<Array>} List of projects for the agent
	 */
	getByAgent: (agentId, fetchFn) => {
		const api = fetchFn ? createProjectsApi(fetchFn) : projectsApi;
		return api.getByAgent(agentId);
	},

	/**
	 * Get project by ID
	 * @param {string|number} projectId - Project ID
	 * @param {typeof fetch} [fetchFn] - Optional fetch function for server-side usage
	 * @returns {Promise<Object|null>} Project data or null
	 */
	getById: (projectId, fetchFn) => {
		const api = fetchFn ? createProjectsApi(fetchFn) : projectsApi;
		return api.getById(projectId);
	},

	/**
	 * Get active projects
	 * @param {Object} options - Query options
	 * @param {typeof fetch} [fetchFn] - Optional fetch function for server-side usage
	 * @returns {Promise<Object>} Active projects with pagination
	 */
	getActive: (options = {}, fetchFn) => {
		const api = fetchFn ? createProjectsApi(fetchFn) : projectsApi;
		return api.getActive(options);
	},

	/**
	 * Search projects
	 * @param {string} searchTerm - Search term
	 * @param {Object} options - Query options
	 * @param {typeof fetch} [fetchFn] - Optional fetch function for server-side usage
	 * @returns {Promise<Object>} Filtered projects with pagination
	 */
	search: (searchTerm, options = {}, fetchFn) => {
		const api = fetchFn ? createProjectsApi(fetchFn) : projectsApi;
		return api.search(searchTerm, options);
	},

	/**
	 * Get project statistics
	 * @param {typeof fetch} [fetchFn] - Optional fetch function for server-side usage
	 * @returns {Promise<Object>} Project statistics
	 */
	getStats: (fetchFn) => {
		const api = fetchFn ? createProjectsApi(fetchFn) : projectsApi;
		return api.getStats();
	}
};
