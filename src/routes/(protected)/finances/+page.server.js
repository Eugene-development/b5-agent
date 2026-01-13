/**
 * Server-side load function for finances page with SSR
 * Data is rendered on the server using JWT token from httpOnly cookies
 * Requirements: 7.1, 7.2, 7.3, 10.1, 10.2
 */

import { makeServerGraphQLRequest, categorizeError, getUserFriendlyErrorMessage } from '$lib/api/server.js';

/**
 * GraphQL query to fetch agent bonuses
 * Updated for unified bonuses model with recipient_type support
 */
const GET_AGENT_BONUSES_QUERY = `
	query GetAgentBonuses($filters: AgentBonusFilters) {
		agentBonuses(filters: $filters) {
			id
			user_id
			agent_id
			contract_id
			order_id
			commission_amount
			percentage
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
			contract_number
			order_number
			is_contract_completed
			is_partner_paid
			recipient_type
			recipient_type_label
			bonus_type
			bonus_type_label
			referral_user_id
			referralUser {
				id
				name
			}
			user {
				id
				name
				email
			}
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
			total_pending
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
 * GraphQL query to fetch agent's bonus payment requests
 */
const GET_MY_BONUS_PAYMENT_REQUESTS_QUERY = `
	query GetMyBonusPaymentRequests($filters: BonusPaymentRequestFilters) {
		myBonusPaymentRequests(filters: $filters) {
			id
			amount
			payment_method
			card_number
			phone_number
			contact_info
			comment
			status {
				id
				code
				name
				color
			}
			payment_date
			created_at
			updated_at
		}
	}
