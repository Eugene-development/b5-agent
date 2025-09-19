<script>
	import { logout } from '$lib/auth/auth.svelte.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	/** @type {import('./$types').PageData} */
	let { data } = $props();

	// Extract data directly from server load function
	const { stats } = data;

	// Email verification success message
	let showSuccessMessage = $state(false);
	let successMessage = $state('');

	// Check for verification success message
	onMount(() => {
		const urlParams = new URLSearchParams(page.url.search);
		const message = urlParams.get('message');

		if (message === 'email_verified') {
			showSuccessMessage = true;
			successMessage =
				'Email успешно подтвержден! Теперь вы можете пользоваться всеми функциями сервиса.';
			// Auto-hide after 5 seconds
			setTimeout(() => {
				showSuccessMessage = false;
				// Clear URL params
				window.history.replaceState({}, '', '/dashboard');
			}, 5000);
		} else if (message === 'email_already_verified') {
			showSuccessMessage = true;
			successMessage = 'Email уже был подтвержден ранее.';
			setTimeout(() => {
				showSuccessMessage = false;
				window.history.replaceState({}, '', '/dashboard');
			}, 3000);
		}
	});

	// Handle logout with redirect
	async function handleLogout() {
		console.log('🚪 Starting logout process...');

		try {
			await logout({ redirectTo: '/' });
			console.log('✅ Logout successful, redirecting to home');
		} catch (error) {
			console.error('💥 Logout error:', error);
			// Force redirect even if logout fails
			goto('/');
		}
	}
</script>

<svelte:head>
	<title>Dashboard - B5 Agent</title>
</svelte:head>

<div class="relative isolate bg-gray-900 py-12 sm:py-24">
	<!-- Success Message -->
	{#if showSuccessMessage}
		<div class="fixed left-1/2 top-4 z-50 w-full max-w-md -translate-x-1/2 transform px-4">
			<div
				class="rounded-lg border border-green-500/30 bg-green-500/20 p-4 shadow-lg backdrop-blur-sm"
			>
				<div class="flex items-center">
					<svg
						class="mr-3 h-6 w-6 text-green-400"
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

	<div class="mx-auto max-w-4xl px-6 lg:px-8">
		<!-- Page Header -->
		<div class="mx-auto mb-16 text-center">
			<h1 class="text-4xl font-normal tracking-widest text-white sm:text-6xl">Личный кабинет</h1>
			<!-- <p class="mt-6 text-lg/8 text-gray-300">
				Добро пожаловать, {user?.name || 'пользователь'}!
			</p> -->
		</div>

		<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
			<!-- Client Data Form Section -->
			<div class="mb-8 rounded-lg bg-white/5 p-8 backdrop-blur-sm">
				<div class="text-center">
					<a
						href="https://mebelmobile.ru/"
						target="_blank"
						rel="noopener noreferrer"
						class="font-medium text-orange-400 hover:text-orange-300"
					>
						<div class="mb-4 flex items-center justify-center">
							<!-- <svg
								class="mr-3 h-8 w-8 text-orange-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								></path>
							</svg> -->
							<h3 class="text-2xl font-semibold tracking-wide text-white">Открытая форма</h3>
						</div>
						Наш куратор свяжется с вами для уточнения вопросов →
					</a>
				</div>
			</div>
			<!-- Client Data Form Section -->
			<div class="mb-8 rounded-lg bg-white/5 p-8 backdrop-blur-sm">
				<div class="text-center">
					<a
						href="https://t.me/mytestbot_2025_v1_bot"
						target="_blank"
						rel="noopener noreferrer"
						class="font-medium text-orange-400 hover:text-orange-300"
					>
						<div class="mb-4 flex items-center justify-center">
							<!-- <svg
								class="mr-3 h-8 w-8 text-orange-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								></path>
							</svg> -->
							<h3 class="text-2xl font-semibold tracking-wide text-white">Секретная Форма</h3>
						</div>
						Наш куратор и поставщик не будут знать от кого заявка →
					</a>
				</div>
			</div>
		</div>

		<!-- Dashboard Actions -->
		<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			<!-- Profile Section -->
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
						></path>
					</svg>
					<h3 class="text-xl font-semibold text-white">Профиль</h3>
				</div>
				<a href="/profile" class="font-medium text-indigo-400 hover:text-indigo-300">
					Просмотреть →
				</a>
			</div>

			<!-- Projects Section -->
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
						></path>
					</svg>
					<h3 class="text-xl font-semibold text-white">Проекты</h3>
				</div>
				<a href="/projects" class="font-medium text-purple-400 hover:text-purple-300">
					Управлять →
				</a>
			</div>

			<!-- Finances Section -->
			<div class="rounded-lg bg-white/5 p-6 backdrop-blur-sm">
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
						></path>
					</svg>
					<h3 class="text-xl font-semibold text-white">Финансы</h3>
				</div>
				<a href="/finances" class="font-medium text-green-400 hover:text-green-300">
					Управлять →
				</a>
			</div>
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

		<!-- Action Buttons -->
		<div class="flex flex-col justify-center gap-4 sm:flex-row">
			<button
				onclick={handleLogout}
				class="rounded-lg bg-red-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-600"
			>
				Выйти из аккаунта
			</button>
		</div>

		<!-- Security Notice -->
		<div class="mt-8 text-center">
			<p class="text-sm text-gray-400">
				Эта страница доступна только авторизованным пользователям.
				<br />
				Ваша сессия защищена API токенами и данные передаются по защищенному соединению.
			</p>
		</div>
	</div>
</div>
