<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { authState } from '$lib/auth/auth.svelte.js';
	import { createNavigationTester } from '../../test-navigation.js';

	let { autoRun = false, showResults = true } = $props();

	let testResults = $state(null);
	let isRunning = $state(false);
	let tester = null;

	onMount(() => {
		tester = createNavigationTester();
		if (autoRun) {
			runTests();
		}
	});

	async function runTests() {
		if (!tester || isRunning) return;

		isRunning = true;
		testResults = null;

		try {
			const results = await tester.runAllTests(
				authState.isAuthenticated,
				page.url.pathname
			);
			testResults = results;
		} catch (error) {
			console.error('Navigation test error:', error);
			testResults = {
				passed: 0,
				failed: 1,
				errors: [`Test execution error: ${error.message}`]
			};
		} finally {
			isRunning = false;
		}
	}

	function getSuccessRate() {
		if (!testResults) return 0;
		const total = testResults.passed + testResults.failed;
		return total > 0 ? ((testResults.passed / total) * 100).toFixed(1) : 0;
	}
</script>

{#if showResults}
	<div class="navigation-test-runner bg-gray-800 border border-gray-700 rounded-lg p-4 m-4">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-semibold text-white">Navigation Tests</h3>
			<button
				onclick={runTests}
				disabled={isRunning}
				class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isRunning ? 'Running...' : 'Run Tests'}
			</button>
		</div>

		{#if isRunning}
			<div class="flex items-center text-blue-400">
				<svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				Running navigation tests...
			</div>
		{/if}

		{#if testResults}
			<div class="space-y-3">
				<div class="grid grid-cols-3 gap-4 text-sm">
					<div class="bg-green-900/20 border border-green-700 rounded p-3">
						<div class="text-green-400 font-semibold">✅ Passed</div>
						<div class="text-2xl font-bold text-green-300">{testResults.passed}</div>
					</div>
					<div class="bg-red-900/20 border border-red-700 rounded p-3">
						<div class="text-red-400 font-semibold">❌ Failed</div>
						<div class="text-2xl font-bold text-red-300">{testResults.failed}</div>
					</div>
					<div class="bg-blue-900/20 border border-blue-700 rounded p-3">
						<div class="text-blue-400 font-semibold">📈 Success Rate</div>
						<div class="text-2xl font-bold text-blue-300">{getSuccessRate()}%</div>
					</div>
				</div>

				{#if testResults.errors.length > 0}
					<div class="bg-red-900/10 border border-red-800 rounded p-3">
						<h4 class="text-red-400 font-semibold mb-2">🔍 Issues Found:</h4>
						<ul class="space-y-1 text-sm text-red-300">
							{#each testResults.errors as error, index}
								<li class="flex items-start">
									<span class="text-red-500 mr-2">{index + 1}.</span>
									<span>{error}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<div class="text-xs text-gray-400">
					Current page: {page.url.pathname} | 
					Auth state: {authState.isAuthenticated ? 'Authenticated' : 'Not authenticated'}
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	.navigation-test-runner {
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
	}
</style>