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

<div class="relative min-h-screen bg-gray-950">
	<!-- Background decoration -->
	<div
		class="absolute left-1/2 top-0 -z-10 -translate-x-1/2 transform-gpu blur-3xl"
		aria-hidden="true"
	>
		<div
			class="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
		></div>
	</div>

	<div class="relative mx-auto max-w-4xl px-6 py-20 sm:py-28 lg:px-8">
		<!-- Header Section -->
		<div class="mb-16 text-center">
			<div
				class="mb-6 inline-flex items-center justify-center rounded-full bg-indigo-500/20 p-2 ring-1 ring-indigo-500/30"
			>
				<svg class="h-6 w-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
			</div>
			<h1 class="mb-4 text-4xl font-bold text-white md:text-5xl">
				Часто задаваемые вопросы
			</h1>
			<p class="mx-auto max-w-2xl text-lg text-gray-300">
				Найдите ответы на самые популярные вопросы о нашем сервисе
			</p>
		</div>

		<!-- FAQ Section -->
		<div class="space-y-4">
			{#each questions as { question, answer }, index}
				<div
					class="group rounded-2xl border border-slate-700/50 bg-white/5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/50 hover:bg-white/10 hover:shadow-xl"
				>
					<button
						class="w-full rounded-2xl px-6 py-6 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950"
						onclick={() => toggleQuestion(index)}
					>
						<div class="flex items-center justify-between">
							<h3
								class="text-lg font-semibold text-white transition-colors duration-200 group-hover:text-indigo-300"
							>
								{question}
							</h3>
							<div class="ml-4 flex-shrink-0">
								<svg
									class="h-5 w-5 transform text-gray-400 transition-transform duration-200 {openIndex ===
									index
										? 'rotate-180 text-indigo-400'
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
								class="mb-4 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"
							></div>
							<p class="leading-relaxed text-gray-300">
								{answer}
							</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Call to Action -->
		<div class="mt-16 text-center">
			<div class="rounded-2xl border border-slate-700/50 bg-white/5 p-8 backdrop-blur-sm">
				<h3 class="mb-2 text-xl font-semibold text-white">Не нашли ответ на свой вопрос?</h3>
				<p class="mb-6 text-gray-300">Напишите нам и мы ответим вам в ближайшее время</p>
				<button
					class="inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3 font-medium text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:cursor-pointer hover:from-indigo-700 hover:to-indigo-800 hover:shadow-xl hover:shadow-indigo-500/40"
				>
					<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
						></path>
					</svg>
					info@bonus5.ru
				</button>
			</div>
		</div>
	</div>
</div>
