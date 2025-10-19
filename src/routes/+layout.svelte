<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initAuthFromServer, authState } from '$lib/auth/auth.svelte.js';

	import Menu from './layout/header/UI/Menu/index.svelte';
	import Footer from './layout/footer/index.svelte';

	let { children, data } = $props();
	console.log('data%', data);

	// Track if initial auth check is complete
	let authInitialized = $state(false);

	// Initialize authentication from server data
	$effect(() => {
		// Always use server data (whether authenticated or not)
		console.log('🔄 Using server data for auth');
		initAuthFromServer(data);
		authInitialized = true;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Show content immediately, no loading spinner -->
{#if authInitialized}
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
