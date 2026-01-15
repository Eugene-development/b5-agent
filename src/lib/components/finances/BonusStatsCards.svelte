<script>
	/**
	 * Карточки статистики бонусов
	 * Отображает 5 карточек: Ожидание, Доступно к выплате, В запросе, Выплачено, Всего
	 * Requirements: 7.1
	 */

	/** @type {{ stats: { total_pending: number, total_available: number, total_requested: number, total_paid: number }, onRequestPayment?: () => void }} */
	let { stats, onRequestPayment } = $props();

	/**
	 * Форматирование суммы в рублях
	 * @param {number} amount
	 */
	function formatCurrency(amount) {
		return new Intl.NumberFormat('ru-RU', {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount || 0);
	}

	// Вычисляем общую сумму
	let total = $derived((stats.total_pending || 0) + (stats.total_available || 0) + (stats.total_requested || 0) + (stats.total_paid || 0));
</script>

<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
	<!-- Ожидание -->
	<div class="rounded-lg bg-gray-800 p-4 border border-gray-700">
		<div class="flex items-center">
			<div class="shrink-0">
				<div class="rounded-md bg-amber-500/10 p-2 sm:p-3">
					<svg class="h-4 w-4 sm:h-6 sm:w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
			</div>
			<div class="ml-4">
				<p class="text-sm font-medium text-gray-400">Ожидание</p>
				<p class="text-base sm:text-lg md:text-xl font-semibold text-amber-500">{formatCurrency(stats.total_pending)}</p>
			</div>
		</div>
	</div>

	<!-- Доступно к выплате -->
	<div class="rounded-lg bg-gray-800 p-4 border border-gray-700">
		<div class="flex items-center justify-between">
			<div class="flex items-center">
				<div class="shrink-0">
					<div class="rounded-md bg-green-500/10 p-2 sm:p-3">
						<svg class="h-4 w-4 sm:h-6 sm:w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-400">Доступно</p>
					<p class="text-base sm:text-lg md:text-xl font-semibold text-green-500">{formatCurrency(stats.total_available)}</p>
				</div>
			</div>
			{#if onRequestPayment && (stats.total_available || 0) > 0}
				<button
					type="button"
					onclick={onRequestPayment}
					class="ml-2 rounded-full bg-green-500/20 p-2 text-green-500 hover:bg-green-500/30 transition-colors"
					title="Запросить выплату"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
				</button>
			{/if}
		</div>
	</div>

	<!-- Запрошено -->
	<div class="rounded-lg bg-gray-800 p-4 border border-gray-700">
		<div class="flex items-center">
			<div class="shrink-0">
				<div class="rounded-md bg-blue-500/10 p-2 sm:p-3">
					<svg class="h-4 w-4 sm:h-6 sm:w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
					</svg>
				</div>
			</div>
			<div class="ml-4">
				<p class="text-sm font-medium text-gray-400">Запрошено</p>
				<p class="text-base sm:text-lg md:text-xl font-semibold text-blue-500">{formatCurrency(stats.total_requested || 0)}</p>
			</div>
		</div>
	</div>

	<!-- Выплачено -->
	<div class="rounded-lg bg-gray-800 p-4 border border-gray-700">
		<div class="flex items-center">
			<div class="shrink-0">
				<div class="rounded-md bg-cyan-500/10 p-2 sm:p-3">
					<svg class="h-4 w-4 sm:h-6 sm:w-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
					</svg>
				</div>
			</div>
			<div class="ml-4">
				<p class="text-sm font-medium text-gray-400">Выплачено</p>
				<p class="text-base sm:text-lg md:text-xl font-semibold text-cyan-500">{formatCurrency(stats.total_paid)}</p>
			</div>
		</div>
	</div>

	<!-- Всего -->
	<div class="rounded-lg bg-gray-800 p-4 border border-gray-700">
		<div class="flex items-center">
			<div class="shrink-0">
				<div class="rounded-md bg-purple-500/10 p-2 sm:p-3">
					<svg class="h-4 w-4 sm:h-6 sm:w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
			</div>
			<div class="ml-4">
				<p class="text-sm font-medium text-gray-400">Всего</p>
				<p class="text-base sm:text-lg md:text-xl font-semibold text-purple-500">{formatCurrency(total)}</p>
			</div>
		</div>
	</div>
</div>