`;

/**
 * GraphQL query to fetch referral bonus statistics
 */
const GET_REFERRAL_BONUS_STATS_QUERY = `
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
`;

/**
 * Load finances data from GraphQL API
 */
async function loadFinancesData(token, fetch, event) {
	const startTime = Date.now();

	console.log('💰 Finances SSR: Starting data load', {
		hasToken: !!token,
		tokenLength: token?.length || 0,
		tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
	});

	// Load all data in parallel
	const [bonusesData, statsData, paymentsData, statusesData, paymentStatusesData, methodsData, referralStatsData, bonusPaymentRequestsData] = await Promise.all([
		makeServerGraphQLRequest(token, GET_AGENT_BONUSES_QUERY, { filters: null }, fetch, event).catch(err => {
			console.error('❌ Finances SSR: agentBonuses query failed:', err.message);
			return { agentBonuses: [] };
		}),
		makeServerGraphQLRequest(token, GET_AGENT_BONUS_STATS_QUERY, { filters: null }, fetch, event).catch(err => {
			console.error('❌ Finances SSR: agentBonusStats query failed:', err.message);
			return { agentBonusStats: null };
		}),
		makeServerGraphQLRequest(token, GET_AGENT_PAYMENTS_QUERY, { filters: null }, fetch, event).catch(err => {
			console.error('❌ Finances SSR: agentPayments query failed:', err.message);
			return { agentPayments: [] };
		}),
		makeServerGraphQLRequest(token, GET_BONUS_STATUSES_QUERY, {}, fetch, event).catch(err => {
			console.error('❌ Finances SSR: bonusStatuses query failed:', err.message);
			return { bonusStatuses: [] };
		}),
		makeServerGraphQLRequest(token, GET_PAYMENT_STATUSES_QUERY, {}, fetch, event).catch(err => {
			console.error('❌ Finances SSR: paymentStatuses query failed:', err.message);
			return { paymentStatuses: [] };
		}),
		makeServerGraphQLRequest(token, GET_PAYMENT_METHODS_QUERY, {}, fetch, event).catch(err => {
			console.error('❌ Finances SSR: paymentMethods query failed:', err.message);
			return { paymentMethods: [] };
		}),
		makeServerGraphQLRequest(token, GET_REFERRAL_BONUS_STATS_QUERY, {}, fetch, event).catch(err => {
			console.error('❌ Finances SSR: referralBonusStats query failed:', err.message);
			return { referralBonusStats: null };
		}),
		makeServerGraphQLRequest(token, GET_MY_BONUS_PAYMENT_REQUESTS_QUERY, { filters: null }, fetch, event).catch(err => {
			console.error('❌ Finances SSR: myBonusPaymentRequests query failed:', err.message);
			return { myBonusPaymentRequests: [] };
		})
	]);

	const bonuses = bonusesData?.agentBonuses || [];
	const stats = statsData?.agentBonusStats || { 
		total_pending: 0,
		total_available: 0,
		total_paid: 0 
	};
	const payments = paymentsData?.agentPayments || [];
	const bonusStatuses = statusesData?.bonusStatuses || [];
	const paymentStatuses = paymentStatusesData?.paymentStatuses || [];
	const paymentMethods = methodsData?.paymentMethods || [];
	const referralStats = referralStatsData?.referralBonusStats || {
		total_pending: 0,
		total_available: 0,
		total_paid: 0,
		total: 0,
		referrals: []
	};
	const bonusPaymentRequests = bonusPaymentRequestsData?.myBonusPaymentRequests || [];

	const loadTime = Date.now() - startTime;
	console.log(`✅ Finances SSR: Loaded data in ${loadTime}ms`, {
		bonuses: bonuses.length,
		payments: payments.length,
		bonusPaymentRequests: bonusPaymentRequests.length,
		stats,
		referralsCount: referralStats.referrals?.length || 0
	});

	return {
		bonuses,
		payments,
		bonusPaymentRequests,
		stats,
		bonusStatuses,
		paymentStatuses,
		paymentMethods,
		referralStats,
		error: null,
		errorType: null,
		canRetry: false,
		_debug: {
			ssrSuccess: true,
			tokenLength: token?.length || 0,
			loadTimeMs: Date.now() - startTime
		}
	};
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, fetch, depends, event }) {
	// Mark this load function as dependent on 'finances' invalidation
	depends('finances');

	try {
		const debugInfo = {
			hasLocals: !!locals,
			hasUser: !!locals?.user,
			hasToken: !!locals?.token,
			userId: locals?.user?.id || null,
			userEmail: locals?.user?.email || null,
			tokenLength: locals?.token?.length || 0
		};

		console.log('🚀 Finances SSR: Starting server-side load', debugInfo);

		// Check if user is authenticated via httpOnly cookie
		if (!locals?.user || !locals?.token) {
			console.log('⚠️ Finances SSR: No authentication token found in httpOnly cookie');
			return {
				financesData: {
					bonuses: [],
					payments: [],
					bonusPaymentRequests: [],
					stats: { total_pending: 0, total_available: 0, total_paid: 0 },
					bonusStatuses: [],
					paymentStatuses: [],
					paymentMethods: [],
					referralStats: { total_pending: 0, total_available: 0, total_paid: 0, total: 0, referrals: [] },
					error: null,
					errorType: null,
					canRetry: false,
					needsClientLoad: true,
					_debug: { ...debugInfo, reason: 'no_token_in_cookie' }
				}
			};
		}

		console.log('👤 Finances SSR: Loading data for user:', locals.user.email);

		// Return Promise for streaming - page renders immediately with skeleton
		// Data streams in when ready
		return {
			financesData: loadFinancesData(locals.token, fetch, event)
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
				bonusPaymentRequests: [],
				stats: { total_pending: 0, total_available: 0, total_paid: 0 },
				bonusStatuses: [],
				paymentStatuses: [],
				paymentMethods: [],
				referralStats: { total_pending: 0, total_available: 0, total_paid: 0, total: 0, referrals: [] },
				error: 'Внутренняя ошибка при загрузке данных финансов',
				errorType: 'unknown',
				canRetry: true
			}
		};
	}
}
