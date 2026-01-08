<script>
	/**
	 * Фильтры для таблицы бонусов
	 * Requirements: 8.1, 8.2, 8.3
	 */

	/** @type {{ filters: any, statuses: Array<any>, onFilterChange: (key: string, value: any) => void, onClear: () => void }} */
	let { filters, statuses, onFilterChange, onClear } = $props();

	const sourceTypes = [
		{ code: '', name: 'Все источники' },
		{ code: 'contract', name: 'Договора' },
		{ code: 'order', name: 'Заказы' }
	];

	const bonusTypes = [
		{ code: '', name: 'Все типы' },
		{ code: 'agent', name: 'Личные' },
		{ code: 'referral', name: 'Реферальные' }
	];
</script>

<div class="flex flex-wrap gap-4 items-end">
	<!-- Фильтр по типу бонуса -->
	<div class="flex-1 min-w-[150px]">
		<label for="bonus-type-filter" class="block text-sm font-medium text-gray-400 mb-1">Тип бонуса</label>
		<select
			id="bonus-type-filter"
			value={filters.bonus_type || ''}
			onchange={(e) => onFilterChange('bonus_type', e.target.value)}
			class="w-full rounded-md bg-gray-800 border-gray-700 text-gray-300 text-sm focus:ring-cyan-500 focus:border-cyan-500"
		>
			{#each bonusTypes as type}
				<option value={type.code}>{type.name}</option>
			{/each}
		</select>
	</div>

	<!-- Фильтр по статусу -->
	<div class="flex-1 min-w-[150px]">
		<label for="status-filter" class="block text-sm font-medium text-gray-400 mb-1">Статус</label>
		<select
			id="status-filter"
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

	<!-- Фильтр по типу источника -->
	<div class="flex-1 min-w-[150px]">
		<label for="source-filter" class="block text-sm font-medium text-gray-400 mb-1">Источник</label>
		<select
			id="source-filter"
			value={filters.source_type || ''}
			onchange={(e) => onFilterChange('source_type', e.target.value)}
			class="w-full rounded-md bg-gray-800 border-gray-700 text-gray-300 text-sm focus:ring-cyan-500 focus:border-cyan-500"
		>
			{#each sourceTypes as type}
				<option value={type.code}>{type.name}</option>
			{/each}
		</select>
	</div>

	<!-- Фильтр по дате от -->
	<div class="flex-1 min-w-[150px]">
		<label for="date-from" class="block text-sm font-medium text-gray-400 mb-1">Дата от</label>
		<input
			type="date"
			id="date-from"
			value={filters.date_from || ''}
			onchange={(e) => onFilterChange('date_from', e.target.value)}
			class="w-full rounded-md bg-gray-800 border-gray-700 text-gray-300 text-sm focus:ring-cyan-500 focus:border-cyan-500"
		/>
	</div>

	<!-- Фильтр по дате до -->
	<div class="flex-1 min-w-[150px]">
		<label for="date-to" class="block text-sm font-medium text-gray-400 mb-1">Дата до</label>
		<input
			type="date"
			id="date-to"
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

