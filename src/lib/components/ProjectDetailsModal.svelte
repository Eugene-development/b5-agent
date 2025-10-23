<!--
  Project Details Modal Component
  Displays full project information for agents
-->
<script>
	let { project = $bindable(null), onClose } = $props();

	function formatDate(dateString) {
		if (!dateString) return 'Не указано';
		return new Date(dateString).toLocaleDateString('ru-RU', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function formatCurrency(amount) {
		if (!amount) return 'Не указано';
		return new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency: 'RUB',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
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
				<h2 id="modal-title" class="text-2xl font-bold text-white">
					{project.value || 'Проект'}
				</h2>
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
				<!-- Status Badge -->
				{#if project.status}
					<div class="mb-6">
						<span
							class="inline-flex rounded-full border px-3 py-1 text-sm font-semibold"
							style={project.status?.color
								? `background-color: ${project.status.color}20; color: ${project.status.color}; border-color: ${project.status.color}`
								: 'background-color: #374151; color: #D1D5DB; border-color: #6B7280'}
						>
							{project.status.value}
						</span>
					</div>
				{/if}

				<!-- Main Information -->
				<div class="mb-6">
					<h3 class="mb-4 text-lg font-semibold text-white">Основная информация</h3>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<p class="text-sm text-gray-400">Название проекта</p>
							<p class="text-base font-medium text-white">{project.value || 'Не указано'}</p>
						</div>

						<div>
							<p class="text-sm text-gray-400">Адрес объекта</p>
							<p class="text-base font-medium text-white">{project.region || 'Не указано'}</p>
						</div>

						{#if project.agent}
							<div>
								<p class="text-sm text-gray-400">Агент</p>
								<p class="text-base font-medium text-white">
									{project.agent.name || project.agent.email || 'Не указано'}
								</p>
							</div>
						{/if}

						<div>
							<p class="text-sm text-gray-400">Активность</p>
							<p class="text-base font-medium text-white">
								{project.is_active ? 'Активный' : 'Неактивный'}
							</p>
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

				<!-- Contract Information -->
				<div class="mb-6">
					<h3 class="mb-4 text-lg font-semibold text-white">Информация о договоре</h3>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						{#if project.contract_name}
							<div>
								<p class="text-sm text-gray-400">Номер договора</p>
								<p class="text-base font-medium text-white">{project.contract_name}</p>
							</div>
						{/if}

						<div>
							<p class="text-sm text-gray-400">Дата договора</p>
							<p class="text-base font-medium text-white">{formatDate(project.contract_date)}</p>
						</div>

						<div>
							<p class="text-sm text-gray-400">Сумма договора</p>
							<p class="text-base font-medium text-white">
								{formatCurrency(project.contract_amount)}
							</p>
						</div>

						{#if project.agent_percentage}
							<div>
								<p class="text-sm text-gray-400">Процент агента</p>
								<p class="text-base font-medium text-white">{project.agent_percentage}%</p>
							</div>
						{/if}

						<div>
							<p class="text-sm text-gray-400">Плановая дата завершения</p>
							<p class="text-base font-medium text-white">
								{formatDate(project.planned_completion_date)}
							</p>
						</div>
					</div>
				</div>

				<!-- Timestamps -->
				<div class="border-t border-gray-700 pt-6">
					<h3 class="mb-4 text-lg font-semibold text-white">Системная информация</h3>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<p class="text-sm text-gray-400">Дата создания</p>
							<p class="text-base font-medium text-white">{formatDate(project.created_at)}</p>
						</div>

						<div>
							<p class="text-sm text-gray-400">Последнее обновление</p>
							<p class="text-base font-medium text-white">{formatDate(project.updated_at)}</p>
						</div>

						<div>
							<p class="text-sm text-gray-400">ID проекта</p>
							<p class="font-mono text-sm text-gray-300">{project.id}</p>
						</div>
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
