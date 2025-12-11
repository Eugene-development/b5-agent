<script>
	/**
	 * Таблица выплат агента
	 * Requirements: 7.3, 7.7
	 */

	/** @type {{ payments: Array<any>, onSelectPayment: (payment: any) => void }} */
	let { payments, onSelectPayment } = $props();

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
			case 'pending':
				return 'bg-amber-500/10 text-amber-500';
			case 'completed':
				return 'bg-green-500/10 text-green-500';
			case 'failed':
				return 'bg-red-500/10 text-red-500';
			default:
				return 'bg-gray-500/10 text-gray-500';
		}
	}
</script>

<div class="overflow-x-auto">
	<table class="min-w-full divide-y divide-gray-700">
		<thead class="bg-gray-800">
			<tr>
				<th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Дата</th>
				<th class="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Сумма</th>
				<th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Способ</th>
				<th class="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Статус</th>
				<th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Номер документа</th>
				<th class="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Действия</th>
			</tr>
		</thead>
		<tbody class="bg-gray-900 divide-y divide-gray-800">
			{#if payments.length === 0}
				<tr>
					<td colspan="6" class="px-4 py-8 text-center text-gray-500">
						Нет данных о выплатах
					</td>
				</tr>
			{:else}
				{#each payments as payment}
					<tr class="hover:bg-gray-800/50 transition-colors">
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
							{formatDate(payment.payment_date)}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-white text-right">
							{formatCurrency(payment.total_amount)}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
							{payment.method?.name || '—'}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-center">
							<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(payment.status?.code)}">
								{payment.status?.name || '—'}
							</span>
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
							{payment.reference_number || '—'}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-center">
							<button
								type="button"
								onclick={() => onSelectPayment(payment)}
								class="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
							>
								Подробнее
							</button>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
