<!--
  Enhanced Error Message Component
  Provides comprehensive error display with retry functionality
  Requirements: 7.2, 7.3
-->
<script>
	// Destructure all props in a single $props() call
	let {
		/**
		 * @type {string} error - Error message to display
		 */
		error = '',
		
		/**
		 * @type {string} errorType - Type of error (network, api, auth, timeout, validation, unknown)
		 */
		errorType = 'unknown',
		
		/**
		 * @type {boolean} canRetry - Whether retry is possible
		 */
		canRetry = false,
		
		/**
		 * @type {Function} onRetry - Callback function for retry action
		 */
		onRetry = null,
		
		/**
		 * @type {string} title - Optional error title
		 */
		title = '',
		
		/**
		 * @type {string} className - Additional CSS classes
		 */
		className = '',
		
		/**
		 * @type {boolean} showIcon - Whether to show error icon
		 */
		showIcon = true,
		
		/**
		 * @type {boolean} dismissible - Whether error can be dismissed
		 */
		dismissible = false,
		
		/**
		 * @type {Function} onDismiss - Callback function for dismiss action
		 */
		onDismiss = null
	} = $props();

	// Internal state
	let isRetrying = $state(false);
	let isDismissed = $state(false);

	// Computed values
	let errorTitle = $derived(() => {
		if (title) return title;
		
		switch (errorType) {
			case 'network':
				return 'Проблема с подключением';
			case 'timeout':
				return 'Превышено время ожидания';
			case 'auth':
				return 'Ошибка авторизации';
			case 'api':
				return 'Ошибка сервера';
			case 'validation':
				return 'Ошибка валидации';
			default:
				return 'Произошла ошибка';
		}
	});

	let errorIcon = $derived(() => {
		switch (errorType) {
			case 'network':
				return '🌐';
			case 'timeout':
				return '⏱️';
			case 'auth':
				return '🔒';
			case 'api':
				return '⚠️';
			case 'validation':
				return '❌';
			default:
				return '⚠️';
		}
	});

	let containerClasses = $derived(() => {
		const baseClasses = 'error-message-container';
		const typeClass = `error-message-container--${errorType}`;
		return `${baseClasses} ${typeClass} ${className}`.trim();
	});

	// Handle retry action
	async function handleRetry() {
		if (!onRetry || isRetrying) return;
		
		isRetrying = true;
		try {
			await onRetry();
		} catch (retryError) {
			console.error('Retry failed:', retryError);
		} finally {
			isRetrying = false;
		}
	}

	// Handle dismiss action
	function handleDismiss() {
		isDismissed = true;
		if (onDismiss) {
			onDismiss();
		}
	}
</script>

{#if error && !isDismissed}
	<div class={containerClasses} role="alert" aria-live="polite">
		<div class="error-message-content">
			{#if showIcon}
				<div class="error-icon" aria-hidden="true">
					{errorIcon}
				</div>
			{/if}
			
			<div class="error-text">
				<div class="error-title">
					{errorTitle}
				</div>
				<div class="error-description">
					{error}
				</div>
			</div>
		</div>

		<div class="error-actions">
			{#if canRetry && onRetry}
				<button
					class="error-button error-button--retry"
					onclick={handleRetry}
					disabled={isRetrying}
					type="button"
				>
					{#if isRetrying}
						<span class="button-spinner" aria-hidden="true"></span>
						Повторяем...
					{:else}
						Повторить
					{/if}
				</button>
			{/if}

			{#if dismissible}
				<button
					class="error-button error-button--dismiss"
					onclick={handleDismiss}
					type="button"
					aria-label="Закрыть сообщение об ошибке"
				>
					✕
				</button>
			{/if}
		</div>
	</div>
{/if}

<style>
	.error-message-container {
		border-radius: 0.5rem;
		padding: 1rem;
		margin: 1rem 0;
		border: 1px solid;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	/* Error type styles */
	.error-message-container--network {
		background-color: #fff7ed;
		border-color: #fb923c;
		color: #c2410c;
	}

	.error-message-container--timeout {
		background-color: #fef3c7;
		border-color: #f59e0b;
		color: #92400e;
	}

	.error-message-container--auth {
		background-color: #fef2f2;
		border-color: #f87171;
		color: #dc2626;
	}

	.error-message-container--api {
		background-color: #f5f3ff;
		border-color: #a78bfa;
		color: #7c3aed;
	}

	.error-message-container--validation {
		background-color: #fef2f2;
		border-color: #fca5a5;
		color: #dc2626;
	}

	.error-message-container--unknown {
		background-color: #f9fafb;
		border-color: #d1d5db;
		color: #374151;
	}

	.error-message-content {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.error-icon {
		font-size: 1.25rem;
		flex-shrink: 0;
		margin-top: 0.125rem;
	}

	.error-text {
		flex: 1;
		min-width: 0;
	}

	.error-title {
		font-weight: 600;
		font-size: 0.875rem;
		margin-bottom: 0.25rem;
		line-height: 1.25;
	}

	.error-description {
		font-size: 0.875rem;
		line-height: 1.5;
		word-wrap: break-word;
	}

	.error-actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		justify-content: flex-end;
		flex-wrap: wrap;
	}

	.error-button {
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		border: 1px solid;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.error-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.error-button--retry {
		background-color: white;
		border-color: currentColor;
		color: inherit;
	}

	.error-button--retry:hover:not(:disabled) {
		background-color: currentColor;
		color: white;
	}

	.error-button--dismiss {
		background-color: transparent;
		border-color: transparent;
		color: inherit;
		padding: 0.25rem;
		min-width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.error-button--dismiss:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}

	.button-spinner {
		width: 1rem;
		height: 1rem;
		border: 2px solid currentColor;
		border-top: 2px solid transparent;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.error-message-container {
			padding: 0.75rem;
			margin: 0.75rem 0;
		}

		.error-message-content {
			gap: 0.5rem;
		}

		.error-actions {
			justify-content: flex-start;
			margin-top: 0.5rem;
		}

		.error-button {
			padding: 0.375rem 0.75rem;
			font-size: 0.8125rem;
		}
	}

	/* Accessibility improvements */
	@media (prefers-reduced-motion: reduce) {
		.button-spinner {
			animation: none;
		}
		
		.error-button {
			transition: none;
		}
	}
</style>