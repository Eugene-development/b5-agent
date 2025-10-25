<script>
	import { ulid } from 'ulid';
	import { authState } from '$lib/auth/auth.svelte.js';
	import { API_BASE_URL } from '$lib/config/api.js';
	import { projectsRefresh } from '$lib/state/projectsRefresh.svelte.js';

	let { isOpen = $bindable(false), onSuccess } = $props();

	let secretKeyInput = $state('');
	let loading = $state(false);
	let successMessage = $state('');
	let errorMessage = $state('');
	let showFullKey = $state(false);

	// Mask secret key showing only last 4 characters
	function maskSecretKey(key) {
		if (!key || key.length <= 4) {
			return key || '';
		}
		const visiblePart = key.slice(-4);
		const maskedPart = '*'.repeat(key.length - 4);
		return maskedPart + visiblePart;
	}

	// Display value for the input (masked by default, full when clicked)
	let displayValue = $derived(showFullKey ? secretKeyInput : maskSecretKey(secretKeyInput));

	// Get secret key from user profile when modal opens or user data changes
	$effect(() => {
		if (authState.user?.key) {
			secretKeyInput = authState.user.key;
		}
	});

	// Reset form when modal opens
	$effect(() => {
		if (isOpen) {
			// Set secret key when modal opens
			if (authState.user?.key) {
				secretKeyInput = authState.user.key;
			}
			// Clear messages
			successMessage = '';
			errorMessage = '';
		}
	});

	async function publicSubmit(payload) {
		try {
			const response = await fetch(`${API_BASE_URL}/api/projects/public-submit`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'X-Requested-With': 'XMLHttpRequest'
				},
				body: JSON.stringify({
					secret_key: payload.secretKey,
					client_id: payload.clientId,
					client_name: payload.clientName,
					phone: payload.phone,
					address: payload.address ?? null,
					comment: payload.comment ?? null
				})
			});

			const data = await response.json();

			if (!response.ok) {
				if (response.status === 422) {
					return {
						success: false,
						errors: data?.errors ?? {},
						message: data?.message || 'Ошибка валидации'
					};
				}

				if (response.status === 404) {
					return {
						success: false,
						message: 'Пользователь с таким ключом не найден'
					};
				}

				return {
					success: false,
					message: data?.message || 'Произошла ошибка при отправке данных'
				};
			}

			return {
				success: !!data.success,
				message: data.message || 'Заявка успешно отправлена'
			};
		} catch (error) {
			return {
				success: false,
				message: 'Произошла ошибка при отправке данных'
			};
		}
	}

	async function handleSubmit(event) {
		event.preventDefault();
		successMessage = '';
		errorMessage = '';

		const ulidPattern = /^[0-9A-HJKMNP-TV-Z]{26}$/;
		if (!secretKeyInput || !ulidPattern.test(secretKeyInput)) {
			errorMessage = 'Введите корректный секретный ключ';
			return;
		}

		loading = true;

		const form = event.currentTarget;
		const formData = new FormData(form);

		const phone = String(formData.get('phone') || '').trim();
		const phoneDigits = phone.replace(/\D/g, '');

		if (phoneDigits.length < 10 || phoneDigits.length > 11) {
			errorMessage = 'Телефон должен содержать 10-11 цифр';
			loading = false;
			return;
		}

		// Normalize phone to format 79991234567
		let normalizedPhone = phoneDigits;
		if (normalizedPhone.startsWith('8') && normalizedPhone.length === 11) {
			normalizedPhone = '7' + normalizedPhone.slice(1);
		} else if (normalizedPhone.length === 10) {
			normalizedPhone = '7' + normalizedPhone;
		}

		const clientId = ulid();

		const payload = {
			secretKey: secretKeyInput,
			clientId: clientId,
			clientName: String(formData.get('client_name') || '').trim(),
			phone: normalizedPhone,
			address: String(formData.get('address') || '').trim() || null,
			comment: String(formData.get('comment') || '').trim() || null
		};

		const result = await publicSubmit(payload);

		if (result.success) {
			successMessage = result.message || 'Заявка успешно отправлена';
			
			// Reset only client data fields, keep secret key
			const clientNameInput = form.querySelector('#client_name');
			const phoneInput = form.querySelector('#phone');
			const addressInput = form.querySelector('#address');
			const commentInput = form.querySelector('#comment');
			
			if (clientNameInput) clientNameInput.value = '';
			if (phoneInput) phoneInput.value = '';
			if (addressInput) addressInput.value = '';
			if (commentInput) commentInput.value = '';
			
			// Secret key remains unchanged
			
			// Trigger global refresh of projects data
			projectsRefresh.refresh();
			
			// Call onSuccess callback if provided
			if (onSuccess) {
				onSuccess();
			}
			
			// Auto-close modal after 2 seconds
			setTimeout(() => {
				isOpen = false;
				successMessage = '';
			}, 2000);
		} else {
			errorMessage = result.message || 'Ошибка отправки заявки';
		}

		loading = false;
	}

	function closeModal() {
		isOpen = false;
		successMessage = '';
		errorMessage = '';
		// Restore secret key after closing
		if (authState.user?.key) {
			secretKeyInput = authState.user.key;
		}
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		onclick={closeModal}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Escape' && closeModal()}
	>
		<div
			class="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-gray-800 p-6 shadow-xl sm:p-8"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			<button
				onclick={closeModal}
				class="absolute right-4 top-4 text-gray-400 hover:text-white"
				aria-label="Закрыть"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>

			<h2 class="mb-6 text-2xl font-bold text-white">Создать проект</h2>

			{#if successMessage}
				<p class="mb-4 rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-300">
					{successMessage}
				</p>
			{/if}
			{#if errorMessage}
				<p class="mb-4 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-300">{errorMessage}</p>
			{/if}

			<form onsubmit={handleSubmit} novalidate>
				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-300" for="secret_key"
						>Ключ агента <span class="text-red-400">*</span></label
					>
					<div class="relative">
						<input
							class="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 pr-10 font-mono text-white opacity-75"
							type="text"
							name="secret_key"
							id="secret_key"
							value={displayValue}
							pattern="^[0-9A-HJKMNP-TV-Z]{26}$"
							minlength="26"
							maxlength="26"
							inputmode="latin"
							autocapitalize="characters"
							autocomplete="off"
							placeholder="01HZY8Y9G5F8M9B6W7K3NQ4Z8X"
							readonly
							required
						/>
						<button
							type="button"
							onclick={() => (showFullKey = !showFullKey)}
							class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
							title={showFullKey ? 'Скрыть ключ' : 'Показать ключ'}
						>
							{#if showFullKey}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
									/>
								</svg>
							{:else}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									/>
								</svg>
							{/if}
						</button>
					</div>
					{#if secretKeyInput}
						<p class="mt-1 text-xs text-green-400">
							✓ Ваш секретный ключ подставлен автоматически
						</p>
					{:else}
						<p class="mt-1 text-xs text-yellow-400">
							⚠ Секретный ключ не найден. Проверьте профиль.
						</p>
					{/if}
				</div>

				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-300" for="client_name"
						>Имя клиента <span class="text-red-400">*</span></label
					>
					<input
						class="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white"
						type="text"
						name="client_name"
						id="client_name"
						placeholder="Введите имя клиента"
						required
					/>
				</div>

				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-300" for="phone"
						>Телефон клиента <span class="text-red-400">*</span></label
					>
					<input
						class="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white"
						type="tel"
						name="phone"
						id="phone"
						inputmode="tel"
						autocomplete="tel"
						placeholder="+7 (___) ___-__-__"
						required
					/>
				</div>

				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-300" for="address"
						>Адрес объекта (не обязательно)</label
					>
					<input
						class="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white"
						type="text"
						name="address"
						id="address"
						placeholder="Введите адрес объекта"
					/>
				</div>

				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-300" for="comment"
						>Комментарий (желательно)</label
					>
					<textarea
						class="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white"
						rows="3"
						name="comment"
						id="comment"
						placeholder="Опишите интерес клиента, в какую фабрику не обращаться, дополнительную информацию и т.д."
					></textarea>
				</div>

				<div class="flex justify-end gap-3">
					<button
						type="button"
						onclick={closeModal}
						class="rounded-md bg-gray-700 px-4 py-2 font-medium text-white hover:bg-gray-600"
					>
						Отмена
					</button>
					<button
						class="rounded-md bg-gradient-to-r from-purple-600 via-purple-400 to-blue-500 px-4 py-2 font-bold text-white hover:opacity-80 disabled:opacity-50"
						type="submit"
						disabled={loading}
					>
						{#if loading}Отправка...{/if}
						{#if !loading}Отправить{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
