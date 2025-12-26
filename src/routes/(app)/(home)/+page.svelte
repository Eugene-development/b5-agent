<script>
	import { Main, Users, Questions, Advantages, CTA } from './UI';
</script>

<svelte:head>
	<title>RUBONUS – Регистрация заявок и заработок до 5% с каждой сделки</title>
	<meta name="description" content="Партнерская программа RUBONUS – зарабатывайте до 5% от суммы сделки. Без вложений, прозрачные условия, быстрые выплаты." />
	<meta name="keywords" content="партнерская программа, заработок на рекомендациях, дополнительный доход" />
</svelte:head>

<div class="overflow-x-hidden">
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
	<Users />
	<Advantages />

	<Questions />
	<CTA />
</div>
