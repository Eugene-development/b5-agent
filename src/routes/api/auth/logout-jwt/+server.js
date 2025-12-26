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

	// Determine cookie domain based on environment
	const isProduction = process.env.NODE_ENV === 'production';
	const cookieDomain = isProduction ? '.rubonus.ru' : undefined;

	// Clear httpOnly cookie
	cookies.delete('b5_auth_token', { 
		path: '/',
		domain: cookieDomain
	});

	// Clear user data cookie
	cookies.delete('b5_auth_user', { 
		path: '/',
		domain: cookieDomain
	});

	console.log('🍪 Cookies cleared with domain:', cookieDomain || 'default (current domain)');

	return json({
		success: true,
		message: 'Logged out successfully'
	});
}
