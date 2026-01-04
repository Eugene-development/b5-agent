/**
 * Formatting utilities
 */

/**
 * Format currency value to Russian format with ₽ symbol
 * @param {number} value - Value to format
 * @param {boolean} showDecimals - Whether to show decimal places (default: true)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, showDecimals = true) {
	if (value === null || value === undefined || isNaN(value)) {
		return '0 ₽';
	}

	const num = Number(value);
	const options = {
		minimumFractionDigits: showDecimals ? 2 : 0,
		maximumFractionDigits: showDecimals ? 2 : 0
	};

	return num.toLocaleString('ru-RU', options) + ' ₽';
}

/**
 * Format phone number to +7 (XXX) XXX-XX-XX format
 * @param {string|number} phone - Phone number to format
 * @returns {string} Formatted phone string
 */
export function formatPhone(phone) {
	if (!phone) {
		return 'Не указан';
	}

	// Convert to string and extract only digits
	const phoneStr = String(phone).replace(/\D/g, '');

	// Check if phone has valid length
	if (phoneStr.length < 10 || phoneStr.length > 11) {
		return String(phone); // Return original if invalid
	}

	// Normalize to 11 digits starting with 7
	let normalized = phoneStr;
	if (normalized.length === 10) {
		normalized = '7' + normalized;
	} else if (normalized.startsWith('8') && normalized.length === 11) {
		normalized = '7' + normalized.slice(1);
	}

	// Format as +7 (XXX) XXX-XX-XX
	if (normalized.length === 11 && normalized.startsWith('7')) {
		return `+7 (${normalized.slice(1, 4)}) ${normalized.slice(4, 7)}-${normalized.slice(7, 9)}-${normalized.slice(9, 11)}`;
	}

	return String(phone); // Return original if can't format
}
