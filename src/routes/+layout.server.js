/**
 * Server-side layout load function for b5-agent
 * Uses JWT token from httpOnly cookie for server-side authentication
 */

/**
 * Load function that runs on the server for every page request
 * @type {import('./$types').LayoutServerLoad}
 */
export async function load({ locals }) {
	// Get authentication data from hooks.server.js (via event.locals)
	return {
		user: locals.user || null,
		isAuthenticated: locals.isAuthenticated || false,
		token: locals.token || null
	};
}
