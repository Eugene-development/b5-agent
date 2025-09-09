<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initAuthFromServer } from '$lib/auth/auth.svelte.js';
	import Menu from './layout/header/UI/Menu/index.svelte';
	import Footer from './layout/footer/index.svelte';

	let { children, data } = $props();
	console.log('data%', data);

	// Initialize authentication from server data
	// This avoids the fetch warning by using server-side data
	$effect(() => {
		if (data) {
			initAuthFromServer(data);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Render children directly since auth is initialized from server -->
<div class="min-h-screen bg-gray-900 text-white">
	<!-- Header with navigation -->
	<header class="bg-gray-900">
		<Menu />
	</header>

	<!-- Main content -->
	<main class="flex-1">
		{@render children?.()}
	</main>

	<!-- Footer -->
	<footer class="bg-gray-900 py-8">
		<Footer />
	</footer>
</div>
