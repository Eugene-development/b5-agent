<script>
	// No scroll animations needed
</script>

<!-- Incognito Feature Explanation Section -->
<div class="relative isolate overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 px-6 py-24 sm:px-24">
	<!-- Background decoration -->
	<div
		class="absolute -top-40 left-20 -z-10 transform-gpu blur-3xl"
		aria-hidden="true"
	>
		<div
			class="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#4f46e5] to-[#80caff] opacity-20"
		></div>
	</div>

	<div class="mx-auto max-w-7xl">
		<div class="mx-auto mb-12 max-w-3xl text-center">
			<span
				class="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/30"
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
				</svg>
				Режим Инкогнито
			</span>
			<h2 class="mt-6 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl tracking-wide">
				Защитите свою конфиденциальность
			</h2>
			<p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
				Используйте режим <strong class="text-indigo-400">Инкогнито</strong> при создании проекта, чтобы ваши данные оставались скрытыми от всех участников
			</p>
		</div>

		<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
			<!-- Static Demo Form with arrow pointing to Incognito checkbox -->
			<div class="relative">
				<div class="relative mx-auto max-w-lg">
					<!-- Glow effect behind the form -->
					<div class="absolute -inset-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-20 blur-2xl"></div>
					
					<!-- Form container (static demo) -->
					<div class="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
						<!-- Header (blurred) -->
						<div class="mb-6 text-center blur-[2px] opacity-60">
							<h3 class="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
								Создать проект
							</h3>
							<p class="mt-2 text-xs text-slate-400 sm:text-sm">Регистрация проекта на платформе RUBONUS</p>
						</div>

						<!-- Form fields (static demo) -->
						<div class="space-y-4">
							<!-- Secret Key and Incognito Row -->
							<div class="relative">
								<!-- Label (blurred) -->
								<div class="mb-2 flex items-center gap-2 text-xs font-medium text-slate-300 blur-[2px] opacity-60 sm:text-sm">
									<svg class="h-3 w-3 text-purple-400 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
									</svg>
									Ключ
									<span class="text-red-400">*</span>
								</div>
								
								<!-- Row: Key input + Incognito checkbox -->
								<div class="flex items-center gap-2 sm:gap-3">
									<!-- Key input (blurred) -->
									<div class="relative min-w-0 flex-1 blur-[2px] opacity-60">
										<div class="w-full truncate rounded-xl border border-slate-600/50 bg-slate-800/50 px-3 py-2 pr-8 font-mono text-xs text-white opacity-75 sm:px-4 sm:py-3 sm:pr-10 sm:text-sm">
											**************
										</div>
										<div class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 sm:right-3" aria-hidden="true">
											<svg class="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
											</svg>
										</div>
									</div>

									<!-- Incognito Checkbox with Arrow (NOT blurred - main focus) -->
									<div class="relative z-10 shrink-0">
										<!-- Animated Arrow pointing to checkbox -->
										<div class="absolute -left-7 top-1/2 -translate-y-1/2 sm:-left-9">
											<svg 
												class="h-5 w-5 animate-bounce-horizontal text-cyan-400 drop-shadow-lg sm:h-7 sm:w-7"
												viewBox="0 0 24 24" 
												fill="none" 
												xmlns="http://www.w3.org/2000/svg"
												aria-hidden="true"
											>
												<path 
													d="M4 12H20M20 12L14 6M20 12L14 18" 
													stroke="currentColor" 
													stroke-width="2.5" 
													stroke-linecap="round" 
													stroke-linejoin="round"
												/>
											</svg>
										</div>
										
										<!-- Highlighted Incognito checkbox (clear, not blurred) -->
										<div class="relative flex cursor-default items-center gap-1.5 rounded-xl border-2 border-cyan-400/50 bg-cyan-500/10 px-2 py-2 ring-2 ring-cyan-400/30 shadow-lg shadow-cyan-500/20 sm:gap-2 sm:px-3 sm:py-2.5">
											<div class="h-4 w-4 rounded border-2 border-slate-500 bg-slate-700 sm:h-5 sm:w-5" aria-hidden="true"></div>
											<span class="text-[11px] font-medium text-slate-300 sm:text-sm">Инкогнито</span>
										</div>
									</div>
								</div>
								
								<!-- Helper text (blurred) -->
								<p class="mt-1 flex items-center gap-1 text-[10px] text-emerald-400 blur-[2px] opacity-60 sm:mt-2 sm:text-xs">
									<svg class="h-2 w-2 sm:h-3 sm:w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
									</svg>
									Ваш секретный ключ подставлен автоматически
								</p>
							</div>

							<!-- Client Name (blurred) -->
							<div class="blur-[2px] opacity-60">
								<div class="mb-2 flex items-center gap-2 text-xs font-medium text-slate-300 sm:text-sm">
									<svg class="h-3 w-3 text-blue-400 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
									Имя клиента
									<span class="text-red-400">*</span>
								</div>
								<div class="w-full rounded-xl border border-slate-600/50 bg-slate-800/50 px-3 py-2 text-xs text-slate-500 sm:px-4 sm:py-3 sm:text-sm">
									Введите имя клиента
								</div>
							</div>

							<!-- Phone (blurred) -->
							<div class="blur-[2px] opacity-60">
								<div class="mb-2 flex items-center gap-2 text-xs font-medium text-slate-300 sm:text-sm">
									<svg class="h-3 w-3 text-green-400 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
									</svg>
									Телефон клиента
									<span class="text-red-400">*</span>
								</div>
								<div class="w-full rounded-xl border border-slate-600/50 bg-slate-800/50 px-3 py-2 text-xs text-slate-500 sm:px-4 sm:py-3 sm:text-sm">
									+7 (___) ___-__-__
								</div>
							</div>

							<!-- Address (blurred) -->
							<div class="blur-[2px] opacity-60">
								<div class="mb-2 flex items-center gap-2 text-xs font-medium text-slate-300 sm:text-sm">
									<svg class="h-3 w-3 text-amber-400 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
									Адрес объекта
									<span class="text-[10px] text-slate-500 sm:text-xs">(не обязательно)</span>
								</div>
								<div class="w-full rounded-xl border border-slate-600/50 bg-slate-800/50 px-3 py-2 text-xs text-slate-500 sm:px-4 sm:py-3 sm:text-sm">
									Введите адрес объекта
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Explanation content -->
			<div class="flex flex-col gap-6">
				<div class="rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 backdrop-blur-sm">
					<div class="flex items-start gap-4">
						<div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-6 w-6 text-white">
								<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
							</svg>
						</div>
						<div>
							<h3 class="text-xl font-bold text-white">Что даёт режим Инкогнито?</h3>
							<p class="mt-2 text-gray-300">
								При активации этой опции ваши личные данные <strong class="text-indigo-400">не будут видны</strong> всем участникам проекта. Вы остаётесь анонимным звеном.
							</p>
						</div>
					</div>
				</div>

				<div class="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 p-6 backdrop-blur-sm">
					<div class="flex items-start gap-4">
						<div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-6 w-6 text-white">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
							</svg>
						</div>
						<div>
							<h3 class="text-xl font-bold text-white">Когда использовать?</h3>
							<p class="mt-2 text-gray-300">
								Рекомендуется активировать, если вы не хотите, чтобы куратор, подрядчик или другие участники проекта знали ваши данные.
							</p>
						</div>
					</div>
				</div>

				<div class="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 backdrop-blur-sm">
					<div class="flex items-start gap-4">
						<div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-6 w-6 text-white">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
							</svg>
						</div>
						<div>
							<h3 class="text-xl font-bold text-white">Бонусы сохраняются</h3>
							<p class="mt-2 text-gray-300">
								Независимо от режима, вы <strong class="text-purple-400">получите свой бонус</strong> после успешного закрытия сделки.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes bounce-horizontal {
		0%, 100% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(-8px);
		}
	}
	
	:global(.animate-bounce-horizontal) {
		animation: bounce-horizontal 1s ease-in-out infinite;
	}
</style>
