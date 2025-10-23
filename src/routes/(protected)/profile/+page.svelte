<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import LogoutButton from '$lib/components/LogoutButton.svelte';
	import NavigationCards from '$lib/components/NavigationCards.svelte';
	import { formatPhone } from '$lib/utils/formatters.js';
	import {
		authState,
		getCurrentUserData,
		checkAuth,
		getCurrentUser
	} from '$lib/auth/auth.svelte.js';

	// Component state
	let isLoading = $state(false);
	let userData = $state(null);
	let isCheckingAuth = $state(false);
	let authError = $state(null);

	// Get user data for display
	function getUserDisplayData() {
		// Try to get from auth state first
		const user = getCurrentUserData();
		if (user) {
			return user;
		}

		// Return any cached data
		return userData;
	}

	// Load user data from API
	async function loadUserData() {
		isLoading = true;
		authError = null;

		try {
			const result = await getCurrentUser();

			if (result.success && result.user) {
				userData = result.user;
				return result.user;
			} else if (result.status === 401) {
				// Unauthorized, redirect to login
				authError = 'Сессия истекла. Необходимо войти в систему заново.';
				setTimeout(() => {
					const currentUrl = $page.url.pathname + $page.url.search;
					goto(`/login?returnTo=${encodeURIComponent(currentUrl)}`);
				}, 2000);
			} else {
				authError = 'Не удалось загрузить данные профиля';
			}
		} catch (error) {
			console.error('Error loading user data:', error);
			authError = 'Ошибка загрузки данных пользователя';
		} finally {
			isLoading = false;
		}

		return null;
	}

	// Check authentication status
	async function checkAuthenticationStatus() {
		isCheckingAuth = true;
		authError = null;

		try {
			const isAuth = await checkAuth();
			if (!isAuth) {
				const currentUrl = $page.url.pathname + $page.url.search;
				goto(`/login?returnTo=${encodeURIComponent(currentUrl)}`);
			} else {
				// If authenticated, load user data
				await loadUserData();
			}
		} catch (error) {
			console.error('Auth check error:', error);
			authError = 'Ошибка проверки авторизации';
		} finally {
			isCheckingAuth = false;
		}
	}

	// Email verification success message
	let showSuccessMessage = $state(false);
	let successMessage = $state('');

	// Copy functionality
	let copyState = $state({
		show: false,
		message: ''
	});

	// Check for verification success message and initialize
	onMount(() => {
		const urlParams = new URLSearchParams($page.url.search);
		const message = urlParams.get('message');

		if (message === 'email_verified') {
			showSuccessMessage = true;
			successMessage =
				'Email успешно подтвержден! Теперь вы можете пользоваться всеми функциями сервиса.';
			// Auto-hide after 5 seconds
			setTimeout(() => {
				showSuccessMessage = false;
				// Clear URL params
				window.history.replaceState({}, '', '/profile');
			}, 5000);
		} else if (message === 'email_already_verified') {
			showSuccessMessage = true;
			successMessage = 'Email уже был подтвержден ранее.';
			setTimeout(() => {
				showSuccessMessage = false;
				window.history.replaceState({}, '', '/profile');
			}, 3000);
		}

		// Load user data on component mount
		if (!authState.isAuthenticated) {
			checkAuthenticationStatus();
		} else {
			loadUserData();
		}
	});

	// Mask secret key showing only last 4 characters
	function maskSecretKey(key) {
		if (!key || key.length <= 4) {
			return key || 'Не указано';
		}
		const visiblePart = key.slice(-4);
		const maskedPart = '*'.repeat(key.length - 4);
		return maskedPart + visiblePart;
	}

	// Copy key to clipboard
	async function copyKey() {
		const user = getUserDisplayData();
		const key = user?.key;
		if (!key) {
			copyState.show = true;
			copyState.message = 'Ошибка: секретный ключ не найден';
			setTimeout(() => {
				copyState.show = false;
			}, 3000);
			return;
		}

		try {
			await navigator.clipboard.writeText(key);
			copyState.show = true;
			copyState.message = 'Ключ скопирован в буфер обмена!';

			setTimeout(() => {
				copyState.show = false;
			}, 3000);
		} catch (error) {
			console.error('Failed to copy key:', error);
			copyState.show = true;
			copyState.message = 'Ошибка копирования ключа';

			setTimeout(() => {
				copyState.show = false;
			}, 3000);
		}
	}
</script>

<svelte:head>
	<title>Профиль - B5 Agent</title>
</svelte:head>

