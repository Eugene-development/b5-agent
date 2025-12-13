<!-- Loading skeleton for finances page -->

<!-- Stats Cards Skeleton -->
<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
	{#each Array(3) as _, index}
		<div class="rounded-lg bg-gray-800 p-6 shadow">
			<div
				class="mb-2 h-4 w-24 animate-pulse rounded bg-gray-700"
				style="animation-delay: {index * 0.1}s;"
			></div>
			<div
				class="h-8 w-32 animate-pulse rounded bg-gray-700"
				style="animation-delay: {index * 0.1 + 0.05}s;"
			></div>
		</div>
	{/each}
</div>

<!-- Tabs Skeleton -->
<div class="mb-6">
	<div class="border-b border-gray-700">
		<nav class="-mb-px flex space-x-8">
			<div class="h-10 w-24 animate-pulse rounded bg-gray-700"></div>
			<div class="h-10 w-24 animate-pulse rounded bg-gray-700"></div>
		</nav>
	</div>
</div>

<!-- Filters Skeleton -->
<div class="mb-6 rounded-lg bg-gray-900 p-4 border border-gray-800">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
		{#each Array(4) as _, index}
			<div>
				<div
					class="mb-2 h-4 w-20 animate-pulse rounded bg-gray-700"
					style="animation-delay: {index * 0.05}s;"
				></div>
				<div
					class="h-10 w-full animate-pulse rounded bg-gray-700"
					style="animation-delay: {index * 0.05 + 0.02}s;"
				></div>
			</div>
		{/each}
	</div>
</div>

<!-- Table Skeleton -->
<div class="overflow-hidden rounded-lg bg-gray-900 border border-gray-800 shadow">
	<div class="-mx-4 overflow-x-auto sm:mx-0">
		<div class="inline-block min-w-full align-middle">
			<table class="min-w-full divide-y divide-gray-700">
				<thead class="bg-gray-800">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
						>
							Дата
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
						>
							Проект
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
						>
							Тип
						</th>
						<th
							class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-300"
						>
							Сумма
						</th>
						<th
							class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-300"
						>
							Статус
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-700 bg-gray-900">
					{#each Array(8) as _, index}
						<tr class="transition-colors">
							<!-- Date -->
							<td class="whitespace-nowrap px-6 py-4">
								<div
									class="h-5 w-24 animate-pulse rounded bg-gray-700"
									style="animation-delay: {index * 0.08}s;"
								></div>
							</td>
							<!-- Project -->
							<td class="px-6 py-4">
								<div
									class="h-5 w-40 animate-pulse rounded bg-gray-700"
									style="animation-delay: {index * 0.08}s;"
								></div>
							</td>
							<!-- Type -->
							<td class="whitespace-nowrap px-6 py-4">
								<div
									class="inline-flex h-6 w-20 animate-pulse rounded-full bg-gray-700"
									style="animation-delay: {index * 0.08}s;"
								></div>
							</td>
							<!-- Amount -->
							<td class="whitespace-nowrap px-6 py-4 text-right">
								<div
									class="ml-auto h-5 w-28 animate-pulse rounded bg-gray-700"
									style="animation-delay: {index * 0.08}s;"
								></div>
							</td>
							<!-- Status -->
							<td class="whitespace-nowrap px-6 py-4 text-center">
								<div class="flex justify-center">
									<div
										class="inline-flex h-6 w-24 animate-pulse rounded-full bg-gray-700"
										style="animation-delay: {index * 0.08}s;"
									></div>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Loading message -->
<div class="mt-6 text-center">
	<div class="inline-flex items-center gap-2 text-gray-400">
		<svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
			></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
		<span class="text-sm">Загрузка данных финансов...</span>
	</div>
</div>
