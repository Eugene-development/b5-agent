<!--
  Project Details Modal Component
  Displays full project information for agents
-->
<script>
	import BonusDetailsSection from './BonusDetailsSection.svelte';

	let { project = $bindable(null), onClose } = $props();

	function formatDate(dateString) {
		if (!dateString) return 'Не указано';
		return new Date(dateString).toLocaleDateString('ru-RU', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// Check if dates are different (comparing only date part, ignoring time)
	function areDatesDifferent(date1, date2) {
		if (!date1 || !date2) return false;
		const d1 = new Date(date1).toDateString();
		const d2 = new Date(date2).toDateString();
		return d1 !== d2;
	}

	function formatCurrency(amount) {
		if (!amount) return '—';
		return new Intl.NumberFormat('ru-RU', {
			style: 'decimal',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	}

	function formatPhone(phoneNumber) {
		if (!phoneNumber) return phoneNumber;
		
		// Убираем все нецифровые символы
		const cleaned = phoneNumber.replace(/\D/g, '');
		
		// Форматируем в +7 915 400-00-20
		if (cleaned.length === 11 && cleaned.startsWith('7')) {
			return `+7 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
		} else if (cleaned.length === 10) {
			return `+7 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8, 10)}`;
		}
		
		// Если формат не подходит, возвращаем как есть
		return phoneNumber;
	}

	function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			onClose?.();
		}
	}

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			onClose?.();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if project}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 overflow-y-auto p-4 pt-20"
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
	>
		<div
			class="relative w-full max-w-4xl my-8 rounded-lg bg-gray-800 shadow-xl"
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-6 py-4 rounded-t-lg">
				<div class="flex flex-col gap-2">
					{#if project.status}
						<span
							id="modal-title"
							class="inline-flex w-fit rounded-full border px-3 py-1 text-sm font-semibold"
							style={project.status?.color
								? `background-color: ${project.status.color}20; color: ${project.status.color}; border-color: ${project.status.color}`
								: 'background-color: #374151; color: #D1D5DB; border-color: #6B7280'}
						>
							{project.status.value}
						</span>
					{/if}
				</div>
				<button
					onclick={onClose}
					class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
					aria-label="Закрыть модальное окно"
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
			</div>

			<!-- Content -->
			<div class="p-6">
				<!-- Main Information -->
				<div class="mb-6">
					<h3 class="mb-4 text-lg font-semibold text-amber-500">Основная информация</h3>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<p class="text-sm text-gray-400">Проект</p>
							<p class="text-base font-medium text-white">{project.value || 'Не указано'}</p>
						</div>

						<div>
							<p class="text-sm text-gray-400">Имя</p>
							<p class="text-base font-medium text-white">{project.client?.name || 'Не указано'}</p>
						</div>

						<div>
							<p class="text-sm text-gray-400">Телефон клиента</p>
							{#if project.client?.phones && project.client.phones.length > 0}
								<div class="flex flex-col gap-1">
									{#each project.client.phones as phone}
										<div class="flex items-center gap-2">
											<a 
												href="tel:{phone.value}" 
												class="inline-flex items-center gap-1 text-base font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
											>
												<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
												</svg>
												{formatPhone(phone.value)}
											</a>
											{#if phone.is_primary}
												<span class="rounded-full bg-emerald-900/30 px-2 py-0.5 text-xs text-emerald-400 border border-emerald-700">
													основной
												</span>
											{/if}
										</div>
									{/each}
								</div>
							{:else}
								<p class="text-base font-medium text-white">Не указано</p>
							{/if}
						</div>

						<div>
							<p class="text-sm text-gray-400">Адрес объекта</p>
							<p class="text-base font-medium text-white">{project.region || 'Не указано'}</p>
						</div>
					</div>
				</div>

				<!-- Description -->
				{#if project.description}
					<div class="mb-6">
						<h3 class="mb-2 text-lg font-semibold text-white">Описание</h3>
						<p class="text-base text-gray-300">{project.description}</p>
					</div>
				{/if}

				<!-- Bonus Details -->
				{#if project.bonusDetails}
					<div class="mb-6">
						<h3 class="mb-4 text-lg font-semibold text-amber-500">Информация о бонусах</h3>
						<BonusDetailsSection 
							bonusDetails={project.bonusDetails} 
							isActive={project.is_active} 
						/>
					</div>
				{:else if project.totalAgentBonus !== undefined}
					<!-- Fallback for simple bonus display -->
					<div class="mb-6">
						<h3 class="mb-4 text-lg font-semibold text-amber-500">Информация о бонусах</h3>
						<div class="rounded-lg bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 p-4">
							<div class="grid grid-cols-2 gap-4">
								<div>
									<p class="text-xs text-gray-400">Общий бонус</p>
									<p class="text-xl font-bold text-emerald-400">
										{formatCurrency(project.totalAgentBonus)}
									</p>
								</div>
								{#if project.status?.value === 'Доставлен'}
									<div>
										<p class="text-xs text-gray-400 flex items-center gap-2">
											Доступно
											<svg class="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
											</svg>
										</p>
										<p class="text-xl font-bold text-emerald-400">
											{formatCurrency(project.totalAgentBonus)}
										</p>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/if}

				<!-- Timestamps -->
				<div class="border-t border-gray-700 pt-6">
					<h3 class="mb-4 text-lg font-semibold text-amber-500">Системная информация</h3>
					<div class="grid grid-cols-1 gap-4 {areDatesDifferent(project.created_at, project.updated_at) ? 'md:grid-cols-2' : ''}">
						<div>
							<p class="text-sm text-gray-400">Дата создания</p>
							<p class="text-base font-medium text-white">{formatDate(project.created_at)}</p>
						</div>

						{#if areDatesDifferent(project.created_at, project.updated_at)}
							<div>
								<p class="text-sm text-gray-400">Последнее обновление</p>
								<p class="text-base font-medium text-white">{formatDate(project.updated_at)}</p>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Footer -->
			<div class="border-t border-gray-700 bg-gray-800 px-6 py-4 rounded-b-lg">
				<div class="flex justify-end">
					<button
						onclick={onClose}
						class="rounded-md bg-cyan-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-500 focus:outline-2 focus:outline-offset-2 focus:outline-cyan-600"
					>
						Закрыть
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
