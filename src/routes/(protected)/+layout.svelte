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

	// Note: Email verification check removed - users can access dashboard without verified email
	// Individual pages (like /form) will handle email verification requirements

	// Watch for logout during session
	// Only redirect if auth was initialized AND user logged out (not on initial load with expired token)
	$effect(() => {
		// Skip if we're already being redirected by root layout due to expired token
		if (data?.tokenExpired) {
			return;
		}
		
		if (authState.initialized && !authState.isAuthenticated) {
			const returnTo = $page.url.pathname + $page.url.search;
			// Use window.location.href to prevent SPA navigation loops
			if (typeof window !== 'undefined') {
				window.location.href = `/login?returnTo=${encodeURIComponent(returnTo)}`;
			}
		}
	});
</script>

<div class="pt-4 lg:pt-6">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<DashboardMenu />
	</div>
</div>

{@render children?.()}
