<script>
	import { loginWithCookie, authState } from '$lib/auth/auth.svelte.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	// Storage keys for "Remember Me" feature
	const REMEMBER_ME_KEY = 'b5_agent_remember_me';
	const SAVED_EMAIL_KEY = 'b5_agent_saved_email';
	const SAVED_PASSWORD_KEY = 'b5_agent_saved_password';

	// Get redirectTo parameter from URL
	let redirectTo = $derived.by(() => {
		const redirect = page.url.searchParams.get('returnTo') || '/form';
		return redirect;
	});

	// Check if session expired
	let sessionExpired = $derived.by(() => {
		return page.url.searchParams.get('expired') === '1';
	});

	// Form state using Svelte 5 runes
	let formData = $state({
		email: '',
		password: '',
		rememberMe: false
	});

	// Form errors state
	let errors = $state({
		email: '',
		password: '',
		general: ''
	});

	// Loading state
	let isLoading = $state(false);

	// Password visibility state
	let showPassword = $state(false);

	// Restore saved credentials from localStorage on mount (for manual login if needed)
	onMount(() => {
		if (browser) {
			const savedRememberMe = localStorage.getItem(REMEMBER_ME_KEY);
			if (savedRememberMe === 'true') {
				formData.rememberMe = true;
				const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY);
				const savedPassword = localStorage.getItem(SAVED_PASSWORD_KEY);
				
				if (savedEmail) {
					formData.email = savedEmail;
				}
				if (savedPassword) {
					formData.password = savedPassword;
				}
			}
		}
	});

	// Note: Server-side redirect is handled by +layout.server.js
	// No need for client-side redirect check here to avoid redirect loops

	/**
	 * Handle form submission
	 * @param {SubmitEvent} event
	 */
	async function handleSubmit(event) {
		event.preventDefault();

		// Reset errors
		errors = {
			email: '',
			password: '',
			general: ''
		};

		// Basic validation
		if (!formData.email) {
			errors.email = 'Email обязателен';
			return;
		}

		if (!formData.password) {
			errors.password = 'Пароль обязателен';
			return;
		}

		isLoading = true;

		try {
			// Save or clear "Remember Me" credentials in localStorage
			if (browser) {
				if (formData.rememberMe) {
					localStorage.setItem(REMEMBER_ME_KEY, 'true');
					localStorage.setItem(SAVED_EMAIL_KEY, formData.email);
					localStorage.setItem(SAVED_PASSWORD_KEY, formData.password);
				} else {
					localStorage.removeItem(REMEMBER_ME_KEY);
					localStorage.removeItem(SAVED_EMAIL_KEY);
					localStorage.removeItem(SAVED_PASSWORD_KEY);
				}
			}

			const success = await loginWithCookie(formData.email, formData.password, formData.rememberMe);

			console.log('🔐 Login result:', { success, isAuthenticated: authState.isAuthenticated });

			// Redirect if login was successful OR if authState shows authenticated
			if (success || authState.isAuthenticated) {
				console.log('✅ Login successful, redirecting to:', redirectTo);
				// Always redirect with full page reload
				// Email verification check will be done on the target page
				window.location.href = redirectTo;
				return; // Prevent further execution
			} else {
				// Show error from auth state
				errors.general = authState.error || authState.loginError || 'Ошибка авторизации';
				isLoading = false;
			}
		} catch (error) {
			console.error('💥 Login error:', error);
			errors.general = 'Произошла ошибка при входе';
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Вход в личный кабинет RUBONUS – Авторизация агента</title>
	<meta name="description" content="Войдите в личный кабинет RUBONUS для управления проектами, просмотра статистики и отслеживания выплат. Безопасная авторизация агентов." />
	<meta name="keywords" content="вход RUBONUS, авторизация агента, личный кабинет, вход в систему" />
</svelte:head>

<div class="relative isolate min-h-screen bg-gray-950 py-8 sm:py-20">
	<!-- Animated gradient background -->
	<div class="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
		<div
			class="absolute top-0 left-1/2 -translate-x-1/2 blur-3xl"
			style="width: 90rem; height: 50rem;"
		>
			<div
				class="aspect-[1155/678] w-full bg-gradient-to-tr from-indigo-500/30 via-purple-500/20 to-pink-500/30 opacity-30"
				style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
			></div>
		</div>
	</div>

	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<!-- Header -->
		<div class="mx-auto max-w-2xl text-center">
			<div class="mb-8 hidden items-center justify-center sm:inline-flex">
				<div
					class="rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-3 ring-1 ring-white/10 backdrop-blur-sm"
				>
					<svg
						class="h-12 w-12 text-indigo-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
						/>
					</svg>
				</div>
			</div>
			<h1
				class="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl"
			>
				Вход в систему
			</h1>
		</div>

		<!-- Form Card -->
		<div class="mx-auto mt-6 max-w-md sm:mt-12">
			{#if sessionExpired}
				<div
					class="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 backdrop-blur-sm"
				>
					<div class="flex items-start gap-3">
						<svg class="h-5 w-5 flex-shrink-0 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
								clip-rule="evenodd"
							/>
						</svg>
						<p class="text-sm text-amber-300">Ваша сессия истекла. Пожалуйста, войдите снова.</p>
					</div>
				</div>
			{/if}

			{#if errors.general}
				<div
					class="mb-6 animate-shake rounded-xl border border-red-500/20 bg-red-500/10 p-4 backdrop-blur-sm"
				>
					<div class="flex items-start gap-3">
						<svg class="h-5 w-5 flex-shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
								clip-rule="evenodd"
							/>
						</svg>
						<p class="text-sm text-red-300">{errors.general}</p>
					</div>
				</div>
			{/if}

			<div
				class="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/50 backdrop-blur-xl"
			>
				<form onsubmit={handleSubmit} class="space-y-4 sm:space-y-6">
					<!-- Email Field -->
					<div>
						<label for="email" class="block text-sm font-medium text-gray-200">Email</label>
						<div class="relative mt-2">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<svg
									class="h-5 w-5 text-gray-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
									/>
								</svg>
							</div>
							<input
								type="email"
								name="email"
								id="email"
								autocomplete="email"
								bind:value={formData.email}
								disabled={isLoading}
								placeholder="your@email.com"
								class="block w-full rounded-lg border-0 bg-white/5 py-2.5 pr-4 pl-10 text-white shadow-sm ring-1 ring-white/10 transition-all ring-inset placeholder:text-gray-500 hover:bg-white/10 focus:bg-white/10 focus:ring-2 focus:ring-indigo-500 focus:ring-inset disabled:cursor-not-allowed disabled:opacity-50 sm:py-3 {errors.email
									? 'ring-red-500/50 focus:ring-red-500'
									: ''}"
							/>
						</div>
						{#if errors.email}
							<p class="mt-2 text-sm text-red-400">{errors.email}</p>
						{/if}
					</div>

					<!-- Password Field -->
					<div>
						<label for="password" class="block text-sm font-medium text-gray-200">Пароль</label>
						<div class="relative mt-2">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<svg
									class="h-5 w-5 text-gray-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
							</div>
							<input
								type={showPassword ? 'text' : 'password'}
								name="password"
								id="password"
								autocomplete="current-password"
								bind:value={formData.password}
								disabled={isLoading}
								placeholder="••••••••"
								class="block w-full rounded-lg border-0 bg-white/5 py-2.5 pr-10 pl-10 text-white shadow-sm ring-1 ring-white/10 transition-all ring-inset placeholder:text-gray-500 hover:bg-white/10 focus:bg-white/10 focus:ring-2 focus:ring-indigo-500 focus:ring-inset disabled:cursor-not-allowed disabled:opacity-50 sm:py-3 {errors.password
									? 'ring-red-500/50 focus:ring-red-500'
									: ''}"
							/>
							<button
								type="button"
								onclick={() => showPassword = !showPassword}
								class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-300 hover:text-gray-500 transition-colors"
								aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
							>
								{#if showPassword}
									<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
									</svg>
								{:else}
									<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
									</svg>
								{/if}
							</button>
						</div>
						{#if errors.password}
							<p class="mt-2 text-sm text-red-400">{errors.password}</p>
						{/if}
					</div>

					<!-- Remember Me & Forgot Password -->
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<input
								id="remember-me"
								name="remember-me"
								type="checkbox"
								bind:checked={formData.rememberMe}
								disabled={isLoading}
								class="h-4 w-4 rounded border-white/20 bg-white/5 text-indigo-500 transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
							/>
							<label for="remember-me" class="text-sm text-gray-300">Запомнить меня</label>
						</div>
						<a
							href="/forgot-password"
							class="text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
						>
							Забыли пароль?
						</a>
					</div>

					<!-- Submit Button -->
					<button
						type="submit"
						disabled={isLoading}
						class="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/40 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
					>
						<span class="relative z-10 flex items-center justify-center gap-2">
							{#if isLoading}
								<svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
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
								</svg>
								Входим...
							{:else}
								Войти
								<svg
									class="h-5 w-5 transition-transform group-hover:translate-x-1"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 7l5 5m0 0l-5 5m5-5H6"
									/>
								</svg>
							{/if}
						</span>
						<div
							class="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 transition-opacity group-hover:opacity-100"
						></div>
					</button>
				</form>
			</div>

			<!-- Sign Up Link -->
			<div class="mt-8 text-center">
				<p class="text-sm text-gray-400">
					Нет аккаунта?
					<a
						href="/registration"
						class="font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
					>
						Зарегистрируйтесь
					</a>
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		10%,
		30%,
		50%,
		70%,
		90% {
			transform: translateX(-4px);
		}
		20%,
		40%,
		60%,
		80% {
			transform: translateX(4px);
		}
	}

	.animate-shake {
		animation: shake 0.5s ease-in-out;
	}

	/* Override @tailwindcss/forms plugin defaults for input fields */
	:global(#email),
	:global(#password) {
		background-color: rgb(255 255 255 / 0.05) !important;
		color: white !important;
	}

	:global(#email:hover),
	:global(#password:hover),
	:global(#email:focus),
	:global(#password:focus) {
		background-color: rgb(255 255 255 / 0.1) !important;
		color: white !important;
	}

	:global(#email::placeholder),
	:global(#password::placeholder) {
		color: rgb(107 114 128) !important;
	}
</style>
