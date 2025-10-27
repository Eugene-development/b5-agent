<!--
  Projects page component with client-side data loading
  Migrated from b5-agent-old and adapted for Svelte 5 runes and client-side authentication
  Uses Tailwind CSS 4 for styling and maintains sorting, filtering functionality
  Enhanced with comprehensive error handling and loading states
  Requirements: 2.2, 3.2, 5.2, 6.1, 7.2, 7.3
-->
<script>
	import { onMount } from 'svelte';
	import DataState from '$lib/components/DataState.svelte';
	import LogoutButton from '$lib/components/LogoutButton.svelte';
	import NavigationCards from '$lib/components/NavigationCards.svelte';
	import ProjectDetailsModal from '$lib/components/ProjectDetailsModal.svelte';
	import { goto, invalidate } from '$app/navigation';
	import { projectsRefresh } from '$lib/state/projectsRefresh.svelte.js';

	// Get client-loaded data
	let { data } = $props();

	// Reactive state for filtering and search using Svelte 5 runes
	let searchTerm = $state('');
	let statusFilter = $state('all');
	let sortBy = $state('created_at');
	let sortOrder = $state('desc');
	let showFilters = $state(false);
	let selectedProject = $state(null);

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

	function formatDateTime(dateString) {
		if (!dateString) return 'Не указано';
		return new Date(dateString).toLocaleString('ru-RU', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
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

	function getStatusBadgeClass(status) {
		if (!status) {
			return 'bg-gray-700 text-gray-300 border-gray-500';
		}

		// Если есть цвет в статусе, используем его
		if (status.color) {
			return `border-[${status.color}]`;
		}

		// Иначе используем цвет по умолчанию в зависимости от активности
		return status.is_active
			? 'bg-green-800 text-green-200 border-green-600'
			: 'bg-gray-700 text-gray-300 border-gray-500';
	}

	function getStatusText(project) {
		// Если есть статус из таблицы project_statuses, используем его
		if (project.status?.value) {
			return project.status.value;
		}

		// Иначе используем старую логику на основе is_active
		return project.is_active ? 'Активный' : 'Неактивный';
	}

	// Handle retry functionality
	async function handleRetry() {
		// Reload the page to retry data loading
		goto('/projects', { replaceState: true });
	}

	// Refresh data from server
	let isRefreshing = $state(false);
	async function refreshData() {
		isRefreshing = true;
		try {
			// Invalidate all data to trigger reload
			await invalidate(() => true);
		} catch (error) {
			console.error('Failed to refresh data:', error);
		} finally {
			isRefreshing = false;
		}
	}

	// Toggle filters visibility
	function toggleFilters() {
		showFilters = !showFilters;
	}

	// Open project details modal
	function openProjectDetails(project) {
		selectedProject = project;
	}

	// Close project details modal
	function closeProjectDetails() {
		selectedProject = null;
	}

	// Subscribe to projects refresh events
	onMount(() => {
		const unsubscribe = projectsRefresh.subscribe(() => {
			console.log('Projects refresh triggered, reloading data...');
			refreshData();
		});

		// Cleanup on component unmount
		return unsubscribe;
	});
</script>

<div class="projects-page min-h-screen bg-gray-950 py-2 sm:py-8">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Page Header -->
		<div class="mb-8">
			<div class="mb-4">
				<h1 class="mb-2 text-3xl font-bold text-white">Проекты</h1>
				<!-- <p class="text-gray-300">Управление проектами и просмотр их статистики</p> -->
			</div>
			<div class="grid grid-cols-2 gap-2 sm:gap-4">
				<button
					type="button"
					onclick={toggleFilters}
					class="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-md bg-cyan-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-150 ease-in-out hover:bg-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
					aria-label="Открыть фильтры проектов"
				>
					<svg
						class="mr-2 h-4 w-4"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
						/>
					</svg>
					Фильтры
				</button>
				<button
					type="button"
					onclick={refreshData}
					disabled={isRefreshing}
					class="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-md bg-cyan-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-150 ease-in-out hover:bg-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
					aria-label="Обновить данные проектов с сервера"
				>
					<svg
						class="mr-2 h-4 w-4 {isRefreshing ? 'animate-spin' : ''}"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						{#if isRefreshing}
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						{:else}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							/>
						{/if}
					</svg>
					{isRefreshing ? 'Обновляю...' : 'Обновить данные'}
				</button>
			</div>
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
			{#if showFilters}
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
									class="px- block h-10 w-full rounded-md border border-gray-600 bg-gray-700 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
			{/if}

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
											<span>Проект</span>
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
										class="w-2/5 cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300 hover:bg-gray-600"
										onclick={() => handleSort('region')}
									>
										<div class="flex items-center space-x-1">
											<span>Адрес объекта</span>
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
								{#each sortedProjects() as project, index (project.id)}
									<tr
										class="group cursor-pointer transition-colors hover:bg-gray-700"
										onclick={() => openProjectDetails(project)}
										role="button"
										tabindex="0"
										onkeydown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												openProjectDetails(project);
											}
										}}
									>
										<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
											{sortedProjects().length - index}
										</td>
										<td class="whitespace-nowrap px-6 py-4">
											<div
												class="text-sm font-medium text-white"
												title="Создан: {formatDateTime(project.created_at)}"
											>
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
										<td class="w-2/5 px-6 py-4 text-sm text-white">
											<div class="truncate">
												{project.region || 'Не указано'}
											</div>
										</td>
										<td class="whitespace-nowrap px-6 py-4">
											<span
												class="inline-flex rounded-full border px-2 py-1 text-xs font-semibold {getStatusBadgeClass(
													project.status
												)}"
												style={project.status?.color
													? `background-color: ${project.status.color}20; color: ${project.status.color}; border-color: ${project.status.color}`
													: ''}
												title={project.status?.value !== 'Новый проект'
													? `Обновлён: ${formatDateTime(project.updated_at)}`
													: ''}
											>
												{getStatusText(project)}
											</span>
										</td>
										<td class="w-32 whitespace-nowrap px-6 py-4 text-center">
											{#if project.is_incognito}
												<svg
													class="mx-auto h-5 w-5 text-green-500"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M5 13l4 4L19 7"
													/>
												</svg>
											{:else}
												<span class="text-gray-500">—</span>
											{/if}
										</td>
									</tr>
								{:else}
									<tr>
										<td colspan="5" class="px-6 py-12 text-center">
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
		</DataState>

		<!-- Navigation Cards -->
		<NavigationCards currentPage="projects" />

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

<!-- Project Details Modal -->
<ProjectDetailsModal bind:project={selectedProject} onClose={closeProjectDetails} />
