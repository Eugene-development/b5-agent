<!--
  Компонент кнопки выхода из системы
  Переиспользуемый компонент для всех защищённых страниц
  Использует единый стиль как на странице dashboard
-->
<script>
	import { logout } from '$lib/auth/auth.svelte.js';

	// State
	let isLoading = $state(false);

	// Handle logout
	async function handleLogout() {
		if (isLoading) return;

		isLoading = true;
		try {
			await logout({ redirectTo: '/' });
		} catch (error) {
			console.error('Logout error:', error);
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
