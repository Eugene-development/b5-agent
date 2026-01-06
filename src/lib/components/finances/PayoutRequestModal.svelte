<script>
	/**
	 * Модальное окно заказа выплаты бонуса
	 * Requirements: 7.x - Заказ выплаты агенту
	 */

	/** @type {{ availableAmount: number, onClose: () => void, onSubmit?: (data: any) => void }} */
	let { availableAmount = 0, onClose, onSubmit } = $props();

	// Состояние формы
	let amount = $state('');
	let paymentMethod = $state('');
	let cardNumber = $state('');
	let phoneNumber = $state('');
	let comment = $state('');

	// Методы оплаты
	const paymentMethods = [
		{ id: 'card', name: 'На карту', icon: 'card' },
		{ id: 'sbp', name: 'СБП (по номеру телефона)', icon: 'phone' }
	];

	/**
	 * Форматирование суммы в рублях
	 * @param {number} value
	 */
	function formatCurrency(value) {
		return new Intl.NumberFormat('ru-RU', {
			style: 'decimal',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(value || 0);
	}

	/**
	 * Обработка отправки формы
	 * @param {Event} event
	 */
	function handleSubmit(event) {
		event.preventDefault();
		
		const formData = {
			amount: parseFloat(amount) || 0,
			paymentMethod,
			cardNumber: paymentMethod === 'card' ? cardNumber : null,
			phoneNumber: paymentMethod === 'sbp' ? phoneNumber : null,
			comment
		};

		// TODO: Функционал отправки будет реализован позже
		if (onSubmit) {
			onSubmit(formData);
		}
	}

	/**
	 * Установить всю доступную сумму
	 */
	function setMaxAmount() {
		amount = availableAmount.toString();
	}

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Backdrop -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 bg-black/50 z-40"
	onclick={onClose}
	onkeydown={(e) => e.key === 'Escape' && onClose()}
	role="button"
	tabindex="-1"
	aria-label="Закрыть"
></div>

<!-- Modal -->
<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
	<div class="bg-gray-900 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-gray-700">
		<!-- Header -->
		<div class="flex items-center justify-between px-6 py-4 border-b border-gray-700">
			<div class="flex items-center gap-3">
				<div class="p-2 bg-green-500/10 rounded-lg">
					<svg class="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
					</svg>
				</div>
				<div>
					<h3 class="text-lg font-semibold text-white">Заказать выплату</h3>
					<p class="text-sm text-gray-400">Доступно: {formatCurrency(availableAmount)}</p>
				</div>
			</div>
			<button
				type="button"
				onclick={onClose}
				class="text-gray-400 hover:text-white transition-colors"
				aria-label="Закрыть"
			>
				<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<!-- Content -->
		<form onsubmit={handleSubmit} class="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
			<!-- Сумма выплаты -->
			<div class="mb-5">
				<label for="amount" class="block text-sm font-medium text-gray-300 mb-2">
					Сумма выплаты
				</label>
				<div class="relative">
					<input
						type="number"
						id="amount"
						bind:value={amount}
						min="1"
						max={availableAmount}
						placeholder="0"
						class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
					/>
					<button
						type="button"
						onclick={setMaxAmount}
						class="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-medium text-green-400 bg-green-500/10 hover:bg-green-500/20 rounded-md transition-colors"
					>
						MAX
					</button>
				</div>
				<p class="mt-1.5 text-xs text-gray-500">
					Максимальная сумма: {formatCurrency(availableAmount)}
				</p>
			</div>

			<!-- Способ выплаты -->
			<div class="mb-5">
				<p class="block text-sm font-medium text-gray-300 mb-2">
					Способ выплаты
				</p>
				<div class="grid grid-cols-2 gap-3">
					{#each paymentMethods as method}
						<button
							type="button"
							onclick={() => paymentMethod = method.id}
							class="flex items-center gap-3 p-4 rounded-lg border-2 transition-all {
								paymentMethod === method.id 
									? 'border-green-500 bg-green-500/10' 
									: 'border-gray-700 bg-gray-800 hover:border-gray-600'
							}"
						>
							{#if method.icon === 'card'}
								<svg class="w-5 h-5 {paymentMethod === method.id ? 'text-green-500' : 'text-gray-400'}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
								</svg>
							{:else}
								<svg class="w-5 h-5 {paymentMethod === method.id ? 'text-green-500' : 'text-gray-400'}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
								</svg>
							{/if}
							<span class="text-sm font-medium {paymentMethod === method.id ? 'text-green-400' : 'text-gray-300'}">
								{method.name}
							</span>
						</button>
					{/each}
				</div>
			</div>

			<!-- Поле для реквизитов (условное отображение) -->
			{#if paymentMethod === 'card'}
				<div class="mb-5">
					<label for="cardNumber" class="block text-sm font-medium text-gray-300 mb-2">
						Номер карты
					</label>
					<input
						type="text"
						id="cardNumber"
						bind:value={cardNumber}
						placeholder="0000 0000 0000 0000"
						maxlength="19"
						class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
					/>
				</div>
			{/if}

			{#if paymentMethod === 'sbp'}
				<div class="mb-5">
					<label for="phoneNumber" class="block text-sm font-medium text-gray-300 mb-2">
						Номер телефона
					</label>
					<input
						type="tel"
						id="phoneNumber"
						bind:value={phoneNumber}
						placeholder="+7 (___) ___-__-__"
						class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
					/>
				</div>
			{/if}

			<!-- Комментарий -->
			<div class="mb-5">
				<label for="comment" class="block text-sm font-medium text-gray-300 mb-2">
					Комментарий <span class="text-gray-500">(необязательно)</span>
				</label>
				<textarea
					id="comment"
					bind:value={comment}
					rows="3"
					placeholder="Дополнительная информация..."
					class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
				></textarea>
			</div>

			<!-- Информационный блок -->
			<div class="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-5">
				<div class="flex gap-3">
					<svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<div class="text-sm text-amber-200">
						<p class="font-medium mb-1">Информация о выплатах</p>
						<p class="text-amber-300/80">
							Выплаты обрабатываются в течение 3-5 рабочих дней. Минимальная сумма выплаты — 1 000 ₽.
						</p>
					</div>
				</div>
			</div>
		</form>

		<!-- Footer -->
		<div class="px-6 py-4 border-t border-gray-700 flex gap-3">
			<button
				type="button"
				onclick={onClose}
				class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
			>
				Отмена
			</button>
			<button
				type="submit"
				onclick={handleSubmit}
				disabled={!amount || !paymentMethod || parseFloat(amount) <= 0 || parseFloat(amount) > availableAmount}
				class="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
			>
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
				Заказать выплату
			</button>
		</div>
	</div>
</div>
