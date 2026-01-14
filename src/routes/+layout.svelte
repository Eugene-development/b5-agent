<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initializeAuth, authState, updateAuthStateFromServer } from '$lib/auth/auth.svelte.js';
	import { PageTransition } from '$lib';
	import { page } from '$app/stores';
	import { captureReferralFromUrl } from '$lib/utils/referral.js';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import Menu from './layout/header/UI/Menu/index.svelte';
	import Footer from './layout/footer/index.svelte';

	let { children, data } = $props();

	// Track if initial auth check is complete
	let authInitialized = $state(false);

	// Capture referral ID on mount and whenever URL changes
	onMount(() => {
		console.log('[Referral] onMount - Checking URL:', window.location.href);
		captureReferralFromUrl(new URL(window.location.href));
	});

	// Also capture on URL changes during SPA navigation
	$effect(() => {
		if (browser && $page.url) {
			console.log('[Referral] $effect - Checking URL for ref parameter:', $page.url.href);
			captureReferralFromUrl($page.url);
		}
	});

	// Initialize authentication from server data or localStorage
	$effect(() => {
		if (browser) {
			// If server has auth data (from httpOnly cookie), use it
			if (data?.isAuthenticated && data?.user) {
				console.log('🔐 Layout: Using server auth data');
				updateAuthStateFromServer(data);
				authInitialized = true;
			} else {
				// Fallback: try to initialize from localStorage
				console.log('🔐 Layout: Initializing from localStorage');
				initializeAuth().then(() => {
					authInitialized = true;
				});
			}
		} else {
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
