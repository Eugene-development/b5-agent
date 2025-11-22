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
			body: JSON.stringify({ email, password })
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

		cookies.set('b5_auth_token', cookieValue, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 // 30 days or 1 day
		});

		// Also set user data cookie (not httpOnly so client can read it)
		if (data.user) {
			cookies.set('b5_auth_user', JSON.stringify(data.user), {
				path: '/',
				httpOnly: false,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24
			});
		}

		// Return success response with user data
		return json({
			success: true,
			user: data.user,
			message: 'Login successful'
		});
	} catch (err) {
		console.error('❌ JWT Login: Error:', err);
		throw error(500, {
			message: 'Internal server error during login'
		});
	}
}
