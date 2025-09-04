<script>
	import NavigationTestRunner from '$lib/components/NavigationTestRunner.svelte';
	import { authState } from '$lib/auth/auth.svelte.js';
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Navigation Testing - B5 Agent</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-4xl mx-auto">
		<h1 class="text-3xl font-bold text-white mb-8">Navigation Testing</h1>
		
		<div class="bg-gray-800 rounded-lg p-6 mb-8">
			<h2 class="text-xl font-semibold text-white mb-4">Current State</h2>
			<div class="grid grid-cols-2 gap-4 text-sm">
				<div>
					<span class="text-gray-400">Current Path:</span>
					<span class="text-white ml-2">{page.url.pathname}</span>
				</div>
				<div>
					<span class="text-gray-400">Authentication:</span>
					<span class="text-white ml-2">
						{authState.isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
					</span>
				</div>
				<div>
					<span class="text-gray-400">User:</span>
					<span class="text-white ml-2">
						{authState.user?.name || 'Not logged in'}
					</span>
				</div>
				<div>
					<span class="text-gray-400">Loading:</span>
					<span class="text-white ml-2">
						{authState.isLoading ? '⏳ Loading' : '✅ Ready'}
					</span>
				</div>
			</div>
		</div>

		<div class="bg-gray-800 rounded-lg p-6 mb-8">
			<h2 class="text-xl font-semibold text-white mb-4">Manual Navigation Test</h2>
			<p class="text-gray-300 mb-4">
				Use the links below to manually test navigation between different pages:
			</p>
			
			<div class="space-y-4">
				<div>
					<h3 class="text-lg font-medium text-white mb-2">Public Pages</h3>
					<div class="flex flex-wrap gap-2">
						<a href="/" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Главная</a>
						<a href="/about" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">О проекте</a>
						<a href="/payments" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Выплаты</a>
						<a href="/152fz" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">152 ФЗ</a>
					</div>
				</div>

				<div>
					<h3 class="text-lg font-medium text-white mb-2">Authentication Pages</h3>
					<div class="flex flex-wrap gap-2">
						<a href="/login" class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Вход</a>
						<a href="/register" class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Регистрация</a>
					</div>
				</div>

				<div>
					<h3 class="text-lg font-medium text-white mb-2">Protected Pages</h3>
					<div class="flex flex-wrap gap-2">
						<a href="/dashboard" class="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700">Личный кабинет</a>
						<a href="/profile" class="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700">Профиль</a>
						<a href="/agents" class="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700">Агенты</a>
						<a href="/projects" class="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700">Проекты</a>
						<a href="/finances" class="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700">Финансы</a>
					</div>
				</div>
			</div>
		</div>

		<NavigationTestRunner autoRun={true} showResults={true} />

		<div class="bg-gray-800 rounded-lg p-6">
			<h2 class="text-xl font-semibold text-white mb-4">Test Instructions</h2>
			<div class="space-y-3 text-gray-300">
				<p><strong>1. Desktop Menu Test:</strong></p>
				<ul class="list-disc list-inside ml-4 space-y-1">
					<li>Verify all menu links are visible and clickable</li>
					<li>Check that protected links show/hide based on authentication</li>
					<li>Verify active link highlighting works correctly</li>
				</ul>

				<p><strong>2. Mobile Menu Test:</strong></p>
				<ul class="list-disc list-inside ml-4 space-y-1">
					<li>Resize browser to mobile width (&lt; 1024px)</li>
					<li>Click hamburger menu button to open mobile menu</li>
					<li>Verify all links are present and functional</li>
					<li>Test close button and backdrop click</li>
				</ul>

				<p><strong>3. Authentication Flow Test:</strong></p>
				<ul class="list-disc list-inside ml-4 space-y-1">
					<li>Test navigation while logged out</li>
					<li>Try accessing protected pages (should redirect to login)</li>
					<li>Log in and verify protected links appear</li>
					<li>Test logout functionality</li>
				</ul>
			</div>
		</div>
	</div>
</div>