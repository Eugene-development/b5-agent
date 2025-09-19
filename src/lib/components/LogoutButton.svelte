<!--
  Компонент кнопки выхода из системы
  Переиспользуемый компонент для всех защищённых страниц
  Содержит логику выхода, состояния загрузки и обработку ошибок
-->
<script>
	import { logout } from '$lib/auth/auth.svelte.js';
	import { goto } from '$app/navigation';

	// Props
	let {
		variant = 'default',
		size = 'default',
		disabled = false,
		class: className = '',
		onLogoutStart = null,
		onLogoutComplete = null,
		onLogoutError = null
	} = $props();

	// State
	let isLoading = $state(false);

	// Computed classes based on variant and size
	const buttonClasses = $derived(() => {
		const baseClasses =
			'flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';

		// Variant styles
		const variantClasses = {
			default: 'bg-red-500 text-white hover:bg-red-600',
			outline: 'border border-red-500 text-red-500 hover:bg-red-500 hover:text-white',
			ghost: 'text-red-500 hover:bg-red-500/10'
		};

		// Size styles
		const sizeClasses = {
			sm: 'px-4 py-2 text-sm',
			default: 'px-6 py-3',
			lg: 'px-8 py-4 text-lg'
		};

		return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
	});

	// Handle logout with enhanced error handling
	async function handleLogout() {
		if (isLoading || disabled) return;

		isLoading = true;

		try {
			// Call optional start callback
			if (onLogoutStart) {
				await onLogoutStart();
			}

			console.log('🚪 Starting logout process...');
			await logout({ redirectTo: '/' });
			console.log('✅ Logout successful, redirecting to home');

			// Call optional complete callback
			if (onLogoutComplete) {
				await onLogoutComplete();
			}
		} catch (error) {
			console.error('💥 Logout error:', error);

			// Call optional error callback
			if (onLogoutError) {
				await onLogoutError(error);
			}

			// Force redirect even if logout fails
			setTimeout(() => {
				goto('/');
			}, 1000);
		} finally {
			isLoading = false;
		}
	}
</script>

<button
	onclick={handleLogout}
	disabled={disabled || isLoading}
	class={buttonClasses()}
	type="button"
>
	{#if isLoading}
		<div
			class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"
		></div>
		<span>Выход...</span>
	{:else}
		<svg
			class="h-5 w-5"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
			/>
		</svg>
		<span>Выйти из аккаунта</span>
	{/if}
</button>
