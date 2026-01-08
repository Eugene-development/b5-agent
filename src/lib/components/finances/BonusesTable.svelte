<script>
	/**
	 * Таблица бонусов агента
	 * Отображает как агентские бонусы (за собственные сделки),
	 * так и реферальные бонусы (за сделки рефералов)
	 * Requirements: 7.2, 7.5, 7.6
	 */

	/** @type {{ bonuses: Array<any> }} */
	let { bonuses } = $props();

	// Debug: проверяем что приходит с сервера
	$effect(() => {
		console.log('🔍 BonusesTable: Данные бонусов:', bonuses.map(b => ({ 
			id: b.id, 
			bonus_type: b.bonus_type, 
			referralUser: b.referralUser,
			commission_amount: b.commission_amount 
		})));
	});

	/**
	 * Форматирование суммы в рублях
	 */
	function formatCurrency(amount) {
		return new Intl.NumberFormat('ru-RU', {
			style: 'decimal',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount || 0);
	}

	/**
	 * Форматирование даты
	 */
	function formatDate(dateString) {
		if (!dateString) return '—';
		return new Date(dateString).toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	}

	/**
	 * Получить цвет статуса
	 */
	function getStatusColor(statusCode) {
		switch (statusCode) {
			case 'pending':
				return 'bg-amber-500/10 text-amber-500';
			case 'paid':
				return 'bg-cyan-500/10 text-cyan-500';
			default:
				return 'bg-gray-500/10 text-gray-500';
		}
	}

	/**
	 * Получить название источника
	 */
	function getSourceName(bonus) {
		return bonus.source_type === 'contract' ? 'Договор' : 'Заказ';
	}

	/**
	 * Получить номер договора или заказа
	 */
	function getSourceNumber(bonus) {
		if (bonus.source_type === 'contract' && bonus.contract) {
			return bonus.contract.contract_number || '—';
		} else if (bonus.source_type === 'order' && bonus.order) {
			return bonus.order.order_number || '—';
		}
		return '—';
	}

	/**
	 * Проверить является ли бонус реферальным
	 */
	function isReferralBonus(bonus) {
		return bonus.bonus_type === 'referral';
	}

	/**
	 * Получить имя реферала для реферального бонуса
	 */
	function getReferralName(bonus) {
		if (!isReferralBonus(bonus)) return null;
		return bonus.referralUser?.name || 'Реферал';
	}

	/**
	 * Проверить доступность бонуса к выплате
	 * Для договоров: is_contract_completed И is_partner_paid должны быть true
	 * Для заказов: проверяем available_at
	 * В обоих случаях: бонус не должен быть выплачен (paid_at = null)
	 */
	function isBonusAvailable(bonus) {
		// Бонус уже выплачен - не доступен
		if (bonus.paid_at) {
			return false;
		}
		
		// Для договоров: проверяем оба условия
		if (bonus.source_type === 'contract') {
			return bonus.is_contract_completed === true && bonus.is_partner_paid === true;
		}
		
		// Для заказов: проверяем available_at
		const hasAvailableAt = bonus.available_at !== null && bonus.available_at !== undefined && bonus.available_at !== '';
		return hasAvailableAt;
	}
</script>

<div class="overflow-x-auto">
	<table class="min-w-full divide-y divide-gray-700">
		<thead class="bg-gray-800">
			<tr>
				<th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Тип</th>
				<th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Источник</th>
				<th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Номер</th>
				<th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Проект</th>
				<th class="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Сумма/Бонус</th>
				<th class="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Доступно</th>
				<th class="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Выплачено</th>
			</tr>
		</thead>
		<tbody class="bg-gray-900 divide-y divide-gray-800">
			{#if bonuses.length === 0}
				<tr>
					<td colspan="7" class="px-4 py-8 text-center text-gray-500">
						Нет данных о бонусах
					</td>
				</tr>
			{:else}
				{#each bonuses as bonus}
					<tr class="hover:bg-gray-800/50 transition-colors">
						<td class="px-4 py-3 whitespace-nowrap">
							{#if isReferralBonus(bonus)}
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400" title="Бонус за сделку реферала">
									Реферальный
								</span>
							{:else}
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400">
									Агентский
								</span>
							{/if}
						</td>
						<td class="px-4 py-3 whitespace-nowrap">
							<div class="flex flex-col gap-0.5">
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {bonus.source_type === 'contract' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}">
									{getSourceName(bonus)}
								</span>
								{#if isReferralBonus(bonus)}
									<span class="text-xs text-gray-500" title="Сделка реферала">
										от {getReferralName(bonus)}
									</span>
								{/if}
							</div>
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
							{getSourceNumber(bonus)}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
							{bonus.project_name || '—'}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-300">
							{formatCurrency(bonus.source_amount)} / <span class="text-green-400 font-medium">{formatCurrency(bonus.commission_amount)}</span>
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-center">
							{#if isBonusAvailable(bonus)}
								<span class="text-green-400 font-bold">✓</span>
							{:else}
								<span class="text-gray-500">—</span>
							{/if}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-400 text-center">
							{formatDate(bonus.paid_at)}
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>

