<!--
  Bonus Details Section Component
  Displays bonus information for contracts and orders in a project
-->
<script>
	let { bonusDetails = null, isActive = true } = $props();

	function formatCurrency(amount) {
		if (amount === null || amount === undefined || amount === 0) {
			return '0';
		}
		// Округляем до целых рублей (без копеек)
		return new Intl.NumberFormat('ru-RU', {
			style: 'decimal',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(Math.round(amount));
	}

	// Проверяем, доступен ли бонус к выплате
	let isBonusAvailable = $derived(bonusDetails && (bonusDetails.totalAvailableBonus || 0) > 0);
</script>

{#if bonusDetails}
	<div class="space-y-4">
		<!-- Summary -->
		<div class="rounded-lg bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 p-4">
			<div class="grid grid-cols-2 gap-4">
				<div>
					<p class="text-xs text-gray-400">Общий бонус проекта</p>
					<p class="text-3xl font-bold text-emerald-400">
						{formatCurrency(bonusDetails.totalAgentBonus)}
					</p>
				</div>
				<div>
					<p class="text-xs text-gray-400">Доступно к выплате</p>
					<div class="flex items-center gap-2">
						{#if isBonusAvailable}
							<span class="text-2xl text-green-400">✓</span>
							<p class="text-xl font-bold text-green-400">
								{formatCurrency(bonusDetails.totalAvailableBonus)}
							</p>
						{:else}
							<p class="text-xl font-bold text-gray-400">
								{formatCurrency(0)}
							</p>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Contracts Bonuses -->
		{#if bonusDetails.contracts && bonusDetails.contracts.length > 0}
			<div>
				<h4 class="mb-2 text-sm font-semibold text-amber-500">
					Бонусы по договорам ({bonusDetails.contracts.length})
				</h4>
				<div class="space-y-2">
					{#each bonusDetails.contracts as contract}
						<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-3">
							<div class="flex items-center justify-between mb-2">
								<span class="text-sm font-medium text-white">
									{#if contract.contract_number}
										{contract.contract_number}
									{:else}
										Без номера
									{/if}
								</span>
								{#if !contract.is_active}
									<span class="rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-400">
										Неактивен
									</span>
								{/if}
							</div>
							<div class="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
								<div>
									<p class="text-gray-500">Сумма договора</p>
									<p class="text-gray-300">{formatCurrency(contract.contract_amount)}</p>
								</div>
								<div>
									<p class="text-gray-500">Ваш процент</p>
									<p class="text-gray-300">
										{contract.agent_percentage ?? 3}%
										{#if !contract.agent_percentage}
											<span class="text-xs text-gray-500">(по умолчанию)</span>
										{/if}
									</p>
								</div>
								<div>
									<p class="text-gray-500">Бонус</p>
									<p class="font-medium {contract.is_active ? 'text-emerald-400' : 'text-gray-500'}">
										{formatCurrency(contract.agent_bonus)}
									</p>
								</div>
								<div>
									<p class="text-gray-500">Доступно</p>
									{#if contract.is_available}
										<span class="text-lg text-green-400">✓</span>
									{:else}
										<span class="text-lg text-gray-500">—</span>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Orders Bonuses -->
		{#if bonusDetails.orders && bonusDetails.orders.length > 0}
			<div>
				<h4 class="mb-2 text-sm font-semibold text-amber-500">
					Бонусы по заказам ({bonusDetails.orders.length})
				</h4>
				<div class="space-y-2">
					{#each bonusDetails.orders as order}
						<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-3">
							<div class="flex items-center justify-between mb-2">
								<span class="text-sm font-medium text-white">
									{#if order.order_number}
										{order.order_number}
									{:else}
										Без номера
									{/if}
								</span>
								{#if !order.is_active}
									<span class="rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-400">
										Неактивна
									</span>
								{/if}
							</div>
							<div class="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
								<div>
									<p class="text-gray-500">Сумма заказа</p>
									<p class="text-gray-300">{formatCurrency(order.order_amount)}</p>
								</div>
								<div>
									<p class="text-gray-500">Ваш процент</p>
									<p class="text-gray-300">
										{order.agent_percentage ?? 5}%
										{#if !order.agent_percentage}
											<span class="text-xs text-gray-500">(по умолчанию)</span>
										{/if}
									</p>
								</div>
								<div>
									<p class="text-gray-500">Бонус</p>
									<p class="font-medium {order.is_active ? 'text-emerald-400' : 'text-gray-500'}">
										{formatCurrency(order.agent_bonus)}
									</p>
								</div>
								<div>
									<p class="text-gray-500">Доступно</p>
									{#if order.is_available}
										<span class="text-lg text-green-400">✓</span>
									{:else}
										<span class="text-lg text-gray-500">—</span>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- No bonuses message -->
		{#if (!bonusDetails.contracts || bonusDetails.contracts.length === 0) && (!bonusDetails.orders || bonusDetails.orders.length === 0)}
			<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-4 text-center">
				<p class="text-sm text-gray-400">Нет данных о бонусах</p>
			</div>
		{/if}

		<!-- Inactive project warning -->
		{#if !isActive}
			<div class="rounded-lg border border-amber-700/50 bg-amber-900/20 p-3">
				<p class="text-xs text-amber-400">
					⚠️ Проект неактивен — бонусы не начисляются
				</p>
			</div>
		{/if}
	</div>
{:else}
	<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-4 text-center">
		<p class="text-sm text-gray-400">Загрузка данных о бонусах...</p>
	</div>
{/if}
