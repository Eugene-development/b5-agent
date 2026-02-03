<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { authState } from '$lib/auth/auth.svelte.js';
	import { goto, invalidate } from '$app/navigation';
	import LogoutButton from '$lib/components/LogoutButton.svelte';
	
	import ProjectSubmitModal from '$lib/components/ProjectSubmitModal.svelte';
	import { projectsRefresh } from '$lib/state/projectsRefresh.svelte.js';

	/** @type {import('./$types').PageData} */
	let { data } = $props();

	// Email verification success message
	let showSuccessMessage = $state(false);
	let successMessage = $state('');

	// Modal state
	let isModalOpen = $state(false);
	
	// Email verification warning modal state
	let showEmailVerificationModal = $state(false);
	
	// Loading state for sending verification email
	let isSendingVerification = $state(false);
	
	// Check if email is verified
	let isEmailVerified = $derived(!!authState.user?.email_verified_at);
	
	// Handle form button click
	function handleOpenFormClick() {
		if (!isEmailVerified) {
			showEmailVerificationModal = true;
		} else {
			isModalOpen = true;
		}
	}
	
	// Send verification email and navigate to email-verify page
	async function sendVerificationAndNavigate() {
		if (isSendingVerification) return;
		
		isSendingVerification = true;
		
		try {
			// Send verification email
			const { resendEmailVerificationNotification } = await import('$lib/auth/auth.svelte.js');
			await resendEmailVerificationNotification();
			console.log('✉️ Verification email sent');
		} catch (error) {
			console.error('Failed to send verification email:', error);
			// Continue to navigate even if sending fails - user can resend from email-verify page
		} finally {
			isSendingVerification = false;
		}
		
		// Close modal if open and navigate
		showEmailVerificationModal = false;
		goto('/email-verify?sent=true');
	}

	// Handle project creation success
	async function handleProjectCreated() {
		// Invalidate dashboard data to reload stats
		await invalidate('dashboard');
	}

	// Check for verification success message and refresh user data
	onMount(async () => {
		const urlParams = new URLSearchParams(page.url.search);
		const verified = urlParams.get('verified');

		if (verified === 'true') {
			showSuccessMessage = true;
			successMessage =
				'Email успешно подтвержден! Теперь вы можете пользоваться всеми функциями сервиса.';
			
			// Refresh user data to update email_verified_at in authState and cookie
			try {
				// First, refresh user cookie with fresh data from API
				const refreshResponse = await fetch('/api/auth/refresh-user', {
					method: 'POST',
					credentials: 'include'
				});
				
				if (refreshResponse.ok) {
					const refreshData = await refreshResponse.json();
					console.log('✅ User cookie refreshed with verified data:', refreshData.user?.email_verified_at);
					
					// Update authState with fresh data
					if (refreshData.user) {
						const { setUser } = await import('$lib/auth/auth.svelte.js');
						setUser(refreshData.user);
					}
				} else {
					// Fallback: mark as verified locally
					const { markEmailAsVerified, checkAuth } = await import('$lib/auth/auth.svelte.js');
					markEmailAsVerified();
					await checkAuth();
				}
			} catch (error) {
				console.error('Failed to refresh user data:', error);
				// Fallback: mark as verified locally
				const { markEmailAsVerified } = await import('$lib/auth/auth.svelte.js');
				markEmailAsVerified();
			}
			
			// Auto-hide after 5 seconds
			setTimeout(() => {
				showSuccessMessage = false;
				// Clear URL params
				window.history.replaceState({}, '', '/form');
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
	<title>Форма создания проекта RUBONUS</title>
	<meta name="description" content="Форма создания проекта в RUBONUS: отправка данных через сайт или Telegram бот. Доступ к секретному ключу и инструментам работы." />
	<meta name="keywords" content="форма RUBONUS, создание проекта, управление проектами, агент RUBONUS" />
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
		<div class="fixed left-1/2 top-36 z-[100] w-full max-w-md -translate-x-1/2 transform px-4">
			<div
				class="rounded-xl border border-green-500/50 bg-gray-900 p-4 shadow-2xl shadow-green-500/20"
			>
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500/20">
						<svg
							class="h-5 w-5 text-green-400"
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
					<div>
						<p class="text-base font-semibold text-green-400">Email подтверждён!</p>
						<p class="text-sm text-gray-300">Теперь вы можете создавать проекты.</p>
					</div>
				</div>
			</div>
		</div>
	{/if}



	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<!-- Page Header -->
		<div class="mx-auto mb-8 text-center">
			<h1 class="text-4xl font-normal tracking-widest text-white sm:text-6xl">Создать проект</h1>
		</div>
		
		<!-- Email Verification Warning under header -->
		{#if !isEmailVerified}
			<div class="mx-auto mb-12 max-w-2xl">
				<div
					class="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-5 shadow-lg backdrop-blur-sm"
				>
					<div class="flex items-center gap-4">
						<div class="flex-shrink-0">
							<div class="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
								<svg
									class="h-6 w-6 text-amber-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
							</div>
						</div>
						<div class="flex-1">
							<h3 class="text-base font-semibold text-amber-300">Подтвердите ваш email</h3>
							<p class="mt-1 text-sm text-amber-200/80">
								Для создания проектов необходимо подтвердить email адрес. Проверьте вашу почту или запросите новое письмо.
							</p>
						</div>
						<div class="flex-shrink-0">
							<button
								onclick={sendVerificationAndNavigate}
								disabled={isSendingVerification}
								class="rounded-lg bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-300 transition-all hover:bg-amber-500/30 hover:text-amber-200 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{#if isSendingVerification}
									<span class="flex items-center gap-2">
										<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
											<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
											<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										Отправка...
									</span>
								{:else}
									Подтвердить
								{/if}
							</button>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Create Project Buttons -->
		<div class="mb-8">
			<!-- <h2 class="mb-6 text-center text-2xl font-semibold tracking-wide text-white">
				Создать проект
			</h2> -->
			<div class="flex justify-center">
				<!-- Website Form Button -->
				<div class="w-full max-w-md md:max-w-2xl rounded-lg bg-white/5 p-6 md:p-10 lg:p-12 backdrop-blur-sm">
					<div class="mb-4 md:mb-8 text-center">
						<svg
							class="mx-auto mb-3 md:mb-6 h-12 w-12 md:h-20 md:w-20 lg:h-24 lg:w-24 text-purple-400"
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
	
						<p class="mb-4 md:mb-6 text-sm md:text-lg lg:text-xl text-gray-300">
							Создайте проект через форму на сайте. <br/> Ваш секретный ключ подставится автоматически.
						</p>
					</div>
					<button
						onclick={handleOpenFormClick}
						class="w-full rounded-lg bg-gradient-to-r from-purple-600 via-purple-400 to-blue-500 px-6 py-3 md:px-8 md:py-4 lg:px-10 lg:py-5 font-bold text-base md:text-xl lg:text-2xl text-white shadow-lg transition-all hover:scale-105 hover:opacity-90"
					>
						<span class="flex items-center justify-center gap-2 md:gap-3">
							<svg class="h-5 w-5 md:h-7 md:w-7 lg:h-8 lg:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
				{#if false}
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
						<h3 class="mb-2 text-xl font-semibold text-white">Форма в Telegram</h3>
						<p class="mb-4 text-sm text-gray-300">
							Отправьте данные через Telegram бот. <br/> Скопируйте заранее ваш секретный ключ в
							профиле.
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
				{/if}
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

<!-- Project Submit Modal -->
<ProjectSubmitModal bind:isOpen={isModalOpen} onSuccess={handleProjectCreated} />

<!-- Email Verification Required Modal -->
{#if showEmailVerificationModal}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
		onclick={() => (showEmailVerificationModal = false)}
		onkeydown={(e) => e.key === 'Escape' && (showEmailVerificationModal = false)}
		role="dialog"
		aria-modal="true"
		aria-labelledby="email-verify-modal-title"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="mx-4 w-full max-w-md transform rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-2xl transition-all"
			onclick={(e) => e.stopPropagation()}
		>
			<!-- Modal Header -->
			<div class="mb-6 text-center">
				<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
					<svg
						class="h-8 w-8 text-amber-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
						/>
					</svg>
				</div>
				<h2 id="email-verify-modal-title" class="text-xl font-bold text-white">
					Подтвердите email
				</h2>
				<p class="mt-3 text-gray-400">
					Для создания проектов необходимо подтвердить ваш email адрес. Мы отправили письмо с подтверждением на вашу почту.
				</p>
			</div>

			<!-- Modal Actions -->
			<div class="flex flex-col gap-3">
				<button
					onclick={sendVerificationAndNavigate}
					disabled={isSendingVerification}
					class="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if isSendingVerification}
						<span class="flex items-center justify-center gap-2">
							<svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Отправка письма...
						</span>
					{:else}
						Подтвердить email
					{/if}
				</button>
				<button
					onclick={() => (showEmailVerificationModal = false)}
					class="w-full rounded-lg border border-white/10 bg-white/5 px-6 py-3 font-medium text-gray-300 transition-all hover:bg-white/10"
				>
					Закрыть
				</button>
			</div>
		</div>
	</div>
{/if}
