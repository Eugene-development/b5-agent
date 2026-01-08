<script>
	/**
	 * Компонент статистики реферальных бонусов
	 * Отображает общую статистику и список рефералов с их бонусами
	 */

	import { formatCurrency } from '$lib/utils/formatters.js';

	/** @type {{ stats: Object }} */
	let { stats = { total_pending: 0, total_available: 0, total_paid: 0, total: 0, referrals: [] } } = $props();
</script>

<div class="space-y-6">
	<!-- Stats Cards -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<!-- Total -->
		<div class="rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-4">
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
					<svg class="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
					</svg>
				</div>
				<div>
					<p class="text-xs text-gray-400">Всего реферальных</p>
					<p class="text-lg font-semibold text-white">{formatCurrency(stats.total || 0, false)}</p>
				</div>
			</div>
		</div>

		<!-- Pending -->
		<div class="rounded-lg bg-gray-800/50 border border-gray-700 p-4">
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20">
					<svg class="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<div>
					<p class="text-xs text-gray-400">Ожидание</p>
					<p class="text-lg font-semibold text-white">{formatCurrency(stats.total_pending || 0, false)}</p>
				</div>
			</div>
		</div>

		<!-- Available -->
		<div class="rounded-lg bg-gray-800/50 border border-gray-700 p-4">
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
					<svg class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<div>
					<p class="text-xs text-gray-400">Доступно</p>
					<p class="text-lg font-semibold text-white">{formatCurrency(stats.total_available || 0, false)}</p>
				</div>
			</div>
		</div>

		<!-- Paid -->
		<div class="rounded-lg bg-gray-800/50 border border-gray-700 p-4">
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
					<svg class="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
					</svg>
				</div>
				<div>
					<p class="text-xs text-gray-400">Выплачено</p>
					<p class="text-lg font-semibold text-white">{formatCurrency(stats.total_paid || 0, false)}</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Referrals List -->
	<div class="rounded-lg bg-gray-900 border border-gray-800 overflow-hidden">
		<div class="px-4 py-3 border-b border-gray-800">
			<h3 class="text-sm font-medium text-white">Ваши рефералы</h3>
			<p class="text-xs text-gray-400 mt-1">Пользователи, зарегистрированные по вашей ссылке</p>
		</div>

		{#if stats.referrals && stats.referrals.length > 0}
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-800">
					<thead class="bg-gray-800/50">
						<tr>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Реферал
							</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Дата регистрации
							</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Статус
							</th>
							<th class="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
								Бонусы
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-800">
						{#each stats.referrals as referral}
							<tr class="hover:bg-gray-800/30 transition-colors">
								<td class="px-4 py-3 whitespace-nowrap">
									<div class="flex items-center gap-3">
										<div class="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium">
											{referral.name?.charAt(0)?.toUpperCase() || '?'}
										</div>
										<p class="text-sm font-medium text-white">{referral.name || 'Без имени'}</p>
									</div>
								</td>
								<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
									{new Date(referral.registered_at).toLocaleDateString('ru-RU')}
								</td>
								<td class="px-4 py-3 whitespace-nowrap">
									{#if referral.is_active}
										<span class="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400">
											<span class="h-1.5 w-1.5 rounded-full bg-green-400"></span>
											Активен
										</span>
									{:else}
										<span class="inline-flex items-center gap-1 rounded-full bg-gray-500/10 px-2 py-1 text-xs font-medium text-gray-400">
											<span class="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
											Истёк
										</span>
									{/if}
								</td>
								<td class="px-4 py-3 whitespace-nowrap text-right">
									<span class="text-sm font-medium text-white">{formatCurrency(referral.total_bonus || 0, false)}</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="px-4 py-12 text-center">
				<svg class="mx-auto h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
				</svg>
				<p class="mt-4 text-sm text-gray-400">У вас пока нет рефералов</p>
				<p class="mt-1 text-xs text-gray-500">Поделитесь своей реферальной ссылкой, чтобы начать получать бонусы</p>
				<a href="/qr" class="mt-4 inline-flex items-center gap-2 rounded-lg bg-purple-500/20 px-4 py-2 text-sm font-medium text-purple-400 hover:bg-purple-500/30 transition-colors">
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
					</svg>
					Получить ссылку
				</a>
			</div>
		{/if}
	</div>
</div>
