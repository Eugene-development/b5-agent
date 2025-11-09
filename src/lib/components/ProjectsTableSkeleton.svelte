<!-- Loading skeleton for projects table -->
<div class="overflow-hidden rounded-lg bg-gray-800 shadow">
	<div class="-mx-4 overflow-x-auto sm:mx-0">
		<div class="inline-block min-w-full align-middle">
			<table class="min-w-full divide-y divide-gray-700">
				<thead class="bg-gray-700">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
						>
							№
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
						>
							Проект
						</th>
						<th
							class="w-2/5 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
						>
							Адрес объекта
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
						>
							Статус
						</th>
						<th
							class="w-32 px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-300"
						>
							Инкогнито
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-700 bg-gray-800">
					{#each Array(5) as _, index}
						<tr class="transition-colors">
							<!-- Number -->
							<td class="whitespace-nowrap px-6 py-4">
								<div
									class="h-5 w-8 animate-pulse rounded bg-gray-700"
									style="animation-delay: {index * 0.1}s;"
								></div>
							</td>
							<!-- Project name -->
							<td class="whitespace-nowrap px-6 py-4">
								<div
									class="mb-2 h-5 w-32 animate-pulse rounded bg-gray-700"
									style="animation-delay: {index * 0.1}s;"
								></div>
								<div
									class="h-4 w-48 animate-pulse rounded bg-gray-700/60"
									style="animation-delay: {index * 0.1 + 0.05}s;"
								></div>
							</td>
							<!-- Address -->
							<td class="w-2/5 px-6 py-4">
								<div
									class="h-5 w-full max-w-md animate-pulse rounded bg-gray-700"
									style="animation-delay: {index * 0.1}s;"
								></div>
							</td>
							<!-- Status -->
							<td class="whitespace-nowrap px-6 py-4">
								<div
									class="inline-flex h-6 w-24 animate-pulse rounded-full bg-gray-700"
									style="animation-delay: {index * 0.1}s;"
								></div>
							</td>
							<!-- Incognito -->
							<td class="w-32 whitespace-nowrap px-6 py-4 text-center">
								<div class="flex justify-center">
									<div
										class="h-5 w-5 animate-pulse rounded bg-gray-700"
										style="animation-delay: {index * 0.1}s;"
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
		<span class="text-sm">Загрузка проектов...</span>
	</div>
</div>
