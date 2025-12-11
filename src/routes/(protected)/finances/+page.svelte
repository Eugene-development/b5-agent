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
	import { invalidate } from '$app/navigation';

	/** @type {{ data: any }} */
	let { data } = $props();

	// State
	let activeTab = $state('bonuses');
	let bonuses = $state(data.bonuses || []);
	let payments = $state(data.payments || []);
	let stats = $state(data.stats || { total_accrued: 0, total_available: 0, total_paid: 0 });
	let loading = $state(false);
	let isRefreshing = $state(false);
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

	// Refresh data from server
	async function refreshData() {
		isRefreshing = true;
		try {
			console.log('🔄 Refreshing finances data...');
			// Invalidate the finances page data to trigger reload
			await invalidate('finances');
			console.log('✅ Finances data refreshed');
		} catch (error) {
			console.error('❌ Failed to refresh data:', error);
		} finally {
			isRefreshing = false;
		}
	}
</script>

<svelte:head>
	<title>Финансы | Bonus5</title>
</svelte:head>

<div class="min-h-screen bg-gray-950 py-8">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8 flex items-start justify-between">
			<div>
				<h1 class="text-2xl font-bold text-white">Финансы</h1>
				<p class="mt-1 text-sm text-gray-400">Учёт начислений и выплат бонусов</p>
			</div>
			<button
				type="button"
				onclick={refreshData}
				disabled={isRefreshing}
				class="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
				aria-label="Обновить данные финансов с сервера"
			>
				<div class="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
				<svg
					class="relative z-10 h-4 w-4 {isRefreshing ? 'animate-spin' : ''}"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					{#if isRefreshing}
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					{:else}
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
					{/if}
				</svg>
				<span class="relative z-10">{isRefreshing ? 'Обновляю...' : 'Обновить'}</span>
			</button>
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
