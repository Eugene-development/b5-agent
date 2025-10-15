<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initAuthFromServer, checkAuth, authState } from '$lib/auth/auth.svelte.js';
	import { browser } from '$app/environment';
	import Menu from './layout/header/UI/Menu/index.svelte';
	import Footer from './layout/footer/index.svelte';

	let { children, data } = $props();
	console.log('data%', data);

	// Track if initial auth check is complete
	let authInitialized = $state(false);
	let checkingAuth = $state(false);

	// Initialize authentication from server data or check via API
	$effect(() => {
		if (data?.user && data?.isAuthenticated) {
			// Use server data if available
			console.log('🔄 Using server data for auth');
			initAuthFromServer(data);
			authInitialized = true;
		} else if (browser && !authInitialized && !checkingAuth) {
			// Always check authentication via API on client side
			console.log('🔄 Checking auth via API');
			checkingAuth = true;
			checkAuth().finally(() => {
				authInitialized = true;
				checkingAuth = false;
			});
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Show loading indicator while checking auth on initial load -->
{#if !authInitialized && browser}
	<div class="flex min-h-screen items-center justify-center bg-gray-950">
		<div class="text-center">
			<div class="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
			<p class="text-gray-400">Загрузка...</p>
		</div>
	</div>
{:else}
	<!-- Render children once auth is initialized -->
	<div class="min-h-screen bg-gray-950 text-white">
		<!-- Header with navigation -->
		<header class="bg-gray-950">
			<Menu />
		</header>

		<!-- Main content -->
		<main class="flex-1 pt-20">
			{@render children?.()}
		</main>

		<!-- Footer -->
		<footer class="bg-gray-950 py-8">
			<Footer />
		</footer>
	</div>
{/if}
