<script>
	import { authState, resendEmailVerificationNotification } from '$lib/auth/auth.svelte.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let cooldownTime = $state(0);
	let isResending = $state(false);
	let showSuccess = $state(false);
	let showError = $state(false);
	let errorMessage = $state('');

	// Redirect if already verified
	$effect(() => {
		if (authState.user?.email_verified_at) {
			goto('/form');
		}
	});

	// Cooldown timer for resend button
	function startCooldown() {
		cooldownTime = 60;
		const timer = setInterval(() => {
			cooldownTime--;
			if (cooldownTime <= 0) {
				clearInterval(timer);
			}
		}, 1000);
	}

	// Handle resend email using JWT
	async function handleResendEmail() {
		if (cooldownTime > 0 || isResending) return;

		isResending = true;

		try {
			const success = await resendEmailVerificationNotification();

			if (success) {
				startCooldown();
				showSuccess = true;
				setTimeout(() => (showSuccess = false), 3000);
			} else {
				throw new Error(authState.emailVerificationError || 'Failed to resend email');
			}
		} catch (error) {
			console.error('❌ Resend email failed:', error);
			showError = true;
			errorMessage = authState.emailVerificationError || 'Не удалось переотправить письмо. Попробуйте еще раз.';
			setTimeout(() => (showError = false), 3000);
		} finally {
			isResending = false;
		}
	}

	// Handle email verification from URL
	async function handleEmailVerificationFromUrl() {
		const urlParams = new URLSearchParams($page.url.search);
		const id = urlParams.get('id');
		const hash = urlParams.get('hash');
		const expires = urlParams.get('expires');
		const signature = urlParams.get('signature');

		if (id && hash && !showSuccess) {
			// Don't verify again if already successful
			try {
				const { verifyEmailWithParams } = await import('$lib/api/auth.js');
				const result = await verifyEmailWithParams(id, hash);

			if (result.success) {
					// Update auth state with verified user data immediately
					const { setUser, markEmailAsVerified } = await import('$lib/auth/auth.svelte.js');
					
					if (result.user) {
						setUser(result.user);
					} else {
						// If API doesn't return user, manually mark as verified
						markEmailAsVerified();
					}

					// Redirect immediately to form with verified flag
					// The form page will show the success message and refresh user data
					window.location.href = '/form?verified=true';
				} else {
					console.error('❌ Email verification failed:', result.message);
					showError = true;
					errorMessage = result.message || 'Ошибка верификации email';
				}
			} catch (error) {
				console.error('❌ Email verification error:', error);
				showError = true;
				errorMessage = 'Произошла ошибка при верификации email';
			}

			return true; // URL had verification parameters
		}

		return false; // No verification parameters in URL
	}

	// Start initial cooldown
	onMount(async () => {
		// Check for email verification parameters first
		const hasVerificationParams = await handleEmailVerificationFromUrl();

		// If we're handling verification, skip other checks
		if (hasVerificationParams) {
			return;
		}

		// Check for registration flag from URL
		const urlParams = new URLSearchParams($page.url.search);
		const fromRegistration = urlParams.get('from_registration') === 'true';
		const emailJustSent = urlParams.get('sent') === 'true';

		// If coming from registration, wait a bit for auth state to initialize
		if (fromRegistration && !authState.isAuthenticated) {
			// Wait for auth state to be updated
			await new Promise(resolve => setTimeout(resolve, 500));
		}

		// If not authenticated after waiting, redirect to login
		if (!authState.isAuthenticated) {
			console.warn('⚠️ No authentication found, redirecting to login');
			showError = true;
			errorMessage = 'Сессия истекла. Пожалуйста, войдите в систему заново.';
			setTimeout(() => {
				goto('/login');
			}, 3000);
			return;
		}

		// If email was just sent from form page, show success and start cooldown
		if (emailJustSent) {
			showSuccess = true;
			setTimeout(() => (showSuccess = false), 3000);
			// Clear sent param from URL
			const url = new URL(window.location);
			url.searchParams.delete('sent');
			window.history.replaceState({}, '', url);
		}

		startCooldown();

		// Check for error messages from URL
		const error = urlParams.get('error');

		if (error === 'invalid_link') {
			showError = true;
			errorMessage = 'Недействительная ссылка для подтверждения. Попробуйте переотправить письмо.';
		} else if (error === 'verification_failed') {
			showError = true;
			errorMessage = 'Произошла ошибка при подтверждении email. Попробуйте еще раз.';
		}
	});
</script>