<!-- Main content -->
<div class="relative isolate bg-gray-950 py-16 sm:py-24">
	<!-- Success Message -->
	{#if showSuccessMessage}
		<div class="fixed left-1/2 top-24 z-[9999] w-full max-w-md -translate-x-1/2 transform px-4">
			<div
				class="rounded-lg border border-green-500/30 bg-green-500/20 p-4 shadow-lg backdrop-blur-sm"
			>
				<div class="flex items-center justify-center text-center">
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

	{#if copyState.show}
		<div class="fixed left-1/2 top-24 z-[9999] w-full max-w-md -translate-x-1/2 transform px-4">
			<div
				class="rounded-lg border border-blue-500/30 bg-blue-500/20 p-4 shadow-lg backdrop-blur-sm"
			>
				<div class="flex items-center text-center">
					<svg
						class="mr-3 h-6 w-6 text-blue-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
						/>
					</svg>
					<p class="text-sm font-medium text-blue-300">{copyState.message}</p>
				</div>
			</div>
		</div>
	{/if}

	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<!-- Page Header -->
		<div class="mx-auto mb-16 text-center">
			<h1 class="text-4xl font-normal tracking-widest text-white sm:text-6xl">Профиль</h1>
		</div>

		<!-- Error Messages -->
		{#if authError}
			<div class="mb-8 rounded-lg border border-red-500/30 bg-red-500/20 p-6 backdrop-blur-sm">
				<div class="flex items-start gap-4">
					<svg class="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
							clip-rule="evenodd"
						/>
					</svg>
					<div>
						<h3 class="mb-1 text-sm font-semibold text-red-400">Ошибка</h3>
						<p class="text-sm text-red-300">{authError}</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Loading States -->
		{#if isCheckingAuth}
			<div class="flex min-h-[50vh] items-center justify-center">
				<div class="text-center">
					<div
						class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
					></div>
					<p class="mt-4 text-lg text-gray-300">Проверка авторизации...</p>
				</div>
			</div>
		{:else if isLoading && !getUserDisplayData()}
			<div class="flex min-h-[50vh] items-center justify-center">
				<div class="text-center">
					<div
						class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
					></div>
					<p class="mt-4 text-lg text-gray-300">Загрузка данных пользователя...</p>
				</div>
			</div>
		{:else}
			<!-- User Info Card -->
			<div class="mb-8 rounded-lg bg-white/5 p-8 backdrop-blur-sm">
				<h2 class="mb-6 text-2xl font-semibold tracking-wide text-white">Профиль агента</h2>

				{#if getUserDisplayData()}
					{@const user = getUserDisplayData()}
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<label for="user-name" class="mb-2 block text-sm font-medium text-gray-400">
								Имя
							</label>
							<div id="user-name" class="rounded-md bg-white/10 px-4 py-3 text-lg text-white">
								{user.name || 'Не указано'}
							</div>
						</div>

						<div>
							<label for="user-key" class="mb-2 block text-sm font-medium text-gray-400">
								Секретный ключ (кликните для копирования)
							</label>
							<button
								type="button"
								id="user-key"
								class="cursor-pointer select-none rounded-md bg-white/10 px-4 py-3 font-mono text-lg tracking-widest text-white transition-all duration-200 hover:scale-105 hover:bg-white/20 hover:shadow-lg active:scale-95"
								onclick={copyKey}
								title="Кликните для копирования ключа"
								style="user-select: none;"
							>
								{maskSecretKey(user.key)}
							</button>
						</div>

						<div>
							<label for="user-region" class="mb-2 block text-sm font-medium text-gray-400">
								Регион
							</label>
							<div id="user-region" class="rounded-md bg-white/10 px-4 py-3 text-lg text-white">
								{user.region || 'Не указано'}
							</div>
						</div>

						<div>
							<label for="user-email" class="mb-2 block text-sm font-medium text-gray-400">
								Email
							</label>
							<div id="user-email" class="rounded-md bg-white/10 px-4 py-3 text-lg text-white">
								{user.email || 'Не указано'}
							</div>
						</div>

						<div>
							<label for="email-status" class="mb-2 block text-sm font-medium text-gray-400">
								Статус Email
							</label>
							<div id="email-status" class="rounded-md bg-white/10 px-4 py-3 text-lg text-white">
								{#if user.email_verified_at}
									<span class="inline-flex items-center whitespace-nowrap text-green-400">
										<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clip-rule="evenodd"
											/>
										</svg>
										Подтвержден
									</span>
								{:else}
									<span class="inline-flex items-center text-yellow-400">
										<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
												clip-rule="evenodd"
											/>
										</svg>
										Не подтвержден
									</span>
								{/if}
							</div>
						</div>

						<div>
							<label for="user-id" class="mb-2 block text-sm font-medium text-gray-400">
								Телефон
							</label>
							<div id="user-id" class="rounded-md bg-white/10 px-4 py-3 text-lg text-white">
								{formatPhone(user.phone)}
							</div>
						</div>
					</div>
				{:else}
					<div class="flex items-center justify-center py-12">
						<div class="text-center">
							<svg class="mx-auto h-12 w-12 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
									clip-rule="evenodd"
								/>
							</svg>
							<p class="mt-4 text-gray-400">Не удалось загрузить информацию о пользователе</p>
							<button
								onclick={checkAuthenticationStatus}
								disabled={isCheckingAuth}
								class="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{#if isCheckingAuth}
									<span>Проверка...</span>
								{:else}
									<span>Повторить попытку</span>
								{/if}
							</button>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Page footer content wrapped to container -->
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<!-- Navigation Actions -->
		<NavigationCards currentPage="profile" />

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
