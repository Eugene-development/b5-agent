/**
 * Refresh user data endpoint
 * Updates the b5_auth_user cookie with fresh user data from the API
 */

import { json, error } from '@sveltejs/kit';
import { API_CONFIG } from '$lib/api/config.js';

/**
 * POST /api/auth/refresh-user
 * Refresh user data in cookie
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ cookies }) {
	try {
		// Get current token
		const token = cookies.get('b5_auth_token');
		
		if (!token) {
			return json(
				{
					success: false,
					message: 'Not authenticated'
				},
				{ status: 401 }
			);
		}

		// Parse token if it's a JSON string
		let actualToken = token;
		try {
			const parsed = JSON.parse(token);
			actualToken = parsed.access_token || parsed.token || token;
		} catch {
			// Token is already a string
		}

		console.log('🔄 Refresh User: Fetching fresh user data');

		// Call backend to get current user data
		const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.user}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${actualToken}`
			}
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			console.error('❌ Refresh User: Failed to fetch user data:', errorData);
			return json(
				{
					success: false,
					message: errorData.message || 'Failed to refresh user data'
				},
				{ status: response.status }
			);
		}

		const data = await response.json();
		const user = data.user || data;

		if (!user) {
			return json(
				{
					success: false,
					message: 'No user data received'
				},
				{ status: 500 }
			);
		}

		console.log('✅ Refresh User: Got fresh user data', {
			userId: user.id,
			email: user.email,
			email_verified_at: user.email_verified_at
		});

		// Determine cookie settings
		const isProduction = process.env.NODE_ENV === 'production';
		const cookieDomain = isProduction ? '.rubonus.pro' : undefined;

		// Update user data cookie
		cookies.set('b5_auth_user', JSON.stringify(user), {
			path: '/',
			httpOnly: false,
			secure: isProduction,
			sameSite: 'lax',
			domain: cookieDomain,
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});

		console.log('🍪 Updated user cookie with fresh data');

		return json({
			success: true,
			user: user,
			message: 'User data refreshed'
		});
	} catch (err) {
		console.error('❌ Refresh User: Error:', err);
		throw error(500, {
			message: 'Internal server error during user refresh'
		});
	}
}
