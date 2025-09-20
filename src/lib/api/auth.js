/**
 * Authentication API functions for b5-agent
 */

import { AUTH_API_URL } from '../config/api.js';

/**
 * Verify email using verification URL parameters
 * @param {string} id - User ID
 * @param {string} hash - Verification hash
 * @returns {Promise<Object>} - Verification result
 */
export async function verifyEmailWithParams(id, hash) {
	try {
		console.log('📧 Verifying email with parameters...', { id, hash });

		const verificationUrl = `${AUTH_API_URL}/api/email/verify/${id}/${hash}`;

		const response = await fetch(verificationUrl, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		});

		const result = await response.json();
		console.log('📧 Email verification result:', result);

		return {
			success: result.success || false,
			message: result.message || 'Ошибка верификации email',
			user: result.data?.user || null
		};
	} catch (error) {
		console.error('❌ Email verification error:', error);
		return {
			success: false,
			message: 'Произошла ошибка при верификации email'
		};
	}
}

/**
 * Resend email verification notification
 * @returns {Promise<Object>} - Result of resend operation
 */
export async function resendEmailVerification() {
	try {
		console.log('📧 Resending email verification...');

		const response = await fetch(`${AUTH_API_URL}/api/email/verification-notification`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		});

		const result = await response.json();
		console.log('📧 Resend email verification result:', result);

		return {
			success: response.ok && result.success,
			message: result.message || (response.ok ? 'Письмо отправлено' : 'Ошибка отправки')
		};
	} catch (error) {
		console.error('❌ Resend email verification error:', error);
		return {
			success: false,
			message: 'Произошла ошибка при отправке письма'
		};
	}
}
