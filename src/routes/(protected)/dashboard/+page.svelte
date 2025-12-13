<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { authState } from '$lib/auth/auth.svelte.js';
	import { goto, invalidate } from '$app/navigation';
	import LogoutButton from '$lib/components/LogoutButton.svelte';
	import { createProjectsApi } from '$lib/api/projects.js';
	
	import ProjectSubmitModal from '$lib/components/ProjectSubmitModal.svelte';
	import StatsCardSkeleton from '$lib/components/StatsCardSkeleton.svelte';
	import { projectsRefresh } from '$lib/state/projectsRefresh.svelte.js';

	/** @type {import('./$types').PageData} */
	let { data } = $props();

	// Local state for stats
	let stats = $state(null);
	let needsClientLoad = $state(data.needsClientLoad || false);

	// Email verification success message
	let showSuccessMessage = $state(false);
	let successMessage = $state('');

	// Modal state
	let isModalOpen = $state(false);

	// Update stats when server data changes
	$effect(() => {
		if (data.stats) {
			// Handle both Promise and resolved stats
			if (data.stats instanceof Promise) {
				data.stats.then(resolvedStats => {
					stats = resolvedStats;
				});
			} else {
				stats = data.stats;
			}
		}
	});

	// Client-side data loading fallback (if no httpOnly cookie)
	async function loadStatsOnClient() {
		if (!authState.user?.id) return;
		
		try {
			console.log('🔄 Dashboard: Loading stats on client (no httpOnly cookie)');
			const projectsApi = createProjectsApi(fetch);
			const projects = await projectsApi.getByAgent(authState.user.id);
			
			// Calculate stats
			const calculatedStats = {
				activeProjects: 0,
				completedProjects: 0,
				totalPayouts: 0
			};

			for (const project of projects) {
				if (project?.is_active) {
					calculatedStats.activeProjects++;
				} else {
					calculatedStats.completedProjects++;
				}
				calculatedStats.totalPayouts += Number(project?.totalAgentBonus) || 0;
			}

			stats = calculatedStats;
			needsClientLoad = false;
		} catch (error) {
			console.error('Failed to load dashboard stats:', error);
			stats = {
				activeProjects: 0,
				completedProjects: 0,
				totalPayouts: 0,
				error: error.message
			};
		}
	}

	// Handle project creation success
	async function handleProjectCreated() {
		// Invalidate dashboard data to reload stats
		await invalidate('dashboard');
	}

	// Check for verification success message
	onMount(() => {
		// Load stats on client if needed
		if (needsClientLoad) {
			loadStatsOnClient();
		}

		const urlParams = new URLSearchParams(page.url.search);
		const verified = urlParams.get('verified');

		if (verified === 'true') {
			showSuccessMessage = true;
			successMessage =
				'Email успешно подтвержден! Теперь вы можете пользоваться всеми функциями сервиса.';
			// Auto-hide after 5 seconds
			setTimeout(() => {
				showSuccessMessage = false;
				// Clear URL params
				window.history.replaceState({}, '', '/dashboard');
			}, 5000);
		}

		// Subscribe to projects refresh events
		const unsubscribe = projectsRefresh.subscribe(() => {
			handleProjectCreated();
		});

		// Cleanup on component unmount
		return unsubscribe;
	});
</script>

<svelte:head>
	<title>Личный кабинет BONUS5 – Dashboard агента</title>
	<meta name="description" content="Личный кабинет агента BONUS5: создание проектов, просмотр статистики, управление клиентами. Доступ к секретному ключу и инструментам работы." />
	<meta name="keywords" content="личный кабинет BONUS5, dashboard агента, управление проектами, статистика агента" />
</svelte:head>

<div
	class="relative isolate min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-12 sm:py-20"
