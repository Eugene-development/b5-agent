<!--
  Projects page component with client-side data loading
  Migrated from b5-agent-old and adapted for Svelte 5 runes and client-side authentication
  Uses Tailwind CSS 4 for styling and maintains sorting, filtering functionality
  Enhanced with comprehensive error handling and loading states
  Requirements: 2.2, 3.2, 5.2, 6.1, 7.2, 7.3
-->
<script>
	import { onMount } from 'svelte';
	import LogoutButton from '$lib/components/LogoutButton.svelte';
	import NavigationCards from '$lib/components/NavigationCards.svelte';
	import ProjectDetailsModal from '$lib/components/ProjectDetailsModal.svelte';
	import ProjectsTableSkeleton from '$lib/components/ProjectsTableSkeleton.svelte';
	import { goto, invalidate } from '$app/navigation';
	import { projectsRefresh } from '$lib/state/projectsRefresh.svelte.js';

	// Get client-loaded data
	let { data } = $props();

	// Reactive state for filtering and search using Svelte 5 runes
	let searchTerm = $state('');
	let statusFilter = $state('all');
	let dateFilter = $state('all'); // all, day, week, month, quarter, half-year, year, custom
	let dateFrom = $state('');
	let dateTo = $state('');
	let sortBy = $state('created_at');
	let sortOrder = $state('desc');
	let showFilters = $state(false);
	let selectedProject = $state(null);

	// Optimized search term for case-insensitive comparison
	let normalizedSearchTerm = $derived(searchTerm.toLowerCase().trim());

	// Calculate date range based on selected period
	let dateRange = $derived(() => {
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

		switch (dateFilter) {
			case 'day':
				return {
					from: today,
					to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
				};
			case 'week':
				const weekAgo = new Date(today);
				weekAgo.setDate(weekAgo.getDate() - 7);
				return { from: weekAgo, to: now };
			case 'month':
				const monthAgo = new Date(today);
				monthAgo.setMonth(monthAgo.getMonth() - 1);
				return { from: monthAgo, to: now };
			case 'quarter':
				const quarterAgo = new Date(today);
				quarterAgo.setMonth(quarterAgo.getMonth() - 3);
				return { from: quarterAgo, to: now };
			case 'half-year':
				const halfYearAgo = new Date(today);
				halfYearAgo.setMonth(halfYearAgo.getMonth() - 6);
				return { from: halfYearAgo, to: now };
			case 'year':
				const yearAgo = new Date(today);
				yearAgo.setFullYear(yearAgo.getFullYear() - 1);
				return { from: yearAgo, to: now };
			case 'custom':
				return {
					from: dateFrom ? new Date(dateFrom) : null,
					to: dateTo ? new Date(dateTo + 'T23:59:59') : null
				};
			default:
				return { from: null, to: null };
		}
	});

	// Computed filtered projects list (separated from sorting for better performance)
	// This will be used inside {#await} block with resolved projectsData
	function getFilteredProjects(projects) {
		if (!projects) return [];

		return projects.filter((project) => {
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
				// Filter by status slug from database
				const projectStatusSlug = project.status?.slug;
				if (projectStatusSlug !== statusFilter) return false;
			}

			// Date filter - filter by created_at date
			if (dateFilter !== 'all') {
				const range = dateRange();
				if (range.from || range.to) {
					const projectDate = project.created_at ? new Date(project.created_at) : null;
					if (!projectDate) return false;

					if (range.from && projectDate < range.from) return false;
					if (range.to && projectDate > range.to) return false;
				}
			}

			return true;
		});
	}

	// Computed sorted projects list (separate from filtering for better performance)
	function getSortedProjects(projects) {
		const filtered = getFilteredProjects(projects);
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
			} else if (sortBy === 'contract_amount' || sortBy === 'sequentialNumber') {
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
	}

	// Optimized statistics computation using single pass
	function getFilteredStats(projects) {
		const filtered = getFilteredProjects(projects);
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
	}

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
		dateFilter = 'all';
		dateFrom = '';
		dateTo = '';
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
			console.log('🔄 Refreshing projects data...');
			// Invalidate the projects page data using the dependency identifier
			// This will trigger the load function to re-run
			await invalidate('projects');
			console.log('✅ Projects data refreshed');
		} catch (error) {
			console.error('❌ Failed to refresh data:', error);
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

		<!-- Streamed Projects Data -->
		{#await data.projectsData}
			<!-- Loading state: Show skeleton -->
			<ProjectsTableSkeleton />
		{:then projectsData}
			<!-- Success state: Show data -->
			{#if projectsData.error}
				<!-- Error state -->
				<div class="rounded-lg border border-red-500/30 bg-red-500/20 p-8 text-center">
					<h3 class="mb-4 text-xl font-semibold text-white">Ошибка загрузки проектов</h3>
					<p class="mb-4 text-red-300">{projectsData.error}</p>
					{#if projectsData.canRetry}
						<button
							onclick={handleRetry}
							class="rounded-lg bg-red-600 px-6 py-2 font-semibold text-white hover:bg-red-700"
						>
							Попробовать снова
						</button>
					{/if}
				</div>
			{:else if !projectsData.projects || projectsData.projects.length === 0}
				<!-- Empty state -->
				<div class="rounded-lg bg-gray-800 p-12 text-center">
					<div class="text-6xl">📋</div>
					<h3 class="mt-4 text-xl font-semibold text-white">В системе пока нет ваших проектов</h3>
				</div>
			{:else}
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
				<div class="mb-6 rounded-lg border border-gray-300/30 bg-transparent backdrop-blur-sm">
					<div class="p-4 sm:p-6">
						<!-- First row: Search on left half, Filters on right half -->
						<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
							<!-- Left half: Search Input -->
							<div>
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

							<!-- Right half: Status, Date Period and Clear Button -->
							<div class="flex gap-4">
								<!-- Status Filter -->
								<div class="flex-1">
									<label for="status-filter" class="mb-2 block text-sm font-medium text-gray-300">
										Статус
									</label>
									<select
										id="status-filter"
										bind:value={statusFilter}
										class="px- block h-10 w-full rounded-md border border-gray-600 bg-gray-700 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
									>
										<option value="all">Все статусы</option>
										{#if projectsData.statuses && projectsData.statuses.length > 0}
											{#each projectsData.statuses as status (status.id)}
												<option value={status.slug}>{status.value}</option>
											{/each}
										{/if}
									</select>
								</div>

								<!-- Date Period Filter -->
								<div class="flex-1">
									<label for="date-filter" class="mb-2 block text-sm font-medium text-gray-300">
										Период
									</label>
									<select
										id="date-filter"
										bind:value={dateFilter}
										class="block h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
									>
										<option value="all">Все время</option>
										<option value="day">За день</option>
										<option value="week">За неделю</option>
										<option value="month">За месяц</option>
										<option value="quarter">За квартал</option>
										<option value="half-year">За полугодие</option>
										<option value="year">За год</option>
										<option value="custom">Выбрать период</option>
									</select>
								</div>

								<!-- Clear Filters Icon Button -->
								<div class="flex items-end">
									<button
										onclick={clearFilters}
										class="flex h-10 w-10 items-center justify-center rounded-md border border-gray-600 bg-gray-700 text-gray-300 shadow-sm transition-colors hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
										aria-label="Очистить фильтры"
										title="Очистить фильтры"
									>
										<svg
											class="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
											/>
										</svg>
									</button>
								</div>
							</div>
						</div>

						<!-- Second row: Custom date range (shown only when 'custom' is selected) -->
						{#if dateFilter === 'custom'}
							<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
								<!-- Date From -->
								<div>
									<label for="date-from" class="mb-2 block text-sm font-medium text-gray-300">
										Дата от
									</label>
									<input
										id="date-from"
										type="date"
										bind:value={dateFrom}
										class="block h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
									/>
								</div>

								<!-- Date To -->
								<div>
									<label for="date-to" class="mb-2 block text-sm font-medium text-gray-300">
										Дата до
									</label>
									<input
										id="date-to"
										type="date"
										bind:value={dateTo}
										class="block h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
									/>
								</div>
							</div>
						{/if}
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
										class="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300 hover:bg-gray-600"
										onclick={() => handleSort('sequentialNumber')}
									>
										<div class="flex items-center space-x-1">
											<span>№</span>
											{#if sortBy === 'sequentialNumber'}
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
										class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
									>
										Имя
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
										<div
											style="display: flex; align-items: center; justify-content: center; gap: 6px; position: relative;"
										>
											Инкогнито
											<svg
												role="img"
												aria-label="Информация об инкогнито режиме"
												style="width: 16px; height: 16px; color: #9ca3af; cursor: pointer; flex-shrink: 0;"
												fill="currentColor"
												viewBox="0 0 20 20"
												xmlns="http://www.w3.org/2000/svg"
												onmouseenter={(e) => {
													const tooltip = e.target.nextElementSibling;
													if (tooltip) tooltip.style.display = 'block';
												}}
												onmouseleave={(e) => {
													const tooltip = e.target.nextElementSibling;
													if (tooltip) tooltip.style.display = 'none';
												}}
											>
												<path
													fill-rule="evenodd"
													d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
													clip-rule="evenodd"
												/>
											</svg>
											<div
												role="tooltip"
												aria-hidden="true"
												style="display: none; position: fixed; bottom: auto; left: auto; transform: none; margin-bottom: 0; padding: 8px 12px; background-color: #374151; color: white; font-size: 10px; border-radius: 4px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); white-space: nowrap; z-index: 9999; pointer-events: none;"
												onmouseenter={(e) => {
													const svg = e.target.previousElementSibling;
													if (svg) {
														const rect = svg.getBoundingClientRect();
														e.target.style.left =
															rect.left + rect.width / 2 - e.target.offsetWidth / 2 + 'px';
														e.target.style.top = rect.top - e.target.offsetHeight - 8 + 'px';
													}
												}}
											>
												Галочкой обозначены<br />ваши<br />секретные проекты
											</div>
										</div>
									</th>
									<th
										class="w-16 px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-300"
									>
									</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-700 bg-gray-800">
								{#each getSortedProjects(projectsData.projects) as project, index (project.id)}
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
											{project.sequentialNumber}
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
										<td class="whitespace-nowrap px-6 py-4 text-sm text-white">
											{project.client?.name || 'Не указано'}
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
										<td class="w-16 whitespace-nowrap px-6 py-4 text-center">
											<svg
												class="mx-auto h-5 w-5 text-gray-400 transition-colors group-hover:text-cyan-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
												/>
											</svg>
										</td>
									</tr>
								{:else}
									<tr>
										<td colspan="6" class="px-6 py-12 text-center">
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
													{#if searchTerm || statusFilter !== 'all' || dateFilter !== 'all'}
														Попробуйте изменить параметры поиска или очистить фильтры.
													{:else}
														В системе пока нет ваших проектов.
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
				{#if getSortedProjects(projectsData.projects).length > 0}
					<div class="mb-8 mt-6 text-center text-sm text-gray-300">
						Показано {getSortedProjects(projectsData.projects).length} из {projectsData.stats.total} проектов
						{#if searchTerm || statusFilter !== 'all' || dateFilter !== 'all'}
							(отфильтровано)
						{/if}
					</div>
				{/if}
			{/if}
		{:catch error}
			<!-- Critical error state -->
			<div class="rounded-lg border border-red-500/30 bg-red-500/20 p-8 text-center">
				<h3 class="mb-4 text-xl font-semibold text-white">Ошибка загрузки проектов</h3>
				<p class="text-red-300">
					Не удалось загрузить проекты. Попробуйте обновить страницу.
				</p>
			</div>
		{/await}

		<!-- Navigation Cards -->
		<div class="mt-8">
			<NavigationCards currentPage="projects" />
		</div>

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
