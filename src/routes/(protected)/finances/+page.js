/**
 * Load function for finances page
 * Requirements: 10.1, 10.2
 */

import { createFinancesApi } from '$lib/api/finances.js';
import { authState } from '$lib/auth/auth.svelte.js';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	try {
		const api = createFinancesApi(fetch);

		const [bonuses, payments, stats, bonusStatuses, paymentStatuses, paymentMethods] =
			await Promise.all([
				api.getBonuses(),
				api.getPayments(),
				api.getBonusStats(),
				api.getBonusStatuses(),
				api.getPaymentStatuses(),
				api.getPaymentMethods()
			]);

		return {
			bonuses,
			payments,
			stats,
			bonusStatuses,
			paymentStatuses,
			paymentMethods,
			error: null
		};
	} catch (error) {
		console.error('Failed to load finances data:', error);
		return {
			bonuses: [],
			payments: [],
			stats: { total_accrued: 0, total_available: 0, total_paid: 0 },
			bonusStatuses: [],
			paymentStatuses: [],
			paymentMethods: [],
			error: error.message
		};
	}
}
