<script>
	import { register, authState } from '$lib/auth/auth.svelte.js';
	import { goto } from '$app/navigation';

	// Form state using Svelte 5 runes
	let formData = $state({
		firstName: '',
		region: '',
		email: '',
		phone: '',
		password: '',
		passwordConfirm: '',
		termsAccepted: false
	});

	// Form errors state
	let errors = $state({
		firstName: '',
		region: '',
		email: '',
		phone: '',
		password: '',
		passwordConfirm: '',
		terms: '',
		general: ''
	});

	// Success notification state
	let showSuccess = $state(false);

	// Loading state
	let isLoading = $state(false);

	// Redirect if already authenticated and email is verified
	$effect(() => {
		if (authState.isAuthenticated) {
			// Check if email is verified
			if (!authState.user?.email_verified_at) {
				// Email not verified - redirect to email verification page
				console.log('📧 User authenticated but email not verified, redirecting to email-verify');
				goto('/email-verify');
			} else {
				// Email verified - redirect to dashboard
				console.log('👤 User already authenticated, redirecting to dashboard');
				goto('/dashboard');
			}
		}
	});

	/**
	 * Form submission handler using API instead of form action
	 * @param {SubmitEvent & { currentTarget: EventTarget & HTMLFormElement}} event
	 */
	async function handleRegistration(event) {
		event.preventDefault();

		// Reset errors
		errors = {
			firstName: '',
			region: '',
			email: '',
			phone: '',
			password: '',
			passwordConfirm: '',
			terms: '',
			general: ''
		};

		// Basic validation (client-side)
		if (!formData.firstName) {
			errors.firstName = 'Имя обязательно';
			return false;
		}

		if (!formData.region) {
			errors.region = 'Регион обязателен';
			return false;
		}

		if (!formData.email) {
			errors.email = 'Email обязателен';
			return false;
		}

		// Validate phone (optional field)
		if (formData.phone && formData.phone.trim()) {
			const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,20}$/;
			if (!phoneRegex.test(formData.phone.trim())) {
				errors.phone = 'Пожалуйста, введите корректный номер телефона';
				return false;
			}
		}

		if (!formData.password) {
			errors.password = 'Пароль обязателен';
			return false;
		}

		if (formData.password.length < 8) {
			errors.password = 'Пароль должен содержать минимум 8 символов';
			return false;
		}

		if (!formData.passwordConfirm) {
			errors.passwordConfirm = 'Подтверждение пароля обязательно';
			return false;
		}

		if (formData.password !== formData.passwordConfirm) {
			errors.passwordConfirm = 'Пароли не совпадают';
			return false;
		}

		if (!formData.termsAccepted) {
			errors.terms = 'Необходимо принять условия';
			return false;
		}

		// Call registration API
		try {
			isLoading = true;

			console.log('📝 Starting registration...');

			// Use the b5-agent auth system to register
			const result = await register(
				formData.firstName,
				formData.email,
				formData.password,
				formData.passwordConfirm,
				formData.region,
				formData.phone
			);

			if (result) {
				console.log('✅ Registration successful');
				showSuccess = true;

				// Auto-hide notification after 3 seconds
				setTimeout(() => {
					showSuccess = false;
				}, 3000);

				// Redirect to email verification page immediately
				goto('/email-verify?from_registration=true');
			} else {
				console.log('❌ Registration failed');
				errors.general =
					authState.errors?.auth?.[0] || authState.errors?.general?.[0] || 'Ошибка регистрации';
			}
		} catch (error) {
			console.error('💥 Registration error:', error);
			errors.general = 'Произошла ошибка при регистрации';
		} finally {
			isLoading = false;
		}

		return true;
	}
</script>

<svelte:head>
	<title>Регистрация - B5 Agent</title>
	<meta name="description" content="Create a new account for B5 Agent" />
</svelte:head>

