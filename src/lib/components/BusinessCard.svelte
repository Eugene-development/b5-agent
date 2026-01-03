<script>
	import html2canvas from 'html2canvas';

	let { qrCodeUrl } = $props();

	let cardElement;

	async function downloadCard() {
		if (!cardElement) return;
		try {
			console.log('Starting card generation...');
			const canvas = await html2canvas(cardElement, {
				scale: 2, // Slightly reduced scale for stability
				useCORS: true,
				logging: true, // Enable logging to see issues in console
				backgroundColor: '#111827', // URL safe hex color (gray-900)
				allowTaint: true,
				onclone: (clonedDoc) => {
					// Ensure tailwind styles are computed or handle specific issues if needed
					// For now, this hook is available if we need to modify the cloned DOM
					const element = clonedDoc.querySelector('[data-card-element]');
					if (element) {
						// Force specific styles if broken
						element.style.backgroundColor = '#111827'; 
					}
				}
			});
			const link = document.createElement('a');
			link.download = 'rubonus-business-card.png';
			link.href = canvas.toDataURL('image/png');
			document.body.appendChild(link); // Append to body to ensure it works in some browsers
			link.click();
			document.body.removeChild(link);
		} catch (err) {
			console.error('Failed to download card:', err);
			alert('Не удалось скачать визитку. Пожалуйста, попробуйте позже или сделайте скриншот.');
		}
	}
</script>

<div class="flex flex-col items-center gap-6 py-8">
	<!-- Card Container (Visual) -->
	<div
		bind:this={cardElement}
		data-card-element
		class="relative flex aspect-[5/9] w-[320px] flex-col items-center justify-between overflow-hidden p-8 shadow-2xl"
		style="
			background-color: #111827;
			background-image: 
				radial-gradient(circle at 0% 0%, rgba(6, 182, 212, 0.25) 0%, transparent 45%),
				radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.25) 0%, transparent 45%);
			box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
		"
	>
		<!-- Branding -->
		<div class="z-10 mt-8 text-center">
			<h2 class="font-mono text-4xl font-bold tracking-widest" style="color: #ffffff;">
				RUBONUS<span class="tracking-wider text-3xl" style="color: #22d3ee;">.pro</span>
			</h2>
		</div>

		<!-- QR Code -->
		<div class="z-10 flex flex-col items-center gap-4">
			<div class="relative rounded-2xl p-3 shadow-xl" style="background-color: #ffffff;">
				{#if qrCodeUrl}
					<img src={qrCodeUrl} alt="QR Code" class="h-48 w-48 object-contain" />
				{:else}
					<div class="h-48 w-48 animate-pulse rounded" style="background-color: #e5e7eb;"></div>
				{/if}
			</div>
		</div>

		<!-- Tagline -->
		<div class="z-10 mb-8 text-center">
			<p class="text-xl font-medium leading-relaxed" style="color: #ffffff;">
				Зарабатывай<br />на рекомендациях
			</p>
			<p class="mt-2 text-xs opacity-80" style="color: #9ca3af;">Сканируй, чтобы начать</p>
		</div>

        <!-- Border/Texture overlay for premium feel -->
        <div class="pointer-events-none absolute inset-0" style="box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);"></div>
	</div>

	<!-- Download Action -->
	<button
		onclick={downloadCard}
		class="group inline-flex items-center gap-2 rounded-xl bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:scale-105 active:scale-95"
	>
		<svg 
            class="h-5 w-5 text-gray-400 transition-colors group-hover:text-cyan-400" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
        >
			<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
		</svg>
		<span>Скачать визитку</span>
	</button>
</div>
