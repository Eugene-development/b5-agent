/**
 * Mobile menu visibility state management using Svelte 5 runes
 * Provides reactive state for mobile menu visibility
 */

// Reactive state using Svelte 5 runes
let isVisible = $state(false);

/**
 * Mobile menu state object with reactive getters
 */
export const visibleMobileMenu = {
	/**
	 * Get current mobile menu visibility state
	 * @returns {boolean} True if mobile menu is visible
	 */
	get value() {
		return isVisible;
	}
};

/**
 * Open the mobile menu
 */
export function openMobileMenu() {
	isVisible = true;
}

/**
 * Close the mobile menu
 */
export function closeMobileMenu() {
	isVisible = false;
}

/**
 * Toggle mobile menu visibility
 */
export function toggleMobileMenu() {
	isVisible = !isVisible;
}