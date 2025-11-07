/**
 * Server-side layout load function for b5-agent
 * Checks authentication status on every page load using Laravel Sanctum cookies
 */

import { AUTH_API_URL } from '$lib/config/api.js';

/**
 * Load function that runs on the server for every page request
 * @type {import('./$types').LayoutServerLoad}
 */
export async function load({ fetch, cookies, request }) {
	try {
		// Get all cookies
		const allCookies = cookies.getAll();

		// Get session cookie from request
		const sessionCookie = cookies.get('b5_auth_2_session');
		const xsrfToken = cookies.get('XSRF-TOKEN');

		// If no session cookie, user is not authenticated
		if (!sessionCookie) {
			return {
				user: null,
				isAuthenticated: false
			};
		}

		// Build cookie header from all cookies
		const cookieHeader = allCookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; ');

		// Try to get current user data from API using session cookie
		const response = await fetch(`${AUTH_API_URL}/api/user`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Cookie: cookieHeader,
				'X-Requested-With': 'XMLHttpRequest',
				// Add referer to help with CORS
				Referer: request.headers.get('referer') || request.url
			}
		});

		if (response.ok) {
			const data = await response.json();
			const user = data.user || data;

			return {
				user,
				isAuthenticated: true
			};
		} else {
			return {
				user: null,
				isAuthenticated: false
			};
		}
	} catch (error) {
		console.error('💥 Error checking authentication:', error);
		// On error, return unauthenticated state
		return {
			user: null,
			isAuthenticated: false
		};
	}
}
