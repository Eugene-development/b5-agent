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
	<div class={spinnerClasses}>
		<div class="spinner-circle"></div>
		<div class="spinner-circle"></div>
		<div class="spinner-circle"></div>
		<div class="spinner-circle"></div>
	</div>
	
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
	}

	.loading-spinner--small {
		width: 1.5rem;
		height: 1.5rem;
	}

	.loading-spinner--medium {
		width: 2.5rem;
		height: 2.5rem;
	}

	.loading-spinner--large {
		width: 4rem;
		height: 4rem;
	}

	.spinner-circle {
		position: absolute;
		border-radius: 50%;
		animation: loading-spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
	}

	.loading-spinner--small .spinner-circle {
		width: 0.25rem;
		height: 0.25rem;
		margin: 0.125rem;
	}

	.loading-spinner--medium .spinner-circle {
		width: 0.5rem;
		height: 0.5rem;
		margin: 0.25rem;
	}

	.loading-spinner--large .spinner-circle {
		width: 0.75rem;
		height: 0.75rem;
		margin: 0.375rem;
	}

	/* Primary color theme */
	.loading-spinner--primary .spinner-circle {
		background-color: #3b82f6;
	}

	/* Secondary color theme */
	.loading-spinner--secondary .spinner-circle {
		background-color: #6b7280;
	}

	/* White color theme */
	.loading-spinner--white .spinner-circle {
		background-color: #ffffff;
	}

	.spinner-circle:nth-child(1) {
		top: 0;
		left: 0;
		animation-delay: -0.036s;
	}

	.spinner-circle:nth-child(2) {
		top: 0;
		right: 0;
		animation-delay: -0.072s;
	}

	.spinner-circle:nth-child(3) {
		bottom: 0;
		right: 0;
		animation-delay: -0.108s;
	}

	.spinner-circle:nth-child(4) {
		bottom: 0;
		left: 0;
		animation-delay: -0.144s;
	}

	@keyframes loading-spinner {
		0%, 80%, 100% {
			transform: scale(0);
		}
		40% {
			transform: scale(1);
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
		.spinner-circle {
			animation: none;
		}
		
		.loading-spinner::after {
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			width: 50%;
			height: 50%;
			background-color: currentColor;
			border-radius: 50%;
			transform: translate(-50%, -50%);
		}
	}
</style>