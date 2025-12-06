<!--
  Layout for protected routes
  This layout wraps all routes that require authentication
-->
<script>
	import { authState } from '$lib/auth/auth.svelte.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import DashboardMenu from '$lib/components/DashboardMenu.svelte';

	let { children } = $props();

	// Client-side authentication guard for protected routes
	$effect(() => {
		// Wait for auth to initialize
		if (authState.initialized) {
			// Check if user is authenticated
			if (!authState.isAuthenticated) {
				// Not authenticated - redirect to login
				const returnTo = $page.url.pathname + $page.url.search;
				goto(`/login?returnTo=${encodeURIComponent(returnTo)}`);
			} else if (authState.user && !authState.user.email_verified_at) {
				// Authenticated but email not verified - redirect to email verification
				goto('/email-verify');
			}
		}
	});
</script>

<div class="pt-8 lg:pt-10">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<DashboardMenu />
	</div>
</div>

{@render children?.()}
