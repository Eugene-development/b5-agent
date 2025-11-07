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

		// Debug logging for production issues
		console.log('🔐 Auth check:', {
			hasCookies: allCookies.length > 0,
			hasSession: !!sessionCookie,
			hasXsrf: !!xsrfToken,
			cookieNames: allCookies.map((c) => c.name),
			url: request.url
		});

		// If no session cookie, user is not authenticated
		if (!sessionCookie) {
			console.log('❌ No session cookie found - user not authenticated');
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
			credentials: 'include', // Important for cross-domain cookies
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Cookie: cookieHeader,
				'X-Requested-With': 'XMLHttpRequest',
				// Add referer to help with CORS
				Referer: request.headers.get('referer') || request.url,
				// Add origin for CORS
				Origin: request.headers.get('origin') || new URL(request.url).origin
			}
		});

		if (response.ok) {
			const data = await response.json();
			const user = data.user || data;

			console.log('✅ Auth API success:', {
				hasUser: !!user,
				userId: user?.id,
				userEmail: user?.email
			});

			return {
				user,
				isAuthenticated: true
			};
		} else {
			console.log('❌ Auth API failed:', {
				status: response.status,
				statusText: response.statusText
			});
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
