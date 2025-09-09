/**
 * Server-side data loading for profile page
 * Fetches user profile data and email verification status on the server
 * Requirements: Server-side data fetching, user profile management
 */

import { createApiClients } from '$lib/utils/http-client.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, parent }) {
	try {
		// Get authentication data from parent layout
		const { user, isAuthenticated } = await parent();
		console.log(user);
		console.log(isAuthenticated);

		if (!isAuthenticated || !user) {
			// Should not happen due to protected layout, but safety check
			return {
				user: null,
				profile: null,
				emailVerified: false,
				error: 'Authentication required'
			};
		}

		// Create API clients with SvelteKit fetch
		const { auth } = createApiClients(fetch);

		// Fetch additional profile data if needed
		let profile = {
			emailVerified: user.email_verified || false,
			emailVerifiedAt: user.email_verified_at || null,
			registrationDate: user.created_at || null,
			lastLoginAt: user.last_login_at || null
		};

		try {
			// You can extend this to fetch additional profile data from your API
			// For example, user settings, preferences, activity logs, etc.
			// const profileResponse = await auth.get('/api/user/profile');
			// if (profileResponse.success) {
			//   profile = { ...profile, ...profileResponse.data };
			// }
		} catch (error) {
			console.log('Could not fetch additional profile data:', error.message);
			// Continue with basic profile data
		}

		return {
			user,
			profile,
			emailVerified: profile.emailVerified,
			isAuthenticated: true
		};
	} catch (error) {
		console.error('Profile server load error:', error);
		return {
			user: null,
			profile: null,
			emailVerified: false,
			error: 'Failed to load profile data'
		};
	}
}
