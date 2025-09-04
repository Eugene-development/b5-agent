/**
 * Server-side layout load function for protected routes group
 * Ensures authentication is checked on the server for all protected routes
 * Requirements: 5.1, 5.2, 5.3
 */

import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ parent, url }) {
	try {
		// Get authentication data from parent layout
		const { user, isAuthenticated } = await parent();

		// Check authentication - redirect if not authenticated
		if (!isAuthenticated || !user) {
			// Store the intended destination for post-login redirect
			const returnTo = url.pathname + url.search;
			const loginUrl = `/login?returnTo=${encodeURIComponent(returnTo)}`;
			throw redirect(302, loginUrl);
		}

		// Return user data for protected routes
		return {
			user,
			isAuthenticated: true
		};
	} catch (err) {
		// Handle authentication redirects
		if (err.status === 302) {
			throw err;
		}

		console.error('Server load error for protected layout:', err);
		// If there's an error getting auth data, redirect to login
		throw redirect(302, '/login');
	}
}