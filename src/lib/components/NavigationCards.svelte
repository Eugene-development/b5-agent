<script>
	/**
	 * Navigation Cards Component
	 * Displays navigation cards for quick access to main sections
	 * @param {string} currentPage - Current page identifier to exclude from navigation
	 */
	let { currentPage = '' } = $props();

	const pages = [
		{
			id: 'form',
			href: '/form',
			title: 'Форма',
			icon: 'dashboard',
			color: 'blue'
		},
		{
			id: 'profile',
			href: '/profile',
			title: 'Профиль',
			icon: 'profile',
			color: 'indigo'
		},
		{
			id: 'projects',
			href: '/projects',
			title: 'Проекты',
			icon: 'projects',
			color: 'purple'
		},
		{
			id: 'statistics',
			href: '/statistics',
			title: 'Отчёты',
			icon: 'statistics',
			color: 'green'
		}
	];

	// Filter out current page
	const visiblePages = $derived(pages.filter((page) => page.id !== currentPage));

	// Get color classes based on color name
	function getColorClass(color) {
		const colors = {
			blue: 'text-blue-400',
			indigo: 'text-indigo-400',
			purple: 'text-purple-400',
			green: 'text-green-400'
		};
		return colors[color] || 'text-gray-400';
	}
</script>

<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
	{#each visiblePages as page (page.id)}
		<a
			href={page.href}
			class="block rounded-lg bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
		>
			<div class="flex items-center">
				{#if page.icon === 'dashboard'}
					<svg
						class="mr-3 h-8 w-8 {getColorClass(page.color)}"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
						/>
					</svg>
				{:else if page.icon === 'profile'}
					<svg
						class="mr-3 h-8 w-8 {getColorClass(page.color)}"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
						/>
					</svg>
				{:else if page.icon === 'projects'}
					<svg
						class="mr-3 h-8 w-8 {getColorClass(page.color)}"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
						/>
					</svg>
				{:else if page.icon === 'statistics'}
					<svg
						class="mr-3 h-8 w-8 {getColorClass(page.color)}"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
						/>
					</svg>
				{/if}
				<h3 class="text-xl font-semibold text-white">{page.title}</h3>
			</div>
		</a>
	{/each}
</div>