>
	<!-- Animated background elements -->
	<!-- <div class="absolute inset-0 overflow-hidden">
		<div
			class="absolute -left-4 top-0 h-72 w-72 animate-pulse rounded-full bg-indigo-500/10 blur-3xl"
		></div>
		<div
			class="absolute -right-4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl"
			style="animation-delay: 2s;"
		></div>
		<div
			class="absolute bottom-0 left-1/3 h-80 w-80 animate-pulse rounded-full bg-blue-500/10 blur-3xl"
			style="animation-delay: 4s;"
		></div>
	</div> -->

	<!-- Success Message -->
	{#if showSuccessMessage}
		<div class="fixed left-1/2 top-4 z-50 w-full max-w-md -translate-x-1/2 transform px-4">
			<div
				class="rounded-lg border border-green-500/30 bg-green-500/20 p-4 shadow-lg backdrop-blur-sm"
			>
				<div class="flex items-start">
					<svg
						class="mr-3 mt-0.5 h-5 w-5 text-green-400"
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
					<p class="text-sm font-medium text-green-300">{successMessage}</p>
				</div>
			</div>
		</div>
	{/if}

	<!-- Email Verification Warning -->
	{#if authState.user && !authState.user.email_verified_at}
		<div class="fixed left-1/2 top-16 z-40 w-full max-w-lg -translate-x-1/2 transform px-4">
			<div
				class="rounded-lg border border-yellow-500/30 bg-yellow-500/20 p-4 shadow-lg backdrop-blur-sm"
			>
				<div class="flex items-start">
					<svg
						class="mr-3 mt-0.5 h-5 w-5 text-yellow-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L3.098 16.5c-.77.833.192 2.5 1.732 2.5z"
						/>
					</svg>
					<div class="flex-1">
						<p class="text-sm font-medium text-yellow-300">Подтвердите свой email</p>
						<p class="mt-1 text-sm text-yellow-200">
							Для полного доступа к функциям сервиса необходимо подтвердить email адрес.
						</p>
						<div class="mt-3">
							<button
								onclick={() => goto('/email-verify')}
								class="text-sm font-medium text-yellow-400 underline hover:text-yellow-300"
							>
								Подтвердить сейчас →
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<!-- Page Header -->
		<div class="mx-auto mb-16 text-center">
			<h1 class="text-4xl font-normal tracking-widest text-white sm:text-6xl">Дашборд</h1>
			<!-- <p class="mt-6 text-lg/8 text-gray-300">
				Добро пожаловать, {user?.name || 'пользователь'}!
			</p> -->
		</div>

		<!-- Create Project Buttons -->
		<div class="mb-8">
			<!-- <h2 class="mb-6 text-center text-2xl font-semibold tracking-wide text-white">
				Создать проект
			</h2> -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- Website Form Button -->
				<div class="rounded-lg bg-white/5 p-6 backdrop-blur-sm">
					<div class="mb-4 text-center">
						<svg
							class="mx-auto mb-3 h-12 w-12 text-purple-400"
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
						<h3 class="mb-2 text-xl font-semibold text-white">Форма на сайте</h3>
						<p class="mb-4 text-sm text-gray-300">
							Создайте проект через форму на сайте. Ваш секретный ключ подставится автоматически.
							Куратор будет знать ваши данные.
						</p>
					</div>
					<button
						onclick={() => (isModalOpen = true)}
						class="w-full rounded-lg bg-gradient-to-r from-purple-600 via-purple-400 to-blue-500 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:opacity-90"
					>
						<span class="flex items-center justify-center gap-2">
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 4v16m8-8H4"
								/>
							</svg>
							Открыть форму
						</span>
					</button>
				</div>

				<!-- Telegram Bot Button -->
				<div class="rounded-lg bg-white/5 p-6 backdrop-blur-sm">
					<div class="mb-4 text-center">
						<svg
							class="mx-auto mb-3 h-12 w-12 text-blue-400"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"
							/>
						</svg>
						<h3 class="mb-2 text-xl font-semibold text-white">Анонимная форма в Telegram</h3>
						<p class="mb-4 text-sm text-gray-300">
							Отправьте данные через анонимный Telegram бот. Скопируйте заранее ваш секретный ключ в
							профиле. Никто не узнает ваши данные.
						</p>
					</div>
					<a
						href="https://t.me/mytestbot_2025_v1_bot"
						target="_blank"
						rel="noopener noreferrer"
						class="block w-full rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-6 py-3 text-center font-bold text-white shadow-lg transition-all hover:scale-105 hover:opacity-90"
					>
						<span class="flex items-center justify-center gap-2">
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"
								/>
							</svg>
							Открыть в Telegram
						</span>
					</a>
				</div>
			</div>
		</div>

		<!-- Quick Stats - Streamed Data -->
		{#if !stats}
			<!-- Loading state: Show skeleton -->
			<StatsCardSkeleton />
		{:else}
			<!-- Success state: Show data -->
			<div class="mb-8 rounded-lg bg-white/5 p-8 backdrop-blur-sm">
				<h2 class="mb-6 text-center text-2xl font-semibold tracking-wide text-white">
					Быстрая статистика
				</h2>

				{#if stats.error}
					<!-- Error message if stats failed to load -->
					<div class="mb-4 rounded-lg border border-red-500/30 bg-red-500/20 p-4 text-center">
						<p class="text-sm text-red-300">{stats.error}</p>
					</div>
				{/if}

				<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
					<div class="text-center">
						<div class="mb-2 text-3xl font-bold text-indigo-400">
							{stats?.activeProjects || 0}
						</div>
						<div class="text-gray-300">Активных проектов</div>
					</div>

					<div class="text-center">
						<div class="mb-2 text-3xl font-bold text-green-400">
							{stats?.completedProjects || 0}
						</div>
						<div class="text-gray-300">Закрытых проектов</div>
					</div>

					<div class="text-center">
						<div class="mb-2 text-3xl font-bold text-yellow-400">
							{stats?.totalPayouts || 0}
						</div>
						<div class="text-gray-300">Выплат получено</div>
					</div>
				</div>
			</div>
		{/if}

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

<!-- Project Submit Modal -->
<ProjectSubmitModal bind:isOpen={isModalOpen} onSuccess={handleProjectCreated} />
