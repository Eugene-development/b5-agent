/**
 * Server-side layout load function for protected routes
 * Handles authentication check on the server (SSR)
 * Requirements: 3.4, 5.1
 */

import { redirect } from '@sveltejs/kit';

/**
 * @type {import('./$types').LayoutServerLoad}
 */
export async function load({ parent, url }) {
	// Get authentication data from parent layout (root +layout.server.js)
	const { user, isAuthenticated } = await parent();

	// Check if user is authenticated
	if (!isAuthenticated || !user) {
		// Store the intended destination for post-login redirect
		const returnTo = url.pathname + url.search;
		const loginUrl = `/login?returnTo=${encodeURIComponent(returnTo)}`;
		throw redirect(302, loginUrl);
	}

	// Check email verification requirement
	if (!user.email_verified_at) {
		// User is authenticated but email not verified
		throw redirect(302, '/email-verify');
	}

	// Return user data for child routes
	return {
		user,
		isAuthenticated,
		emailVerified: true
	};
}
