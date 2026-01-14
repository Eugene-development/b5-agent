<!--
  Layout for protected routes
  This layout wraps all routes that require authentication
  Server-side redirect handles unauthenticated users
-->
<script>
	import { onMount } from 'svelte';
	import { authState, checkAuth } from '$lib/auth/auth.svelte.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import DashboardMenu from '$lib/components/DashboardMenu.svelte';

	let { children, data } = $props();

	// Check email verification on mount
	onMount(async () => {
		// Wait for auth state to be initialized
		if (!authState.initialized) {
			// Give time for root layout to initialize auth
			await new Promise(resolve => setTimeout(resolve, 100));
		}

		// Check email verification (server already verified authentication)
		if (authState.user && !authState.user.email_verified_at) {
			goto('/email-verify');
		}
	});

	// Watch for logout during session
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
