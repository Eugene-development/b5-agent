/**
 * Server-side load function for statistics page with SSR
 * Data is rendered on the server using JWT from httpOnly cookie
 * Requirements: 2.2, 3.2, 5.2, 6.1
 */

import { error } from '@sveltejs/kit';
import { API_CONFIG } from '$lib/api/config.js';

/**
 * Make GraphQL request with JWT token from server
 * @param {string} token - JWT access token
 * @param {string} query - GraphQL query
 * @param {Object} variables - GraphQL variables
 * @returns {Promise<Object>} GraphQL response data
 */
async function makeServerGraphQLRequest(token, query, variables = {}) {
	const response = await fetch(API_CONFIG.graphqlUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({ query, variables })
	});

	if (!response.ok) {
		throw new Error(`GraphQL request failed: ${response.statusText}`);
	}

	const result = await response.json();

	if (result.errors) {
		throw new Error(result.errors[0]?.message || 'GraphQL query failed');
	}

	return result.data;
}

/**
 * Get projects for agent using GraphQL
 * @param {string} token - JWT access token
 * @param {string} userId - User/Agent ID
 * @returns {Promise<Array>} Projects array
 */
async function getProjectsByAgent(token, userId) {
	const query = `
		query GetProjectsByAgent($user_id: ID!) {
			projectsByAgent(user_id: $user_id) {
				id
				value
				description
				region
				contract_amount
				contract_date
				planned_completion_date
				is_active
				is_incognito
				created_at
				updated_at
				status {
					id
					slug
					value
					color
					is_active
				}
				client {
					id
					name
					email
					phone
				}
				agent {
					id
					name
					email
				}
			}
		}
	`;

	const data = await makeServerGraphQLRequest(token, query, { user_id: String(userId) });
	return data.projectsByAgent || [];
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	try {
		console.log('📊 Statistics SSR: Server-side load started');

		// Check authentication from event.locals (set by hooks.server.js)
		if (!locals.isAuthenticated || !locals.user || !locals.token) {
			console.log('⚠️ Statistics SSR: User not authenticated, returning empty data for client-side loading');
			// Return empty data - client will handle loading with localStorage token
			return {
				user: null,
				totalProjects: 0,
				isAuthenticated: false,
				error: null,
				needsClientLoad: true // Flag for client to load data
			};
		}

		const userId = locals.user.id;
		console.log('👤 Statistics SSR: Loading data for user ID:', userId);

		try {
			// Fetch projects using GraphQL with JWT token
			const userProjects = await getProjectsByAgent(locals.token, userId);

			// Calculate total projects count
			const totalProjects = Array.isArray(userProjects) ? userProjects.length : 0;

			console.log(`✅ Statistics SSR: Loaded ${totalProjects} projects`);

			return {
				user: locals.user,
				totalProjects,
				isAuthenticated: true,
				error: null
			};
		} catch (apiError) {
			console.error('❌ Statistics SSR: Failed to load projects:', {
				error: apiError.message,
				stack: apiError.stack
			});

			// Return error state with default stats
			return {
				user: locals.user,
				totalProjects: 0,
				isAuthenticated: true,
				error: 'Не удалось загрузить статистику проектов'
			};
		}
	} catch (err) {
		console.error('❌ Statistics SSR: Server load error:', {
			error: err.message,
			stack: err.stack
		});

		// Re-throw authentication errors
		if (err.status === 401) {
			throw err;
		}

		throw error(500, {
			message: 'Внутренняя ошибка при загрузке статистики'
		});
	}
}
