<!--
  Projects page component with client-side data loading
  Migrated from b5-agent-old and adapted for Svelte 5 runes and client-side authentication
  Uses Tailwind CSS 4 for styling and maintains sorting, filtering functionality
  Enhanced with comprehensive error handling and loading states
  Requirements: 2.2, 3.2, 5.2, 6.1, 7.2, 7.3
-->
<script>
	import DataState from '$lib/components/DataState.svelte';
	import LogoutButton from '$lib/components/LogoutButton.svelte';
	import { goto } from '$app/navigation';

	// Get client-loaded data
	let { data } = $props();

	// Reactive state for filtering and search using Svelte 5 runes
	let searchTerm = $state('');
	let statusFilter = $state('all');
	let sortBy = $state('created_at');
	let sortOrder = $state('desc');

	// Optimized search term for case-insensitive comparison
	let normalizedSearchTerm = $derived(searchTerm.toLowerCase().trim());

	// Computed filtered projects list (separated from sorting for better performance)
	let filteredProjects = $derived(() => {
		if (!data.projects) return [];

		return data.projects.filter((project) => {
			// Search filter - optimized with early return and normalized search term
			if (normalizedSearchTerm) {
				const matchesSearch =
					project.value?.toLowerCase().includes(normalizedSearchTerm) ||
					project.region?.toLowerCase().includes(normalizedSearchTerm) ||
					project.description?.toLowerCase().includes(normalizedSearchTerm) ||
					project.agent?.name?.toLowerCase().includes(normalizedSearchTerm);
				if (!matchesSearch) return false;
			}

			// Status filter - optimized with early return
			if (statusFilter !== 'all') {
				if (statusFilter === 'active' && !project.is_active) return false;
				if (statusFilter === 'inactive' && project.is_active) return false;
			}

			return true;
		});
	});

	// Computed sorted projects list (separate from filtering for better performance)
	let sortedProjects = $derived(() => {
		const filtered = filteredProjects();
		if (filtered.length === 0) return filtered;

		// Create a copy to avoid mutating the original array
		return [...filtered].sort((a, b) => {
			let aVal = a[sortBy];
			let bVal = b[sortBy];

			// Handle different data types
			if (
				sortBy === 'created_at' ||
				sortBy === 'planned_completion_date' ||
				sortBy === 'contract_date'
			) {
				aVal = aVal ? new Date(aVal) : new Date(0);
				bVal = bVal ? new Date(bVal) : new Date(0);
			} else if (sortBy === 'contract_amount') {
				aVal = aVal || 0;
				bVal = bVal || 0;
			} else if (typeof aVal === 'string') {
				aVal = (aVal || '').toLowerCase();
				bVal = (bVal || '').toLowerCase();
			} else {
				aVal = aVal || '';
				bVal = bVal || '';
			}

			const modifier = sortOrder === 'asc' ? 1 : -1;
			if (aVal < bVal) return -1 * modifier;
			if (aVal > bVal) return 1 * modifier;
			return 0;
		});
	});

	// Optimized statistics computation using single pass
	let filteredStats = $derived(() => {
		const filtered = filteredProjects();
		let active = 0;
		let inactive = 0;
		let totalAmount = 0;

		// Single pass through the array for better performance
		for (const project of filtered) {
			if (project.is_active) {
				active++;
			} else {
				inactive++;
			}
			totalAmount += project.contract_amount || 0;
		}

		return {
			total: filtered.length,
			active,
			inactive,
			totalContractAmount: totalAmount,
			averageContractAmount: filtered.length > 0 ? totalAmount / filtered.length : 0
		};
	});

	// Functions for handling user interactions
	function handleSort(column) {
		if (sortBy === column) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = column;
			sortOrder = 'asc';
		}
	}

	function clearFilters() {
		searchTerm = '';
		statusFilter = 'all';
		sortBy = 'created_at';
		sortOrder = 'desc';
	}

	function formatDate(dateString) {
		if (!dateString) return 'Не указано';
		return new Date(dateString).toLocaleDateString('ru-RU', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function formatCurrency(amount) {
		if (!amount) return 'Не указано';
		return new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency: 'RUB',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	}

	function getStatusBadgeClass(isActive) {
		return isActive
			? 'bg-green-800 text-green-200 border-green-600'
			: 'bg-gray-700 text-gray-300 border-gray-500';
	}

	function getStatusText(isActive) {
		return isActive ? 'Активный' : 'Неактивный';
	}

	// Handle retry functionality
	async function handleRetry() {
		// Reload the page to retry data loading
		goto('/projects', { replaceState: true });
	}
</script>

<div class="projects-page min-h-screen bg-gray-900 py-2 sm:py-8">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Page Header -->
		<div class="mb-8">
			<h1 class="mb-2 text-3xl font-bold text-white">Проекты</h1>
			<!-- <p class="text-gray-300">Управление проектами и просмотр их статистики</p> -->
		</div>

		<!-- Data State Management -->
		<DataState
			isLoading={data.isLoading || false}
			error={data.error}
			errorType={data.errorType || 'unknown'}
			canRetry={data.canRetry || false}
			onRetry={handleRetry}
			data={data.projects}
			emptyMessage="В системе пока нет проектов"
			emptyIcon="📋"
			loadingType="table"
			loadingMessage="Загрузка данных проектов..."
			skeletonRows={5}
			minHeight="400px"
		>
			<!-- Content when data is successfully loaded -->

			<!-- Statistics Cards -->
			<!-- <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
				<div class="rounded-lg bg-gray-800 p-6 shadow">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
								<svg
									class="h-5 w-5 text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-400">Всего проектов</p>
							<p class="text-2xl font-semibold text-white">{filteredStats().total}</p>
						</div>
					</div>
				</div>

				<div class="rounded-lg bg-gray-800 p-6 shadow">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
								<svg
									class="h-5 w-5 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-400">Активные</p>
							<p class="text-2xl font-semibold text-white">{filteredStats().active}</p>
						</div>
					</div>
				</div>

				<div class="rounded-lg bg-gray-800 p-6 shadow">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
								<svg
									class="h-5 w-5 text-red-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
									/>
								</svg>
							</div>
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-400">Неактивные</p>
							<p class="text-2xl font-semibold text-white">{filteredStats().inactive}</p>
						</div>
					</div>
				</div>

				<div class="rounded-lg bg-gray-800 p-6 shadow">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100">
								<svg
									class="h-5 w-5 text-yellow-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
									/>
								</svg>
							</div>
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-400">Общая сумма</p>
							<p class="text-2xl font-semibold text-white">
								{formatCurrency(filteredStats().totalContractAmount)}
							</p>
						</div>
					</div>
				</div>
			</div> -->

			<!-- Filters and Search -->
			<div class="mb-6 rounded-lg bg-gray-800 shadow">
				<div class="p-4 sm:p-6">
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<!-- Search Input -->
						<div class="sm:col-span-2 lg:col-span-2">
							<label for="search" class="mb-2 block text-sm font-medium text-gray-300">
								Поиск проектов
							</label>
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<svg
										class="h-5 w-5 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
								</div>
								<input
									id="search"
									type="text"
									bind:value={searchTerm}
									placeholder="Поиск по названию, городу, описанию или агенту..."
									class="block h-10 w-full rounded-md border border-gray-600 bg-gray-700 pl-10 pr-3 text-white placeholder-gray-400 focus:border-blue-500 focus:placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
								/>
							</div>
						</div>

						<!-- Status Filter -->
						<div>
							<label for="status-filter" class="mb-2 block text-sm font-medium text-gray-300">
								Статус
							</label>
							<select
								id="status-filter"
								bind:value={statusFilter}
								class="block h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							>
								<option value="">Все статусы</option>
								<option value="active">В обработке</option>
								<option value="active">Активный</option>
								<option value="paused">Выполнен</option>
								<option value="completed">Завершен</option>
							</select>
						</div>

						<!-- Clear Filters Button -->
						<div class="flex items-end">
							<button
								onclick={clearFilters}
								class="h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
							>
								Очистить фильтры
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Projects Table -->
			<div class="overflow-hidden rounded-lg bg-gray-800 shadow">
				<!-- Mobile-friendly table wrapper with improved scrolling -->
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
										class="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300 hover:bg-gray-600"
										onclick={() => handleSort('value')}
									>
										<div class="flex items-center space-x-1">
											<span>Название</span>
											{#if sortBy === 'value'}
												<svg
													class="h-4 w-4 {sortOrder === 'asc' ? 'rotate-180 transform' : ''}"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											{/if}
										</div>
									</th>
									<th
										class="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300 hover:bg-gray-600"
										onclick={() => handleSort('region')}
									>
										<div class="flex items-center space-x-1">
											<span>Регион</span>
											{#if sortBy === 'region'}
												<svg
													class="h-4 w-4 {sortOrder === 'asc' ? 'rotate-180 transform' : ''}"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											{/if}
										</div>
									</th>
									<th
										class="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300 hover:bg-gray-600 md:table-cell"
										onclick={() => handleSort('contract_amount')}
									>
										<div class="flex items-center space-x-1">
											<span>Сумма контракта</span>
											{#if sortBy === 'contract_amount'}
												<svg
													class="h-4 w-4 {sortOrder === 'asc' ? 'rotate-180 transform' : ''}"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											{/if}
										</div>
									</th>
									<th
										class="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300 hover:bg-gray-600 lg:table-cell"
										onclick={() => handleSort('planned_completion_date')}
									>
										<div class="flex items-center space-x-1">
											<span>Плановая дата</span>
											{#if sortBy === 'planned_completion_date'}
												<svg
													class="h-4 w-4 {sortOrder === 'asc' ? 'rotate-180 transform' : ''}"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											{/if}
										</div>
									</th>
									<th
										class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
									>
										Статус
									</th>
									<th
										class="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300 hover:bg-gray-600 sm:table-cell"
										onclick={() => handleSort('created_at')}
									>
										<div class="flex items-center space-x-1">
											<span>Создан</span>
											{#if sortBy === 'created_at'}
												<svg
													class="h-4 w-4 {sortOrder === 'asc' ? 'rotate-180 transform' : ''}"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											{/if}
										</div>
									</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-700 bg-gray-800">
								{#each sortedProjects() as project, index (project.id)}
									<tr class="hover:bg-gray-700">
										<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
											{sortedProjects().length - index}
										</td>
										<td class="whitespace-nowrap px-6 py-4">
											<div class="text-sm font-medium text-white">
												{project.value || 'Не указано'}
											</div>
											{#if project.description}
												<div
													class="max-w-xs truncate text-sm text-gray-400"
													title={project.description}
												>
													{project.description}
												</div>
											{/if}
										</td>
										<td class="whitespace-nowrap px-6 py-4 text-sm text-white">
											{project.region || 'Не указано'}
										</td>
										<td class="whitespace-nowrap px-6 py-4 text-sm text-white md:table-cell">
											{formatCurrency(project.contract_amount)}
										</td>
										<td class="whitespace-nowrap px-6 py-4 text-sm text-white lg:table-cell">
											{formatDate(project.planned_completion_date)}
										</td>
										<td class="whitespace-nowrap px-6 py-4">
											<span
												class="inline-flex rounded-full border px-2 py-1 text-xs font-semibold {getStatusBadgeClass(
													project.is_active
												)}"
											>
												{getStatusText(project.is_active)}
											</span>
										</td>
										<td class="whitespace-nowrap px-6 py-4 text-sm text-white sm:table-cell">
											{formatDate(project.created_at)}
										</td>
									</tr>
								{:else}
									<tr>
										<td colspan="7" class="px-6 py-12 text-center">
											<div class="flex flex-col items-center">
												<svg
													class="w-12 h-12 text-gray-400 mb-4"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
													/>
												</svg>
												<h3 class="text-lg font-medium text-white mb-2">Проекты не найдены</h3>
												<p class="text-gray-400">
													{#if searchTerm || statusFilter !== 'all'}
														Попробуйте изменить параметры поиска или очистить фильтры.
													{:else}
														В системе пока нет проектов.
													{/if}
												</p>
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<!-- Results Summary -->
			{#if sortedProjects().length > 0}
				<div class="mt-6 text-center text-sm text-gray-300">
					Показано {sortedProjects().length} из {data.stats.total} проектов
					{#if searchTerm || statusFilter !== 'all'}
						(отфильтровано)
					{/if}
				</div>
			{/if}

			<!-- Navigation Cards -->
			<div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
				<div class="rounded-lg bg-gray-800 p-6 shadow">
					<div class="mb-4 flex items-center">
						<svg
							class="mr-3 h-8 w-8 text-blue-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
							/>
						</svg>
						<h3 class="text-xl font-semibold text-white">Дашборд</h3>
					</div>
					<a href="/dashboard" class="font-medium text-blue-400 hover:text-blue-300">
						Вернуться →
					</a>
				</div>

				<div class="rounded-lg bg-gray-800 p-6 shadow">
					<div class="mb-4 flex items-center">
						<svg
							class="mr-3 h-8 w-8 text-indigo-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
						<h3 class="text-xl font-semibold text-white">Профиль</h3>
					</div>
					<a href="/profile" class="font-medium text-indigo-400 hover:text-indigo-300">
						Просмотреть →
					</a>
				</div>

				<div class="rounded-lg bg-gray-800 p-6 shadow">
					<div class="mb-4 flex items-center">
						<svg
							class="mr-3 h-8 w-8 text-green-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
							/>
						</svg>
						<h3 class="text-xl font-semibold text-white">Финансы</h3>
					</div>
					<a href="/finances" class="font-medium text-green-400 hover:text-green-300">
						Управлять →
					</a>
				</div>
			</div>
		</DataState>

		<!-- Action Buttons -->
		<div class="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
			<LogoutButton />
		</div>

		<!-- Security Notice -->
		<div class="mt-8 text-center">
			<p class="text-sm text-gray-400">
				Эта страница доступна только авторизованным пользователям.
				<br />
				Ваша сессия защищена и данные передаются по защищенному соединению.
			</p>
		</div>
	</div>
</div>
