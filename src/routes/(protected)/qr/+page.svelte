<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import QRCode from 'qrcode';
	import { authState, checkAuth, getCurrentUserData } from '$lib/auth/auth.svelte.js';
	import BusinessCard from '$lib/components/BusinessCard.svelte';

	// State
	let qrCodeDataUrl = $state('');
	let isLoading = $state(true);
	let error = $state(null);
	let referralUrl = $state('');
	let copyState = $state({ show: false, message: '' });

	// Generate referral URL with UTM
	function generateReferralUrl(userKey) {
		const baseUrl = 'https://rubonus.pro';
		const utmParams = new URLSearchParams({
			utm_source: 'agent_referral',
			utm_medium: 'qr_code',
			utm_campaign: 'agent_program',
			ref: userKey
		});
		return `${baseUrl}/?${utmParams.toString()}`;
	}

	// Generate QR code
	async function generateQRCode(url) {
		try {
			const dataUrl = await QRCode.toDataURL(url, {
				width: 300,
				margin: 2,
				color: {
					dark: '#000000',
					light: '#ffffff'
				},
				errorCorrectionLevel: 'H'
			});
			return dataUrl;
		} catch (err) {
			console.error('QR generation error:', err);
			throw new Error('Не удалось сгенерировать QR-код');
		}
	}

	// Copy URL to clipboard
	async function copyUrl() {
		if (!referralUrl) return;

		try {
			await navigator.clipboard.writeText(referralUrl);
			copyState = { show: true, message: 'Ссылка скопирована!' };
			setTimeout(() => {
				copyState = { show: false, message: '' };
			}, 3000);
		} catch (err) {
			copyState = { show: true, message: 'Ошибка копирования' };
			setTimeout(() => {
				copyState = { show: false, message: '' };
			}, 3000);
		}
	}

	// Download QR code
	function downloadQR() {
		if (!qrCodeDataUrl) return;

		// Convert PNG data URL to JPEG
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext('2d');
			
			// Fill white background (JPEG doesn't support transparency)
			ctx.fillStyle = '#FFFFFF';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			// Draw QR code
			ctx.drawImage(img, 0, 0);
			
			// Convert to JPEG and download
			const link = document.createElement('a');
			link.download = 'rubonus-referral-qr.jpg';
			link.href = canvas.toDataURL('image/jpeg', 0.95);
			link.click();
		};
		img.src = qrCodeDataUrl;
	}

	onMount(async () => {
		// Check auth
		if (!authState.isAuthenticated) {
			const returnTo = $page.url.pathname;
			goto(`/login?returnTo=${encodeURIComponent(returnTo)}`);
			return;
		}

		const isAuth = await checkAuth();
		if (!isAuth) {
			const returnTo = $page.url.pathname;
			goto(`/login?returnTo=${encodeURIComponent(returnTo)}`);
			return;
		}

		// Get user data
		const user = getCurrentUserData();
		if (!user?.key) {
			error = 'Не удалось получить данные пользователя';
			isLoading = false;
			return;
		}

		try {
			// Generate referral URL and QR
			referralUrl = generateReferralUrl(user.key);
			qrCodeDataUrl = await generateQRCode(referralUrl);
		} catch (err) {
			error = err.message;
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>QR – RUBONUS</title>
	<meta name="description" content="Ваш персональный QR-код для привлечения новых агентов в реферальную программу RUBONUS" />
</svelte:head>


<!-- Toast notification -->
{#if copyState.show}
	<div class="fixed left-1/2 top-24 z-[9999] w-full max-w-md -translate-x-1/2 transform px-4">
		<div class="rounded-lg border border-green-500/30 bg-green-500/20 p-4 shadow-lg backdrop-blur-sm">
			<div class="flex items-center justify-center">
				<svg class="mr-2 h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
				<p class="text-sm font-medium text-green-300">{copyState.message}</p>
			</div>
		</div>
	</div>
{/if}

<div class="relative isolate bg-gray-950 py-16 sm:py-20">
	<div class="mx-auto max-w-3xl px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-12 text-center">
			<h1 class="text-4xl font-normal tracking-widest text-white sm:text-5xl">Ваш QR</h1>
			<!-- <p class="mt-4 text-lg text-gray-400">
				Привлекайте новых агентов и получайте 0,5% с их сделок
			</p> -->
		</div>

		<!-- Content -->
		{#if isLoading}
			<div class="flex min-h-[400px] items-center justify-center">
				<div class="text-center">
					<div class="inline-block h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-r-transparent"></div>
					<p class="mt-4 text-gray-400">Генерация QR-кода...</p>
				</div>
			</div>
		{:else if error}
			<div class="rounded-lg border border-red-500/30 bg-red-500/10 p-8 text-center">
				<svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
				</svg>
				<p class="mt-4 text-red-300">{error}</p>
			</div>
		{:else}
			<!-- QR Code Card -->
			<div class="rounded-2xl bg-white/5 p-8 backdrop-blur-sm">
				<!-- QR Code -->
				<div class="flex justify-center">
					<div class="rounded-xl bg-white p-4">
						<img src={qrCodeDataUrl} alt="Реферальный QR-код" class="h-[300px] w-[300px]" />
					</div>
				</div>
				<!-- Actions -->
				<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
					<button
						onclick={downloadQR}
						class="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/20"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
						</svg>
						Скачать QR-код
					</button>
				</div>






				<!-- Business Card -->
				<div class="mt-12 flex justify-center border-t border-white/10 pt-12">
					<BusinessCard qrCodeUrl={qrCodeDataUrl} />
				</div>

				<!-- Referral URL -->
				<div class="mt-12">
					<label for="referral-url" class="mb-2 block text-sm font-medium text-gray-400">Ваша реферальная ссылка</label>
					<div class="flex gap-2">
						<input
							id="referral-url"
							type="text"
							readonly
							value={referralUrl}
							class="flex-1 rounded-lg bg-white/10 px-4 py-3 font-mono text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
						/>
						<button
							onclick={copyUrl}
							class="rounded-lg bg-cyan-600 px-2 py-3 text-sm font-medium text-white transition hover:bg-cyan-500"
						>
							Копировать
						</button>
					</div>
				</div>

				<!-- Info -->
				<div class="mt-12 rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-4">
					<h3 class="mb-2 font-medium text-cyan-300">Как это работает?</h3>
					<ul class="space-y-1 text-sm text-gray-400">
						<li>• Поделитесь QR-кодом, визиткой или ссылкой с потенциальными партнёрами</li>
						<li>• Когда они зарегистрируются по вашей ссылке, они станут вашими рефералами</li>
						<li>• Два года вы будете получать 0,5% от зарегистрированных рефералами проектов</li>
					</ul>
				</div>
			</div>
		{/if}
	</div>
</div>
