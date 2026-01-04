/**
 * API client for finances management
 * Integrates with GraphQL API for agent bonuses and payments
 * Requirements: 9.1, 9.2, 9.3
 */

import { createApiClients } from '$lib/utils/http-client.js';

/**
 * GraphQL queries for finances
 */
const FINANCES_QUERIES = {
	/**
	 * Get agent bonuses with filters
	 */
	GET_AGENT_BONUSES: `
		query GetAgentBonuses($filters: AgentBonusFilters) {
			agentBonuses(filters: $filters) {
				id
				agent_id
				contract_id
				order_id
				commission_amount
				status {
					id
					code
					name
				}
				contract {
					id
					contract_number
				}
				order {
					id
					order_number
				}
				accrued_at
				available_at
				paid_at
				source_type
				source_amount
				project_name
				is_contract_completed
				is_partner_paid
				created_at
				updated_at
			}
		}
	`,

	/**
	 * Get agent bonus statistics
	 */
	GET_AGENT_BONUS_STATS: `
		query GetAgentBonusStats($filters: AgentBonusFilters) {
			agentBonusStats(filters: $filters) {
				total_pending
				total_available
				total_paid
			}
		}
	`,

	/**
	 * Get agent payments with filters
	 */
	GET_AGENT_PAYMENTS: `
		query GetAgentPayments($filters: AgentPaymentFilters) {
			agentPayments(filters: $filters) {
				id
				agent_id
				total_amount
				payment_date
				reference_number
				status {
					id
					code
					name
				}
				method {
					id
					code
					name
				}
				bonuses {
					id
					commission_amount
					source_type
					project_name
				}
				created_at
				updated_at
			}
		}
	`,


	/**
	 * Get bonus statuses
	 */
	GET_BONUS_STATUSES: `
		query GetBonusStatuses {
			bonusStatuses {
				id
				code
				name
				description
			}
		}
	`,

	/**
	 * Get payment statuses
	 */
	GET_PAYMENT_STATUSES: `
		query GetPaymentStatuses {
			paymentStatuses {
				id
				code
				name
				description
			}
		}
	`,

	/**
	 * Get payment methods
	 */
	GET_PAYMENT_METHODS: `
		query GetPaymentMethods {
			paymentMethods {
				id
				code
				name
				description
			}
		}
	`,

	/**
	 * Get referral bonus statistics
	 */
	GET_REFERRAL_BONUS_STATS: `
		query GetReferralBonusStats {
			referralBonusStats {
				total_pending
				total_available
				total_paid
				total
				referrals {
					user_id
					name
					email
					registered_at
					is_active
					total_bonus
				}
			}
		}
	`
};

/**
 * Finances API client class
 */
export class FinancesApi {
	constructor(apiClients) {
		this.apiClients = apiClients;
	}

	/**
	 * Get agent bonuses with optional filters
	 * @param {Object} filters - Query filters
	 * @returns {Promise<Array>} List of bonuses
	 */
	async getBonuses(filters = {}) {
		try {
			const response = await this.apiClients.data.graphql(FINANCES_QUERIES.GET_AGENT_BONUSES, {
				filters: Object.keys(filters).length > 0 ? filters : null
			});

			if (response.errors) {
				throw new Error(response.errors[0]?.message || 'GraphQL query failed');
			}

			return response.data?.agentBonuses || [];
		} catch (error) {
			console.error('Failed to fetch bonuses:', error);
			throw new Error(`Failed to fetch bonuses: ${error.message}`);
		}
	}

	/**
	 * Get agent bonus statistics
	 * @param {Object} filters - Query filters
	 * @returns {Promise<Object>} Bonus statistics
	 */
	async getBonusStats(filters = {}) {
		try {
			const response = await this.apiClients.data.graphql(FINANCES_QUERIES.GET_AGENT_BONUS_STATS, {
				filters: Object.keys(filters).length > 0 ? filters : null
			});

			if (response.errors) {
				throw new Error(response.errors[0]?.message || 'GraphQL query failed');
			}

			return response.data?.agentBonusStats || {
				total_pending: 0,
				total_available: 0,
				total_paid: 0
			};
		} catch (error) {
			console.error('Failed to fetch bonus stats:', error);
			throw new Error(`Failed to fetch bonus stats: ${error.message}`);
		}
	}


