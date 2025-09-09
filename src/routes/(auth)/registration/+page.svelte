<!-- <script>
	import RegisterForm from '$lib/components/RegisterForm.svelte';
</script>

<svelte:head>
	<title>Register - B5 Agent</title>
	<meta name="description" content="Create a new account for B5 Agent" />
</svelte:head>

<main class="register-page">
	<div class="container">
		<RegisterForm />
	</div>
</main>

<style>
	.register-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f8f9fa;
		padding: 1rem;
	}

	.container {
		width: 100%;
		max-width: 500px;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.register-page {
			padding: 0.5rem;
		}
	}
</style> -->

<script>
	import { register, authState } from '$lib/auth/auth.svelte.js';
	import { goto } from '$app/navigation';

	// Form state using Svelte 5 runes
	let formData = $state({
		firstName: '',
		city: '',
		email: '',
		password: '',
		passwordConfirm: '',
		termsAccepted: false
	});

	// Form errors state
	let errors = $state({
		firstName: '',
		city: '',
		email: '',
		password: '',
		passwordConfirm: '',
		terms: '',
		general: ''
	});

	// Success notification state
	let showSuccess = $state(false);

	// Loading state
	let isLoading = $state(false);

	// Redirect if already authenticated
	$effect(() => {
		if (authState.isAuthenticated) {
			console.log('👤 User already authenticated, redirecting to dashboard');
			goto('/dashboard');
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
			city: '',
			email: '',
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

		if (!formData.city) {
			errors.city = 'Город обязателен';
			return false;
		}

		if (!formData.email) {
			errors.email = 'Email обязателен';
			return false;
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
				formData.passwordConfirm
			);

			if (result) {
				console.log('✅ Registration successful');
				showSuccess = true;

				// Auto-hide notification after 3 seconds
				setTimeout(() => {
					showSuccess = false;
				}, 3000);

				// Redirect to dashboard
				setTimeout(() => {
					goto('/dashboard');
				}, 1500);
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
	<div class="notification-container fixed right-4 top-4 z-50">
		<div
			class="notification glass-card slide-in min-w-80 transform p-4 transition-all duration-300"
		>
			<div class="flex items-start space-x-3">
				<div class="flex-shrink-0">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
						<span class="text-lg">✅</span>
					</div>
				</div>
				<div class="min-w-0 flex-1">
					<h4 class="text-sm font-medium leading-tight text-white">Регистрация прошла успешно</h4>
					<p class="mt-1 text-sm leading-relaxed text-gray-300">
						Перенаправляем вас на главную страницу
					</p>
				</div>
			</div>
		</div>
	</div>
{/if}

<div class="relative isolate bg-gray-900 py-24 sm:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto text-center">
			<h2 class="text-pretty text-4xl font-normal tracking-widest text-white sm:text-6xl">
				Регистрация
			</h2>
		</div>

		<div class="mx-auto mt-16 max-w-xl">
			{#if errors.general}
				<div class="mb-6 rounded-md bg-red-500/10 p-4 text-red-400">
					{errors.general}
				</div>
			{/if}

			<form onsubmit={handleRegistration} class="space-y-8">
				<div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
					<div>
						<label for="first-name" class="block text-sm/6 font-semibold text-white">Ваше имя</label
						>
						<div class="mt-2.5">
							<input
								type="text"
								name="first-name"
								id="first-name"
								autocomplete="given-name"
								bind:value={formData.firstName}
								disabled={isLoading}
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 disabled:opacity-50 {errors.firstName
									? 'outline-red-500'
									: ''}"
							/>
							{#if errors.firstName}
								<p class="mt-1 text-sm text-red-400">{errors.firstName}</p>
							{/if}
						</div>
					</div>
					<div>
						<label for="city" class="block text-sm/6 font-semibold text-white">Город</label>
						<div class="mt-2.5">
							<input
								type="text"
								name="city"
								id="city"
								autocomplete="address-level2"
								bind:value={formData.city}
								disabled={isLoading}
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 disabled:opacity-50 {errors.city
									? 'outline-red-500'
									: ''}"
							/>
							{#if errors.city}
								<p class="mt-1 text-sm text-red-400">{errors.city}</p>
							{/if}
						</div>
					</div>
					<div class="sm:col-span-2">
						<label for="email" class="block text-sm/6 font-semibold text-white">Email</label>
						<div class="mt-2.5">
							<input
								type="email"
								name="email"
								id="email"
								autocomplete="email"
								bind:value={formData.email}
								disabled={isLoading}
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 disabled:opacity-50 {errors.email
									? 'outline-red-500'
									: ''}"
							/>
							{#if errors.email}
								<p class="mt-1 text-sm text-red-400">{errors.email}</p>
							{/if}
						</div>
					</div>
					<div class="sm:col-span-2">
						<label for="password" class="block text-sm/6 font-semibold text-white">Пароль</label>
						<div class="mt-2.5">
							<input
								type="password"
								name="password"
								id="password"
								autocomplete="new-password"
								bind:value={formData.password}
								disabled={isLoading}
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 disabled:opacity-50 {errors.password
									? 'outline-red-500'
									: ''}"
							/>
							{#if errors.password}
								<p class="mt-1 text-sm text-red-400">{errors.password}</p>
							{/if}
						</div>
					</div>
					<div class="sm:col-span-2">
						<label for="password-confirm" class="block text-sm/6 font-semibold text-white"
							>Подтверждение пароля</label
						>
						<div class="mt-2.5">
							<input
								type="password"
								name="password-confirm"
								id="password-confirm"
								autocomplete="new-password"
								bind:value={formData.passwordConfirm}
								disabled={isLoading}
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 disabled:opacity-50 {errors.passwordConfirm
									? 'outline-red-500'
									: ''}"
							/>
							{#if errors.passwordConfirm}
								<p class="mt-1 text-sm text-red-400">{errors.passwordConfirm}</p>
							{/if}
						</div>
					</div>
					<div class="sm:col-span-2">
						<div class="flex items-center gap-x-3">
							<input
								id="terms"
								name="terms"
								type="checkbox"
								bind:checked={formData.termsAccepted}
								disabled={isLoading}
								class="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900 disabled:opacity-50 {errors.terms
									? 'border-red-500'
									: ''}"
							/>
							<label for="terms" class="text-sm/6 text-white {errors.terms ? 'text-red-400' : ''}">
								Я согласен с
								<a href="/152fz" class="font-semibold text-indigo-400 hover:text-indigo-300"
									>политикой обработки персональных данных</a
								>
							</label>
						</div>
						{#if errors.terms}
							<p class="mt-1 text-sm text-red-400">{errors.terms}</p>
						{/if}
					</div>
				</div>
				<div class="mt-8 flex justify-end">
					<button
						type="submit"
						disabled={isLoading || !formData.termsAccepted}
						class="rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 {formData.termsAccepted &&
						!isLoading
							? 'bg-indigo-400 hover:bg-pink-400'
							: 'cursor-not-allowed bg-gray-600'}"
					>
						{#if isLoading}
							Регистрация...
						{:else}
							Зарегистрироваться
						{/if}
					</button>
				</div>
			</form>

			<div class="mt-10 border-t border-white/10 pt-8 text-center">
				<p class="text-sm text-gray-400">
					Уже зарегистрированы? <a
						href="/login"
						class="font-semibold text-indigo-400 hover:text-indigo-300">Войти</a
					>
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	.glass-card {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
	}

	.slide-in {
		animation: slideInFromRight 0.3s ease-out;
	}

	@keyframes slideInFromRight {
		from {
			opacity: 0;
			transform: translateX(100%);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.notification-container {
		pointer-events: none;
	}

	.notification {
		pointer-events: auto;
	}
</style>
