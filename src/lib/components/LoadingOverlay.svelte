<!--
  LoadingOverlay Component
  A full-screen overlay component for displaying loading states during navigation
-->
<script>
	import LoadingSpinner from './LoadingSpinner.svelte';

	let {
		/**
		 * @type {boolean} show - Controls overlay visibility
		 */
		show = false,

		/**
		 * @type {string} message - Custom loading message to display
		 */
		message = 'Загрузка...',

		/**
		 * @type {string} spinnerSize - Size of the loading spinner
		 */
		spinnerSize = 'large',

		/**
		 * @type {string} spinnerColor - Color of the loading spinner
		 */
		spinnerColor = 'white',

		/**
		 * @type {boolean} preventBodyScroll - Whether to prevent body scrolling
		 */
		preventBodyScroll = true,

		/**
		 * @type {string} className - Additional CSS classes
		 */
		className = ''
	} = $props();

	// Handle body scroll prevention
	$effect(() => {
		if (show && preventBodyScroll) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

{#if show}
	<div class="loading-overlay {className}" role="status" aria-live="polite" aria-label={message}>
		<div class="loading-overlay__backdrop"></div>

		<div class="loading-overlay__content">
			<LoadingSpinner size={spinnerSize} color={spinnerColor} {message} showMessage={true} />
		</div>
	</div>
{/if}

<style>
	.loading-overlay {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loading-overlay__backdrop {
		position: absolute;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(4px);
		transition: opacity 0.3s ease-in-out;
	}

	.loading-overlay__content {
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		border-radius: 0.5rem;
		background-color: rgba(31, 41, 55, 0.95);
		box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
	}

	@media (prefers-reduced-motion: reduce) {
		.loading-overlay__backdrop {
			transition: none;
		}
	}
</style>
