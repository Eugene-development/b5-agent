<!--
  Компонент кнопки выхода из системы
  Переиспользуемый компонент для всех защищённых страниц
  Использует единый стиль как на странице dashboard
-->
<script>
	import { logout } from '$lib/auth/auth.svelte.js';
	import { goto, invalidateAll } from '$app/navigation';

	// State
	let isLoading = $state(false);

	// Handle logout
	async function handleLogout() {
		if (isLoading) return;

		isLoading = true;
		try {
			console.log('🚪 Logging out...');
			await logout();
			console.log('✅ Logout successful');

			// Invalidate all server load functions to reload auth state
			await invalidateAll();
			console.log('🔄 Server data invalidated');

			// Small delay to ensure cookies are cleared and server state is updated
			await new Promise((resolve) => setTimeout(resolve, 100));

			// Navigate to home page
			await goto('/', { replaceState: true });
			console.log('🏠 Redirected to home');
		} catch (error) {
			console.error('❌ Logout error:', error);
			// Still try to invalidate and redirect on error
			try {
				await invalidateAll();
				await goto('/', { replaceState: true });
			} catch (navError) {
				console.error('Navigation error:', navError);
			}
		} finally {
			isLoading = false;
		}
	}
</script>

<button
	onclick={handleLogout}
	disabled={isLoading}
	class="cursor-pointer rounded-xl border border-red-500/30 bg-red-500/15 px-5 py-2 text-sm font-medium tracking-wide text-slate-200/90 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-red-500/50 hover:bg-red-500/25 hover:text-red-300 hover:shadow-md hover:shadow-red-500/30 disabled:cursor-not-allowed disabled:opacity-50"
	type="button"
>
	{#if isLoading}
		Выход...
	{:else}
		Выйти из аккаунта
	{/if}
</button>
