<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initializeAuth, authState } from '$lib/auth/auth.svelte.js';
	import { PageTransition } from '$lib';
	import { page } from '$app/stores';
	import { captureReferralFromUrl } from '$lib/utils/referral.js';

	import Menu from './layout/header/UI/Menu/index.svelte';
	import Footer from './layout/footer/index.svelte';

	let { children, data } = $props();

	// Track if initial auth check is complete
	let authInitialized = $state(false);

	// Capture referral ID from URL on page load
	$effect(() => {
		if (typeof window !== 'undefined') {
			captureReferralFromUrl(new URL(window.location.href));
		}
	});

	// Initialize authentication from localStorage (JWT mode)
	$effect(() => {
		// In JWT mode, ignore server data and use localStorage
		if (data?.jwtMode) {
			// Initialize from localStorage (JWT tokens)
			initializeAuth().then(() => {
				authInitialized = true;
			});
		} else {
			// Fallback: cookie-based auth (for backward compatibility)
			// This branch shouldn't be used anymore with JWT
			authInitialized = true;
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if authInitialized}
	<div class="min-h-screen bg-gray-950 text-white">
		<header class="bg-gray-950">
			<Menu />
		</header>

		{#key $page.url.pathname}
			<PageTransition type="fade" duration={400}>
				<main class="flex-1 pt-20">
					<div class="relative">
						{@render children?.()}
					</div>
				</main>
			</PageTransition>
		{/key}

		<footer class="bg-gray-950 py-8">
			<Footer />
		</footer>
	</div>
{/if}
