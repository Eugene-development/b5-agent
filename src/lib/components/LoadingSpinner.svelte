<!--
  Loading Spinner Component
  Provides consistent loading indicators across the application
  Requirements: 7.2, 7.3
-->
<script>
	// Destructure all props in a single $props() call
	let {
		/**
		 * @type {string} size - Size of the spinner (small, medium, large)
		 */
		size = 'medium',

		/**
		 * @type {string} message - Optional loading message
		 */
		message = 'Загрузка...',

		/**
		 * @type {boolean} showMessage - Whether to show the loading message
		 */
		showMessage = true,

		/**
		 * @type {string} className - Additional CSS classes
		 */
		className = '',

		/**
		 * @type {string} color - Color theme (primary, secondary, white)
		 */
		color = 'primary'
	} = $props();

	// Computed classes based on props
	let spinnerClasses = $derived(() => {
		const baseClasses = 'loading-spinner';
		const sizeClass = `loading-spinner--${size}`;
		const colorClass = `loading-spinner--${color}`;
		return `${baseClasses} ${sizeClass} ${colorClass} ${className}`.trim();
	});
</script>

<div class="loading-container" role="status" aria-live="polite">
	<div class={spinnerClasses()}></div>

	{#if showMessage && message}
		<div class="loading-message">
			{message}
		</div>
	{/if}
</div>

<style>
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		text-align: center;
	}

	.loading-spinner {
		position: relative;
		display: inline-block;
		border-radius: 50%;
		border: 2px solid transparent;
		animation: spin 1s linear infinite;
	}

	.loading-spinner--small {
		width: 1.5rem;
		height: 1.5rem;
		border-width: 2px;
	}

	.loading-spinner--medium {
		width: 2.5rem;
		height: 2.5rem;
		border-width: 2px;
	}

	.loading-spinner--large {
		width: 4rem;
		height: 4rem;
		border-width: 3px;
	}

	.spinner-circle {
		display: none;
	}

	/* Primary color theme */
	.loading-spinner--primary {
		border-top-color: #a78bfa;
		border-right-color: #c084fc;
		border-bottom-color: #e879f9;
	}

	/* Secondary color theme */
	.loading-spinner--secondary {
		border-top-color: #6b7280;
		border-right-color: #9ca3af;
		border-bottom-color: #d1d5db;
	}

	/* White color theme */
	.loading-spinner--white {
		border-top-color: #ffffff;
		border-right-color: rgba(255, 255, 255, 0.7);
		border-bottom-color: rgba(255, 255, 255, 0.5);
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.loading-message {
		margin-top: 1rem;
		color: #6b7280;
		font-size: 0.875rem;
		font-weight: 500;
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.loading-container {
			padding: 1.5rem;
		}

		.loading-message {
			font-size: 0.8125rem;
		}
	}

	/* Accessibility improvements */
	@media (prefers-reduced-motion: reduce) {
		.loading-spinner {
			animation: none;
			border-color: #a78bfa;
		}
	}
</style>