	/**
	 * Get agent payments with optional filters
	 * @param {Object} filters - Query filters
	 * @returns {Promise<Array>} List of payments
	 */
	async getPayments(filters = {}) {
		try {
			const response = await this.apiClients.data.graphql(FINANCES_QUERIES.GET_AGENT_PAYMENTS, {
				filters: Object.keys(filters).length > 0 ? filters : null
			});

			if (response.errors) {
				throw new Error(response.errors[0]?.message || 'GraphQL query failed');
			}

			return response.data?.agentPayments || [];
		} catch (error) {
			console.error('Failed to fetch payments:', error);
			throw new Error(`Failed to fetch payments: ${error.message}`);
		}
	}

	/**
	 * Get bonus statuses
	 * @returns {Promise<Array>} List of bonus statuses
	 */
	async getBonusStatuses() {
		try {
			const response = await this.apiClients.data.graphql(FINANCES_QUERIES.GET_BONUS_STATUSES);

			if (response.errors) {
				throw new Error(response.errors[0]?.message || 'GraphQL query failed');
			}

			return response.data?.bonusStatuses || [];
		} catch (error) {
			console.error('Failed to fetch bonus statuses:', error);
			throw new Error(`Failed to fetch bonus statuses: ${error.message}`);
		}
	}

	/**
	 * Get payment statuses
	 * @returns {Promise<Array>} List of payment statuses
	 */
	async getPaymentStatuses() {
		try {
			const response = await this.apiClients.data.graphql(FINANCES_QUERIES.GET_PAYMENT_STATUSES);

			if (response.errors) {
				throw new Error(response.errors[0]?.message || 'GraphQL query failed');
			}

			return response.data?.paymentStatuses || [];
		} catch (error) {
			console.error('Failed to fetch payment statuses:', error);
			throw new Error(`Failed to fetch payment statuses: ${error.message}`);
		}
	}

	/**
	 * Get payment methods
	 * @returns {Promise<Array>} List of payment methods
	 */
	async getPaymentMethods() {
		try {
			const response = await this.apiClients.data.graphql(FINANCES_QUERIES.GET_PAYMENT_METHODS);

			if (response.errors) {
				throw new Error(response.errors[0]?.message || 'GraphQL query failed');
			}

			return response.data?.paymentMethods || [];
		} catch (error) {
			console.error('Failed to fetch payment methods:', error);
			throw new Error(`Failed to fetch payment methods: ${error.message}`);
		}
	}

	/**
	 * Get referral bonus statistics
	 * @returns {Promise<Object>} Referral bonus statistics with referrals list
	 */
	async getReferralBonusStats() {
		try {
			const response = await this.apiClients.data.graphql(FINANCES_QUERIES.GET_REFERRAL_BONUS_STATS);

			if (response.errors) {
				throw new Error(response.errors[0]?.message || 'GraphQL query failed');
			}

			return response.data?.referralBonusStats || {
				total_pending: 0,
				total_available: 0,
				total_paid: 0,
				total: 0,
				referrals: []
			};
		} catch (error) {
			console.error('Failed to fetch referral bonus stats:', error);
			throw new Error(`Failed to fetch referral bonus stats: ${error.message}`);
		}
	}
}

/**
 * Create finances API client with SvelteKit fetch function
 * @param {typeof fetch} fetch - SvelteKit fetch function
 * @returns {FinancesApi} Configured finances API client
 */
export function createFinancesApi(fetch) {
	const apiClients = createApiClients(fetch);
	return new FinancesApi(apiClients);
}

/**
 * Default finances API client for client-side usage
 */
export const financesApi = new FinancesApi(createApiClients(globalThis.fetch));
