<script>
	/**
	 * Модальное окно заказа выплаты бонуса
	 * Requirements: 7.x - Заказ выплаты агенту
	 */

	import { bonusPaymentsApi } from '$lib/api/bonusPayments.js';

	/** @type {{ availableAmount: number, onClose: () => void, onSubmit?: (data: any) => void }} */
	let { availableAmount = 0, onClose, onSubmit } = $props();

	// Состояние формы
	let amount = $state('');
	let paymentMethod = $state('');
	let cardNumber = $state('');
	let phoneNumber = $state('');
	let contactInfo = $state('');
	let comment = $state('');
	
	// Состояние отправки
	let isSubmitting = $state(false);
	
	// Состояние уведомления
	let notification = $state({ show: false, type: 'success', message: '' });

	// Методы оплаты
	const paymentMethods = [
		{ id: 'card', name: 'КАРТА', icon: 'card' },
		{ id: 'sbp', name: 'СБП', icon: 'phone' },
		{ id: 'other', name: 'ДРУГОЕ', icon: 'other' }
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
	 * Показать уведомление
	 * @param {'success' | 'error'} type
	 * @param {string} message
	 */
	function showNotification(type, message) {
		notification = { show: true, type, message };
		setTimeout(() => {
			notification = { show: false, type: 'success', message: '' };
		}, 3000);
	}

	/**
	 * Обработка отправки формы
	 */
	async function handleSubmit() {
		
		if (isSubmitting) return;
		
		const formData = {
			amount: parseFloat(amount) || 0,
			paymentMethod,
			cardNumber: paymentMethod === 'card' ? cardNumber : null,
			phoneNumber: paymentMethod === 'sbp' ? phoneNumber : null,
			contactInfo: paymentMethod === 'other' ? contactInfo : null,
			comment
		};

		isSubmitting = true;
		
		try {
			const result = await bonusPaymentsApi.createBonusPaymentRequest(formData);
			
			showNotification('success', 'Заявка на выплату успешно создана');
			
			// Вызываем callback если передан
			if (onSubmit) {
				onSubmit(result);
			}
			
			// Закрываем модал через небольшую задержку для показа уведомления
			setTimeout(() => {
				onClose();
			}, 1500);
		} catch (error) {
			console.error('Failed to create payment request:', error);
			showNotification('error', error.message || 'Не удалось создать заявку на выплату');
		} finally {
			isSubmitting = false;
		}
	}

	/**
	 * Установить всю доступную сумму
	 */
	function setMaxAmount() {
		amount = Math.round(availableAmount).toString();
	}

	/**
	 * Форматирование номера телефона в маску +7 (XXX) XXX-XX-XX
	 * @param {string} value
	 */
	function formatPhoneNumber(value) {
		// Удаляем все кроме цифр
		let digits = value.replace(/\D/g, '');
		
		// Если начинается с 8, заменяем на 7
		if (digits.startsWith('8')) {
			digits = '7' + digits.slice(1);
		}
		
		// Если не начинается с 7, добавляем 7
		if (digits.length > 0 && !digits.startsWith('7')) {
			digits = '7' + digits;
		}
		
		// Ограничиваем до 11 цифр (7 + 10 цифр номера)
		digits = digits.slice(0, 11);
		
		// Форматируем
		if (digits.length === 0) return '';
		if (digits.length <= 1) return '+7';
		if (digits.length <= 4) return `+7 (${digits.slice(1)}`;
		if (digits.length <= 7) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
		if (digits.length <= 9) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
		return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
	}

	/**
	 * Обработчик ввода телефона
	 * @param {Event} event
	 */
	function handlePhoneInput(event) {
		const input = /** @type {HTMLInputElement} */ (event.target);
		const formatted = formatPhoneNumber(input.value);
		phoneNumber = formatted;
		
		// Устанавливаем курсор в конец
		setTimeout(() => {
			input.setSelectionRange(formatted.length, formatted.length);
		}, 0);
	}

	/**
	 * Форматирование номера карты: 0000 0000 0000 0000 00
	 * @param {string} value
	 */
	function formatCardNumber(value) {
		// Удаляем все кроме цифр
		let digits = value.replace(/\D/g, '');
		
		// Ограничиваем до 18 цифр
		digits = digits.slice(0, 18);
		
		// Добавляем пробел через каждые 4 символа
		const groups = [];
		for (let i = 0; i < digits.length; i += 4) {
			groups.push(digits.slice(i, i + 4));
		}
		return groups.join(' ');
	}

	/**
	 * Обработчик ввода номера карты
	 * @param {Event} event
	 */
	function handleCardInput(event) {
		const input = /** @type {HTMLInputElement} */ (event.target);
		const formatted = formatCardNumber(input.value);
		cardNumber = formatted;
		
		// Устанавливаем курсор в конец
		setTimeout(() => {
			input.setSelectionRange(formatted.length, formatted.length);
		}, 0);
	}

	/**
	 * Блокировка ввода нецифровых символов
	 * @param {KeyboardEvent} event
	 */
	function blockNonDigits(event) {
		// Разрешаем служебные клавиши
		const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
		if (allowedKeys.includes(event.key)) return;
		
		// Разрешаем Ctrl/Cmd + A, C, V, X
		if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) return;
		
		// Блокируем всё кроме цифр
		if (!/^[0-9]$/.test(event.key)) {
			event.preventDefault();
		}
	}

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Toast notification -->
{#if notification.show}
	<div class="fixed left-1/2 top-24 z-[9999] w-full max-w-md -translate-x-1/2 transform px-4">
		<div class="rounded-lg border {notification.type === 'success' ? 'border-green-500/30 bg-green-500/20' : 'border-red-500/30 bg-red-500/20'} p-4 shadow-lg backdrop-blur-sm">
			<div class="flex items-center justify-center">
				{#if notification.type === 'success'}
					<svg class="mr-2 h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					</svg>
					<p class="text-sm font-medium text-green-300">{notification.message}</p>
				{:else}
					<svg class="mr-2 h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
					<p class="text-sm font-medium text-red-300">{notification.message}</p>
				{/if}
			</div>
		</div>
	</div>
{/if}

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
					<p class="text-sm text-gray-400">Доступно: <span class="text-green-400">{formatCurrency(availableAmount)}</span></p>
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
		<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
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
						max={Math.round(availableAmount)}
						placeholder="0"
						class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
					/>
					<button
						type="button"
						onclick={setMaxAmount}
						class="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-medium text-green-400 bg-green-500/10 hover:bg-green-500/20 rounded-md transition-colors"
					>
						MAX
					</button>
				</div>
			</div>

			<!-- Способ выплаты -->
			<div class="mb-5">
				<p class="block text-sm font-medium text-gray-300 mb-2">
					Способ выплаты
				</p>
				<div class="grid grid-cols-3 gap-3">
					{#each paymentMethods as method}
						<button
							type="button"
							onclick={() => paymentMethod = method.id}
							class="flex items-center gap-3 p-2 rounded-lg border-2 transition-all {
								paymentMethod === method.id 
									? 'border-green-500 bg-green-500/10' 
									: 'border-gray-700 bg-gray-800 hover:border-gray-600'
							}"
						>
							{#if method.icon === 'card'}
								<svg class="w-5 h-5 flex-shrink-0 {paymentMethod === method.id ? 'text-green-500' : 'text-gray-400'}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
								</svg>
							{:else if method.icon === 'phone'}
								<svg class="w-5 h-5 flex-shrink-0 {paymentMethod === method.id ? 'text-green-500' : 'text-gray-400'}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
								</svg>
							{:else}
								<svg class="w-5 h-5 flex-shrink-0 {paymentMethod === method.id ? 'text-green-500' : 'text-gray-400'}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
						value={cardNumber}
						oninput={handleCardInput}
						onkeydown={blockNonDigits}
						placeholder="0000 0000 0000 0000 00"
						maxlength="22"
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
						value={phoneNumber}
						oninput={handlePhoneInput}
						onkeydown={blockNonDigits}
						placeholder="+7 (___) ___-__-__"
						maxlength="18"
						class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
					/>
				</div>
			{/if}

			{#if paymentMethod === 'other'}
				<div class="mb-5">
					<label for="contactInfo" class="block text-sm font-medium text-gray-300 mb-2">
						Как с вами связаться?
					</label>
					<input
						type="text"
						id="contactInfo"
						bind:value={contactInfo}
						placeholder="Телефон, email или другой способ связи"
						maxlength="255"
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
					maxlength="300"
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
						<p class="text-amber-300/80">
							Выплаты обрабатываются в течение 3-5 рабочих дней. Минимальная сумма выплаты — 1 000 ₽.
						</p>
					</div>
				</div>
			</div>

			<!-- Footer кнопки внутри формы -->
			<div class="flex gap-3 pt-4 border-t border-gray-700">
				<button
					type="button"
					onclick={onClose}
					class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
				>
					Отмена
				</button>
				<button
					type="submit"
					disabled={isSubmitting || !amount || !paymentMethod || parseFloat(amount) < 1000 || parseFloat(amount) > Math.round(availableAmount)}
					class="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
				>
					{#if isSubmitting}
						<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Отправка...
					{:else}
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
						Заказать выплату
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
