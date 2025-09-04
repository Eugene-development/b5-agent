/**
 * Server-side load function for projects page
 * Handles authentication checks and data loading on the server
 * Requirements: 3.1, 3.2, 5.3
 */

import { error, redirect } from '@sveltejs/kit';
import { createProjectsApi } from '$lib/api/projects.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, locals, parent }) {
	try {
		// Get authentication data from parent layout
		const { user, isAuthenticated } = await parent();

		// Check authentication - redirect if not authenticated
		if (!isAuthenticated || !user) {
			throw redirect(302, '/login?returnTo=/projects');
		}

		// Create projects API client with server-side fetch
		const projectsApi = createProjectsApi(fetch);

		try {
			// Load projects data on the server
			const projectsResult = await projectsApi.getAll({ first: 100, page: 1 });
			const projects = projectsResult.data || [];

			// Calculate statistics
			const stats = {
				total: projects.length,
				active: projects.filter(project => project.is_active).length,
				inactive: projects.filter(project => !project.is_active).length,
				totalContractAmount: projects.reduce((sum, project) => sum + (project.contract_amount || 0), 0),
				averageContractAmount: 0
			};

			// Calculate average contract amount
			if (stats.total > 0) {
				stats.averageContractAmount = stats.totalContractAmount / stats.total;
			}

			return {
				projects,
				stats,
				pagination: projectsResult.paginatorInfo || {
					currentPage: 1,
					lastPage: 1,
					total: projects.length,
					perPage: 100,
					hasMorePages: false
				},
				error: null
			};
		} catch (apiError) {
			console.error('Failed to load projects data:', apiError);
			
			// Return error state instead of throwing to allow graceful error handling
			return {
				projects: [],
				stats: { 
					total: 0, 
					active: 0, 
					inactive: 0, 
					totalContractAmount: 0, 
					averageContractAmount: 0 
				},
				pagination: {
					currentPage: 1,
					lastPage: 1,
					total: 0,
					perPage: 100,
					hasMorePages: false
				},
				error: `Не удалось загрузить данные проектов: ${apiError.message}`
			};
		}
	} catch (err) {
		// Handle authentication redirects
		if (err.status === 302) {
			throw err;
		}

		console.error('Server load error for projects page:', err);
		throw error(500, 'Внутренняя ошибка сервера');
	}
}