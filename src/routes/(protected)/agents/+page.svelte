<!--
  Agents page component with server-side data loading
  Uses Svelte 5 runes for state management and Tailwind CSS 4 for styling
  Enhanced with comprehensive error handling and loading states
  Requirements: 2.2, 4.1, 6.1, 7.1, 7.3, 7.2
-->
<script>
  import DataState from '$lib/components/DataState.svelte';
  import { goto } from '$app/navigation';

  // Get server-loaded data
  let { data } = $props();

  // Reactive state for filtering and search using Svelte 5 runes
  let searchTerm = $state('');
  let statusFilter = $state('all');
  let sortBy = $state('name');
  let sortOrder = $state('asc');

  // Optimized search term for case-insensitive comparison
  let normalizedSearchTerm = $derived(searchTerm.toLowerCase().trim());

  // Computed filtered agents list (separated from sorting for better performance)
  let filteredAgents = $derived(() => {
    if (!data.agents) return [];

    return data.agents.filter(agent => {
      // Search filter - optimized with early return and normalized search term
      if (normalizedSearchTerm) {
        const matchesSearch = 
          agent.name?.toLowerCase().includes(normalizedSearchTerm) ||
          agent.email?.toLowerCase().includes(normalizedSearchTerm) ||
          agent.city?.toLowerCase().includes(normalizedSearchTerm);
        if (!matchesSearch) return false;
      }

      // Status filter - optimized with early return
      if (statusFilter !== 'all') {
        const isActive = agent.status === 'ACTIVE';
        if (statusFilter === 'active' && !isActive) return false;
        if (statusFilter === 'inactive' && isActive) return false;
      }

      return true;
    });
  });

  // Computed sorted agents list (separate from filtering for better performance)
  let sortedAgents = $derived(() => {
    const filtered = filteredAgents();
    if (filtered.length === 0) return filtered;

    // Create a copy to avoid mutating the original array
    return [...filtered].sort((a, b) => {
      let aVal = a[sortBy] || '';
      let bVal = b[sortBy] || '';
      
      // Handle different data types
      if (sortBy === 'created_at') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      const modifier = sortOrder === 'asc' ? 1 : -1;
      if (aVal < bVal) return -1 * modifier;
      if (aVal > bVal) return 1 * modifier;
      return 0;
    });
  });

  // Optimized statistics computation using single pass
  let filteredStats = $derived(() => {
    const filtered = filteredAgents();
    let active = 0;
    let inactive = 0;
    
    // Single pass through the array for better performance
    for (const agent of filtered) {
      if (agent.status === 'ACTIVE') {
        active++;
      } else {
        inactive++;
      }
    }
    
    return {
      total: filtered.length,
      active,
      inactive
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
    sortBy = 'name';
    sortOrder = 'asc';
  }

  function formatDate(dateString) {
    if (!dateString) return 'Не указано';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'BANNED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  function getStatusText(status) {
    switch (status) {
      case 'ACTIVE':
        return 'Активный';
      case 'BANNED':
        return 'Заблокирован';
      default:
        return 'Неизвестно';
    }
  }

  // Handle retry functionality
  async function handleRetry() {
    // Reload the page to retry data loading
    goto('/agents', { replaceState: true });
  }
</script>

<div class="agents-page min-h-screen bg-gray-50 py-8">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Агенты системы</h1>
      <p class="text-gray-600">Управление агентами и просмотр их статистики</p>
    </div>

    <!-- Data State Management -->
    <DataState
      isLoading={data.isLoading || false}
      error={data.error}
      errorType={data.errorType || 'unknown'}
      canRetry={data.canRetry || false}
      onRetry={handleRetry}
      data={data.agents}
      emptyMessage="В системе пока нет зарегистрированных агентов"
      emptyIcon="👥"
      loadingType="table"
      loadingMessage="Загрузка данных агентов..."
      skeletonRows={5}
      minHeight="400px"
    >
      <!-- Content when data is successfully loaded -->

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Всего агентов</p>
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
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-lg shadow mb-6">
      <div class="p-4 sm:p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search Input -->
          <div class="sm:col-span-2 lg:col-span-2">
            <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
              Поиск агентов
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
                placeholder="Поиск по имени, email или городу..."
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

    <!-- Agents Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <!-- Mobile-friendly table wrapper with improved scrolling -->
      <div class="overflow-x-auto -mx-4 sm:mx-0">
        <div class="inline-block min-w-full align-middle">
          <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onclick={() => handleSort('name')}
              >
                <div class="flex items-center space-x-1">
                  <span>Имя</span>
                  {#if sortBy === 'name'}
                    <svg class="w-4 h-4 {sortOrder === 'asc' ? 'transform rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  {/if}
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onclick={() => handleSort('email')}
              >
                <div class="flex items-center space-x-1">
                  <span>Email</span>
                  {#if sortBy === 'email'}
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th class="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email подтвержден
              </th>
              <th
                class="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onclick={() => handleSort('created_at')}
              >
                <div class="flex items-center space-x-1">
                  <span>Дата регистрации</span>
                  {#if sortBy === 'created_at'}
                    <svg class="w-4 h-4 {sortOrder === 'asc' ? 'transform rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  {/if}
                </div>
              </th>
              <th class="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Проекты
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each sortedAgents() as agent (agent.id)}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700">
                          {agent.name ? agent.name.charAt(0).toUpperCase() : '?'}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {agent.name || 'Не указано'}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{agent.email || 'Не указано'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{agent.city || 'Не указано'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full border {getStatusBadgeClass(agent.status)}">
                    {getStatusText(agent.status)}
                  </span>
                </td>
                <td class="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    {#if agent.email_verified_at}
                      <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="ml-2 text-sm text-gray-900">Подтвержден</span>
                    {:else}
                      <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span class="ml-2 text-sm text-gray-900">Не подтвержден</span>
                    {/if}
                  </div>
                </td>
                <td class="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(agent.created_at)}
                </td>
                <td class="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    {agent.projects_count || 0}
                  </span>
                </td>
              </tr>
            {:else}
              <tr>
                <td colspan="7" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center">
                    <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Агенты не найдены</h3>
                    <p class="text-gray-500">
                      {#if searchTerm || statusFilter !== 'all'}
                        Попробуйте изменить параметры поиска или очистить фильтры.
                      {:else}
                        В системе пока нет зарегистрированных агентов.
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
    {#if sortedAgents().length > 0}
      <div class="mt-6 text-sm text-gray-700 text-center">
        Показано {sortedAgents().length} из {data.stats.total} агентов
        {#if searchTerm || statusFilter !== 'all'}
          (отфильтровано)
        {/if}
      </div>
    {/if}

    </DataState>
  </div>
</div>