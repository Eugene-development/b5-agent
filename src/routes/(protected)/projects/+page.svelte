<!--
  Projects page component with server-side data loading
  Migrated from b5-front and adapted for Svelte 5 runes and server-side authentication
  Uses Tailwind CSS 4 for styling and maintains sorting, filtering functionality
  Enhanced with comprehensive error handling and loading states
  Requirements: 2.2, 3.2, 5.2, 6.1, 7.2, 7.3
-->
<script>
  import DataState from '$lib/components/DataState.svelte';
  import { goto } from '$app/navigation';

  // Get server-loaded data
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

    return data.projects.filter(project => {
      // Search filter - optimized with early return and normalized search term
      if (normalizedSearchTerm) {
        const matchesSearch = 
          project.value?.toLowerCase().includes(normalizedSearchTerm) ||
          project.city?.toLowerCase().includes(normalizedSearchTerm) ||
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
      if (sortBy === 'created_at' || sortBy === 'planned_completion_date' || sortBy === 'contract_date') {
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
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
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

<div class="projects-page min-h-screen bg-gray-50 py-8">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Проекты</h1>
      <p class="text-gray-600">Управление проектами и просмотр их статистики</p>
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
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Всего проектов</p>
            <p class="text-2xl font-semibold text-gray-900">{filteredStats().total}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Активные</p>
            <p class="text-2xl font-semibold text-gray-900">{filteredStats().active}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Неактивные</p>
            <p class="text-2xl font-semibold text-gray-900">{filteredStats().inactive}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Общая сумма</p>
            <p class="text-2xl font-semibold text-gray-900">
              {formatCurrency(filteredStats().totalContractAmount)}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-lg shadow mb-6">
      <div class="p-4 sm:p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search Input -->
          <div class="sm:col-span-2 lg:col-span-2">
            <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
              Поиск проектов
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                bind:value={searchTerm}
                placeholder="Поиск по названию, городу, описанию или агенту..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-2">
              Статус
            </label>
            <select
              id="status-filter"
              bind:value={statusFilter}
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
            </select>
          </div>

          <!-- Clear Filters Button -->
          <div class="flex items-end">
            <button
              onclick={clearFilters}
              class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Очистить фильтры
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Projects Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <!-- Mobile-friendly table wrapper with improved scrolling -->
      <div class="overflow-x-auto -mx-4 sm:mx-0">
        <div class="inline-block min-w-full align-middle">
          <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onclick={() => handleSort('id')}
              >
                <div class="flex items-center space-x-1">
                  <span>ID</span>
                  {#if sortBy === 'id'}
                    <svg class="w-4 h-4 {sortOrder === 'asc' ? 'transform rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  {/if}
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onclick={() => handleSort('value')}
              >
                <div class="flex items-center space-x-1">
                  <span>Название</span>
                  {#if sortBy === 'value'}
                    <svg class="w-4 h-4 {sortOrder === 'asc' ? 'transform rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  {/if}
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onclick={() => handleSort('city')}
              >
                <div class="flex items-center space-x-1">
                  <span>Город</span>
                  {#if sortBy === 'city'}
                    <svg class="w-4 h-4 {sortOrder === 'asc' ? 'transform rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  {/if}
                </div>
              </th>
              <th class="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Агент
              </th>
              <th
                class="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onclick={() => handleSort('contract_amount')}
              >
                <div class="flex items-center space-x-1">
                  <span>Сумма контракта</span>
                  {#if sortBy === 'contract_amount'}
                    <svg class="w-4 h-4 {sortOrder === 'asc' ? 'transform rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  {/if}
                </div>
              </th>
              <th
                class="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onclick={() => handleSort('planned_completion_date')}
              >
                <div class="flex items-center space-x-1">
                  <span>Плановая дата</span>
                  {#if sortBy === 'planned_completion_date'}
                    <svg class="w-4 h-4 {sortOrder === 'asc' ? 'transform rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  {/if}
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th
                class="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onclick={() => handleSort('created_at')}
              >
                <div class="flex items-center space-x-1">
                  <span>Создан</span>
                  {#if sortBy === 'created_at'}
                    <svg class="w-4 h-4 {sortOrder === 'asc' ? 'transform rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  {/if}
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each sortedProjects() as project (project.id)}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {project.id}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {project.value || 'Не указано'}
                  </div>
                  {#if project.description}
                    <div class="text-sm text-gray-500 truncate max-w-xs" title={project.description}>
                      {project.description}
                    </div>
                  {/if}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {project.city || 'Не указано'}
                </td>
                <td class="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                  {#if project.agent}
                    <div class="text-sm font-medium text-gray-900">{project.agent.name}</div>
                    <div class="text-sm text-gray-500">{project.agent.email}</div>
                  {:else}
                    <span class="text-sm text-gray-500">Не назначен</span>
                  {/if}
                </td>
                <td class="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(project.contract_amount)}
                </td>
                <td class="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(project.planned_completion_date)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full border {getStatusBadgeClass(project.is_active)}">
                    {getStatusText(project.is_active)}
                  </span>
                </td>
                <td class="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(project.created_at)}
                </td>
              </tr>
            {:else}
              <tr>
                <td colspan="8" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center">
                    <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Проекты не найдены</h3>
                    <p class="text-gray-500">
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
      <div class="mt-6 text-sm text-gray-700 text-center">
        Показано {sortedProjects().length} из {data.stats.total} проектов
        {#if searchTerm || statusFilter !== 'all'}
          (отфильтровано)
        {/if}
      </div>
    {/if}

    <!-- Navigation Cards -->
    <div class="mt-8 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div class="bg-white rounded-lg shadow p-6">
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
          <h3 class="text-xl font-semibold text-gray-900">Дашборд</h3>
        </div>
        <a href="/dashboard" class="font-medium text-blue-600 hover:text-blue-500">
          Вернуться →
        </a>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 class="text-xl font-semibold text-gray-900">Агенты</h3>
        </div>
        <a href="/agents" class="font-medium text-indigo-600 hover:text-indigo-500">
          Просмотреть →
        </a>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
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
          <h3 class="text-xl font-semibold text-gray-900">Финансы</h3>
        </div>
        <a href="/finances" class="font-medium text-green-600 hover:text-green-500">
          Управлять →
        </a>
      </div>
    </div>

    </DataState>
  </div>
</div>