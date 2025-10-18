<script>
	// Data for the advantage cards
	const advantages = [
		{
			id: 1,
			title: 'Быстрые выплаты',
			description:
				'Получайте свои бонусы быстро и без задержек. Выплаты производятся в течение 5 рабочих после закрытия сделки.',
			icon: 'clock',
			iconBg: 'bg-teal-50',
			iconColor: 'text-teal-700',
			cardBg: 'bg-gray-50',
			href: '/'
		},
		{
			id: 2,
			title: 'Надёжные подрядчики и поставщики',
			description:
				'Работаем только с проверенными партнёрами. Все подрядчики проходят тщательную проверку и имеют подтверждённую репутацию.',
			icon: 'shield-check',
			iconBg: 'bg-purple-50',
			iconColor: 'text-purple-700',
			cardBg: 'bg-white',
			href: '/'
		},
		{
			id: 3,
			title: 'Команда кураторов проектов',
			description:
				'Персональная поддержка на каждом этапе. Наши кураторы помогут вам максимизировать доходы и решить любые вопросы с клиентом.',
			icon: 'users',
			iconBg: 'bg-sky-50',
			iconColor: 'text-sky-700',
			cardBg: 'bg-white',
			href: '/'
		},
		{
			id: 4,
			title: 'Высокий доход',
			description:
				'Конкурентные комиссионные выплаты до 5% без усилий с каждой успешной сделки. Чем больше клиентов - тем выше ваш доход.',
			icon: 'banknotes',
			iconBg: 'bg-yellow-50',
			iconColor: 'text-yellow-700',
			cardBg: 'bg-gray-50',
			href: '/'
		},
		{
			id: 5,
			title: 'Полная секретность',
			description:
				'Гарантируем полную конфиденциальность ваших данных и клиентской информации. Все сделки защищены соглашением о неразглашении.',
			icon: 'lock-closed',
			iconBg: 'bg-rose-50',
			iconColor: 'text-rose-700',
			cardBg: 'bg-gray-50',
			href: '/'
		},
		{
			id: 6,
			title: 'Обучение и поддержка',
			description:
				'Бесплатное обучение работе с системой, регулярные вебинары и круглосуточная техническая поддержка для всех участников.',
			icon: 'academic-cap',
			iconBg: 'bg-indigo-50',
			iconColor: 'text-indigo-700',
			cardBg: 'bg-white',
			href: '/'
		}
	];

	// Function to get SVG icon based on icon name
	function getIconSvg(iconName) {
		const icons = {
			clock: `<path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke-linecap="round" stroke-linejoin="round" />`,
			'shield-check': `<path d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" stroke-linecap="round" stroke-linejoin="round" />`,
			users: `<path d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" stroke-linecap="round" stroke-linejoin="round" />`,
			banknotes: `<path d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" stroke-linecap="round" stroke-linejoin="round" />`,
			'lock-closed': `<path d="M18 10.5h.008v.008H18V10.5Zm-3-7.5a3 3 0 1 0-6 0v3h6V3ZM6.75 6.75v-3a5.25 5.25 0 1 1 10.5 0v3h2.25A2.25 2.25 0 0 1 21.75 9v7.5A2.25 2.25 0 0 1 19.5 18.75h-15A2.25 2.25 0 0 1 2.25 16.5V9A2.25 2.25 0 0 1 4.5 6.75h2.25Z" stroke-linecap="round" stroke-linejoin="round" />`,
			'academic-cap': `<path d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" stroke-linecap="round" stroke-linejoin="round" />`
		};
		return icons[iconName] || '';
	}
</script>

