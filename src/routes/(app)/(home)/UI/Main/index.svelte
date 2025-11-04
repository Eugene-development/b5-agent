<script>
	import bonusImage from './img/Gemini_Generated_Image_iowmgviowmgviowm.png';
	import { onMount } from 'svelte';
	import { scrollAnimation, animations } from '$lib/actions/scrollAnimation.js';

	let imageLoaded = false;

	onMount(() => {
		const img = new Image();
		img.src = bonusImage;
		img.onload = () => {
			imageLoaded = true;
		};
	});
</script>

<div
	class=" relative isolate overflow-x-hidden overflow-y-visible bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950"
>
	<div class=" grid grid-cols-1 lg:grid-cols-2">
		<div class="relative flex px-6 py-16 sm:py-20 lg:static lg:px-8 lg:pt-32">
			<div class="mx-auto w-full max-w-xl lg:max-w-lg">
				<div
					class="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden ring-1 ring-white/5 lg:w-1/2"
				>
					<svg
						class="absolute inset-0 size-full stroke-indigo-500/30 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
						aria-hidden="true"
					>
						<defs>
							<pattern
								id="54f88622-e7f8-4f1d-aaf9-c2f5e46dd1f2"
								width="200"
								height="200"
								x="100%"
								y="-1"
								patternUnits="userSpaceOnUse"
							>
								<path d="M130 200V.5M.5 .5H200" fill="none" />
							</pattern>
						</defs>
						<svg x="100%" y="-1" class="overflow-visible fill-indigo-900/20">
							<path d="M-470.5 0h201v201h-201Z" stroke-width="0" />
						</svg>
						<rect
							width="100%"
							height="100%"
							stroke-width="0"
							fill="url(#54f88622-e7f8-4f1d-aaf9-c2f5e46dd1f2)"
						/>
					</svg>
					<div
						class="absolute -left-56 top-[calc(100%-13rem)] transform-gpu blur-3xl lg:left-[max(-14rem,calc(100%-59rem))] lg:top-[calc(50%-7rem)]"
						aria-hidden="true"
					>
						<div
							class="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 opacity-30"
							style="clip-path: polygon(74.1% 56.1%, 100% 38.6%, 97.5% 73.3%, 85.5% 100%, 80.7% 98.2%, 72.5% 67.7%, 60.2% 37.8%, 52.4% 32.2%, 47.5% 41.9%, 45.2% 65.8%, 27.5% 23.5%, 0.1% 35.4%, 17.9% 0.1%, 27.6% 23.5%, 76.1% 2.6%, 74.1% 56.1%)"
						></div>
					</div>
				</div>

				<div class="inline-block">
					<h2
						class="bg-gradient-to-r from-white via-indigo-200 to-cyan-400 bg-clip-text text-6xl font-black tracking-tight text-transparent sm:text-7xl lg:text-8xl"
					>
						BONUS 5
					</h2>
					<!-- <div
						class="mt-2 h-1.5 w-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"
					></div> -->
				</div>

				<p class="mt-8 text-xl font-medium leading-relaxed text-gray-100">
					Бонус 5 — это сервис тайного маркетинга, который позволяет получать до <span
						class="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-2xl font-black text-transparent"
					>
						5%
					</span>
					с рекомендаций<sup class="text-cyan-400">*</sup>
				</p>

				<dl class="mt-12 space-y-4">
					<div
						class="group flex gap-x-4 rounded-xl bg-white/5 p-4 backdrop-blur-sm transition-all hover:scale-[1.02] hover:bg-white/10"
						use:scrollAnimation={{ animation: animations.slideInLeft, delay: 600 }}
					>
						<dt class="flex-none">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600"
							>
								<svg
									class="h-6 w-6 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2.5"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
						</dt>
						<dd class="flex flex-col justify-center">
							<strong class="text-lg font-bold text-white">Честно</strong>
							<span class="text-sm text-gray-400">Выплата бонуса после закрытия сделки</span>
						</dd>
					</div>

					<div
						class="group flex gap-x-4 rounded-xl bg-white/5 p-4 backdrop-blur-sm transition-all hover:scale-[1.02] hover:bg-white/10"
						use:scrollAnimation={{ animation: animations.slideInLeft, delay: 700 }}
					>
						<dt class="flex-none">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600"
							>
								<svg
									class="h-6 w-6 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2.5"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
						</dt>
						<dd class="flex flex-col justify-center">
							<strong class="text-lg font-bold text-white">Выгодно</strong>
							<span class="text-sm text-gray-400">Ваш хороший дополнительный доход</span>
						</dd>
					</div>

					<div
						class="group flex gap-x-4 rounded-xl bg-white/5 p-4 backdrop-blur-sm transition-all hover:scale-[1.02] hover:bg-white/10"
						use:scrollAnimation={{ animation: animations.slideInLeft, delay: 800 }}
					>
						<dt class="flex-none">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600"
							>
								<svg
									class="h-6 w-6 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2.5"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
						</dt>
						<dd class="flex flex-col justify-center">
							<strong class="text-lg font-bold text-white">Секретно</strong>
							<span class="text-sm text-gray-400">Конфиденциальность ваших данных</span>
						</dd>
					</div>

					<div
						class="group flex gap-x-4 rounded-xl bg-white/5 p-4 backdrop-blur-sm transition-all hover:scale-[1.02] hover:bg-white/10"
						use:scrollAnimation={{ animation: animations.slideInLeft, delay: 900 }}
					>
						<dt class="flex-none">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600"
							>
								<svg
									class="h-6 w-6 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2.5"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
						</dt>
						<dd class="flex flex-col justify-center">
							<strong class="text-lg font-bold text-white">Надёжно</strong>
							<span class="text-sm text-gray-400">Проверенные поставщики и подрядчики</span>
						</dd>
					</div>
				</dl>

				<div class="mt-8">
					<p class="text-xs text-gray-500">
						<span class="text-cyan-400">*</span> передача данных только с согласия клиента
					</p>
				</div>
			</div>
		</div>

		<div class="relative hidden justify-center px-6 pb-12 pt-20 lg:flex lg:px-8 lg:pt-32">
			<div class="relative mx-auto flex w-full max-w-xl items-center justify-center lg:max-w-2xl">
				<div
					class="absolute -inset-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 opacity-20 blur-2xl"
				></div>
				<img
					src={bonusImage}
					alt="Бонусная программа"
					class="relative h-auto w-full rounded-2xl shadow-2xl ring-1 ring-white/10 {imageLoaded
						? ''
						: 'opacity-0'}"
				/>
			</div>
		</div>
	</div>
</div>
