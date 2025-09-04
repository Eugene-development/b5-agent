/**
 * API client for agents (users) management
 * Integrates with existing HTTP client system and GraphQL API
 * Requirements: 3.1, 7.2
 */

import { createApiClients } from '$lib/utils/http-client.js';

/**
 * GraphQL queries for agents
 */
const AGENTS_QUERIES = {
	/**
	 * Get all agents (users) with basic information
	 */
	GET_ALL_AGENTS: `
		query GetAllAgents {
			users {
				id
				name
				email
				city
				status
				created_at
				updated_at
				email_verified_at
			}
		}
	`,

	/**
	 * Get projects count for each agent
	 */
	GET_AGENTS_WITH_PROJECTS: `
		query GetAgentsWithProjects {
			users {
				id
				name
				email
				city
				status
				created_at
				updated_at
				email_verified_at
			}
		}
	`
};

/**
 * Agents API client class
 * Provides methods for working with agents data
 */
export class AgentsApi {
	constructor(apiClients) {
		this.apiClients = apiClients;
	}

	/**
	 * Get all agents
	 * @returns {Promise<Array>} List of agents
	 * @throws {Error} API error
	 */
	async getAll() {
		try {
			const response = await this.apiClients.data.graphql(
				AGENTS_QUERIES.GET_ALL_AGENTS
			);

			if (response.errors) {
				throw new Error(response.errors[0]?.message || 'GraphQL query failed');
			}

			return response.data?.users || [];
		} catch (error) {
			console.error('Failed to fetch agents:', error);
			throw new Error(`Failed to fetch agents: ${error.message}`);
		}
	}

	/**
	 * Get agents with additional project statistics
	 * Note: This will be enhanced when project counting is needed
	 * @returns {Promise<Array>} List of agents with project counts
	 * @throws {Error} API error
	 */
	async getAllWithProjects() {
		try {
			// For now, get basic agent data
			// TODO: Enhance with project counts when needed
			const agents = await this.getAll();
			
			// Add placeholder project count (will be implemented when needed)
			return agents.map(agent => ({
				...agent,
				projects_count: 0 // Placeholder - will be calculated from projects API
			}));
		} catch (error) {
			console.error('Failed to fetch agents with projects:', error);
			throw new Error(`Failed to fetch agents with projects: ${error.message}`);
		}
	}

	/**
	 * Get active agents only
	 * @returns {Promise<Array>} List of active agents
	 * @throws {Error} API error
	 */
	async getActive() {
		try {
			const agents = await this.getAll();
			return agents.filter(agent => agent.status === 'ACTIVE');
		} catch (error) {
			console.error('Failed to fetch active agents:', error);
			throw new Error(`Failed to fetch active agents: ${error.message}`);
		}
	}

	/**
	 * Search agents by name or email
	 * @param {string} searchTerm - Search term
	 * @returns {Promise<Array>} Filtered list of agents
	 * @throws {Error} API error
	 */
	async search(searchTerm) {
		try {
			const agents = await this.getAll();
			const term = searchTerm.toLowerCase();
			
			return agents.filter(agent => 
				agent.name?.toLowerCase().includes(term) ||
				agent.email?.toLowerCase().includes(term)
			);
		} catch (error) {
			console.error('Failed to search agents:', error);
			throw new Error(`Failed to search agents: ${error.message}`);
		}
	}

	/**
	 * Filter agents by status
	 * @param {string} status - Agent status (ACTIVE, BANNED)
	 * @returns {Promise<Array>} Filtered list of agents
	 * @throws {Error} API error
	 */
	async getByStatus(status) {
		try {
			const agents = await this.getAll();
			return agents.filter(agent => agent.status === status);
		} catch (error) {
			console.error(`Failed to fetch agents by status ${status}:`, error);
			throw new Error(`Failed to fetch agents by status: ${error.message}`);
		}
	}
}

/**
 * Create agents API client with SvelteKit fetch function
 * Use this in server-side load functions
 * @param {typeof fetch} fetch - SvelteKit fetch function
 * @returns {AgentsApi} Configured agents API client
 */
export function createAgentsApi(fetch) {
	const apiClients = createApiClients(fetch);
	return new AgentsApi(apiClients);
}

/**
 * Default agents API client for client-side usage
 * Uses the default HTTP client configuration
 */
export const agentsApi = new AgentsApi(createApiClients(globalThis.fetch));

/**
 * Convenience functions for common operations
 */
export const agents = {
	/**
	 * Get all agents
	 * @param {typeof fetch} [fetchFn] - Optional fetch function for server-side usage
	 * @returns {Promise<Array>} List of agents
	 */
	getAll: (fetchFn) => {
		const api = fetchFn ? createAgentsApi(fetchFn) : agentsApi;
		return api.getAll();
	},

	/**
	 * Get active agents only
	 * @param {typeof fetch} [fetchFn] - Optional fetch function for server-side usage
	 * @returns {Promise<Array>} List of active agents
	 */
	getActive: (fetchFn) => {
		const api = fetchFn ? createAgentsApi(fetchFn) : agentsApi;
		return api.getActive();
	},

	/**
	 * Search agents
	 * @param {string} searchTerm - Search term
	 * @param {typeof fetch} [fetchFn] - Optional fetch function for server-side usage
	 * @returns {Promise<Array>} Filtered list of agents
	 */
	search: (searchTerm, fetchFn) => {
		const api = fetchFn ? createAgentsApi(fetchFn) : agentsApi;
		return api.search(searchTerm);
	},

	/**
	 * Get agents by status
	 * @param {string} status - Agent status
	 * @param {typeof fetch} [fetchFn] - Optional fetch function for server-side usage
	 * @returns {Promise<Array>} Filtered list of agents
	 */
	getByStatus: (status, fetchFn) => {
		const api = fetchFn ? createAgentsApi(fetchFn) : agentsApi;
		return api.getByStatus(status);
	}
};