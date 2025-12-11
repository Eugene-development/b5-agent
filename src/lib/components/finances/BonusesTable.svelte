<script>
	/**
	 * Таблица бонусов агента
	 * Requirements: 7.2, 7.5, 7.6
	 */

	/** @type {{ bonuses: Array<any> }} */
	let { bonuses } = $props();

	/**
	 * Форматирование суммы в рублях
	 */
	function formatCurrency(amount) {
		return new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency: 'RUB',
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
			case 'accrued':
				return 'bg-amber-500/10 text-amber-500';
			case 'available_for_payment':
				return 'bg-green-500/10 text-green-500';
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
		return bonus.source_type === 'contract' ? 'Договор' : 'Закупка';
	}
</script>

<div class="overflow-x-auto">
	<table class="min-w-full divide-y divide-gray-700">
		<thead class="bg-gray-800">
			<tr>
				<th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Источник</th>
				<th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Проект</th>
				<th class="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Сумма</th>
				<th class="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Комиссия</th>
				<th class="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Статус</th>
				<th class="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Начислено</th>
				<th class="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Доступно</th>
				<th class="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Выплачено</th>
			</tr>
		</thead>
		<tbody class="bg-gray-900 divide-y divide-gray-800">
			{#if bonuses.length === 0}
				<tr>
					<td colspan="8" class="px-4 py-8 text-center text-gray-500">
						Нет данных о бонусах
					</td>
				</tr>
			{:else}
				{#each bonuses as bonus}
					<tr class="hover:bg-gray-800/50 transition-colors">
						<td class="px-4 py-3 whitespace-nowrap">
							<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {bonus.source_type === 'contract' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-purple-500/10 text-purple-400'}">
								{getSourceName(bonus)}
							</span>
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
							{bonus.project_name || '—'}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300 text-right">
							{formatCurrency(bonus.source_amount)}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-white text-right">
							{formatCurrency(bonus.commission_amount)}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-center">
							<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(bonus.status?.code)}">
								{bonus.status?.name || '—'}
							</span>
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-400 text-center">
							{formatDate(bonus.accrued_at)}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-400 text-center">
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
