/**
 * Server-side layout load function for b5-agent
 * Note: For JWT authentication, server-side checks are skipped
 * Authentication is handled entirely on the client side using JWT tokens from localStorage
 */

/**
 * Load function that runs on the server for every page request
 * @type {import('./$types').LayoutServerLoad}
 */
export async function load() {
	// For JWT authentication, we don't have access to localStorage on the server
	// Return minimal data - client will handle authentication via localStorage
	return {
		// Server doesn't know about JWT tokens, so we return null
		// Client will initialize from localStorage
		user: null,
		isAuthenticated: false,
		// Flag to indicate this is JWT mode (client-side auth only)
		jwtMode: true
	};
}
