<script>
	import { visibleMobileMenu, closeMobileMenu } from '$lib/state/visibleMobileMenu.svelte.js';
	import { authState, logout } from '$lib/auth/auth.svelte.js';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			closeMobileMenu();
		}
	}

	function handleBackdropKeydown(event) {
		if (event.key === 'Escape') {
			closeMobileMenu();
		}
	}

	function handleMenuClick(event) {
		event.stopPropagation();
	}

	let currentPath = $derived(page.url.pathname);

	function isActive(href) {
		return currentPath === href;
	}

	function navigate(href) {
		closeMobileMenu();
		goto(href);
	}
</script>

{#if visibleMobileMenu.value}
	<div class="lg:hidden" role="dialog" aria-modal="true">
		<div
			class="fixed inset-0 z-50 bg-black/70 backdrop-blur-md transition-opacity duration-300"
			onclick={handleBackdropClick}
			onkeydown={handleBackdropKeydown}
			tabindex="0"
			role="button"
			aria-label="Close mobile menu"
		></div>
		<div
			class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-6 py-6 shadow-2xl shadow-indigo-500/20 backdrop-blur-xl sm:max-w-sm sm:border-l sm:border-slate-400/10"
			onclick={handleMenuClick}
			onkeydown={handleBackdropKeydown}
			role="dialog"
			aria-label="Mobile navigation menu"
			tabindex="0"
		>
			<div class="flex items-center justify-end">
				<button
					onclick={closeMobileMenu}
					type="button"
					class="rounded-xl border border-slate-400/10 bg-gray-950 p-2.5 text-gray-400 shadow-sm transition-all duration-300 hover:border-indigo-400/30 hover:bg-indigo-500/15 hover:text-indigo-300 active:scale-95"
				>
					<span class="sr-only">Close menu</span>
					<svg
						class="size-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="mt-8 flow-root">
				<div class="-my-6 divide-y divide-slate-400/10">
					<div class="space-y-2 py-6">
						<button
							onclick={() => navigate('/')}
							class="relative block w-full overflow-hidden rounded-xl border border-slate-400/10 bg-gray-950 px-5 py-3.5 text-left text-base font-medium tracking-wide text-slate-200/90 shadow-sm transition-all duration-300 hover:border-indigo-400/30 hover:bg-indigo-500/15 hover:text-indigo-300 active:scale-98 {isActive(
								'/'
							)
								? 'border-indigo-400/40 bg-gradient-to-br from-indigo-500/25 to-indigo-600/25 text-indigo-400 shadow-md shadow-indigo-500/30'
								: ''}"
						>
							Главная
							{#if isActive('/')}
								<span
									class="absolute inset-x-0 bottom-0 mx-auto h-0.5 w-3/5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
								></span>
							{/if}
						</button>
						<button
							onclick={() => navigate('/about')}
							class="relative block w-full overflow-hidden rounded-xl border border-slate-400/10 bg-gray-950 px-5 py-3.5 text-left text-base font-medium tracking-wide text-slate-200/90 shadow-sm transition-all duration-300 hover:border-indigo-400/30 hover:bg-indigo-500/15 hover:text-indigo-300 active:scale-98 {isActive(
								'/about'
							)
								? 'border-indigo-400/40 bg-gradient-to-br from-indigo-500/25 to-indigo-600/25 text-indigo-400 shadow-md shadow-indigo-500/30'
								: ''}"
						>
							О проекте
							{#if isActive('/about')}
								<span
									class="absolute inset-x-0 bottom-0 mx-auto h-0.5 w-3/5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
								></span>
							{/if}
						</button>
						<button
							onclick={() => navigate('/payments')}
							class="relative block w-full overflow-hidden rounded-xl border border-slate-400/10 bg-gray-950 px-5 py-3.5 text-left text-base font-medium tracking-wide text-slate-200/90 shadow-sm transition-all duration-300 hover:border-indigo-400/30 hover:bg-indigo-500/15 hover:text-indigo-300 active:scale-98 {isActive(
								'/payments'
							)
								? 'border-indigo-400/40 bg-gradient-to-br from-indigo-500/25 to-indigo-600/25 text-indigo-400 shadow-md shadow-indigo-500/30'
								: ''}"
						>
							Выплаты
							{#if isActive('/payments')}
								<span
									class="absolute inset-x-0 bottom-0 mx-auto h-0.5 w-3/5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
								></span>
							{/if}
						</button>
						<button
							onclick={() => navigate('/152fz')}
							class="relative block w-full overflow-hidden rounded-xl border border-slate-400/10 bg-gray-950 px-5 py-3.5 text-left text-base font-medium tracking-wide text-slate-200/90 shadow-sm transition-all duration-300 hover:border-indigo-400/30 hover:bg-indigo-500/15 hover:text-indigo-300 active:scale-98 {isActive(
								'/152fz'
							)
								? 'border-indigo-400/40 bg-gradient-to-br from-indigo-500/25 to-indigo-600/25 text-indigo-400 shadow-md shadow-indigo-500/30'
								: ''}"
						>
							152 ФЗ
							{#if isActive('/152fz')}
								<span
									class="absolute inset-x-0 bottom-0 mx-auto h-0.5 w-3/5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
								></span>
							{/if}
						</button>
					</div>
					<div class="space-y-2 py-6">
						{#if authState.isAuthenticated}
							<button
								onclick={() => navigate('/dashboard')}
								class="mb-2 flex w-full items-center overflow-hidden rounded-xl border border-slate-400/10 bg-gray-950 px-5 py-3.5 text-left text-base font-medium tracking-wide text-slate-200/90 shadow-sm transition-all duration-300 hover:border-indigo-400/30 hover:bg-indigo-500/15 hover:text-indigo-300 active:scale-98 {isActive(
									'/dashboard'
								)
									? 'border-indigo-400/40 bg-gradient-to-br from-indigo-500/25 to-indigo-600/25 text-indigo-400 shadow-md shadow-indigo-500/30'
									: ''}"
							>
								<svg
									class="mr-3 h-5 w-5 text-emerald-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
									/>
								</svg>
								Личный кабинет
							</button>

							<button
								onclick={() => navigate('/profile')}
								class="mb-2 flex w-full items-center overflow-hidden rounded-xl border border-slate-400/10 bg-gray-950 px-5 py-3.5 text-left text-base font-medium tracking-wide text-slate-200/90 shadow-sm transition-all duration-300 hover:border-indigo-400/30 hover:bg-indigo-500/15 hover:text-indigo-300 active:scale-98 {isActive(
									'/profile'
								)
									? 'border-indigo-400/40 bg-gradient-to-br from-indigo-500/25 to-indigo-600/25 text-indigo-400 shadow-md shadow-indigo-500/30'
									: ''}"
							>
								<svg
									class="mr-3 h-5 w-5 text-indigo-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
								Профиль
							</button>

							<button
								onclick={() => navigate('/projects')}
								class="mb-2 flex w-full items-center overflow-hidden rounded-xl border border-slate-400/10 bg-gray-950 px-5 py-3.5 text-left text-base font-medium tracking-wide text-slate-200/90 shadow-sm transition-all duration-300 hover:border-indigo-400/30 hover:bg-indigo-500/15 hover:text-indigo-300 active:scale-98 {isActive(
									'/projects'
								)
									? 'border-indigo-400/40 bg-gradient-to-br from-indigo-500/25 to-indigo-600/25 text-indigo-400 shadow-md shadow-indigo-500/30'
									: ''}"
							>
								<svg
									class="mr-3 h-5 w-5 text-purple-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
									/>
								</svg>
								Проекты
							</button>

							<button
								onclick={() => navigate('/statistics')}
								class="mb-2 flex w-full items-center overflow-hidden rounded-xl border border-slate-400/10 bg-gray-950 px-5 py-3.5 text-left text-base font-medium tracking-wide text-slate-200/90 shadow-sm transition-all duration-300 hover:border-indigo-400/30 hover:bg-indigo-500/15 hover:text-indigo-300 active:scale-98 {isActive(
									'/statistics'
								)
									? 'border-indigo-400/40 bg-gradient-to-br from-indigo-500/25 to-indigo-600/25 text-indigo-400 shadow-md shadow-indigo-500/30'
									: ''}"
							>
								<svg
									class="mr-3 h-5 w-5 text-emerald-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
								Статистика
							</button>

							<button
								onclick={async () => {
									await logout({ redirectTo: '/' });
									closeMobileMenu();
								}}
								class="mt-4 flex w-full items-center rounded-xl border border-red-500/30 bg-red-500/15 px-5 py-3.5 text-left text-base font-medium tracking-wide text-slate-200/90 shadow-sm transition-all duration-300 hover:border-red-500/50 hover:bg-red-500/25 hover:text-red-300 active:scale-98"
							>
								<svg
									class="mr-3 h-5 w-5 text-red-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
									/>
								</svg>
								Выход
							</button>
						{:else}
							<button
								onclick={() => navigate('/login')}
								class="mb-2 flex w-full items-center overflow-hidden rounded-xl border border-slate-400/20 bg-gray-950 px-5 py-3.5 text-left text-base font-medium tracking-wide text-slate-200/90 shadow-sm transition-all duration-300 hover:border-indigo-400/40 hover:bg-indigo-500/20 hover:text-indigo-300 active:scale-98 {isActive(
									'/login'
								)
									? 'border-indigo-400/40 bg-gradient-to-br from-indigo-500/25 to-indigo-600/25 text-indigo-400 shadow-md shadow-indigo-500/30'
									: ''}"
							>
								<svg
									class="mr-3 h-5 w-5 text-indigo-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
									/>
								</svg>
								Вход
							</button>
							<button
								onclick={() => navigate('/registration')}
								class="flex w-full items-center overflow-hidden rounded-xl border border-slate-400/20 bg-gray-950 px-5 py-3.5 text-left text-base font-medium tracking-wide text-slate-200/90 shadow-sm transition-all duration-300 hover:border-indigo-400/40 hover:bg-indigo-500/20 hover:text-indigo-300 active:scale-98 {isActive(
									'/registration'
								)
									? 'border-indigo-400/40 bg-gradient-to-br from-indigo-500/25 to-indigo-600/25 text-indigo-400 shadow-md shadow-indigo-500/30'
									: ''}"
							>
								<svg
									class="mr-3 h-5 w-5 text-indigo-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
									/>
								</svg>
								Регистрация
							</button>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
