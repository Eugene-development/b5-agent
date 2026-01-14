/**
 * JWT Login endpoint that sets httpOnly cookie
 * Calls the backend API and sets JWT token in httpOnly cookie
 */

import { json, error } from '@sveltejs/kit';
import { API_CONFIG } from '$lib/api/config.js';

/**
 * POST /api/auth/login-jwt
 * Login and set JWT in httpOnly cookie
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ request, cookies }) {
	try {
		// Get login credentials from request
		const { email, password, remember } = await request.json();

		console.log('🔐 JWT Login: Attempting login for:', email);

		// Call backend login API
		const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.login}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({ email, password, remember })
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			console.error('❌ JWT Login: Backend login failed:', errorData);
			return json(
				{
					success: false,
					message: errorData.message || 'Login failed'
				},
				{ status: response.status }
			);
		}

		const data = await response.json();

		// Extract token from response
		const token = data.token || data.access_token;
		if (!token) {
			console.error('❌ JWT Login: No token in response');
			return json(
				{
					success: false,
					message: 'No token received from server'
				},
				{ status: 500 }
			);
		}

		console.log('✅ JWT Login: Login successful, setting httpOnly cookie');

		// Set httpOnly cookie with JWT token
		// Store the full token object as JSON
		const cookieValue = typeof token === 'string' ? token : JSON.stringify(token);

		// Determine cookie domain based on environment
		const isProduction = process.env.NODE_ENV === 'production';
		// Use .rubonus.pro for b5-agent (not .rubonus.ru which is for b5-admin)
		const cookieDomain = isProduction ? '.rubonus.pro' : undefined;

		cookies.set('b5_auth_token', cookieValue, {
			path: '/',
			httpOnly: true,
			secure: isProduction,
			sameSite: 'lax',
			domain: cookieDomain,
			maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 // 30 days or 1 day
		});

		console.log('🍪 Cookie set with domain:', cookieDomain || 'default (current domain)');

		// Also set user data cookie (not httpOnly so client can read it)
		if (data.user) {
			cookies.set('b5_auth_user', JSON.stringify(data.user), {
				path: '/',
				httpOnly: false,
				secure: isProduction,
				sameSite: 'lax',
				domain: cookieDomain,
				maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24
			});
		}

		// Return success response with user data and token
		// Token is also returned so client can store it in localStorage for API requests
		return json({
			success: true,
			user: data.user,
			token: token,
			message: 'Login successful'
		});
	} catch (err) {
		console.error('❌ JWT Login: Error:', err);
		throw error(500, {
			message: 'Internal server error during login'
		});
	}
}
