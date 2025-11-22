/**
 * Server-side layout load function for protected routes
 * Note: For JWT authentication, server-side redirects are disabled
 * Authentication checks are handled on the client side
 * Requirements: 3.4, 5.1
 */

/**
 * @type {import('./$types').LayoutServerLoad}
 */
export async function load({ parent }) {
	// Get parent data (which indicates JWT mode)
	const parentData = await parent();

	// In JWT mode, skip server-side authentication checks
	// Client will handle redirects based on localStorage token
	return {
		...parentData,
		// Pass through parent data without modification
	};
}
