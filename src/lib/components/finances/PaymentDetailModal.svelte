<script>
	/**
	 * Модальное окно деталей выплаты
	 * Requirements: 7.4
	 */

	/** @type {{ payment: any, onClose: () => void }} */
	let { payment, onClose } = $props();

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
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
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

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Backdrop -->
<div
	class="fixed inset-0 bg-black/50 z-40"
	onclick={onClose}
	role="button"
	tabindex="-1"
	aria-label="Закрыть"
></div>

<!-- Modal -->
<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
	<div class="bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
		<!-- Header -->
		<div class="flex items-center justify-between px-6 py-4 border-b border-gray-700">
			<h3 class="text-lg font-semibold text-white">Детали выплаты</h3>
			<button
				type="button"
				onclick={onClose}
				class="text-gray-400 hover:text-white transition-colors"
			>
				<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<!-- Content -->
		<div class="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
			<!-- Payment Info -->
			<div class="grid grid-cols-2 gap-4 mb-6">
				<div>
					<p class="text-sm text-gray-400">Дата выплаты</p>
					<p class="text-white font-medium">{formatDate(payment.payment_date)}</p>
				</div>
				<div>
					<p class="text-sm text-gray-400">Сумма</p>
					<p class="text-white font-medium text-lg">{formatCurrency(payment.total_amount)}</p>
				</div>
				<div>
					<p class="text-sm text-gray-400">Способ выплаты</p>
					<p class="text-white font-medium">{payment.method?.name || '—'}</p>
				</div>
				<div>
					<p class="text-sm text-gray-400">Статус</p>
					<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(payment.status?.code)}">
						{payment.status?.name || '—'}
					</span>
				</div>
				{#if payment.reference_number}
					<div class="col-span-2">
						<p class="text-sm text-gray-400">Номер документа</p>
						<p class="text-white font-medium">{payment.reference_number}</p>
					</div>
				{/if}
			</div>

			<!-- Bonuses List -->
			<div>
				<h4 class="text-sm font-medium text-gray-400 mb-3">Включённые бонусы ({payment.bonuses?.length || 0})</h4>
				<div class="space-y-2">
					{#if payment.bonuses && payment.bonuses.length > 0}
						{#each payment.bonuses as bonus}
							<div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
								<div>
									<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium {bonus.source_type === 'contract' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-purple-500/10 text-purple-400'}">
										{bonus.source_type === 'contract' ? 'Договор' : 'Заказ'}
									</span>
									<span class="ml-2 text-sm text-gray-300">{bonus.project_name || '—'}</span>
								</div>
								<span class="text-sm font-medium text-white">{formatCurrency(bonus.commission_amount)}</span>
							</div>
						{/each}
					{:else}
						<p class="text-gray-500 text-sm">Нет связанных бонусов</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div class="px-6 py-4 border-t border-gray-700">
			<button
				type="button"
				onclick={onClose}
				class="w-full px-4 py-2 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors"
			>
				Закрыть
			</button>
		</div>
	</div>
</div>
