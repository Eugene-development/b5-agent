/**
 * JWT Logout endpoint that clears httpOnly cookie
 */

import { json } from '@sveltejs/kit';

/**
 * POST /api/auth/logout-jwt
 * Logout and clear JWT httpOnly cookie
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ cookies }) {
	console.log('👋 JWT Logout: Clearing cookies');

	// Clear httpOnly cookie
	cookies.delete('b5_auth_token', { path: '/' });

	// Clear user data cookie
	cookies.delete('b5_auth_user', { path: '/' });

	return json({
		success: true,
		message: 'Logged out successfully'
	});
}
