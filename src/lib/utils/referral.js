/**
 * Утилиты для работы с реферальными ссылками.
 *
 * Сохраняет ref параметр в localStorage при переходе на сайт,
 * чтобы использовать его при регистрации.
 */

const REFERRAL_STORAGE_KEY = 'referral_id';

/**
 * Сохранить ключ реферера в localStorage.
 *
 * @param {string|number} referrerKey - Ключ реферера (ULID или ID для обратной совместимости)
 */
export function saveReferralId(referrerKey) {
	if (!referrerKey) return;

	const key = String(referrerKey).trim();
	// Принимаем ULID (26 символов base32: 0-9A-Z) или числовой ID (для обратной совместимости)
	if (key && (/^[0-9A-Z]{26}$/i.test(key) || /^\d+$/.test(key))) {
		localStorage.setItem(REFERRAL_STORAGE_KEY, key);
		console.log('[Referral] Saved referral key to localStorage:', key);
	} else {
		console.warn('[Referral] Invalid referral key format:', key);
	}
}

/**
 * Получить ID реферера из localStorage.
 *
 * @returns {string|null} ID реферера или null
 */
export function getReferralId() {
	if (typeof localStorage === 'undefined') return null;
	return localStorage.getItem(REFERRAL_STORAGE_KEY);
}

/**
 * Очистить ID реферера из localStorage.
 * Вызывается после успешной регистрации.
 */
export function clearReferralId() {
	if (typeof localStorage === 'undefined') return;
	localStorage.removeItem(REFERRAL_STORAGE_KEY);
}

/**
 * Проверить и сохранить ref параметр из URL.
 *
 * @param {URLSearchParams|URL} urlOrParams - URL или URLSearchParams
 */
export function captureReferralFromUrl(urlOrParams) {
	let ref;

	if (urlOrParams instanceof URL) {
		ref = urlOrParams.searchParams.get('ref');
	} else if (urlOrParams instanceof URLSearchParams) {
		ref = urlOrParams.get('ref');
	} else if (typeof urlOrParams === 'string') {
		const url = new URL(urlOrParams, 'http://localhost');
		ref = url.searchParams.get('ref');
	}

	if (ref) {
		console.log('[Referral] Capturing ref from URL:', ref);
		saveReferralId(ref);
		console.log('[Referral] Saved to localStorage:', localStorage.getItem(REFERRAL_STORAGE_KEY));
	} else {
		console.log('[Referral] No ref parameter found in URL');
	}
}
