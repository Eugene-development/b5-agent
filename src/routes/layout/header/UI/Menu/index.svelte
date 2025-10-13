<script>
	import { openMobileMenu } from '$lib/state/visibleMobileMenu.svelte.js';
	import { authState, logout } from '$lib/auth/auth.svelte.js';
	import { page } from '$app/state';
	import MobileMenu from '../MobileMenu/index.svelte';

	let currentPath = $derived(page.url.pathname);

	function isActive(href) {
		return currentPath === href;
	}
</script>

<nav
	class="mx-auto flex max-w-7xl items-center justify-between border-b border-slate-400/10 bg-gray-950 p-6 shadow-lg shadow-black/20 lg:px-8"
	aria-label="Global"
>
	<div class="flex lg:hidden">
		<button
			onclick={openMobileMenu}
			type="button"
			class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400 transition-colors duration-300 hover:text-indigo-400"
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
			class="relative overflow-hidden rounded-xl border border-slate-400/10 bg-gray-950 px-6 py-2 text-sm font-medium tracking-wide text-slate-200/90 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-indigo-400/30 hover:bg-indigo-500/15 hover:text-indigo-300 hover:shadow-lg hover:shadow-indigo-500/20 {isActive(
				'/about'
			)
				? 'bg-linear-to-br border-indigo-400/40 from-indigo-500/25 to-indigo-600/25 text-indigo-400 shadow-md shadow-indigo-500/30'
				: ''}"
		>
			О проекте
			{#if isActive('/about')}
				<span
					class="bg-linear-to-r absolute inset-x-0 bottom-0 mx-auto h-0.5 w-3/5 from-transparent via-indigo-400 to-transparent"
				></span>
			{/if}
		</a>

		<a
			href="/payments"
			class="relative overflow-hidden rounded-xl border border-slate-400/10 bg-gray-950 px-6 py-2 text-sm font-medium tracking-wide text-slate-200/90 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-indigo-400/30 hover:bg-indigo-500/15 hover:text-indigo-300 hover:shadow-lg hover:shadow-indigo-500/20 {isActive(
				'/payments'
			)
				? 'bg-linear-to-br border-indigo-400/40 from-indigo-500/25 to-indigo-600/25 text-indigo-400 shadow-md shadow-indigo-500/30'
				: ''}"
		>
			Выплаты
			{#if isActive('/payments')}
				<span
					class="bg-linear-to-r absolute inset-x-0 bottom-0 mx-auto h-0.5 w-3/5 from-transparent via-indigo-400 to-transparent"
				></span>
			{/if}
		</a>

		<a
			href="/152fz"
			class="relative overflow-hidden rounded-xl border border-slate-400/10 bg-gray-950 px-6 py-2 text-sm font-medium tracking-wide text-slate-200/90 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-indigo-400/30 hover:bg-indigo-500/15 hover:text-indigo-300 hover:shadow-lg hover:shadow-indigo-500/20 {isActive(
				'/152fz'
			)
				? 'bg-linear-to-br border-indigo-400/40 from-indigo-500/25 to-indigo-600/25 text-indigo-400 shadow-md shadow-indigo-500/30'
				: ''}"
		>
			152 ФЗ
			{#if isActive('/152fz')}
				<span
					class="bg-linear-to-r absolute inset-x-0 bottom-0 mx-auto h-0.5 w-3/5 from-transparent via-indigo-400 to-transparent"
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
</nav>

<MobileMenu />
