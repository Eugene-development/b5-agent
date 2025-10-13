<script>
	import LogoutButton from '$lib/components/LogoutButton.svelte';

	// Mock data for statistics
	const stats = {
		totalProjects: 24,
		activeProjects: 18,
		completedProjects: 6,
		totalRevenue: 15750000,
		monthlyRevenue: 2850000,
		averageProjectValue: 656250
	};

	const monthlyData = [
		{ month: 'Янв', projects: 2, revenue: 1200000 },
		{ month: 'Фев', projects: 3, revenue: 1850000 },
		{ month: 'Мар', projects: 4, revenue: 2100000 },
		{ month: 'Апр', projects: 3, revenue: 1950000 },
		{ month: 'Май', projects: 5, revenue: 2850000 },
		{ month: 'Июн', projects: 4, revenue: 2400000 },
		{ month: 'Июл', projects: 3, revenue: 2200000 }
	];

	const topProjects = [
		{ name: 'ЖК Солнечный', region: 'Москва', revenue: 2500000, status: 'active' },
		{ name: 'ТЦ Европа', region: 'Санкт-Петербург', revenue: 1800000, status: 'active' },
		{ name: 'Офис Центр', region: 'Казань', revenue: 1500000, status: 'completed' },
		{ name: 'Парк Победы', region: 'Екатеринбург', revenue: 1200000, status: 'active' },
		{ name: 'Бизнес Плаза', region: 'Новосибирск', revenue: 950000, status: 'completed' }
	];

	const regionStats = [
		{ region: 'Москва', projects: 8, revenue: 5200000, percentage: 33 },
		{ region: 'Санкт-Петербург', projects: 5, revenue: 3100000, percentage: 20 },
		{ region: 'Казань', projects: 4, revenue: 2400000, percentage: 15 },
		{ region: 'Екатеринбург', projects: 3, revenue: 2050000, percentage: 13 },
		{ region: 'Новосибирск', projects: 4, revenue: 3000000, percentage: 19 }
	];

	function formatCurrency(amount) {
		return new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency: 'RUB',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	}

	function getMaxRevenue() {
		return Math.max(...monthlyData.map((d) => d.revenue));
	}
</script>

<svelte:head>
	<title>Статистика - B5 Agent</title>
</svelte:head>

<div class="relative isolate bg-gray-950 py-2 sm:py-8">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Page Header -->
		<div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div>
				<h1 class="mb-2 text-3xl font-bold text-white">Статистика</h1>
			</div>
		</div>

		<!-- Key Metrics -->
		<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
			<div class="rounded-lg bg-gray-800 p-6 shadow">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
							<svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
						<p class="text-2xl font-semibold text-white">{stats.totalProjects}</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-gray-800 p-6 shadow">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
							<svg class="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
						<p class="text-2xl font-semibold text-white">{stats.activeProjects}</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-gray-800 p-6 shadow">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20">
							<svg class="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-400">Завершено</p>
						<p class="text-2xl font-semibold text-white">{stats.completedProjects}</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-gray-800 p-6 shadow">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/20">
							<svg class="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
						<p class="text-sm font-medium text-gray-400">Общий доход</p>
						<p class="text-2xl font-semibold text-white">{formatCurrency(stats.totalRevenue)}</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-gray-800 p-6 shadow">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/20">
							<svg class="h-6 w-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-400">Доход за месяц</p>
						<p class="text-2xl font-semibold text-white">{formatCurrency(stats.monthlyRevenue)}</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-gray-800 p-6 shadow">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/20">
							<svg class="h-6 w-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-400">Средний чек</p>
						<p class="text-2xl font-semibold text-white">{formatCurrency(stats.averageProjectValue)}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Charts Section -->
		<div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
			<!-- Monthly Revenue Chart -->
			<div class="rounded-lg bg-gray-800 p-6 shadow">
				<h2 class="mb-6 text-xl font-semibold text-white">Доход по месяцам</h2>
				<div class="space-y-4">
					{#each monthlyData as data}
						<div>
							<div class="mb-2 flex items-center justify-between text-sm">
								<span class="text-gray-300">{data.month}</span>
								<span class="font-medium text-white">{formatCurrency(data.revenue)}</span>
							</div>
							<div class="h-3 w-full overflow-hidden rounded-full bg-gray-700">
								<div
									class="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
									style="width: {(data.revenue / getMaxRevenue()) * 100}%"
								></div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Regional Distribution -->
			<div class="rounded-lg bg-gray-800 p-6 shadow">
				<h2 class="mb-6 text-xl font-semibold text-white">Распределение по регионам</h2>
				<div class="space-y-4">
					{#each regionStats as region}
						<div>
							<div class="mb-2 flex items-center justify-between text-sm">
								<span class="text-gray-300">{region.region}</span>
								<span class="font-medium text-white">{region.percentage}%</span>
							</div>
							<div class="h-3 w-full overflow-hidden rounded-full bg-gray-700">
								<div
									class="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
									style="width: {region.percentage}%"
								></div>
							</div>
							<div class="mt-1 flex items-center justify-between text-xs text-gray-400">
								<span>{region.projects} проектов</span>
								<span>{formatCurrency(region.revenue)}</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Top Projects Table -->
		<div class="mb-8 overflow-hidden rounded-lg bg-gray-800 shadow">
			<div class="p-6">
				<h2 class="mb-6 text-xl font-semibold text-white">Топ проектов</h2>
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-700">
						<thead>
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
									Название
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
									Регион
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
									Доход
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
									Статус
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-700">
							{#each topProjects as project}
								<tr class="hover:bg-gray-700/50">
									<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
										{project.name}
									</td>
									<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
										{project.region}
									</td>
									<td class="whitespace-nowrap px-6 py-4 text-sm text-white">
										{formatCurrency(project.revenue)}
									</td>
									<td class="whitespace-nowrap px-6 py-4">
										{#if project.status === 'active'}
											<span
												class="inline-flex rounded-full border border-green-600 bg-green-800 px-2 py-1 text-xs font-semibold text-green-200"
											>
												Активный
											</span>
										{:else}
											<span
												class="inline-flex rounded-full border border-gray-500 bg-gray-700 px-2 py-1 text-xs font-semibold text-gray-300"
											>
												Завершен
											</span>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!-- Navigation Cards -->
		<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			<div class="rounded-lg bg-white/5 p-6 backdrop-blur-sm">
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

			<div class="rounded-lg bg-white/5 p-6 backdrop-blur-sm">
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

			<div class="rounded-lg bg-white/5 p-6 backdrop-blur-sm">
				<div class="mb-4 flex items-center">
					<svg
						class="mr-3 h-8 w-8 text-purple-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
						/>
					</svg>
					<h3 class="text-xl font-semibold text-white">Проекты</h3>
				</div>
				<a href="/projects" class="font-medium text-purple-400 hover:text-purple-300">
					Управлять →
				</a>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="flex flex-col justify-center gap-4 sm:flex-row">
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