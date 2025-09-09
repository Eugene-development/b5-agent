<!--
  Data State Component
  Comprehensive component for handling loading, error, empty, and success states
  Requirements: 7.2, 7.3
-->
<script>
	import LoadingState from './LoadingState.svelte';
	import ErrorMessage from './ErrorMessage.svelte';

	// Destructure all props in a single $props() call
	let {
		/**
		 * @type {boolean} isLoading - Whether data is loading
		 */
		isLoading = false,

		/**
		 * @type {string|null} error - Error message if any
		 */
		error = null,

		/**
		 * @type {string} errorType - Type of error
		 */
		errorType = 'unknown',

		/**
		 * @type {boolean} canRetry - Whether retry is possible
		 */
		canRetry = false,

		/**
		 * @type {Function} onRetry - Retry callback function
		 */
		onRetry = null,

		/**
		 * @type {any} data - The data to check for emptiness
		 */
		data = null,

		/**
		 * @type {boolean} isEmpty - Whether data is empty (computed if not provided)
		 */
		isEmpty = null,

		/**
		 * @type {string} emptyMessage - Message to show when data is empty
		 */
		emptyMessage = 'Нет данных для отображения',

		/**
		 * @type {string} emptyIcon - Icon to show when data is empty
		 */
		emptyIcon = '📭',

		/**
		 * @type {string} loadingType - Type of loading indicator
		 */
		loadingType = 'spinner',

		/**
		 * @type {string} loadingMessage - Loading message
		 */
		loadingMessage = 'Загрузка данных...',

		/**
		 * @type {number} skeletonRows - Number of skeleton rows for table loading
		 */
		skeletonRows = 3,

		/**
		 * @type {string} className - Additional CSS classes
		 */
		className = '',

		/**
		 * @type {string} minHeight - Minimum height for the container
		 */
		minHeight = '200px',

		/**
		 * Default slot content (Svelte 5 snippets)
		 */
		children = null,

		/**
		 * Named slot replacement for `empty-actions` (Svelte 5 snippets)
		 */
		emptyActions = null
	} = $props();

	// Optimized computed empty state with early returns
	let isDataEmpty = $derived(() => {
		// Use provided isEmpty if available
		if (isEmpty !== null) return isEmpty;

		// Early returns for better performance
		if (data === null || data === undefined) return true;
		if (Array.isArray(data)) return data.length === 0;
		if (typeof data === 'object') return Object.keys(data).length === 0;
		if (typeof data === 'string') return data.trim().length === 0;

		return false;
	});

	// Optimized state determination with single computation
	let displayState = $derived(() => {
		if (isLoading) return 'loading';
		if (error) return 'error';
		if (isDataEmpty()) return 'empty';
		return 'content';
	});
</script>

<div class="data-state {className}" style="min-height: {minHeight};">
	{#if displayState() === 'loading'}
		<LoadingState isLoading={true} type={loadingType} message={loadingMessage} {skeletonRows} />
	{:else if displayState() === 'error'}
		<ErrorMessage {error} {errorType} {canRetry} {onRetry} className="data-state-error" />
	{:else if displayState() === 'empty'}
		<div class="empty-state" role="status">
			<div class="empty-icon" aria-hidden="true">
				{emptyIcon}
			</div>
			<div class="empty-message">
				{emptyMessage}
			</div>
			{@render emptyActions?.()}
		</div>
	{:else}
		<div class="data-content">
			{@render children?.()}
		</div>
	{/if}
</div>

<style>
	.data-state {
		width: 100%;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.data-content {
		width: 100%;
		flex: 1;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1rem;
		text-align: center;
		color: #6b7280;
		min-height: 200px;
	}

	.empty-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
		opacity: 0.7;
	}

	.empty-message {
		font-size: 1rem;
		font-weight: 500;
		margin-bottom: 1.5rem;
		max-width: 400px;
		line-height: 1.5;
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.empty-state {
			padding: 2rem 1rem;
			min-height: 150px;
		}

		.empty-icon {
			font-size: 2.5rem;
		}

		.empty-message {
			font-size: 0.875rem;
		}
	}

	/* Dark mode support */
	@media (prefers-color-scheme: dark) {
		.empty-state {
			color: #9ca3af;
		}
	}
</style>
