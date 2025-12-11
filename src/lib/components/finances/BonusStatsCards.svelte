<script>
	/**
	 * Карточки статистики бонусов
	 * Отображает три карточки: Всего начислено, Доступно к выплате, Выплачено
	 * Requirements: 7.1
	 */

	/** @type {{ stats: { total_accrued: number, total_available: number, total_paid: number } }} */
	let { stats } = $props();

	/**
	 * Форматирование суммы в рублях
	 * @param {number} amount
	 */
	function formatCurrency(amount) {
		return new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency: 'RUB',
			minimumFractionDigits: 2
		}).format(amount || 0);
	}
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
	<!-- Всего начислено -->
	<div class="rounded-lg bg-gray-800 p-6 border border-gray-700">
		<div class="flex items-center">
			<div class="flex-shrink-0">
				<div class="rounded-md bg-amber-500/10 p-3">
					<svg class="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
			</div>
			<div class="ml-4">
				<p class="text-sm font-medium text-gray-400">Всего начислено</p>
				<p class="text-2xl font-semibold text-amber-500">{formatCurrency(stats.total_accrued)}</p>
			</div>
		</div>
	</div>

	<!-- Доступно к выплате -->
	<div class="rounded-lg bg-gray-800 p-6 border border-gray-700">
		<div class="flex items-center">
			<div class="flex-shrink-0">
				<div class="rounded-md bg-green-500/10 p-3">
					<svg class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
			</div>
			<div class="ml-4">
				<p class="text-sm font-medium text-gray-400">Доступно к выплате</p>
				<p class="text-2xl font-semibold text-green-500">{formatCurrency(stats.total_available)}</p>
			</div>
		</div>
	</div>

	<!-- Выплачено -->
	<div class="rounded-lg bg-gray-800 p-6 border border-gray-700">
		<div class="flex items-center">
			<div class="flex-shrink-0">
				<div class="rounded-md bg-cyan-500/10 p-3">
					<svg class="h-6 w-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
					</svg>
				</div>
			</div>
			<div class="ml-4">
				<p class="text-sm font-medium text-gray-400">Выплачено</p>
				<p class="text-2xl font-semibold text-cyan-500">{formatCurrency(stats.total_paid)}</p>
			</div>
		</div>
	</div>
</div>
