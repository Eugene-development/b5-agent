<script>
	import { Main, Users, Questions, Progress, CTA } from './UI';
</script>

<svelte:head>
	<title>Платформа Bonus5 – экономьте и зарабатывайте</title>
	<meta
		name="description"
		content="Платформа Bonus5 — сервис для экономии и заработка: получайте бонусы за покупки, участвуйте в акциях и используйте выгодные предложения от партнеров."
	/>
</svelte:head>

<Main />
<!-- <div class="flex justify-center py-8">
	<a 
		href="https://t.me/mytestbot_2025_v1_bot" 
		target="_blank" 
		class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
	> 
		Начать в Telegram 
	</a>
</div> -->
<Progress />
<Users />
<Questions />
<CTA />
