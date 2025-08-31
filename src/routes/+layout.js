/**
 * Root layout load function for authentication initialization
 * Requirements: 4.1, 4.2, 4.3
 */

import { browser } from '$app/environment';

/**
 * Load function for root layout
 * Provides initial authentication state to all routes
 */
export async function load({ url, route }) {
	// Return basic layout data
	// Authentication initialization happens client-side in the layout component
	return {
		url: url.pathname,
		route: route.id
	};
}

// Disable server-side rendering for authentication-dependent content
export const ssr = false;