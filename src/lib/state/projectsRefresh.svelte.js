/**
 * Global state for triggering projects data refresh
 * Used to notify projects page when a new project is created
 */

let refreshTrigger = $state(0);
let callbacks = [];

export const projectsRefresh = {
	/**
	 * Get current refresh trigger value
	 */
	get trigger() {
		return refreshTrigger;
	},

	/**
	 * Trigger a refresh of projects data
	 */
	refresh() {
		refreshTrigger++;
		// Call all registered callbacks
		callbacks.forEach((callback) => {
			try {
				callback();
			} catch (error) {
				console.error('Error in refresh callback:', error);
			}
		});
	},

	/**
	 * Register a callback to be called when refresh is triggered
	 * @param {Function} callback - Function to call on refresh
	 * @returns {Function} Unsubscribe function
	 */
	subscribe(callback) {
		callbacks.push(callback);
		// Return unsubscribe function
		return () => {
			callbacks = callbacks.filter((cb) => cb !== callback);
		};
	}
};
