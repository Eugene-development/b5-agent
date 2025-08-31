<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { initializeAuth } from '$lib/auth-guard.svelte.js';
	import { authState } from '$lib/auth.svelte.js';

	let { children } = $props();
	let authInitialized = $state(false);

	// Initialize authentication on app startup
	// Requirements: 4.1, 4.2, 4.3
	onMount(async () => {
		try {
			await initializeAuth();
		} catch (error) {
			console.debug('Failed to initialize authentication:', error);
		} finally {
			authInitialized = true;
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Show loading indicator while initializing auth -->
{#if !authInitialized}
	<div class="auth-loading">
		<div class="loading-spinner"></div>
		<p>Loading...</p>
	</div>
{:else}
	{@render children?.()}
{/if}

<style>
	.auth-loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		gap: 1rem;
	}

	.loading-spinner {
		width: 2rem;
		height: 2rem;
		border: 2px solid #f3f3f3;
		border-top: 2px solid #007bff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