<!-- Header section -->
<div class="relative isolate overflow-hidden bg-gray-950 px-6 py-24 sm:px-24">
	<div
		class="absolute -top-52 right-20 -z-10 transform-gpu blur-3xl xl:right-1/2 xl:-mr-80"
		aria-hidden="true"
	>
		<div
			class="aspect-[1108/632] w-[69.25rem] bg-gradient-to-l from-[#80caff] to-[#4f46e5] opacity-20"
		></div>
	</div>

	<div class="mx-auto mb-12 max-w-3xl text-center">
		<p
			class="mt-2 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
		>
			Преимущества
		</p>
		<p class="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300 sm:text-xl">
			Получите максимум от сотрудничества с нами благодаря системе преимуществ, которая обеспечивает
			максимальную прибыльность для каждой сделки.
		</p>
	</div>

	<div
		class="divide-y divide-gray-700/50 overflow-hidden rounded-2xl border border-slate-700/50 bg-white/5 py-12 shadow-xl backdrop-blur-sm *:p-8 sm:grid sm:grid-cols-2 sm:divide-y-0 sm:px-24 sm:py-24"
	>
		{#each advantages as advantage, index (advantage.id)}
			<div
				class="{index === 0
					? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none'
					: index === 4
						? 'sm:rounded-bl-lg'
						: index === 5
							? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none'
							: ''} sm:odd:not-nth-last-2:border-b sm:even:not-last:border-b group relative border-gray-700/50 p-6 transition-all duration-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500 hover:bg-white/10 sm:even:border-l"
			>
				<div>
					<span
						class="inline-flex rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-3 ring-1 ring-indigo-500/30"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							data-slot="icon"
							aria-hidden="true"
							class="size-6 text-indigo-400"
						>
							{@html getIconSvg(advantage.icon)}
						</svg>
					</span>
				</div>
				<div class="mt-8">
					<h3 class="text-base font-semibold text-white">
						<a href={advantage.href} class="focus:outline-hidden">
							<span aria-hidden="true" class="absolute inset-0"></span>
							{advantage.title}
						</a>
					</h3>
					<p class="mt-2 text-sm text-gray-300">
						{advantage.description}
					</p>
				</div>
				<span
					aria-hidden="true"
					class="pointer-events-none absolute right-6 top-6 text-gray-600 transition-colors duration-300 group-hover:text-indigo-400"
				>
					<svg viewBox="0 0 24 24" fill="currentColor" class="size-6">
						<path
							d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z"
						/>
					</svg>
				</span>
			</div>
		{/each}
	</div>
</div>

<!-- <div class="bg-white pt-24 sm:pt-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl lg:mx-0">
			<h2 class="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
				Простые 4 шага
			</h2>
			<p class="mt-6 text-lg/8 text-gray-600">
				Пройдите простую регистрацию и начинайте получать бонусы за приведённых потенциальных
				клиентов.
			</p>
		</div>
	</div>
