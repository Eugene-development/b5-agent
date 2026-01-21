/**
 * Server-side layout load function for protected routes
 * Redirects unauthenticated users to login page
 * Requirements: 3.4, 5.1
 */

import { redirect } from '@sveltejs/kit';

/**
 * @type {import('./$types').LayoutServerLoad}
 */
export async function load({ parent, url, locals }) {
	// Get authentication data from parent layout
	const parentData = await parent();

	// Check if token was expired (cleared by hooks.server.js)
	if (locals.tokenExpired) {
		const returnTo = url.pathname + url.search;
		console.log('⏰ Protected route: Token expired, redirecting to login', { returnTo });
		throw redirect(302, `/login?returnTo=${encodeURIComponent(returnTo)}&expired=1`);
	}

	// Redirect unauthenticated users to login
	if (!parentData.isAuthenticated) {
		const returnTo = url.pathname + url.search;
		console.log('🔒 Protected route: User not authenticated, redirecting to login', { returnTo });
		throw redirect(302, `/login?returnTo=${encodeURIComponent(returnTo)}`);
	}

	return {
		...parentData
	};
}
