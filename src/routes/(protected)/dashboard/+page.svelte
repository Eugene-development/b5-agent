<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { authState } from '$lib/auth/auth.svelte.js';
	import { goto, invalidate } from '$app/navigation';
	import LogoutButton from '$lib/components/LogoutButton.svelte';
	import NavigationCards from '$lib/components/NavigationCards.svelte';
	import ProjectSubmitModal from '$lib/components/ProjectSubmitModal.svelte';
	import { projectsRefresh } from '$lib/state/projectsRefresh.svelte.js';

	/** @type {import('./$types').PageData} */
	let { data } = $props();
	// console.log(data);

	// Extract data directly from server load function
	const { stats } = data;

	// Email verification success message
	let showSuccessMessage = $state(false);
	let successMessage = $state('');

	// Modal state
	let isModalOpen = $state(false);

	// Handle project creation success
	async function handleProjectCreated() {
		console.log('Project created, refreshing dashboard stats...');
		// Invalidate dashboard data to reload stats
		await invalidate('/dashboard');
	}

	// Check for verification success message
	onMount(() => {
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
			console.log('Projects refresh triggered on dashboard, reloading stats...');
			handleProjectCreated();
		});

		// Cleanup on component unmount
		return unsubscribe;
	});
</script>

<svelte:head>
	<title>Dashboard - B5 Agent</title>
</svelte:head>

<div
	class="relative isolate min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-12 sm:py-24"
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
		<div class="fixed top-4 left-1/2 z-50 w-full max-w-md -translate-x-1/2 transform px-4">
			<div
				class="rounded-lg border border-green-500/30 bg-green-500/20 p-4 shadow-lg backdrop-blur-sm"
			>
				<div class="flex items-start">
					<svg
						class="mt-0.5 mr-3 h-5 w-5 text-green-400"
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
		<div class="fixed top-16 left-1/2 z-40 w-full max-w-lg -translate-x-1/2 transform px-4">
			<div
				class="rounded-lg border border-yellow-500/30 bg-yellow-500/20 p-4 shadow-lg backdrop-blur-sm"
			>
				<div class="flex items-start">
					<svg
						class="mt-0.5 mr-3 h-5 w-5 text-yellow-400"
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
			<h1 class="text-4xl font-normal tracking-widest text-white sm:text-6xl">Личный кабинет</h1>
			<!-- <p class="mt-6 text-lg/8 text-gray-300">
				Добро пожаловать, {user?.name || 'пользователь'}!
			</p> -->
		</div>

		<!-- Create Project Button -->
		<div class="mb-8">
			<button
				onclick={() => (isModalOpen = true)}
				class="mx-auto flex items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-purple-600 via-purple-400 to-blue-500 px-8 py-4 text-xl font-bold text-white shadow-lg transition-all hover:scale-105 hover:opacity-90"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/>
				</svg>
				Создать проект
			</button>
		</div>

		<!-- Quick Stats -->
		<div class="mb-8 rounded-lg bg-white/5 p-8 backdrop-blur-sm">
			<h2 class="mb-6 text-center text-2xl font-semibold tracking-wide text-white">
				Быстрая статистика
			</h2>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
				<div class="text-center">
					<div class="mb-2 text-3xl font-bold text-indigo-400">{stats?.activeProjects || 0}</div>
					<div class="text-gray-300">Активных проектов</div>
				</div>

				<div class="text-center">
					<div class="mb-2 text-3xl font-bold text-green-400">{stats?.completedProjects || 0}</div>
					<div class="text-gray-300">Закрытых проектов</div>
				</div>

				<div class="text-center">
					<div class="mb-2 text-3xl font-bold text-yellow-400">{stats?.totalPayouts || 0}</div>
					<div class="text-gray-300">Выплат получено</div>
				</div>
			</div>
		</div>

		<!-- Dashboard Actions -->
		<NavigationCards currentPage="dashboard" />

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
