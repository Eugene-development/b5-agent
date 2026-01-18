<!--
  Bonus Details Section Component
  Displays bonus information for contracts and orders in a project
-->
<script>
	let { bonusDetails = null, isActive = true } = $props();

	// Фильтруем только активные договоры и заказы
	let activeContracts = $derived(bonusDetails?.contracts?.filter(c => c.is_active !== false) || []);
	let activeOrders = $derived(bonusDetails?.orders?.filter(o => o.is_active !== false) || []);

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

	// Сумма выплаченных бонусов (только активные)
	let totalPaidBonus = $derived(() => {
		if (!bonusDetails) return 0;
		
		let paidFromContracts = 0;
		if (activeContracts) {
			paidFromContracts = activeContracts
				.filter(c => c.is_paid)
				.reduce((sum, c) => sum + (c.agent_bonus || 0), 0);
		}
		
		let paidFromOrders = 0;
		if (activeOrders) {
			paidFromOrders = activeOrders
				.filter(o => o.is_paid)
				.reduce((sum, o) => sum + (o.agent_bonus || 0), 0);
		}
		
		return paidFromContracts + paidFromOrders;
	});

	// Проверяем, есть ли выплаченные бонусы
	let hasPaidBonus = $derived(totalPaidBonus() > 0);
</script>

{#if bonusDetails}
	<div class="space-y-4">
		<!-- Summary -->
		<div class="rounded-lg bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 p-4">
			<div class="grid grid-cols-3 gap-4">
				<div>
					<p class="text-xs text-gray-400">Общий бонус</p>
					<p class="text-lg sm:text-2xl md:text-3xl font-bold text-emerald-400">
						{formatCurrency(bonusDetails.totalAgentBonus)}
					</p>
				</div>
				<div>
					<p class="text-xs text-gray-400">Доступно</p>
					<div class="flex items-center gap-2">
						{#if isBonusAvailable}
							<span class="text-lg sm:text-xl md:text-2xl text-green-400">✓</span>
							<p class="text-base sm:text-lg md:text-xl font-bold text-green-400">
								{formatCurrency(bonusDetails.totalAvailableBonus)}
							</p>
						{:else}
							<p class="text-base sm:text-lg md:text-xl font-bold text-gray-400">
								{formatCurrency(0)}
							</p>
						{/if}
					</div>
				</div>
				<div>
					<p class="text-xs text-gray-400">Выплачено</p>
					<div class="flex items-center gap-2">
						{#if hasPaidBonus}
							<span class="text-lg sm:text-xl md:text-2xl text-cyan-400">✓</span>
							<p class="text-base sm:text-lg md:text-xl font-bold text-cyan-400">
								{formatCurrency(totalPaidBonus())}
							</p>
						{:else}
							<p class="text-base sm:text-lg md:text-xl font-bold text-gray-400">
								{formatCurrency(0)}
							</p>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Contracts Bonuses -->
		{#if activeContracts && activeContracts.length > 0}
			<div>
				<h4 class="mb-2 text-sm font-semibold text-amber-500">
					Бонусы по договорам ({activeContracts.length})
				</h4>
				<div class="space-y-2">
					{#each activeContracts as contract}
						<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-3">
							<div class="flex items-center justify-between mb-2">
								<span class="text-sm font-medium text-white">
									{#if contract.contract_number}
										{contract.contract_number}
									{:else}
										Без номера
									{/if}
								</span>
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
									<p class="font-medium text-emerald-400">
										{formatCurrency(contract.agent_bonus)}
									</p>
								</div>
								<div>
									{#if contract.is_paid}
										<p class="text-gray-500">Выплачено</p>
										<span class="text-lg text-cyan-400">✓</span>
									{:else if contract.is_available}
										<p class="text-gray-500">Доступно</p>
										<span class="text-lg text-green-400">✓</span>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Orders Bonuses -->
		{#if activeOrders && activeOrders.length > 0}
			<div>
				<h4 class="mb-2 text-sm font-semibold text-amber-500">
					Бонусы по заказам ({activeOrders.length})
				</h4>
				<div class="space-y-2">
					{#each activeOrders as order}
						<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-3">
							<div class="flex items-center justify-between mb-2">
								<span class="text-sm font-medium text-white">
									{#if order.order_number}
										{order.order_number}
									{:else}
										Без номера
									{/if}
								</span>
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
									<p class="font-medium text-emerald-400">
										{formatCurrency(order.agent_bonus)}
									</p>
								</div>
								<div>
									{#if order.is_paid}
										<p class="text-gray-500">Выплачено</p>
										<span class="text-lg text-cyan-400">✓</span>
									{:else if order.is_available}
										<p class="text-gray-500">Доступно</p>
										<span class="text-lg text-green-400">✓</span>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- No bonuses message -->
		{#if activeContracts.length === 0 && activeOrders.length === 0}
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