<!-- Success Notification -->
{#if showSuccess}
	<div class="animate-slide-in fixed top-4 right-4 z-50">
		<div
			class="min-w-80 rounded-xl border border-green-500/20 bg-green-500/10 p-4 shadow-xl backdrop-blur-xl"
		>
			<div class="flex items-start gap-3">
				<div class="flex-shrink-0">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 ring-2 ring-green-500/30"
					>
						<svg class="h-6 w-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
				</div>
				<div class="min-w-0 flex-1">
					<h4 class="text-sm font-semibold text-white">Регистрация прошла успешно</h4>
					<p class="mt-1 text-sm text-gray-300">Проверьте свою почту для подтверждения email</p>
				</div>
			</div>
		</div>
	</div>
{/if}

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
							d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
						/>
					</svg>
				</div>
			</div>
			<h1
				class="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl"
			>
				Регистрация
			</h1>
		</div>

		<!-- Form Card -->
		<div class="mx-auto mt-6 max-w-2xl sm:mt-12">
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
				<form onsubmit={handleRegistration} class="space-y-4 sm:space-y-6">
					<!-- Name and Region Row -->
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
						<!-- First Name -->
						<div>
							<label for="first-name" class="block text-sm font-medium text-gray-200"
								>Ваше имя</label
							>
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
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
								</div>
								<input
									type="text"
									name="first-name"
									id="first-name"
									autocomplete="given-name"
									bind:value={formData.firstName}
									disabled={isLoading}
									placeholder="Иван"
									class="block w-full rounded-lg border-0 bg-white/5 py-2.5 pr-4 pl-10 text-white shadow-sm ring-1 ring-white/10 transition-all ring-inset placeholder:text-gray-500 hover:bg-white/10 focus:bg-white/10 focus:ring-2 focus:ring-indigo-500 focus:ring-inset disabled:cursor-not-allowed disabled:opacity-50 sm:py-3 {errors.firstName
										? 'ring-red-500/50 focus:ring-red-500'
										: ''}"
								/>
							</div>
							{#if errors.firstName}
								<p class="mt-2 text-sm text-red-400">{errors.firstName}</p>
							{/if}
						</div>

						<!-- Region -->
						<div>
							<label for="region" class="block text-sm font-medium text-gray-200">Регион</label>
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
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
								</div>
								<input
									type="text"
									name="region"
									id="region"
									autocomplete="address-level2"
									bind:value={formData.region}
									disabled={isLoading}
									placeholder="Москва"
									class="block w-full rounded-lg border-0 bg-white/5 py-2.5 pr-4 pl-10 text-white shadow-sm ring-1 ring-white/10 transition-all ring-inset placeholder:text-gray-500 hover:bg-white/10 focus:bg-white/10 focus:ring-2 focus:ring-indigo-500 focus:ring-inset disabled:cursor-not-allowed disabled:opacity-50 sm:py-3 {errors.region
										? 'ring-red-500/50 focus:ring-red-500'
										: ''}"
								/>
							</div>
							{#if errors.region}
								<p class="mt-2 text-sm text-red-400">{errors.region}</p>
							{/if}
						</div>
					</div>

					<!-- Email and Phone Row -->
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
						<!-- Email -->
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

						<!-- Phone -->
						<div>
							<label for="phone" class="block text-sm font-medium text-gray-200"
								>Телефон <span class="text-gray-500">(необязательно)</span></label
							>
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
											d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
										/>
									</svg>
								</div>
								<input
									type="tel"
									name="phone"
									id="phone"
									autocomplete="tel"
									bind:value={formData.phone}
									disabled={isLoading}
									placeholder="+7 (900) 123-45-67"
									class="block w-full rounded-lg border-0 bg-white/5 py-2.5 pr-4 pl-10 text-white shadow-sm ring-1 ring-white/10 transition-all ring-inset placeholder:text-gray-500 hover:bg-white/10 focus:bg-white/10 focus:ring-2 focus:ring-indigo-500 focus:ring-inset disabled:cursor-not-allowed disabled:opacity-50 sm:py-3 {errors.phone
										? 'ring-red-500/50 focus:ring-red-500'
										: ''}"
								/>
							</div>
							{#if errors.phone}
								<p class="mt-2 text-sm text-red-400">{errors.phone}</p>
							{/if}
						</div>
					</div>

					<!-- Password Fields -->
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
						<!-- Password -->
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
									type="password"
									name="password"
									id="password"
									autocomplete="new-password"
									bind:value={formData.password}
									disabled={isLoading}
									placeholder="••••••••"
									class="block w-full rounded-lg border-0 bg-white/5 py-2.5 pr-4 pl-10 text-white shadow-sm ring-1 ring-white/10 transition-all ring-inset placeholder:text-gray-500 hover:bg-white/10 focus:bg-white/10 focus:ring-2 focus:ring-indigo-500 focus:ring-inset disabled:cursor-not-allowed disabled:opacity-50 sm:py-3 {errors.password
										? 'ring-red-500/50 focus:ring-red-500'
										: ''}"
								/>
							</div>
							{#if errors.password}
								<p class="mt-2 text-sm text-red-400">{errors.password}</p>
							{/if}
						</div>

						<!-- Password Confirm -->
						<div>
							<label for="password-confirm" class="block text-sm font-medium text-gray-200"
								>Повторите пароль</label
							>
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
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<input
									type="password"
									name="password-confirm"
									id="password-confirm"
									autocomplete="new-password"
									bind:value={formData.passwordConfirm}
									disabled={isLoading}
									placeholder="••••••••"
									class="block w-full rounded-lg border-0 bg-white/5 py-2.5 pr-4 pl-10 text-white shadow-sm ring-1 ring-white/10 transition-all ring-inset placeholder:text-gray-500 hover:bg-white/10 focus:bg-white/10 focus:ring-2 focus:ring-indigo-500 focus:ring-inset disabled:cursor-not-allowed disabled:opacity-50 sm:py-3 {errors.passwordConfirm
										? 'ring-red-500/50 focus:ring-red-500'
										: ''}"
								/>
							</div>
							{#if errors.passwordConfirm}
								<p class="mt-2 text-sm text-red-400">{errors.passwordConfirm}</p>
							{/if}
						</div>
					</div>

					<!-- Terms Checkbox -->
					<div>
						<div class="flex items-start gap-3">
							<div class="flex h-6 items-center">
								<input
									id="terms"
									name="terms"
									type="checkbox"
									bind:checked={formData.termsAccepted}
									disabled={isLoading}
									class="h-4 w-4 rounded border-white/20 bg-white/5 text-indigo-500 transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 {errors.terms
										? 'border-red-500/50'
										: ''}"
								/>
							</div>
							<label
								for="terms"
								class="text-xs leading-6 text-gray-300 {errors.terms ? 'text-red-400' : ''}"
							>
								Согласен с
								<a
									href="/privacy-policy"
									class="font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
									>политикой конфиденциальности</a
								>
							</label>
						</div>
						{#if errors.terms}
							<p class="mt-2 text-sm text-red-400">{errors.terms}</p>
						{/if}
					</div>

					<!-- Submit Button -->
					<button
						type="submit"
						disabled={isLoading || !formData.termsAccepted}
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
								Регистрация...
							{:else}
								Зарегистрироваться
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

			<!-- Sign In Link -->
			<div class="mt-8 text-center">
				<p class="text-sm text-gray-400">
					Уже зарегистрированы?
					<a
						href="/login"
						class="font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
					>
						Войти
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

	@keyframes slide-in {
		from {
			opacity: 0;
			transform: translateX(100%);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.animate-shake {
		animation: shake 0.5s ease-in-out;
	}

	.animate-slide-in {
		animation: slide-in 0.3s ease-out;
	}
</style>
