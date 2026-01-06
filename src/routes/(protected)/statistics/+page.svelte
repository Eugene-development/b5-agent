<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import LogoutButton from '$lib/components/LogoutButton.svelte';
	import { createProjectsApi } from '$lib/api/projects.js';
	import { getUserData } from '$lib/api/config.js';

	/** @type {import('./$types').PageData} */
	let { data } = $props();

	// Reactive state for projects count
	let totalProjects = $state(data?.totalProjects || 0);
	let totalContracts = $state(0);
	let totalOrders = $state(0);
	let loading = $state(false);
	let loadError = $state(null);

	// Load projects on client side
	async function loadProjects() {
		if (!browser) return;
		
		// Get user ID from localStorage using the proper function (same as projects page)
		const userData = getUserData();
		const userId = userData?.id;
		
		if (!userId) {
			console.log('⚠️ Statistics: No user ID available', { userData });
			return;
		}

		loading = true;
		loadError = null;

		try {
			console.log('📊 Statistics: Loading data for user:', userId);
			
			// Load projects with bonus details (includes contracts and orders)
			const projectsApi = createProjectsApi(fetch);
			const projects = await projectsApi.getByAgent(userId);
			
			totalProjects = Array.isArray(projects) ? projects.length : 0;
			
			// Debug: log first project structure
			if (projects.length > 0) {
				console.log('📊 Statistics: First project structure:', {
					id: projects[0].id,
					value: projects[0].value,
					hasBonusDetails: !!projects[0].bonusDetails,
					bonusDetails: projects[0].bonusDetails
				});
			}
			
			// Count total contracts and orders from all projects
			let contractsCount = 0;
			let ordersCount = 0;
			
			projects.forEach((project, index) => {
				const projectContracts = project.bonusDetails?.contracts;
				const projectOrders = project.bonusDetails?.orders;
				
				if (projectContracts && Array.isArray(projectContracts)) {
					console.log(`📊 Project ${index + 1} (${project.value}): ${projectContracts.length} contracts`);
					contractsCount += projectContracts.length;
				}
				if (projectOrders && Array.isArray(projectOrders)) {
					console.log(`📊 Project ${index + 1} (${project.value}): ${projectOrders.length} orders`);
					ordersCount += projectOrders.length;
				}
			});
			
			totalContracts = contractsCount;
			totalOrders = ordersCount;
			
			console.log(`✅ Statistics: Loaded data - Projects: ${totalProjects}, Contracts: ${totalContracts}, Orders: ${totalOrders}`);
		} catch (err) {
			console.error('❌ Statistics: Failed to load data:', err);
			loadError = 'Не удалось загрузить статистику';
		} finally {
			loading = false;
		}
	}

	// Load on mount
	onMount(() => {
		// Always try to load on client if we don't have data
		if (totalProjects === 0) {
			loadProjects();
		}
	});

	// Stats object
	const stats = $derived({
		totalProjects: totalProjects,
		activeProjects: 18,
		completedProjects: 6,
		totalRevenue: 15750000,
		monthlyRevenue: 2850000,
		averageProjectValue: 656250
	});

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
			style: 'decimal',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	}

	function getMaxRevenue() {
		return Math.max(...monthlyData.map((d) => d.revenue));
	}
</script>

<svelte:head>
	<title>Отчёты RUBONUS – Аналитика работы агента</title>
	<meta name="description" content="Отчёты работы агента RUBONUS: количество проектов, доход по месяцам, распределение по регионам, топ проектов. Детальная аналитика вашей деятельности." />
	<meta name="keywords" content="отчёты RUBONUS, аналитика агента, доход агента, отчеты по проектам, метрики" />
</svelte:head>

