/**
 * Утилиты для работы с реферальными ссылками.
 *
 * Сохраняет ref параметр в localStorage при переходе на сайт,
 * чтобы использовать его при регистрации.
 */

const REFERRAL_STORAGE_KEY = 'referral_id';

/**
 * Сохранить ID реферера в localStorage.
 *
 * @param {string|number} referrerId - ID реферера
 */
export function saveReferralId(referrerId) {
	if (!referrerId) return;

	const id = String(referrerId).trim();
	if (id && /^\d+$/.test(id)) {
		localStorage.setItem(REFERRAL_STORAGE_KEY, id);
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
