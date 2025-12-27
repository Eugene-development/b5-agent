/**
 * State management for finances page
 * Uses Svelte 5 runes for reactivity
 * Requirements: 7.1, 7.2, 7.3
 */

import { createFinancesApi } from '$lib/api/finances.js';

/**
 * Create finances state with reactive properties
 */
export function createFinancesState() {
	// Reactive state
	let bonuses = $state([]);
	let payments = $state([]);
	let stats = $state({
		total_pending: 0,
		total_paid: 0
	});
	let bonusStatuses = $state([]);
	let paymentStatuses = $state([]);
	let paymentMethods = $state([]);
	let loading = $state(false);
	let error = $state(null);
	let activeTab = $state('bonuses');

	// Filters
	let bonusFilters = $state({
		status_code: null,
		source_type: null,
		date_from: null,
		date_to: null
	});
	let paymentFilters = $state({
		status_code: null,
		date_from: null,
		date_to: null
	});

	// Selected payment for detail modal
	let selectedPayment = $state(null);

	/**
	 * Load all finances data
	 * @param {typeof fetch} fetchFn - Fetch function
	 */
	async function loadAll(fetchFn) {
		loading = true;
		error = null;

		try {
			const api = createFinancesApi(fetchFn);

			const [bonusesData, paymentsData, statsData, statusesData, paymentStatusesData, methodsData] =
				await Promise.all([
					api.getBonuses(getActiveBonusFilters()),
					api.getPayments(getActivePaymentFilters()),
					api.getBonusStats(getActiveBonusFilters()),
					api.getBonusStatuses(),
					api.getPaymentStatuses(),
					api.getPaymentMethods()
				]);

			bonuses = bonusesData;
			payments = paymentsData;
			stats = statsData;
			bonusStatuses = statusesData;
			paymentStatuses = paymentStatusesData;
			paymentMethods = methodsData;
		} catch (err) {
			error = err.message;
			console.error('Failed to load finances data:', err);
		} finally {
			loading = false;
		}
	}


	/**
	 * Load bonuses with current filters
	 * @param {typeof fetch} fetchFn - Fetch function
	 */
	async function loadBonuses(fetchFn) {
		loading = true;
		error = null;

		try {
			const api = createFinancesApi(fetchFn);
			const filters = getActiveBonusFilters();

			const [bonusesData, statsData] = await Promise.all([
				api.getBonuses(filters),
				api.getBonusStats(filters)
			]);

			bonuses = bonusesData;
			stats = statsData;
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	/**
	 * Load payments with current filters
	 * @param {typeof fetch} fetchFn - Fetch function
	 */
	async function loadPayments(fetchFn) {
		loading = true;
		error = null;

		try {
			const api = createFinancesApi(fetchFn);
			payments = await api.getPayments(getActivePaymentFilters());
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	/**
	 * Get active bonus filters (non-null values only)
	 */
	function getActiveBonusFilters() {
		const filters = {};
		if (bonusFilters.status_code) filters.status_code = bonusFilters.status_code;
		if (bonusFilters.source_type) filters.source_type = bonusFilters.source_type;
		if (bonusFilters.date_from) filters.date_from = bonusFilters.date_from;
		if (bonusFilters.date_to) filters.date_to = bonusFilters.date_to;
		return filters;
	}

	/**
	 * Get active payment filters (non-null values only)
	 */
	function getActivePaymentFilters() {
		const filters = {};
		if (paymentFilters.status_code) filters.status_code = paymentFilters.status_code;
		if (paymentFilters.date_from) filters.date_from = paymentFilters.date_from;
		if (paymentFilters.date_to) filters.date_to = paymentFilters.date_to;
		return filters;
	}

	/**
	 * Set bonus filter
	 */
	function setBonusFilter(key, value) {
		bonusFilters = { ...bonusFilters, [key]: value || null };
	}

	/**
	 * Set payment filter
	 */
	function setPaymentFilter(key, value) {
		paymentFilters = { ...paymentFilters, [key]: value || null };
	}

	/**
	 * Clear all bonus filters
	 */
	function clearBonusFilters() {
		bonusFilters = { status_code: null, source_type: null, date_from: null, date_to: null };
	}

	/**
	 * Clear all payment filters
	 */
	function clearPaymentFilters() {
		paymentFilters = { status_code: null, date_from: null, date_to: null };
	}

	return {
		// State getters
		get bonuses() { return bonuses; },
		get payments() { return payments; },
		get stats() { return stats; },
		get bonusStatuses() { return bonusStatuses; },
		get paymentStatuses() { return paymentStatuses; },
		get paymentMethods() { return paymentMethods; },
		get loading() { return loading; },
		get error() { return error; },
		get activeTab() { return activeTab; },
		get bonusFilters() { return bonusFilters; },
		get paymentFilters() { return paymentFilters; },
		get selectedPayment() { return selectedPayment; },

		// State setters
		set activeTab(value) { activeTab = value; },
		set selectedPayment(value) { selectedPayment = value; },

		// Methods
		loadAll,
		loadBonuses,
		loadPayments,
		setBonusFilter,
		setPaymentFilter,
		clearBonusFilters,
		clearPaymentFilters
	};
}
