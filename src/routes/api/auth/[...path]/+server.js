/**
 * Auth API Proxy
 * Proxies requests to Auth API (auth.rubonus.ru) through the same domain
 * This solves cross-domain cookie issues
 */

import { AUTH_API_URL } from '$lib/config/api.js';
import { error } from '@sveltejs/kit';

/**
 * Proxy all methods to Auth API
 * @type {import('./$types').RequestHandler}
 */
async function proxyRequest({ request, params, cookies }) {
	const { path } = params;
	const url = new URL(request.url);

	// Build target URL
	const targetUrl = `${AUTH_API_URL}/${path}${url.search}`;

	console.log('🔄 Proxying auth request:', {
		method: request.method,
		path,
		targetUrl
	});

	try {
		// Get all cookies from the request
		const allCookies = cookies.getAll();
		const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ');

		// Copy headers from original request
		const headers = new Headers();
		headers.set('Accept', request.headers.get('Accept') || 'application/json');
		headers.set('Content-Type', request.headers.get('Content-Type') || 'application/json');
		headers.set('X-Requested-With', 'XMLHttpRequest');

		// Add cookies if present
		if (cookieHeader) {
			headers.set('Cookie', cookieHeader);
		}

		// Copy CSRF token if present
		const xsrfToken = request.headers.get('X-XSRF-TOKEN');
		if (xsrfToken) {
			headers.set('X-XSRF-TOKEN', xsrfToken);
		}

		// Build request options
		const options = {
			method: request.method,
			headers,
			credentials: 'include'
		};

		// Add body for non-GET requests
		if (request.method !== 'GET' && request.method !== 'HEAD') {
			const body = await request.text();
			if (body) {
				options.body = body;
			}
		}

		// Make request to Auth API
		const response = await fetch(targetUrl, options);

		console.log('📥 Auth API response:', {
			status: response.status,
			statusText: response.statusText,
			hasCookies: response.headers.has('set-cookie')
		});

		// Copy Set-Cookie headers from Auth API response to our response
		const setCookieHeaders = response.headers.getSetCookie?.() || [];
		for (const cookieString of setCookieHeaders) {
			// Parse cookie and set it through SvelteKit cookies API
			const [nameValue, ...attributes] = cookieString.split(';').map((s) => s.trim());
			const [name, value] = nameValue.split('=');

			const cookieOptions = {
				path: '/',
				httpOnly: false,
				secure: false,
				sameSite: 'lax'
			};

			// Parse cookie attributes
			for (const attr of attributes) {
				const [key, val] = attr.split('=').map((s) => s.trim());
				const keyLower = key.toLowerCase();

				if (keyLower === 'path') cookieOptions.path = val;
				else if (keyLower === 'httponly') cookieOptions.httpOnly = true;
				else if (keyLower === 'secure') cookieOptions.secure = true;
				else if (keyLower === 'samesite') cookieOptions.sameSite = val.toLowerCase();
				else if (keyLower === 'max-age') cookieOptions.maxAge = parseInt(val);
				else if (keyLower === 'expires') {
					// Convert expires to maxAge
					const expiresDate = new Date(val);
					const now = new Date();
					cookieOptions.maxAge = Math.floor((expiresDate - now) / 1000);
				}
			}

			// Set cookie through SvelteKit
			cookies.set(name, value, cookieOptions);

			console.log('🍪 Setting cookie:', {
				name,
				hasValue: !!value,
				options: cookieOptions
			});
		}

		// Get response body
		const contentType = response.headers.get('content-type') || '';
		let responseBody;

		if (contentType.includes('application/json')) {
			responseBody = await response.json();
		} else {
			responseBody = await response.text();
		}

		// Return response with same status and body
		return new Response(JSON.stringify(responseBody), {
			status: response.status,
			statusText: response.statusText,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (err) {
		console.error('❌ Auth API proxy error:', err);
		throw error(500, {
			message: 'Failed to proxy auth request',
			details: err.message
		});
	}
}

// Export all HTTP methods
export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
