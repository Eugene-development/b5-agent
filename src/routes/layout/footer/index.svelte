<script>
	const currentYear = new Date().getFullYear();
</script>

<footer class="border-t border-slate-800/50 bg-gray-950">
	<div class="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
			<!-- О компании -->
			<div>
				<h3
					class="mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-xl font-bold tracking-tight text-transparent"
				>
					BONUS5
				</h3>
				<p class="text-sm leading-6 text-gray-400">
					Партнерская программа для заработка на рекомендациях.
				</p>
			</div>

			<!-- Навигация -->
			<div>
				<h4 class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">Навигация</h4>
				<ul class="space-y-3">
					<li>
						<a
							href="/about"
							class="text-sm text-gray-400 transition-colors duration-200 hover:text-purple-400"
						>
							О проекте
						</a>
					</li>
					<li>
						<a
							href="/payments"
							class="text-sm text-gray-400 transition-colors duration-200 hover:text-emerald-400"
						>
							Выплаты
						</a>
					</li>
					<li>
						<a
							href="/promotions"
							class="text-sm text-gray-400 transition-colors duration-200 hover:text-amber-400"
						>
							Акции
						</a>
					</li>
				</ul>
			</div>

			<!-- Партнерство -->
			<div>
				<h4 class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
					Сотрудничество
				</h4>
				<ul class="space-y-3">
					<li>
						<a
							href="/partnership"
							class="text-sm text-gray-400 transition-colors duration-200 hover:text-cyan-400"
						>
							Партнёрство
						</a>
					</li>
					<li>
						<a
							href="https://rubonus.info"
							target="_blank"
							rel="noopener noreferrer"
							class="text-sm text-gray-400 transition-colors duration-200 hover:text-indigo-400"
						>
							CSRM система
						</a>
					</li>
					<li>
						<a
							href="/vacancies"
							class="text-sm text-gray-400 transition-colors duration-200 hover:text-purple-400"
						>
							Вакансии
						</a>
					</li>
				</ul>
			</div>

			<!-- Кабинет -->
			<div>
				<h4 class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">Кабинет</h4>
				<ul class="space-y-3">
					<li>
						<a
							href="/login"
							class="text-sm text-gray-400 transition-colors duration-200 hover:text-blue-400"
						>
							Вход
						</a>
					</li>
					<li>
						<a
							href="/register"
							class="text-sm text-gray-400 transition-colors duration-200 hover:text-green-400"
						>
							Регистрация
						</a>
					</li>
				</ul>
			</div>

			<!-- Контакты и документы -->
			<div>
				<h4 class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">Контакты</h4>
				<ul class="space-y-3">
					<li>
						<a
							href="mailto:info@bonus5.ru"
							class="flex items-center gap-2 text-sm text-gray-400 transition-colors duration-200 hover:text-indigo-400"
						>
							<svg
								class="size-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
								/>
							</svg>
							info@bonus5.ru
						</a>
					</li>
				</ul>
			</div>
		</div>

		<!-- Разделитель -->
		<div class="mt-12 border-t border-slate-800/50 pt-8">
			<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
				<p class="text-sm text-gray-400">© {currentYear} BONUS5. Все права защищены.</p>
				<div class="flex gap-6">
					<a
						href="/privacy-policy"
						class="text-sm text-gray-400 transition-colors duration-200 hover:text-indigo-400"
					>
						Политика конфиденциальности
					</a>
				</div>
			</div>
		</div>
	</div>
</footer>
