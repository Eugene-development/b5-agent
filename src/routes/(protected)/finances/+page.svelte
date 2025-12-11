<script>
	/**
	 * Страница "Финансы" - учёт бонусов и выплат агента
	 * Requirements: 7.1, 7.2, 7.3, 10.1, 10.2
	 */

	import BonusStatsCards from '$lib/components/finances/BonusStatsCards.svelte';
	import BonusesTable from '$lib/components/finances/BonusesTable.svelte';
	import PaymentsTable from '$lib/components/finances/PaymentsTable.svelte';
	import BonusFilters from '$lib/components/finances/BonusFilters.svelte';
	import PaymentFilters from '$lib/components/finances/PaymentFilters.svelte';
	import PaymentDetailModal from '$lib/components/finances/PaymentDetailModal.svelte';
	import { createFinancesApi } from '$lib/api/finances.js';

	/** @type {{ data: any }} */
	let { data } = $props();

	// State
	let activeTab = $state('bonuses');
	let bonuses = $state(data.bonuses || []);
	let payments = $state(data.payments || []);
	let stats = $state(data.stats || { total_accrued: 0, total_available: 0, total_paid: 0 });
	let loading = $state(false);
	let selectedPayment = $state(null);

	// Filters
	let bonusFilters = $state({ status_code: null, source_type: null, date_from: null, date_to: null });
	let paymentFilters = $state({ status_code: null, date_from: null, date_to: null });

	/**
	 * Load bonuses with filters
	 */
	async function loadBonuses() {
		loading = true;
		try {
			const api = createFinancesApi(fetch);
			const filters = {};
			if (bonusFilters.status_code) filters.status_code = bonusFilters.status_code;
			if (bonusFilters.source_type) filters.source_type = bonusFilters.source_type;
			if (bonusFilters.date_from) filters.date_from = bonusFilters.date_from;
			if (bonusFilters.date_to) filters.date_to = bonusFilters.date_to;

			const [bonusesData, statsData] = await Promise.all([
				api.getBonuses(filters),
				api.getBonusStats(filters)
			]);

			bonuses = bonusesData;
			stats = statsData;
		} catch (error) {
			console.error('Failed to load bonuses:', error);
		} finally {
			loading = false;
		}
	}


	/**
	 * Load payments with filters
	 */
	async function loadPayments() {
		loading = true;
		try {
			const api = createFinancesApi(fetch);
			const filters = {};
			if (paymentFilters.status_code) filters.status_code = paymentFilters.status_code;
			if (paymentFilters.date_from) filters.date_from = paymentFilters.date_from;
			if (paymentFilters.date_to) filters.date_to = paymentFilters.date_to;

			payments = await api.getPayments(filters);
		} catch (error) {
			console.error('Failed to load payments:', error);
		} finally {
			loading = false;
		}
	}

	function handleBonusFilterChange(key, value) {
		bonusFilters = { ...bonusFilters, [key]: value || null };
		loadBonuses();
	}

	function handlePaymentFilterChange(key, value) {
		paymentFilters = { ...paymentFilters, [key]: value || null };
		loadPayments();
	}

	function clearBonusFilters() {
		bonusFilters = { status_code: null, source_type: null, date_from: null, date_to: null };
		loadBonuses();
	}

	function clearPaymentFilters() {
		paymentFilters = { status_code: null, date_from: null, date_to: null };
		loadPayments();
	}

	function selectPayment(payment) {
		selectedPayment = payment;
	}

	function closePaymentModal() {
		selectedPayment = null;
	}
</script>

<svelte:head>
	<title>Финансы | Bonus5</title>
</svelte:head>

<div class="min-h-screen bg-gray-950 py-8">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-2xl font-bold text-white">Финансы</h1>
			<p class="mt-1 text-sm text-gray-400">Учёт начислений и выплат бонусов</p>
		</div>

		<!-- Stats Cards -->
		<div class="mb-8">
			<BonusStatsCards {stats} />
		</div>

		<!-- Tabs -->
		<div class="mb-6">
			<div class="border-b border-gray-700">
				<nav class="-mb-px flex space-x-8">
					<button
						type="button"
						onclick={() => activeTab = 'bonuses'}
						class="py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'bonuses' ? 'border-cyan-500 text-cyan-500' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}"
					>
						Бонусы
					</button>
					<button
						type="button"
						onclick={() => activeTab = 'payments'}
						class="py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'payments' ? 'border-cyan-500 text-cyan-500' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}"
					>
						Выплаты
					</button>
				</nav>
			</div>
		</div>


		<!-- Content -->
		{#if loading}
			<div class="flex items-center justify-center py-12">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
			</div>
		{:else if data.error}
			<div class="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
				<p class="text-red-400">{data.error}</p>
			</div>
		{:else}
			{#if activeTab === 'bonuses'}
				<!-- Bonuses Tab -->
				<div class="space-y-6">
					<div class="rounded-lg bg-gray-900 p-4 border border-gray-800">
						<BonusFilters
							filters={bonusFilters}
							statuses={data.bonusStatuses}
							onFilterChange={handleBonusFilterChange}
							onClear={clearBonusFilters}
						/>
					</div>
					<div class="rounded-lg bg-gray-900 border border-gray-800 overflow-hidden">
						<BonusesTable {bonuses} />
					</div>
				</div>
			{:else}
				<!-- Payments Tab -->
				<div class="space-y-6">
					<div class="rounded-lg bg-gray-900 p-4 border border-gray-800">
						<PaymentFilters
							filters={paymentFilters}
							statuses={data.paymentStatuses}
							onFilterChange={handlePaymentFilterChange}
							onClear={clearPaymentFilters}
						/>
					</div>
					<div class="rounded-lg bg-gray-900 border border-gray-800 overflow-hidden">
						<PaymentsTable {payments} onSelectPayment={selectPayment} />
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>

<!-- Payment Detail Modal -->
{#if selectedPayment}
	<PaymentDetailModal payment={selectedPayment} onClose={closePaymentModal} />
{/if}
