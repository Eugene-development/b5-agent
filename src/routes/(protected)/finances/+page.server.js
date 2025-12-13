/**
 * Server-side load function for finances page with SSR
 * Data is rendered on the server using JWT token from httpOnly cookies
 * Requirements: 7.1, 7.2, 7.3, 10.1, 10.2
 */

import { makeServerGraphQLRequest, categorizeError, getUserFriendlyErrorMessage } from '$lib/api/server.js';

/**
 * GraphQL query to fetch agent bonuses
 */
const GET_AGENT_BONUSES_QUERY = `
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
			accrued_at
			available_at
			paid_at
			source_type
			source_amount
			project_name
			created_at
			updated_at
		}
	}
`;

/**
 * GraphQL query to fetch agent bonus statistics
 */
const GET_AGENT_BONUS_STATS_QUERY = `
	query GetAgentBonusStats($filters: AgentBonusFilters) {
		agentBonusStats(filters: $filters) {
			total_accrued
			total_available
			total_paid
		}
	}
`;

/**
 * GraphQL query to fetch agent payments
 */
const GET_AGENT_PAYMENTS_QUERY = `
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
`;

/**
 * GraphQL query to fetch bonus statuses
 */
const GET_BONUS_STATUSES_QUERY = `
	query GetBonusStatuses {
		bonusStatuses {
			id
			code
			name
			description
		}
	}
`;

/**
 * GraphQL query to fetch payment statuses
 */
const GET_PAYMENT_STATUSES_QUERY = `
	query GetPaymentStatuses {
		paymentStatuses {
			id
			code
			name
			description
		}
	}
`;

/**
 * GraphQL query to fetch payment methods
 */
const GET_PAYMENT_METHODS_QUERY = `
	query GetPaymentMethods {
		paymentMethods {
			id
			code
			name
			description
		}
	}
`;

/**
 * Load finances data from GraphQL API
 */
async function loadFinancesData(token, fetch) {
	const startTime = Date.now();

	try {
		console.log('💰 Finances SSR: Starting data load');

		// Load all data in parallel
		const [bonusesData, statsData, paymentsData, statusesData, paymentStatusesData, methodsData] = 
			await Promise.all([
				makeServerGraphQLRequest(token, GET_AGENT_BONUSES_QUERY, { filters: null }, fetch),
				makeServerGraphQLRequest(token, GET_AGENT_BONUS_STATS_QUERY, { filters: null }, fetch),
				makeServerGraphQLRequest(token, GET_AGENT_PAYMENTS_QUERY, { filters: null }, fetch),
				makeServerGraphQLRequest(token, GET_BONUS_STATUSES_QUERY, {}, fetch),
				makeServerGraphQLRequest(token, GET_PAYMENT_STATUSES_QUERY, {}, fetch),
				makeServerGraphQLRequest(token, GET_PAYMENT_METHODS_QUERY, {}, fetch)
			]);

		const bonuses = bonusesData?.agentBonuses || [];
		const stats = statsData?.agentBonusStats || { 
			total_accrued: 0, 
			total_available: 0, 
			total_paid: 0 
		};
		const payments = paymentsData?.agentPayments || [];
		const bonusStatuses = statusesData?.bonusStatuses || [];
		const paymentStatuses = paymentStatusesData?.paymentStatuses || [];
		const paymentMethods = methodsData?.paymentMethods || [];

		const loadTime = Date.now() - startTime;
		console.log(`✅ Finances SSR: Loaded data in ${loadTime}ms`, {
			bonuses: bonuses.length,
			payments: payments.length,
			stats
		});

		return {
			bonuses,
			payments,
			stats,
			bonusStatuses,
			paymentStatuses,
			paymentMethods,
			error: null,
			errorType: null,
			canRetry: false
		};
	} catch (error) {
		const errorType = categorizeError(error);
		const userMessage = getUserFriendlyErrorMessage(errorType, error.message);

		console.error('❌ Finances SSR: Failed to load data:', {
			error: error.message,
			type: errorType,
			loadTime: Date.now() - startTime
		});

		return {
			bonuses: [],
			payments: [],
			stats: { total_accrued: 0, total_available: 0, total_paid: 0 },
			bonusStatuses: [],
			paymentStatuses: [],
			paymentMethods: [],
			error: userMessage,
			errorType,
			canRetry: errorType !== 'auth'
		};
	}
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, fetch, depends }) {
	// Mark this load function as dependent on 'finances' invalidation
	depends('finances');

	try {
		console.log('🚀 Finances SSR: Starting server-side load', {
			hasLocals: !!locals,
			hasUser: !!locals?.user,
			hasToken: !!locals?.token
		});

		// Check if user is authenticated via httpOnly cookie
		if (!locals?.user || !locals?.token) {
			console.log('⚠️ Finances SSR: No authentication token found in httpOnly cookie');
			return {
				financesData: {
					bonuses: [],
					payments: [],
					stats: { total_accrued: 0, total_available: 0, total_paid: 0 },
					bonusStatuses: [],
					paymentStatuses: [],
					paymentMethods: [],
					error: null,
					errorType: null,
					canRetry: false,
					needsClientLoad: true
				}
			};
		}

		console.log('👤 Finances SSR: Loading data for user:', locals.user.email);

		// Return Promise for streaming - page renders immediately with skeleton
		// Data streams in when ready
		return {
			financesData: loadFinancesData(locals.token, fetch)
		};
	} catch (err) {
		console.error('❌ Finances SSR: Server load error:', {
			error: err.message,
			stack: err.stack
		});

		return {
			financesData: {
				bonuses: [],
				payments: [],
				stats: { total_accrued: 0, total_available: 0, total_paid: 0 },
				bonusStatuses: [],
				paymentStatuses: [],
				paymentMethods: [],
				error: 'Внутренняя ошибка при загрузке данных финансов',
				errorType: 'unknown',
				canRetry: true
			}
		};
	}
}
