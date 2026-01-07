/**
 * API client for bonus payment requests
 * Integrates with GraphQL API for creating payout requests
 * Requirements: 7.1 - Agent payout request creation
 */

import { createApiClients } from '$lib/utils/http-client.js';

/**
 * GraphQL mutations for bonus payments
 */
const BONUS_PAYMENT_MUTATIONS = {
	/**
	 * Create bonus payment request
	 */
	CREATE_BONUS_PAYMENT_REQUEST: `
		mutation CreateBonusPaymentRequest($input: CreateBonusPaymentRequestInput!) {
			createBonusPaymentRequest(input: $input) {
				id
				agent_id
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
				created_at
			}
		}
	`,

	/**
	 * Get agent's own payment requests
	 */
	GET_MY_BONUS_PAYMENT_REQUESTS: `
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
	`
};

/**
 * Bonus Payments API client class
 */
export class BonusPaymentsApi {
	constructor(apiClients) {
		this.apiClients = apiClients;
	}

	/**
	 * Create a new bonus payment request
	 * @param {Object} formData - Form data from PayoutRequestModal
	 * @param {number} formData.amount - Payment amount
	 * @param {string} formData.paymentMethod - Payment method (card, sbp, other)
	 * @param {string|null} formData.cardNumber - Card number (for card method)
	 * @param {string|null} formData.phoneNumber - Phone number (for sbp method)
	 * @param {string|null} formData.contactInfo - Contact info (for other method)
	 * @param {string|null} formData.comment - Optional comment
	 * @returns {Promise<Object>} Created payment request
	 */
	async createBonusPaymentRequest(formData) {
		try {
			const input = {
				amount: formData.amount,
				payment_method: formData.paymentMethod,
				card_number: formData.cardNumber || null,
				phone_number: formData.phoneNumber || null,
				contact_info: formData.contactInfo || null,
				comment: formData.comment || null
			};

			const response = await this.apiClients.data.graphql(
				BONUS_PAYMENT_MUTATIONS.CREATE_BONUS_PAYMENT_REQUEST,
				{ input }
			);

			if (response.errors) {
				const errorMessage = response.errors[0]?.message || 'Не удалось создать заявку';
				throw new Error(errorMessage);
			}

			return response.data?.createBonusPaymentRequest;
		} catch (error) {
			console.error('Failed to create bonus payment request:', error);
			throw error;
		}
	}

	/**
	 * Get current agent's payment requests
	 * @param {Object} filters - Optional filters
	 * @returns {Promise<Array>} List of payment requests
	 */
	async getMyBonusPaymentRequests(filters = {}) {
		try {
			const response = await this.apiClients.data.graphql(
				BONUS_PAYMENT_MUTATIONS.GET_MY_BONUS_PAYMENT_REQUESTS,
				{ filters: Object.keys(filters).length > 0 ? filters : null }
			);

			if (response.errors) {
				throw new Error(response.errors[0]?.message || 'Не удалось загрузить заявки');
			}

			return response.data?.myBonusPaymentRequests || [];
		} catch (error) {
			console.error('Failed to fetch bonus payment requests:', error);
			throw error;
		}
	}
}

/**
 * Create bonus payments API client with SvelteKit fetch function
 * @param {typeof fetch} fetch - SvelteKit fetch function
 * @returns {BonusPaymentsApi} Configured bonus payments API client
 */
export function createBonusPaymentsApi(fetch) {
	const apiClients = createApiClients(fetch);
	return new BonusPaymentsApi(apiClients);
}

/**
 * Default bonus payments API client for client-side usage
 */
export const bonusPaymentsApi = new BonusPaymentsApi(createApiClients(globalThis.fetch));
