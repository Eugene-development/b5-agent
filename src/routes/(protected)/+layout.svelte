<!--
  Layout for protected routes
  This layout wraps all routes that require authentication
-->
<script>
	import { onMount } from 'svelte';
	import { authState, checkAuth } from '$lib/auth/auth.svelte.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import DashboardMenu from '$lib/components/DashboardMenu.svelte';

	let { children } = $props();

	// Check authentication on mount (like profile page does)
	onMount(async () => {
		// If not authenticated from localStorage, redirect immediately
		if (!authState.isAuthenticated) {
			const returnTo = $page.url.pathname + $page.url.search;
			goto(`/login?returnTo=${encodeURIComponent(returnTo)}`);
			return;
		}

		// Verify token with server (like profile page)
		const isAuth = await checkAuth();
		if (!isAuth) {
			const returnTo = $page.url.pathname + $page.url.search;
			goto(`/login?returnTo=${encodeURIComponent(returnTo)}`);
			return;
		}

		// Check email verification
		if (authState.user && !authState.user.email_verified_at) {
			goto('/email-verify');
		}
	});

	// Watch for logout
	$effect(() => {
		if (authState.initialized && !authState.isAuthenticated) {
			const returnTo = $page.url.pathname + $page.url.search;
			goto(`/login?returnTo=${encodeURIComponent(returnTo)}`);
		}
	});
</script>

<div class="pt-4 lg:pt-6">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<DashboardMenu />
	</div>
</div>

{@render children?.()}
