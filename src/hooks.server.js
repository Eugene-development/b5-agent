/**
 * SvelteKit server-side hooks for authentication middleware
 * Handles JWT authentication from httpOnly cookies
 * Requirements: 5.1
 */

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired
 */
function isTokenExpired(token) {
	try {
		const base64Url = token.split('.')[1];
		if (!base64Url) return true;
		
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		);
		
		const payload = JSON.parse(jsonPayload);
		
		// Check exp claim (expiration time in seconds since epoch)
		if (payload.exp) {
			const now = Math.floor(Date.now() / 1000);
			// Add 30 second buffer to handle clock skew
			if (payload.exp < now - 30) {
				console.log('⏰ Token expired:', {
					exp: new Date(payload.exp * 1000).toISOString(),
					now: new Date(now * 1000).toISOString()
				});
				return true;
			}
		}
		
		return false;
	} catch (error) {
		console.error('❌ Error checking token expiration:', error);
		return true; // Treat invalid tokens as expired
	}
}

/**
 * Clear authentication cookies
 * @param {Object} cookies - SvelteKit cookies object
 */
function clearAuthCookies(cookies) {
	const isProduction = process.env.NODE_ENV === 'production';
	const cookieDomain = isProduction ? '.rubonus.pro' : undefined;
	
	cookies.delete('b5_auth_token', { path: '/', domain: cookieDomain });
	cookies.delete('b5_auth_user', { path: '/', domain: cookieDomain });
	
	console.log('🧹 Cleared expired auth cookies');
}

/**
 * Handle server-side requests with authentication middleware
 * Reads JWT token from httpOnly cookie and adds user data to event.locals
 * @param {Object} event - SvelteKit request event
 * @param {Function} resolve - SvelteKit resolve function
 * @returns {Promise<Response>} Response
 */
export async function handle({ event, resolve }) {
	// Try to get JWT token from httpOnly cookie
	const token = event.cookies.get('b5_auth_token');
	const userCookie = event.cookies.get('b5_auth_user');

	if (token) {
		try {
			// Parse token if it's a JSON string
			let actualToken = token;
			try {
				const parsed = JSON.parse(token);
				actualToken = parsed.access_token || parsed.token || token;
			} catch {
				// Token is already a string
			}

			// Check if token is expired BEFORE processing
			if (isTokenExpired(actualToken)) {
				console.log('⏰ Auth middleware: Token expired, clearing cookies', {
					path: event.url.pathname
				});
				
				// Clear expired cookies
				clearAuthCookies(event.cookies);
				
				// Set unauthenticated state
				event.locals.user = null;
				event.locals.token = null;
				event.locals.isAuthenticated = false;
				event.locals.tokenExpired = true; // Flag for client to know token expired
				
				return await resolve(event);
			}

			console.log('🔐 Auth middleware: Processing token', {
				tokenLength: actualToken.length,
				tokenPreview: actualToken.substring(0, 30) + '...',
				path: event.url.pathname,
				hasUserCookie: !!userCookie
			});

			// Try to get full user data from user cookie first
			let userData = null;
			if (userCookie) {
				try {
					userData = JSON.parse(userCookie);
					console.log('🔐 Auth middleware: Got user data from cookie', {
						userId: userData.id,
						email: userData.email
					});
				} catch (e) {
					console.warn('⚠️ Auth middleware: Failed to parse user cookie:', e);
				}
			}

			// Fallback: decode JWT to get basic user data
			if (!userData) {
				const base64Url = actualToken.split('.')[1];
				if (base64Url) {
					const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
					const jsonPayload = decodeURIComponent(
						atob(base64)
							.split('')
							.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
							.join('')
					);

					const payload = JSON.parse(jsonPayload);
					userData = {
						id: payload.sub,
						email: payload.email,
						name: payload.name,
						email_verified_at: payload.email_verified ? new Date().toISOString() : null
					};
				}
			}

			if (userData) {
				event.locals.user = userData;
				event.locals.token = actualToken;
				event.locals.isAuthenticated = true;

				console.log('🔐 Auth middleware: User authenticated', {
					userId: userData.id,
					email: userData.email,
					path: event.url.pathname
				});
			}
		} catch (error) {
			console.error('❌ Auth middleware: Failed to process auth:', error);
			// Clear potentially corrupted cookies
			clearAuthCookies(event.cookies);
			event.locals.user = null;
			event.locals.token = null;
			event.locals.isAuthenticated = false;
		}
	} else {
		console.log('⚠️ Auth middleware: No token found in httpOnly cookie', {
			path: event.url.pathname,
			cookies: Object.keys(event.cookies.getAll())
		});
		event.locals.user = null;
		event.locals.token = null;
		event.locals.isAuthenticated = false;
	}

	return await resolve(event);
}
