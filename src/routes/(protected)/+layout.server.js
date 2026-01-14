/**
 * Server-side layout load function for protected routes
 * Redirects unauthenticated users to login page
 * Requirements: 3.4, 5.1
 */

import { redirect } from '@sveltejs/kit';

/**
 * @type {import('./$types').LayoutServerLoad}
 */
export async function load({ parent, url }) {
	// Get authentication data from parent layout
	const parentData = await parent();

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
