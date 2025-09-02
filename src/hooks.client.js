/**
 * SvelteKit client-side hooks for authentication handling
 * Requirements: 4.1, 4.2, 4.3, 5.1
 */

import { browser } from '$app/environment';
import { initializeAuth, isProtectedRoute, isGuestRoute } from '$lib/auth/auth-guard.svelte.js';

/**
 * Handle client-side navigation and authentication state
 */
export async function handleError({ error, event }) {
	console.error('Client error:', error);
	
	// Handle authentication errors
	if (error.status === 401) {
		// Clear auth state and redirect to login
		const { clearAuthState } = await import('$lib/auth/auth.svelte.js');
		clearAuthState();
		
		// Only redirect if not already on login page
		if (!event.url.pathname.startsWith('/login')) {
			const { goto } = await import('$app/navigation');
			await goto('/login');
		}
	}
	
	return {
		message: error.message || 'An unexpected error occurred'
	};
}

/**
 * Initialize authentication on app start
 */
let authInitialized = false;

/**
 * Handle client-side navigation with authentication checks
 * Requirements: 3.4, 4.3, 5.1
 */
export async function beforeNavigate({ from, to, cancel }) {
	// Initialize auth state on first navigation if not done yet
	if (!authInitialized && browser) {
		authInitialized = true;
		try {
			await initializeAuth();
		} catch (err) {
			console.debug('Failed to initialize auth on client:', err);
		}
	}

	// Skip navigation checks for external URLs or same page
	if (!to || !to.url || to.url.origin !== location.origin) {
		return;
	}

	const pathname = to.url.pathname;

	// Check if navigation to protected route is allowed
	if (isProtectedRoute(pathname)) {
		const { navigationGuard } = await import('$lib/auth-guard.svelte.js');
		const allowed = await navigationGuard(pathname, { requireAuth: true });
		
		if (!allowed) {
			cancel();
			const { goto } = await import('$app/navigation');
			const returnTo = encodeURIComponent(pathname + to.url.search);
			await goto(`/login?returnTo=${returnTo}`);
		}
	}

	// Check if navigation to guest-only route is allowed
	if (isGuestRoute(pathname)) {
		const { navigationGuard } = await import('$lib/auth-guard.svelte.js');
		const allowed = await navigationGuard(pathname, { requireGuest: true });
		
		if (!allowed) {
			cancel();
			const { goto } = await import('$app/navigation');
			await goto('/dashboard');
		}
	}
}

/**
 * Handle client-side errors with authentication context
 */
export async function handleClientError({ error, event }) {
	return handleError({ error, event });
}