<div class="relative isolate bg-gray-950 py-2 sm:py-8">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Page Header -->
		<div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div>
				<h1 class="mb-2 text-3xl font-bold text-white">Отчёты</h1>
			</div>
		</div>

		<!-- Key Metrics -->
		<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
			<!-- Всего проектов -->
			<div class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-6 shadow-lg transition-all duration-300 hover:shadow-blue-500/20 hover:scale-[1.02] border border-blue-500/20">
				<div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 transition-transform duration-300 group-hover:scale-110"></div>
				<div class="relative flex items-center">
					<div class="flex-shrink-0">
						<div class="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50">
							<svg
								class="h-7 w-7 text-white"
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
					<div class="ml-5">
						<p class="text-sm font-medium text-blue-300">Всего проектов</p>
						<p class="text-3xl font-bold text-white mt-1">{totalProjects}</p>
					</div>
				</div>
			</div>

			<!-- Всего договоров -->
			<div class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-6 shadow-lg transition-all duration-300 hover:shadow-emerald-500/20 hover:scale-[1.02] border border-emerald-500/20">
				<div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 transition-transform duration-300 group-hover:scale-110"></div>
				<div class="relative flex items-center">
					<div class="flex-shrink-0">
						<div class="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/50">
							<svg
								class="h-7 w-7 text-white"
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
					<div class="ml-5">
						<p class="text-sm font-medium text-emerald-300">Всего договоров</p>
						<p class="text-3xl font-bold text-white mt-1">{totalContracts}</p>
					</div>
				</div>
			</div>

			<!-- Всего заказов -->
			<div class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-6 shadow-lg transition-all duration-300 hover:shadow-purple-500/20 hover:scale-[1.02] border border-purple-500/20">
				<div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 transition-transform duration-300 group-hover:scale-110"></div>
				<div class="relative flex items-center">
					<div class="flex-shrink-0">
						<div class="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/50">
							<svg
								class="h-7 w-7 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-5">
						<p class="text-sm font-medium text-purple-300">Всего заказов</p>
						<p class="text-3xl font-bold text-white mt-1">{totalOrders}</p>
					</div>
				</div>
			</div>

			<!-- Новый отчёт (скоро) -->
			<div class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-600/10 to-gray-700/5 p-6 shadow-lg transition-all duration-300 hover:shadow-gray-500/10 hover:scale-[1.02] border border-gray-600/20">
				<div class="absolute top-0 right-0 w-32 h-32 bg-gray-600/10 rounded-full -mr-16 -mt-16 transition-transform duration-300 group-hover:scale-110"></div>
				<div class="relative flex items-center">
					<div class="flex-shrink-0">
						<div class="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 shadow-lg shadow-gray-600/30">
							<svg
								class="h-7 w-7 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-5">
						<p class="text-sm font-medium text-gray-400">Здесь скоро будет</p>
						<p class="text-lg font-semibold text-gray-300 mt-1">новый отчёт</p>
					</div>
				</div>
			</div>
		</div>

			<!-- <div class="rounded-lg bg-gray-800 p-6 shadow">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
							<svg
								class="h-6 w-6 text-green-400"
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
						<p class="text-2xl font-semibold text-white">{stats.activeProjects}</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-gray-800 p-6 shadow">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20">
							<svg
								class="h-6 w-6 text-purple-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
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
							<svg
								class="h-6 w-6 text-yellow-400"
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
						<p class="text-sm font-medium text-gray-400">Общий доход</p>
						<p class="text-2xl font-semibold text-white">{formatCurrency(stats.totalRevenue)}</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-gray-800 p-6 shadow">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/20">
							<svg
								class="h-6 w-6 text-cyan-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
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
							<svg
								class="h-6 w-6 text-indigo-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
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
						<p class="text-2xl font-semibold text-white">
							{formatCurrency(stats.averageProjectValue)}
						</p>
					</div>
				</div>
			</div> -->

		<!-- Charts Section -->
		<!-- <div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
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
		</div> -->

		<!-- Top Projects Table -->
		<!-- <div class="mb-8 overflow-hidden rounded-lg bg-gray-800 shadow">
			<div class="p-6">
				<h2 class="mb-6 text-xl font-semibold text-white">Топ проектов</h2>
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-700">
						<thead>
							<tr>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase"
								>
									Название
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase"
								>
									Регион
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase"
								>
									Доход
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase"
								>
									Статус
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-700">
							{#each topProjects as project}
								<tr class="hover:bg-gray-700/50">
									<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-white">
										{project.value}
									</td>
									<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
										{project.region}
									</td>
									<td class="px-6 py-4 text-sm whitespace-nowrap text-white">
										{formatCurrency(project.revenue)}
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
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
		</div> -->

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
