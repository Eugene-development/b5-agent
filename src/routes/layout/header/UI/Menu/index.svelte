<script>
	import { openMobileMenu, visibleMobileMenu } from '$lib/state/visibleMobileMenu.svelte.js';
	import { authState, logout } from '$lib/auth/auth.svelte.js';
	import { page } from '$app/state';
	import MobileMenu from '../MobileMenu/index.svelte';
	import { onMount } from 'svelte';

	let currentPath = $derived(page.url.pathname);
	let isVisible = $state(true);
	let lastScrollY = $state(0);
	let isMobileMenuOpen = $derived(visibleMobileMenu.value);

	function isActive(href) {
		return currentPath === href;
	}

	onMount(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			if (currentScrollY < 10) {
				isVisible = true;
			} else if (currentScrollY < lastScrollY) {
				// Скролл вверх
				isVisible = true;
			} else if (currentScrollY > lastScrollY && currentScrollY > 100) {
				// Скролл вниз
				isVisible = false;
			}

			lastScrollY = currentScrollY;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

{#if !isMobileMenuOpen}
	<nav
		class="fixed left-0 right-0 top-0 z-50 border-b border-slate-400/10 bg-gray-950 shadow-lg shadow-black/20 transition-transform duration-300 {isVisible
			? 'translate-y-0'
			: '-translate-y-full'}"
		aria-label="Global"
	>
		<div class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
			<div class="flex w-full items-center justify-between lg:hidden">
				<a
					href="/"
					class="bg-gradient-to-r from-white via-indigo-200 to-cyan-400 bg-clip-text text-xl font-black tracking-tight text-transparent"
				>
					BONUS 5
				</a>
				<button
					onclick={openMobileMenu}
					type="button"
					class="-m-2.5 inline-flex items-center justify-center gap-2 rounded-md p-2.5 text-gray-400 transition-colors duration-300 hover:text-indigo-400"
				>
					<span class="sr-only">Open main menu</span>
					<svg
						class="size-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						/>
					</svg>
					<span class="text-sm font-medium">Меню</span>
				</button>
			</div>

			<div class="hidden lg:flex lg:gap-x-3">
				<a
					href="/"
					class="relative overflow-hidden rounded-xl border border-slate-400/10 bg-gray-950 px-6 py-2 text-sm font-medium tracking-wide text-slate-200/90 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-indigo-400/30 hover:bg-indigo-500/15 hover:text-indigo-300 hover:shadow-lg hover:shadow-indigo-500/20 {isActive(
						'/'
					)
						? 'bg-linear-to-br border-indigo-400/40 from-indigo-500/25 to-indigo-600/25 text-indigo-400 shadow-md shadow-indigo-500/30'
						: ''}"
				>
					Главная
					{#if isActive('/')}
						<span
							class="bg-linear-to-r absolute inset-x-0 bottom-0 mx-auto h-0.5 w-3/5 from-transparent via-indigo-400 to-transparent"
						></span>
					{/if}
				</a>

				<a
					href="/about"
					class="relative overflow-hidden rounded-xl border border-slate-400/10 bg-gray-950 px-6 py-2 text-sm font-medium tracking-wide text-slate-200/90 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-purple-400/30 hover:bg-purple-500/15 hover:text-purple-300 hover:shadow-lg hover:shadow-purple-500/20 {isActive(
						'/about'
					)
						? 'bg-linear-to-br border-purple-400/40 from-purple-500/25 to-purple-600/25 text-purple-400 shadow-md shadow-purple-500/30'
						: ''}"
				>
					О проекте
					{#if isActive('/about')}
						<span
							class="bg-linear-to-r absolute inset-x-0 bottom-0 mx-auto h-0.5 w-3/5 from-transparent via-purple-400 to-transparent"
						></span>
					{/if}
				</a>

				<a
					href="/cities"
					class="relative overflow-hidden rounded-xl border border-slate-400/10 bg-gray-950 px-6 py-2 text-sm font-medium tracking-wide text-slate-200/90 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-cyan-500/15 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/20 {isActive(
						'/cities'
					)
						? 'bg-linear-to-br border-cyan-400/40 from-cyan-500/25 to-cyan-600/25 text-cyan-400 shadow-md shadow-cyan-500/30'
						: ''}"
				>
					Города
					{#if isActive('/cities')}
						<span
							class="bg-linear-to-r absolute inset-x-0 bottom-0 mx-auto h-0.5 w-3/5 from-transparent via-cyan-400 to-transparent"
						></span>
					{/if}
				</a>

				<a
					href="/payments"
					class="relative overflow-hidden rounded-xl border border-slate-400/10 bg-gray-950 px-6 py-2 text-sm font-medium tracking-wide text-slate-200/90 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-emerald-500/15 hover:text-emerald-300 hover:shadow-lg hover:shadow-emerald-500/20 {isActive(
						'/payments'
					)
						? 'bg-linear-to-br border-emerald-400/40 from-emerald-500/25 to-emerald-600/25 text-emerald-400 shadow-md shadow-emerald-500/30'
						: ''}"
				>
					Выплаты
					{#if isActive('/payments')}
						<span
							class="bg-linear-to-r absolute inset-x-0 bottom-0 mx-auto h-0.5 w-3/5 from-transparent via-emerald-400 to-transparent"
						></span>
					{/if}
				</a>

				<a
					href="/promotions"
					class="relative overflow-hidden rounded-xl border border-slate-400/10 bg-gray-950 px-6 py-2 text-sm font-medium tracking-wide text-slate-200/90 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-amber-400/30 hover:bg-amber-500/15 hover:text-amber-300 hover:shadow-lg hover:shadow-amber-500/20 {isActive(
						'/promotions'
					)
						? 'bg-linear-to-br border-amber-400/40 from-amber-500/25 to-amber-600/25 text-amber-400 shadow-md shadow-amber-500/30'
						: ''}"
				>
					Акции
					{#if isActive('/promotions')}
						<span
							class="bg-linear-to-r absolute inset-x-0 bottom-0 mx-auto h-0.5 w-3/5 from-transparent via-amber-400 to-transparent"
						></span>
					{/if}
				</a>
			</div>

			<div class="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-3">
				{#if authState.isAuthenticated}
					<a
						href="/dashboard"
						class="bg-linear-to-br rounded-xl border border-emerald-500/50 from-emerald-700 to-emerald-800 px-5 py-2 text-sm font-medium tracking-wide text-white shadow-md transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-lg hover:shadow-emerald-500/40"
					>
						Личный кабинет
					</a>
					<button
						onclick={async () => {
							await logout({ redirectTo: '/' });
						}}
						class="cursor-pointer rounded-xl border border-red-500/30 bg-red-500/15 px-5 py-2 text-sm font-medium tracking-wide text-slate-200/90 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-red-500/50 hover:bg-red-500/25 hover:text-red-300 hover:shadow-md hover:shadow-red-500/30"
					>
						Выход
					</button>
				{:else}
					<a
						href="/login"
						class="rounded-xl border border-slate-400/20 bg-gray-950 px-5 py-2 text-sm font-medium tracking-wide text-slate-200/90 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-indigo-400/40 hover:bg-indigo-500/20 hover:text-indigo-300 hover:shadow-md hover:shadow-indigo-500/20"
					>
						Вход
					</a>
					<a
						href="/registration"
						class="bg-linear-to-br relative overflow-hidden rounded-xl border border-indigo-400/40 from-indigo-500/25 to-indigo-600/25 px-5 py-2 text-sm font-medium tracking-wide text-indigo-400 shadow-md shadow-indigo-500/30 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-indigo-400/30 hover:bg-indigo-500/15 hover:text-indigo-300 hover:shadow-lg hover:shadow-indigo-500/20"
					>
						Регистрация
					</a>
				{/if}
			</div>
		</div>
	</nav>
{/if}

<MobileMenu />
