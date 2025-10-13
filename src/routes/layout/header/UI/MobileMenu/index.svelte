<script>
	import { visibleMobileMenu, closeMobileMenu } from '$lib/state/visibleMobileMenu.svelte.js';
	import { authState, logout } from '$lib/auth/auth.svelte.js';
	import { page } from '$app/state';

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
</script>

{#if visibleMobileMenu.value}
	<div class="lg:hidden" role="dialog" aria-modal="true">
		<div
			class="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm"
			onclick={handleBackdropClick}
			onkeydown={handleBackdropKeydown}
			tabindex="0"
			role="button"
			aria-label="Close mobile menu"
		></div>
		<div
			class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-linear-to-br/oklch from-slate-900/98 to-slate-800/98 px-4 py-4 backdrop-blur-xl sm:max-w-sm sm:px-6 sm:py-6 sm:ring-1 sm:ring-white/10"
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
					class="rounded-lg border border-slate-400/10 bg-slate-700/30 p-2.5 text-gray-400/90 transition-all duration-300 active:scale-95 active:border-blue-400/30 active:bg-blue-500/20 active:text-blue-400"
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
			<div class="mt-6 flow-root">
				<div class="-my-6 divide-y divide-gray-500/25">
					<div class="space-y-3 py-6">
						<a
							href="/"
							onclick={() => closeMobileMenu()}
							class="-mx-3 block overflow-hidden rounded-xl border border-slate-400/10 bg-slate-700/30 px-4 py-3 text-base font-semibold text-slate-200/90 shadow-sm transition-all duration-300 active:scale-98 active:border-blue-400/30 active:bg-blue-500/20 active:text-blue-300 {isActive(
								'/'
							)
								? 'border-blue-400/40 bg-linear-to-br from-blue-500/25 to-blue-600/25 text-blue-400 shadow-md shadow-blue-500/30'
								: ''}"
						>
							Главная
						</a>
						<a
							href="/about"
							onclick={() => closeMobileMenu()}
							class="-mx-3 block overflow-hidden rounded-xl border border-slate-400/10 bg-slate-700/30 px-4 py-3 text-base font-semibold text-slate-200/90 shadow-sm transition-all duration-300 active:scale-98 active:border-blue-400/30 active:bg-blue-500/20 active:text-blue-300 {isActive(
								'/about'
							)
								? 'border-blue-400/40 bg-linear-to-br from-blue-500/25 to-blue-600/25 text-blue-400 shadow-md shadow-blue-500/30'
								: ''}"
						>
							О проекте
						</a>
						<a
							href="/payments"
							onclick={() => closeMobileMenu()}
							class="-mx-3 block overflow-hidden rounded-xl border border-slate-400/10 bg-slate-700/30 px-4 py-3 text-base font-semibold text-slate-200/90 shadow-sm transition-all duration-300 active:scale-98 active:border-blue-400/30 active:bg-blue-500/20 active:text-blue-300 {isActive(
								'/payments'
							)
								? 'border-blue-400/40 bg-linear-to-br from-blue-500/25 to-blue-600/25 text-blue-400 shadow-md shadow-blue-500/30'
								: ''}"
						>
							Выплаты
						</a>
						<a
							href="/152fz"
							onclick={() => closeMobileMenu()}
							class="-mx-3 block overflow-hidden rounded-xl border border-slate-400/10 bg-slate-700/30 px-4 py-3 text-base font-semibold text-slate-200/90 shadow-sm transition-all duration-300 active:scale-98 active:border-blue-400/30 active:bg-blue-500/20 active:text-blue-300 {isActive(
								'/152fz'
							)
								? 'border-blue-400/40 bg-linear-to-br from-blue-500/25 to-blue-600/25 text-blue-400 shadow-md shadow-blue-500/30'
								: ''}"
						>
							152 ФЗ
						</a>
					</div>
					<div class="py-6">
						{#if authState.isAuthenticated}
							<a
								href="/dashboard"
								onclick={closeMobileMenu}
								class="-mx-3 mb-3 flex items-center overflow-hidden rounded-xl border border-slate-400/10 bg-slate-700/30 px-4 py-3 text-base font-semibold text-slate-200/90 shadow-sm transition-all duration-300 active:scale-98 active:bg-blue-500/20 {isActive(
									'/dashboard'
								)
									? 'border-blue-400/40 bg-linear-to-br from-blue-500/25 to-blue-600/25 text-blue-400 shadow-md shadow-blue-500/30'
									: ''}"
							>
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
							</a>

							<a
								href="/profile"
								onclick={closeMobileMenu}
								class="-mx-3 mb-3 flex items-center overflow-hidden rounded-xl border border-slate-400/10 bg-slate-700/30 px-4 py-3 text-base font-semibold text-slate-200/90 shadow-sm transition-all duration-300 active:scale-98 active:bg-blue-500/20 {isActive(
									'/profile'
								)
									? 'border-blue-400/40 bg-linear-to-br from-blue-500/25 to-blue-600/25 text-blue-400 shadow-md shadow-blue-500/30'
									: ''}"
							>
								<svg
									class="mr-3 h-6 w-6 text-indigo-400"
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
							</a>

							<a
								href="/projects"
								onclick={closeMobileMenu}
								class="-mx-3 mb-3 flex items-center overflow-hidden rounded-xl border border-slate-400/10 bg-slate-700/30 px-4 py-3 text-base font-semibold text-slate-200/90 shadow-sm transition-all duration-300 active:scale-98 active:bg-blue-500/20 {isActive(
									'/projects'
								)
									? 'border-blue-400/40 bg-linear-to-br from-blue-500/25 to-blue-600/25 text-blue-400 shadow-md shadow-blue-500/30'
									: ''}"
							>
								<svg
									class="mr-3 h-6 w-6 text-purple-400"
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
							</a>

							<a
								href="/finances"
								onclick={closeMobileMenu}
								class="-mx-3 mb-3 flex items-center overflow-hidden rounded-xl border border-slate-400/10 bg-slate-700/30 px-4 py-3 text-base font-semibold text-slate-200/90 shadow-sm transition-all duration-300 active:scale-98 active:bg-blue-500/20 {isActive(
									'/finances'
								)
									? 'border-blue-400/40 bg-linear-to-br from-blue-500/25 to-blue-600/25 text-blue-400 shadow-md shadow-blue-500/30'
									: ''}"
							>
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
										d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
									/>
								</svg>
								Финансы
							</a>

							<button
								onclick={async () => {
									await logout({ redirectTo: '/' });
									closeMobileMenu();
								}}
								class="-mx-3 mt-4 flex w-full items-center rounded-xl border border-red-500/30 bg-red-500/15 px-4 py-3 text-left text-base font-semibold text-slate-200/90 shadow-sm transition-all duration-300 active:scale-98 active:border-red-500/50 active:bg-red-500/25 active:text-red-300"
							>
								<svg
									class="mr-3 h-6 w-6 text-red-400"
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
							<a
								href="/login"
								onclick={closeMobileMenu}
								class="-mx-3 mb-3 flex items-center overflow-hidden rounded-xl border border-slate-400/10 bg-slate-700/30 px-4 py-3 text-base font-semibold text-slate-200/90 shadow-sm transition-all duration-300 active:scale-98 active:bg-blue-500/20 {isActive(
									'/login'
								)
									? 'border-blue-400/40 bg-linear-to-br from-blue-500/25 to-blue-600/25 text-blue-400 shadow-md shadow-blue-500/30'
									: ''}"
							>
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
										d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
									/>
								</svg>
								Вход
							</a>
							<a
								href="/registration"
								onclick={closeMobileMenu}
								class="-mx-3 flex items-center overflow-hidden rounded-xl border border-slate-400/10 bg-slate-700/30 px-4 py-3 text-base font-semibold text-slate-200/90 shadow-sm transition-all duration-300 active:scale-98 active:bg-blue-500/20 {isActive(
									'/registration'
								)
									? 'border-blue-400/40 bg-linear-to-br from-blue-500/25 to-blue-600/25 text-blue-400 shadow-md shadow-blue-500/30'
									: ''}"
							>
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
										d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
									/>
								</svg>
								Регистрация
							</a>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