</div>
<div class="mx-auto mt-12 max-w-7xl lg:border-b lg:border-t lg:border-gray-200">
	<nav aria-label="Progress" class="mx-auto px-4 sm:px-6 lg:px-8">
		<ol
			role="list"
			class="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-200"
		>
			<li class="relative overflow-hidden lg:flex-1">
				<div class="overflow-hidden rounded-t-md border border-b-0 border-gray-200 lg:border-0">
					<a href="/registration" class="group block">
						<span
							aria-hidden="true"
							class="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-indigo-600 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
						></span>
						<span class="flex items-start px-6 py-5 text-sm font-medium">
							<span class="shrink-0">
								<span
									class="flex size-10 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-700"
								>
									<span class="text-lg font-bold text-white">1</span>
								</span>
							</span>
							<span class="ml-4 mt-0.5 flex min-w-0 flex-col">
								<span class="text-sm font-medium group-hover:text-indigo-600"
									>Зарегистрируйтесь</span
								>
								<span class="mt-1 text-sm font-medium text-gray-500"
									>Пройдите простую регистрацию на нашей платформе</span
								>
							</span>
						</span>
					</a>
				</div>
			</li>
			<li class="relative overflow-hidden lg:flex-1">
				<div class="overflow-hidden border border-gray-200 lg:border-0">
					<div class="group" aria-current="step">
						<span
							aria-hidden="true"
							class="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-indigo-600 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
						></span>
						<span class="flex items-start px-6 py-5 text-sm font-medium lg:pl-9">
							<span class="shrink-0">
								<span
									class="flex size-10 items-center justify-center rounded-full border-2 border-indigo-500 group-hover:border-indigo-600"
								>
									<span class="text-gray-500 group-hover:text-indigo-600">2</span>
								</span>
							</span>
							<span class="ml-4 mt-0.5 flex min-w-0 flex-col">
								<span class="text-sm font-medium group-hover:text-indigo-600"
									>Получите инструкцию</span
								>
								<span class="mt-1 text-sm font-medium text-gray-500"
									>После регистрации вам придёт инструкция на вашу почту.</span
								>
							</span>
						</span>
					</div>
					<div aria-hidden="true" class="absolute inset-0 left-0 top-0 hidden w-3 lg:block">
						<svg
							viewBox="0 0 12 82"
							fill="none"
							preserveAspectRatio="none"
							class="size-full text-indigo-500"
						>
							<path
								d="M0.5 0V31L10.5 41L0.5 51V82"
								stroke="currentcolor"
								vector-effect="non-scaling-stroke"
							/>
						</svg>
					</div>
				</div>
			</li>
			<li class="relative overflow-hidden lg:flex-1">
				<div class="overflow-hidden rounded-b-md border border-t-0 border-gray-200 lg:border-0">
					<div class="group">
						<span
							aria-hidden="true"
							class="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-indigo-600 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
						></span>
						<span class="flex items-start px-6 py-5 text-sm font-medium lg:pl-9">
							<span class="shrink-0">
								<span
									class="flex size-10 items-center justify-center rounded-full border-2 border-indigo-500 group-hover:border-indigo-600"
								>
									<span class="text-gray-500 group-hover:text-indigo-600">3</span>
								</span>
							</span>
							<span class="ml-4 mt-0.5 flex min-w-0 flex-col">
								<span class="text-sm font-medium group-hover:text-indigo-600">Рекомендуйте</span>
								<span class="mt-1 text-sm font-medium text-gray-500"
									>Отправляйте контакты заинтересованных клиентов.</span
								>
							</span>
						</span>
					</div>
					<div aria-hidden="true" class="absolute inset-0 left-0 top-0 hidden w-3 lg:block">
						<svg
							viewBox="0 0 12 82"
							fill="none"
							preserveAspectRatio="none"
							class="size-full text-indigo-500"
						>
							<path
								d="M0.5 0V31L10.5 41L0.5 51V82"
								stroke="currentcolor"
								vector-effect="non-scaling-stroke"
							/>
						</svg>
					</div>
				</div>
			</li>
			<li class="relative overflow-hidden lg:flex-1">
				<div class="overflow-hidden rounded-b-md border border-t-0 border-gray-200 lg:border-0">
					<div class="group">
						<span
							aria-hidden="true"
							class="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-indigo-600 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
						></span>
						<span class="flex items-start px-6 py-5 text-sm font-medium lg:pl-9">
							<span class="shrink-0">
								<span
									class="flex size-10 items-center justify-center rounded-full border-2 border-indigo-500 group-hover:border-indigo-600"
								>
									<span class="text-gray-500 group-hover:text-indigo-600">4</span>
								</span>
							</span>
							<span class="ml-4 mt-0.5 flex min-w-0 flex-col">
								<span class="text-sm font-medium group-hover:text-indigo-600">Получайте бонусы</span
								>
								<span class="mt-1 text-sm font-medium text-gray-500"
									>После закрытия сделки получайте положенные вам бонусы.</span
								>
							</span>
						</span>
					</div>
					<div aria-hidden="true" class="absolute inset-0 left-0 top-0 hidden w-3 lg:block">
						<svg
							viewBox="0 0 12 82"
							fill="none"
							preserveAspectRatio="none"
							class="size-full text-indigo-500"
						>
							<path
								d="M0.5 0V31L10.5 41L0.5 51V82"
								stroke="currentcolor"
								vector-effect="non-scaling-stroke"
							/>
						</svg>
					</div>
				</div>
			</li>
		</ol>
	</nav>
</div> -->