<svelte:head>
	<title>Подтверждение Email RUBONUS – Верификация почты агента</title>
	<meta name="description" content="Подтвердите ваш email адрес для полного доступа к функциям RUBONUS. Верификация почты агента для безопасности аккаунта." />
	<meta name="keywords" content="подтверждение email, верификация почты, активация аккаунта, RUBONUS" />
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
			<div class="mb-8 inline-flex items-center justify-center">
				<div
					class="rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-3 ring-1 ring-white/10 backdrop-blur-sm"
				>
					<svg
						class="h-12 w-12 text-indigo-400 transition-transform duration-500 hover:scale-110"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
						></path>
					</svg>
				</div>
			</div>
			<h1
				class="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl"
			>
				Подтвердите вашу почту
			</h1>
			<p class="mt-6 text-lg leading-8 text-gray-300">
				Мы отправили письмо с подтверждением на<br />
				<span class="font-semibold text-indigo-400">{authState.user?.email || 'вашу почту'}</span>
			</p>
		</div>

		<!-- Main Card -->
		<div class="mx-auto mt-8 max-w-md sm:mt-12">
			<!-- Success Notification -->
			{#if showSuccess}
				<div
					class="animate-slide-in mb-6 rounded-xl border border-green-500/20 bg-green-500/10 p-4 backdrop-blur-sm"
				>
					<div class="flex items-start gap-3">
						<div
							class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500/20"
						>
							<svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
						<div class="flex-1">
							<h4 class="text-sm font-medium text-white">Письмо отправлено</h4>
							<p class="mt-1 text-sm text-green-300">Проверьте вашу почту</p>
						</div>
						<button
							class="text-green-400 transition-colors hover:text-green-300"
							onclick={() => (showSuccess = false)}
							aria-label="Закрыть уведомление"
						>
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</button>
					</div>
				</div>
			{/if}

			<!-- Error Notification -->
			{#if showError}
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
						<div class="flex-1">
							<h4 class="text-sm font-medium text-white">Ошибка</h4>
							<p class="mt-1 text-sm text-red-300">{errorMessage}</p>
						</div>
						<button
							class="text-red-400 transition-colors hover:text-red-300"
							onclick={() => (showError = false)}
							aria-label="Закрыть уведомление"
						>
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</button>
					</div>
				</div>
			{/if}

			<div
				class="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/50 backdrop-blur-xl"
			>
				<!-- Status Card -->
				<div class="mb-6 rounded-xl border border-white/10 bg-white/5 p-6">
					<div class="flex items-start gap-4">
						<div class="flex-shrink-0">
							<div
								class="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500"
							>
								<svg class="size-7 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									></path>
								</svg>
							</div>
						</div>
						<div class="flex-1 mx-auto">
							<h3 class="font-semibold text-white">Email отправлен</h3>
							<p class="mt-1 text-sm text-gray-400">Проверьте папку "Входящие" и "Спам"</p>
						</div>
					</div>
				</div>

				<!-- Resend Button -->
				<button
					onclick={handleResendEmail}
					disabled={cooldownTime > 0 || isResending}
					class="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/40 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
				>
					<span class="relative z-10 flex items-center justify-center gap-2">
						{#if isResending}
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
							Отправляем...
						{:else if cooldownTime > 0}
							<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							Доступно через {cooldownTime}с
						{:else}
							<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
							Переотправить письмо
						{/if}
					</span>
					<div
						class="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 transition-opacity group-hover:opacity-100"
					></div>
				</button>

				<!-- Help Section -->
				<div class="mt-8 space-y-4 border-t border-white/10 pt-6">
					<p class="text-center text-sm font-medium text-gray-400">Не получили письмо?</p>
					<div class="flex flex-col gap-3 text-sm sm:flex-row sm:justify-center">
						<button
							class="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-gray-300 transition-all hover:border-indigo-400/30 hover:bg-indigo-500/10 hover:text-indigo-300"
						>
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
								/>
							</svg>
							Проверьте папку спам
						</button>
						<a
							href="mailto:support@rubonus.ru"
							class="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-gray-300 transition-all hover:border-indigo-400/30 hover:bg-indigo-500/10 hover:text-indigo-300"
						>
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
								/>
							</svg>
							Поддержка
						</a>
					</div>
				</div>
			</div>

			<!-- Back to Login -->
			<div class="mt-8 text-center">
				<a
					href="/login"
					class="text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
				>
					← Вернуться к входу
				</a>
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
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-shake {
		animation: shake 0.5s ease-in-out;
	}

	.animate-slide-in {
		animation: slide-in 0.3s ease-out;
	}
</style>
