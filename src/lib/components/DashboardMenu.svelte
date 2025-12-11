<script>
	import { page } from '$app/state';

	let currentPath = $derived(page.url.pathname);

	function isActive(href) {
		return currentPath === href;
	}

	const menuItems = [
		{
			href: '/dashboard',
			label: 'Дашборд',
			color: 'blue'
		},
		{
			href: '/projects',
			label: 'Проекты',
			color: 'purple'
		},
		{
			href: '/finances',
			label: 'Финансы',
			color: 'cyan'
		},
		{
			href: '/statistics',
			label: 'Отчёты',
			color: 'emerald'
		},
		{
			href: '/qr',
			label: 'QR-код',
			color: 'amber'
		},
		{
			href: '/profile',
			label: 'Профиль',
			color: 'indigo'
		}
	];

	function getHoverClasses(color) {
		const colors = {
			blue: 'hover:border-blue-400/30 hover:bg-blue-500/15 hover:text-blue-300 hover:shadow-blue-500/20',
			indigo: 'hover:border-indigo-400/30 hover:bg-indigo-500/15 hover:text-indigo-300 hover:shadow-indigo-500/20',
			purple: 'hover:border-purple-400/30 hover:bg-purple-500/15 hover:text-purple-300 hover:shadow-purple-500/20',
			emerald: 'hover:border-emerald-400/30 hover:bg-emerald-500/15 hover:text-emerald-300 hover:shadow-emerald-500/20',
			cyan: 'hover:border-cyan-400/30 hover:bg-cyan-500/15 hover:text-cyan-300 hover:shadow-cyan-500/20',
			amber: 'hover:border-amber-400/30 hover:bg-amber-500/15 hover:text-amber-300 hover:shadow-amber-500/20'
		};
		return colors[color] || colors.blue;
	}

	function getActiveClasses(color) {
		const colors = {
			blue: 'bg-linear-to-br border-blue-400/40 from-blue-500/25 to-blue-600/25 text-blue-400 shadow-md shadow-blue-500/30',
			indigo: 'bg-linear-to-br border-indigo-400/40 from-indigo-500/25 to-indigo-600/25 text-indigo-400 shadow-md shadow-indigo-500/30',
			purple: 'bg-linear-to-br border-purple-400/40 from-purple-500/25 to-purple-600/25 text-purple-400 shadow-md shadow-purple-500/30',
			emerald: 'bg-linear-to-br border-emerald-400/40 from-emerald-500/25 to-emerald-600/25 text-emerald-400 shadow-md shadow-emerald-500/30',
			cyan: 'bg-linear-to-br border-cyan-400/40 from-cyan-500/25 to-cyan-600/25 text-cyan-400 shadow-md shadow-cyan-500/30',
			amber: 'bg-linear-to-br border-amber-400/40 from-amber-500/25 to-amber-600/25 text-amber-400 shadow-md shadow-amber-500/30'
		};
		return colors[color] || colors.blue;
	}

	function getIndicatorColor(color) {
		const colors = {
			blue: 'via-blue-400',
			indigo: 'via-indigo-400',
			purple: 'via-purple-400',
			emerald: 'via-emerald-400',
			cyan: 'via-cyan-400',
			amber: 'via-amber-400'
		};
		return colors[color] || colors.blue;
	}
</script>

<div class="mb-2 flex justify-center">
	<nav class="w-full">
		<!-- Mobile: 3 columns grid -->
		<div class="grid grid-cols-3 gap-2 sm:hidden pb-4">
			{#each menuItems as item (item.href)}
				<a
					href={item.href}
					class="relative flex items-center justify-center px-2 py-3 text-xs font-medium tracking-wide text-slate-200/90 transition-all duration-300 ease-in-out hover:text-slate-100 rounded-lg border border-slate-700/50 {isActive(item.href) ? 'text-white bg-slate-700/30 border-slate-600' : 'hover:border-slate-600/80 hover:bg-slate-800/20'}"
				>
					<span class="text-center">{item.label}</span>
				</a>
			{/each}
		</div>

		<!-- Desktop: Horizontal flex layout -->
		<div class="hidden sm:flex flex-wrap gap-2 sm:gap-3 pb-4 justify-center">
			{#each menuItems as item (item.href)}
				<a
					href={item.href}
					class="relative px-3 py-2 text-sm font-medium tracking-wide text-slate-200/90 transition-all duration-300 ease-in-out hover:text-slate-100 sm:px-6 {isActive(item.href) ? 'text-white' : ''}"
				>
					{item.label}
					{#if isActive(item.href)}
						<span
							class="bg-linear-to-r absolute inset-x-0 bottom-0 h-1 from-transparent {getIndicatorColor(item.color)} to-transparent"
						></span>
					{/if}
				</a>
			{/each}
		</div>
	</nav>
</div>
