<script>
	/**
	 * Фильтры для таблицы выплат
	 * Requirements: 8.4, 8.5
	 */

	/** @type {{ filters: any, statuses: Array<any>, onFilterChange: (key: string, value: any) => void, onClear: () => void }} */
	let { filters, statuses, onFilterChange, onClear } = $props();
</script>

<div class="flex flex-wrap gap-4 items-end">
	<!-- Фильтр по статусу -->
	<div class="flex-1 min-w-[150px]">
		<label for="payment-status-filter" class="block text-sm font-medium text-gray-400 mb-1">Статус</label>
		<select
			id="payment-status-filter"
			value={filters.status_code || ''}
			onchange={(e) => onFilterChange('status_code', e.target.value)}
			class="w-full rounded-md bg-gray-800 border-gray-700 text-gray-300 text-sm focus:ring-cyan-500 focus:border-cyan-500"
		>
			<option value="">Все статусы</option>
			{#each statuses as status}
				<option value={status.code}>{status.name}</option>
			{/each}
		</select>
	</div>

	<!-- Фильтр по дате от -->
	<div class="flex-1 min-w-[150px]">
		<label for="payment-date-from" class="block text-sm font-medium text-gray-400 mb-1">Дата от</label>
		<input
			type="date"
			id="payment-date-from"
			value={filters.date_from || ''}
			onchange={(e) => onFilterChange('date_from', e.target.value)}
			class="w-full rounded-md bg-gray-800 border-gray-700 text-gray-300 text-sm focus:ring-cyan-500 focus:border-cyan-500"
		/>
	</div>

	<!-- Фильтр по дате до -->
	<div class="flex-1 min-w-[150px]">
		<label for="payment-date-to" class="block text-sm font-medium text-gray-400 mb-1">Дата до</label>
		<input
			type="date"
			id="payment-date-to"
			value={filters.date_to || ''}
			onchange={(e) => onFilterChange('date_to', e.target.value)}
			class="w-full rounded-md bg-gray-800 border-gray-700 text-gray-300 text-sm focus:ring-cyan-500 focus:border-cyan-500"
		/>
	</div>

	<!-- Кнопка сброса -->
	<div>
		<button
			type="button"
			onclick={onClear}
			class="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white bg-gray-800 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
		>
			Сбросить
		</button>
	</div>
</div>
