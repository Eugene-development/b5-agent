/**
 * Server-side layout load function for authentication routes (login, register)
 * Requirements: 2.5 - Redirect authenticated users away from auth pages
 */

import { redirect } from '@sveltejs/kit';

/**
 * @type {import('./$types').LayoutServerLoad}
 */
export async function load({ parent, url }) {
	// Get authentication data from parent layout (root +layout.server.js)
	const { user, isAuthenticated } = await parent();

	// Redirect authenticated users to dashboard
	if (isAuthenticated && user) {
		console.log('🔒 User is authenticated, redirecting from auth page to dashboard');
		throw redirect(302, '/dashboard');
	}

	// Allow access to auth pages for non-authenticated users
	return {
		user: null,
		isAuthenticated: false
	};
}
