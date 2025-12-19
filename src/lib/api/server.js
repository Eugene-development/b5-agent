/**
 * Server-side API utilities for SSR data loading
 * Handles GraphQL requests with JWT token from httpOnly cookies via event.locals
 */

import { API_BASE_URL } from '../config/api.js';

/**
 * Make GraphQL request with JWT token from server context
 * @param {string} token - JWT access token from event.locals
 * @param {string} query - GraphQL query
 * @param {Object} variables - GraphQL variables
 * @param {Function} fetch - SvelteKit fetch function (optional, for SSR)
 * @returns {Promise<Object>} GraphQL response data
 */
export async function makeServerGraphQLRequest(token, query, variables = {}, fetch = globalThis.fetch, event = null) {
	// Extract query name for logging
	const queryMatch = query.match(/query\s+(\w+)/);
	const queryName = queryMatch ? queryMatch[1] : 'UnknownQuery';

	const headers = {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		...(token && { Authorization: `Bearer ${token}` })
	};

	console.log(`📡 GraphQL SSR [${queryName}]: Making request to ${API_BASE_URL}/graphql`, {
		hasToken: !!token,
		tokenPreview: token ? `${token.substring(0, 30)}...` : 'none',
		tokenLength: token?.length || 0,
		hasAuthHeader: !!headers.Authorization,
		apiUrl: API_BASE_URL,
		variables: JSON.stringify(variables)
	});

	const response = await fetch(`${API_BASE_URL}/graphql`, {
		method: 'POST',
		headers,
		body: JSON.stringify({ query, variables })
	});

	console.log(`📡 GraphQL SSR [${queryName}]: Response status ${response.status}`);

	if (!response.ok) {
		const errorText = await response.text();
		console.error(`❌ GraphQL SSR [${queryName}]: Request failed`, {
			status: response.status,
			statusText: response.statusText,
			error: errorText
		});
		throw new Error(`GraphQL request failed: ${response.status} ${response.statusText} - ${errorText}`);
	}

	const result = await response.json();

	if (result.errors) {
		console.error(`❌ GraphQL SSR [${queryName}]: GraphQL errors`, result.errors);
		throw new Error(result.errors[0]?.message || 'GraphQL query failed');
	}

	console.log(`✅ GraphQL SSR [${queryName}]: Success`);
	return result.data;
}

/**
 * Error types for categorization
 */
export const ERROR_TYPES = {
	NETWORK: 'network',
	API: 'api',
	AUTH: 'auth',
	TIMEOUT: 'timeout',
	VALIDATION: 'validation',
	UNKNOWN: 'unknown'
};

/**
 * Categorize error by type
 * @param {Error} error - Error object
 * @returns {string} Error type
 */
export function categorizeError(error) {
	const message = error.message?.toLowerCase() || '';

	if (message.includes('network') || message.includes('fetch')) {
		return ERROR_TYPES.NETWORK;
	}
	if (message.includes('timeout') || message.includes('aborted')) {
		return ERROR_TYPES.TIMEOUT;
	}
	if (message.includes('unauthorized') || message.includes('forbidden') || message.includes('401')) {
		return ERROR_TYPES.AUTH;
	}
	if (message.includes('validation') || message.includes('invalid')) {
		return ERROR_TYPES.VALIDATION;
	}
	if (message.includes('graphql') || message.includes('api')) {
		return ERROR_TYPES.API;
	}

	return ERROR_TYPES.UNKNOWN;
}

/**
 * Get user-friendly error message
 * @param {string} errorType - Error type
 * @param {string} originalMessage - Original error message
 * @returns {string} User-friendly error message
 */
export function getUserFriendlyErrorMessage(errorType, originalMessage) {
	switch (errorType) {
		case ERROR_TYPES.NETWORK:
			return 'Проблема с подключением к серверу. Проверьте интернет-соединение.';
		case ERROR_TYPES.TIMEOUT:
			return 'Превышено время ожидания ответа от сервера. Попробуйте еще раз.';
		case ERROR_TYPES.AUTH:
			return 'Ошибка авторизации. Пожалуйста, войдите в систему заново.';
		case ERROR_TYPES.API:
			return 'Ошибка при получении данных с сервера. Попробуйте обновить страницу.';
		case ERROR_TYPES.VALIDATION:
			return 'Получены некорректные данные с сервера. Обратитесь к администратору.';
		default:
			return `Произошла неожиданная ошибка: ${originalMessage}`;
	}
}
