<script>
	/**
	 * Таблица заявок на выплату бонусов агента
	 * Отображает заявки текущего агента с их статусами
	 */

	/** @type {{ requests: Array<any> }} */
	let { requests = [] } = $props();

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
	 * Форматирование даты и времени
	 */
	function formatDateTime(dateString) {
		if (!dateString) return '—';
		return new Date(dateString).toLocaleString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	/**
	 * Получить название способа оплаты
	 */
	function getPaymentMethodName(method) {
		switch (method) {
			case 'card': return 'Карта';
			case 'sbp': return 'СБП';
			case 'other': return 'Другое';
			default: return method || '—';
		}
	}

	/**
	 * Получить реквизиты в зависимости от способа оплаты
	 */
	function getPaymentDetails(request) {
		switch (request.payment_method) {
			case 'card': return request.card_number || '—';
			case 'sbp': return request.phone_number || '—';
			case 'other': return request.contact_info || '—';
			default: return '—';
		}
	}

	/**
	 * Получить иконку способа оплаты
	 */
	function getPaymentMethodIcon(method) {
		switch (method) {
			case 'card': return 'card';
			case 'sbp': return 'phone';
			case 'other': return 'other';
			default: return 'other';
		}
	}
</script>

<!-- Desktop Table -->
<div class="hidden md:block overflow-x-auto">
	<table class="min-w-full divide-y divide-gray-700">
		<thead class="bg-gray-800">
			<tr>
				<th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Дата заявки</th>
				<th class="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Сумма</th>
				<th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Способ</th>
				<th class="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Статус</th>
				<th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Дата выплаты</th>
			</tr>
		</thead>
		<tbody class="bg-gray-900 divide-y divide-gray-800">
			{#if requests.length === 0}
				<tr>
					<td colspan="5" class="px-4 py-8 text-center text-gray-500">
						<div class="flex flex-col items-center gap-2">
							<svg class="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							<p>Нет заявок на выплату</p>
							<p class="text-sm text-gray-600">Создайте заявку во вкладке "Доступно к выплате"</p>
						</div>
					</td>
				</tr>
			{:else}
				{#each requests as request}
					<tr class="hover:bg-gray-800/50 transition-colors">
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
							{formatDateTime(request.created_at)}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-white text-right">
							{formatCurrency(request.amount)} ₽
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
							<div class="flex items-center gap-2">
								{#if getPaymentMethodIcon(request.payment_method) === 'card'}
									<svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
									</svg>
								{:else if getPaymentMethodIcon(request.payment_method) === 'phone'}
									<svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
									</svg>
								{:else}
									<svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								{/if}
								{getPaymentMethodName(request.payment_method)}
							</div>
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-center">
							<span 
								class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
								style="background-color: {request.status?.color}20; color: {request.status?.color}"
							>
								{request.status?.name || '—'}
							</span>
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
							{formatDate(request.payment_date)}
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>

<!-- Mobile Cards -->
<div class="md:hidden space-y-3 p-4">
	{#if requests.length === 0}
		<div class="text-center py-8 text-gray-500">
			<div class="flex flex-col items-center gap-2">
				<svg class="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
				<p>Нет заявок на выплату</p>
				<p class="text-sm text-gray-600">Создайте заявку во вкладке "Доступно к выплате"</p>
			</div>
		</div>
	{:else}
		{#each requests as request}
			<div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
				<div class="flex items-start justify-between mb-3">
					<div>
						<p class="text-lg font-semibold text-white">{formatCurrency(request.amount)} ₽</p>
						<p class="text-xs text-gray-400">{formatDateTime(request.created_at)}</p>
					</div>
					<span 
						class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
						style="background-color: {request.status?.color}20; color: {request.status?.color}"
					>
						{request.status?.name || '—'}
					</span>
				</div>
				
				<div class="space-y-2 text-sm">
					<div class="flex justify-between">
						<span class="text-gray-400">Способ:</span>
						<span class="text-gray-200 flex items-center gap-1">
							{#if getPaymentMethodIcon(request.payment_method) === 'card'}
								<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
								</svg>
							{:else if getPaymentMethodIcon(request.payment_method) === 'phone'}
								<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
								</svg>
							{:else}
								<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							{/if}
							{getPaymentMethodName(request.payment_method)}
						</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-400">Реквизиты:</span>
						<span class="text-gray-200 font-mono text-xs">{getPaymentDetails(request)}</span>
					</div>
					{#if request.payment_date}
						<div class="flex justify-between">
							<span class="text-gray-400">Дата выплаты:</span>
							<span class="text-green-400">{formatDate(request.payment_date)}</span>
						</div>
					{/if}
					{#if request.comment}
						<div class="pt-2 border-t border-gray-700">
							<p class="text-gray-400 text-xs">Комментарий:</p>
							<p class="text-gray-300 text-xs mt-1">{request.comment}</p>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	{/if}
</div>
