<script>
	let openIndex = $state(null);

	function toggleQuestion(index) {
		openIndex = openIndex === index ? null : index;
	}

	const questions = [
		{
			question: 'Как это работает?',
			answer:
				'Зачастую у вас может быть клиент, который по объективным причинам не может приобрести необходимый товар или услугу у вас. В такой ситуации вы можете с его согласия передать контакты нашим партнёрам через специальную анонимную форму. Мы гарантируем конфиденциальность и защиту ваших данных. За успешную сделку вы получаете вознаграждение до 5%.'
		},
		{
			question: 'А вдруг меня уволят?',
			answer:
				'Мы предполагаем, что не будет конфликта интересов с компанией, где вы работаете. При этом мы строго соблюдаем требования Федерального закона №152-ФЗ и не передаём ваши контактные данные и информацию о сделках третьим лицам. Сама регистрация в нашем сервисе является конфиденциальной, поэтому наши партнёры не имеют доступа к информации о вас.'
		},
		{
			question: 'Как я получу бонусы?',
			answer:
				'После регистрации вы укажите удобный для вас способ получения бонуса. Подробности будут в вашем личном кабинете.'
		},
		{
			question: 'А что с налоговой?',
			answer:
				'Мы не являемся вашим налоговым агентом и вы самостоятельно решаете судьбу дохода и уплаченных налогов. Для полной легальности оформитесь как самозанятый или ИП и уплатите символический налог.'
		},
		{
			question: 'Как я отслежу что с клиентом?',
			answer:
				'В личном кабинете сервиса будет вся информация о ваших клиентах, статусе сделок и размере ожидаемых бонусов.'
		},
		{
			question: 'Где гарантии, что я получу бонусы?',
			answer:
				'Мы гарантируем выплату бонусов в течение 5 дней после закрытия сделки. Более того, мы заинтересованы делать выплаты, так как это мотивирует вас на постоянную работу.'
		}
	];
</script>

<div class="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50">
	<!-- Background Pattern -->
	<div class="absolute inset-0 opacity-50">
		<div
			class="absolute inset-0"
			style="background-image: radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.15) 1px, transparent 0); background-size: 20px 20px;"
		></div>
	</div>

	<div class="relative mx-auto max-w-4xl px-6 py-20 sm:py-28 lg:px-8">
		<!-- Header Section -->
		<div class="mb-16 text-center">
			<div class="mb-6 inline-flex items-center justify-center rounded-full bg-red-100 p-2">
				<svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
			</div>
			<h1
				class="mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
			>
				Часто задаваемые вопросы
			</h1>
			<p class="mx-auto max-w-2xl text-lg text-gray-600">
				Найдите ответы на самые популярные вопросы о нашем сервисе
			</p>
		</div>

		<!-- FAQ Section -->
		<div class="space-y-4">
			{#each questions as { question, answer }, index}
				<div
					class="group rounded-2xl border border-gray-200/50 bg-white/70 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-red-200 hover:shadow-md"
				>
					<button
						class="w-full rounded-2xl px-6 py-6 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
						onclick={() => toggleQuestion(index)}
					>
						<div class="flex items-center justify-between">
							<h3
								class="text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-red-700"
							>
								{question}
							</h3>
							<div class="ml-4 flex-shrink-0">
								<svg
									class="h-5 w-5 transform text-gray-500 transition-transform duration-200 {openIndex ===
									index
										? 'rotate-180'
										: ''}"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									></path>
								</svg>
							</div>
						</div>
					</button>

					{#if openIndex === index}
						<div class="animate-in slide-in-from-top-2 px-6 pb-6 duration-200">
							<div
								class="mb-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"
							></div>
							<p class="leading-relaxed text-gray-600">
								{answer}
							</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Call to Action -->
		<div class="mt-16 text-center">
			<div class="rounded-2xl border border-red-100 p-8">
				<h3 class="mb-2 text-xl font-semibold text-gray-900">Не нашли ответ на свой вопрос?</h3>
				<p class="mb-6 text-gray-600">Наша команда поддержки готова помочь вам в любое время</p>
				<button
					class="inline-flex items-center rounded-xl bg-red-700 px-6 py-3 font-medium text-white shadow-sm transition-colors duration-200 hover:cursor-pointer hover:bg-red-800 hover:shadow-md"
				>
					<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
						></path>
					</svg>
					Связаться с поддержкой
				</button>
			</div>
		</div>
	</div>
</div>
