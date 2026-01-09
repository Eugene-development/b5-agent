<script>
	/**
	 * Таблица бонусов агента
	 * Отображает как агентские бонусы (за собственные сделки),
	 * так и реферальные бонусы (за сделки рефералов)
	 * Requirements: 7.2, 7.5, 7.6
	 */

	/** @type {{ bonuses: Array<any> }} */
	let { bonuses } = $props();

	// Pagination
	const itemsPerPage = 10;
	let currentPage = $state(1);

	// Computed: total pages
	let totalPages = $derived(Math.ceil(bonuses.length / itemsPerPage));

	// Computed: paginated bonuses
	let paginatedBonuses = $derived(() => {
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		return bonuses.slice(start, end);
	});

	// Reset page when bonuses change
	$effect(() => {
		bonuses;
		currentPage = 1;
	});

	function goToPage(page) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}

	/**
	 * Форматирование суммы в рублях
	 */
	function formatCurrency(amount) {
		return new Intl.NumberFormat('ru-RU', {
			style: 'decimal',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount || 0);
	}

	/**
	 * Форматирование даты
	 */
	function formatDate(dateString) {
		if (!dateString) return '—';
		return new Date(dateString).toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	}

	/**
	 * Получить цвет статуса
	 */
	function getStatusColor(statusCode) {
		switch (statusCode) {
			case 'pending':
				return 'bg-amber-500/10 text-amber-500';
			case 'paid':
				return 'bg-cyan-500/10 text-cyan-500';
			default:
				return 'bg-gray-500/10 text-gray-500';
		}
	}

	/**
	 * Получить название источника
	 */
	function getSourceName(bonus) {
		return bonus.source_type === 'contract' ? 'Договор' : 'Заказ';
	}

	/**
	 * Получить номер договора или заказа
	 */
	function getSourceNumber(bonus) {
		if (bonus.source_type === 'contract' && bonus.contract) {
			return bonus.contract.contract_number || '—';
		} else if (bonus.source_type === 'order' && bonus.order) {
			return bonus.order.order_number || '—';
		}
		return '—';
	}

	/**
	 * Проверить является ли бонус реферальным
	 */
	function isReferralBonus(bonus) {
		return bonus.bonus_type === 'referral';
	}

	/**
	 * Получить имя реферала для реферального бонуса
	 */
	function getReferralName(bonus) {
		if (!isReferralBonus(bonus)) return null;
		return bonus.referralUser?.name || 'Реферал';
	}

	/**
	 * Проверить доступность бонуса к выплате
	 */
	function isBonusAvailable(bonus) {
		if (bonus.paid_at) {
			return false;
		}
		
		if (bonus.source_type === 'contract') {
			return bonus.is_contract_completed === true && bonus.is_partner_paid === true;
		}
		
		const hasAvailableAt = bonus.available_at !== null && bonus.available_at !== undefined && bonus.available_at !== '';
		return hasAvailableAt;
	}
</script>

<div class="overflow-x-auto">
	<table class="min-w-full divide-y divide-gray-700">
		<thead class="bg-gray-800">
			<tr>
				<th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Тип</th>
				<th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Источник</th>
				<th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Номер</th>
				<th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Проект</th>
				<th class="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Сумма/Бонус</th>
				<th class="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Доступно</th>
				<th class="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Выплачено</th>
			</tr>
		</thead>
		<tbody class="bg-gray-900 divide-y divide-gray-800">
			{#if bonuses.length === 0}
				<tr>
					<td colspan="7" class="px-4 py-8 text-center text-gray-500">
						Нет данных о бонусах
					</td>
				</tr>
			{:else}
				{#each paginatedBonuses() as bonus}
					<tr class="hover:bg-gray-800/50 transition-colors">
						<td class="px-4 py-3 whitespace-nowrap">
							{#if isReferralBonus(bonus)}
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400" title="Бонус за сделку реферала">
									Реферал
								</span>
							{:else}
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400">
									Личный
								</span>
							{/if}
						</td>
						<td class="px-4 py-3 whitespace-nowrap">
							<div class="flex flex-col gap-0.5">
								<span class="text-xs font-medium {bonus.source_type === 'contract' ? 'text-indigo-400' : 'text-emerald-400'}">
									{getSourceName(bonus)}
								</span>
								{#if isReferralBonus(bonus)}
									<span class="text-xs text-gray-500" title="Сделка реферала">
										от {getReferralName(bonus)}
									</span>
								{/if}
							</div>
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
							{getSourceNumber(bonus)}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
							{bonus.project_name || '—'}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-300">
							{formatCurrency(bonus.source_amount)} / <span class="text-green-400 font-medium">{formatCurrency(bonus.commission_amount)}</span>
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-400">
							{formatDate(bonus.available_at)}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-400 text-center">
							{formatDate(bonus.paid_at)}
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>

<!-- Pagination -->
{#if totalPages > 1}
	<div class="flex items-center justify-between border-t border-gray-700 bg-gray-800/50 px-4 py-3">
		<div class="text-sm text-gray-400">
			Показано {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, bonuses.length)} из {bonuses.length}
		</div>
		<div class="flex gap-1">
			<button
				type="button"
				onclick={() => goToPage(currentPage - 1)}
				disabled={currentPage === 1}
				class="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				←
			</button>
			{#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
				{#if page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)}
					<button
						type="button"
						onclick={() => goToPage(page)}
						class="px-3 py-1.5 text-sm font-medium rounded-md border {page === currentPage ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400' : 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'}"
					>
						{page}
					</button>
				{:else if page === currentPage - 2 || page === currentPage + 2}
					<span class="px-2 py-1.5 text-gray-500">...</span>
				{/if}
			{/each}
			<button
				type="button"
				onclick={() => goToPage(currentPage + 1)}
				disabled={currentPage === totalPages}
				class="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				→
			</button>
		</div>
	</div>
{/if}
