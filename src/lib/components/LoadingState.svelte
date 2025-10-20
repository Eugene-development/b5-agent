<!--
  Loading State Component
  Provides comprehensive loading state management with skeleton loading
  Requirements: 7.2, 7.3
-->
<script>
	import LoadingSpinner from './LoadingSpinner.svelte';

	// Destructure all props in a single $props() call
	let {
		/**
		 * @type {boolean} isLoading - Whether content is loading
		 */
		isLoading = false,

		/**
		 * @type {string} type - Type of loading display (spinner, skeleton, inline)
		 */
		type = 'spinner',

		/**
		 * @type {string} message - Loading message
		 */
		message = 'Загрузка данных...',

		/**
		 * @type {string} size - Size of loading indicator (small, medium, large)
		 */
		size = 'medium',

		/**
		 * @type {string} className - Additional CSS classes
		 */
		className = '',

		/**
		 * @type {number} skeletonRows - Number of skeleton rows to show
		 */
		skeletonRows = 3,

		/**
		 * @type {boolean} showMessage - Whether to show loading message
		 */
		showMessage = true,

		/**
		 * @type {string} minHeight - Minimum height for loading container
		 */
		minHeight = 'auto'
	} = $props();

	// Computed classes
	let containerClasses = $derived(() => {
		const baseClasses = 'loading-state';
		const typeClass = `loading-state--${type}`;
		const sizeClass = `loading-state--${size}`;
		return `${baseClasses} ${typeClass} ${sizeClass} ${className}`.trim();
	});

	// Generate skeleton rows
	let skeletonRowsArray = $derived(() => Array.from({ length: skeletonRows }, (_, i) => i));
</script>

{#if isLoading}
	<div
		class={containerClasses()}
		style="min-height: {minHeight};"
		role="status"
		aria-live="polite"
		aria-label={message}
	>
		{#if type === 'spinner'}
			<LoadingSpinner {size} {message} {showMessage} className="loading-state-spinner" />
		{:else if type === 'skeleton'}
			<div class="skeleton-container">
				{#if showMessage}
					<div class="skeleton-message">{message}</div>
				{/if}
				<div class="skeleton-content">
					{#each skeletonRowsArray() as row}
						<div class="skeleton-row">
							<div class="skeleton-item skeleton-item--avatar"></div>
							<div class="skeleton-item skeleton-item--text">
								<div class="skeleton-line skeleton-line--title"></div>
								<div class="skeleton-line skeleton-line--subtitle"></div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else if type === 'inline'}
			<div class="inline-loading">
				<div class="inline-spinner"></div>
				{#if showMessage}
					<span class="inline-message">{message}</span>
				{/if}
			</div>
		{:else if type === 'table'}
			<div class="table-skeleton">
				{#if showMessage}
					<div class="table-skeleton-message">{message}</div>
				{/if}
				<div class="table-skeleton-header">
					<div class="table-skeleton-cell"></div>
					<div class="table-skeleton-cell"></div>
					<div class="table-skeleton-cell"></div>
					<div class="table-skeleton-cell"></div>
				</div>
				{#each skeletonRowsArray() as row}
					<div class="table-skeleton-row">
						<div class="table-skeleton-cell"></div>
						<div class="table-skeleton-cell"></div>
						<div class="table-skeleton-cell"></div>
						<div class="table-skeleton-cell"></div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	.loading-state {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	.loading-state--small {
		padding: 1rem;
	}

	.loading-state--medium {
		padding: 2rem;
	}

	.loading-state--large {
		padding: 3rem;
	}

	/* Skeleton loading styles */
	.skeleton-container {
		width: 100%;
		max-width: 100%;
	}

	.skeleton-message {
		text-align: center;
		color: #6b7280;
		font-size: 0.875rem;
		margin-bottom: 1.5rem;
		font-weight: 500;
	}

	.skeleton-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.skeleton-row {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem;
		border-radius: 0.5rem;
		background-color: #f9fafb;
	}

	.skeleton-item--avatar {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
		background-size: 200% 100%;
		animation: skeleton-loading 1.5s infinite;
		flex-shrink: 0;
	}

	.skeleton-item--text {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.skeleton-line {
		height: 1rem;
		border-radius: 0.25rem;
		background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
		background-size: 200% 100%;
		animation: skeleton-loading 1.5s infinite;
	}

	.skeleton-line--title {
		width: 70%;
		height: 1.25rem;
	}

	.skeleton-line--subtitle {
		width: 50%;
		height: 1rem;
	}

	/* Table skeleton styles */
	.table-skeleton {
		width: 100%;
	}

	.table-skeleton-message {
		text-align: center;
		color: #6b7280;
		font-size: 0.875rem;
		margin-bottom: 1rem;
		font-weight: 500;
	}

	.table-skeleton-header,
	.table-skeleton-row {
		display: grid;
		grid-template-columns: 1fr 2fr 1fr 1fr;
		gap: 1rem;
		padding: 0.75rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.table-skeleton-header {
		background-color: #f9fafb;
		border-radius: 0.5rem 0.5rem 0 0;
	}

	.table-skeleton-cell {
		height: 1.25rem;
		border-radius: 0.25rem;
		background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
		background-size: 200% 100%;
		animation: skeleton-loading 1.5s infinite;
	}

	/* Inline loading styles */
	.inline-loading {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
	}

	.inline-spinner {
		width: 1rem;
		height: 1rem;
		border: 2px solid #e5e7eb;
		border-top: 2px solid #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	.inline-message {
		color: #6b7280;
		font-size: 0.875rem;
	}

	/* Animations */
	@keyframes skeleton-loading {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.loading-state--medium {
			padding: 1.5rem;
		}

		.loading-state--large {
			padding: 2rem;
		}

		.skeleton-row {
			padding: 0.5rem;
			gap: 0.75rem;
		}

		.skeleton-item--avatar {
			width: 2.5rem;
			height: 2.5rem;
		}

		.table-skeleton-header,
		.table-skeleton-row {
			grid-template-columns: 1fr 1fr;
			gap: 0.5rem;
			padding: 0.5rem;
		}

		.table-skeleton-cell:nth-child(n + 3) {
			display: none;
		}
	}

	/* Accessibility improvements */
	@media (prefers-reduced-motion: reduce) {
		.skeleton-line,
		.skeleton-item--avatar,
		.table-skeleton-cell {
			animation: none;
			background: #e5e7eb;
		}

		.inline-spinner {
			animation: none;
			border: 2px solid #6b7280;
		}
	}

	/* Dark mode support */
	@media (prefers-color-scheme: dark) {
		.skeleton-row {
			background-color: #374151;
		}

		.skeleton-line,
		.skeleton-item--avatar,
		.table-skeleton-cell {
			background: linear-gradient(90deg, #4b5563 25%, #6b7280 50%, #4b5563 75%);
			background-size: 200% 100%;
		}

		.skeleton-message,
		.table-skeleton-message,
		.inline-message {
			color: #9ca3af;
		}

		.table-skeleton-header {
			background-color: #374151;
		}

		.table-skeleton-header,
		.table-skeleton-row {
			border-bottom-color: #4b5563;
		}
	}
</style>
