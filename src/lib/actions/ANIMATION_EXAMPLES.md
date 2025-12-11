# Примеры использования scrollAnimation

## Базовые примеры

### Простое появление

```svelte
<script>
	import { scrollAnimation, animations } from '$lib/actions/scrollAnimation.js';
</script>

<div use:scrollAnimation={{ animation: animations.fadeIn }}>Простое появление</div>
```

### С задержкой

```svelte
<div use:scrollAnimation={{ animation: animations.fadeIn, delay: 500 }}>
	Появится через 500мс после входа в viewport
</div>
```

### Повторяющаяся анимация

```svelte
<div
	use:scrollAnimation={{
		animation: animations.fadeIn,
		once: false
	}}
>
	Анимация будет повторяться при каждом скролле
</div>
```

### Настройка порога видимости

```svelte
<div
	use:scrollAnimation={{
		animation: animations.fadeIn,
		threshold: 0.5 // Элемент должен быть виден на 50%
	}}
>
	Появится когда виден наполовину
</div>
```

## Списки и массивы

### Последовательное появление элементов списка

```svelte
<script>
	const items = ['Пункт 1', 'Пункт 2', 'Пункт 3', 'Пункт 4'];
</script>

{#each items as item, index}
	<div
		use:scrollAnimation={{
			animation: animations.slideInUp,
			delay: index * 100 // Каждый следующий элемент появляется с задержкой 100мс
		}}
	>
		{item}
	</div>
{/each}
```

### Чередующиеся анимации

```svelte
{#each items as item, index}
	<div
		use:scrollAnimation={{
			animation: index % 2 === 0 ? animations.slideInLeft : animations.slideInRight,
			delay: 100 + index * 50
		}}
	>
		{item}
	</div>
{/each}
```

### Разные анимации для разных типов

```svelte
{#each items as item, index}
	<div
		use:scrollAnimation={{
			animation: item.type === 'important' ? animations.zoomIn : animations.fadeIn
		}}
	>
		{item.content}
	</div>
{/each}
```

## Карточки и компоненты

### Карточка с эффектом увеличения

```svelte
<div
	class="card"
	use:scrollAnimation={{
		animation: animations.zoomIn,
		delay: 200,
		threshold: 0.2
	}}
>
	<h3>Заголовок карточки</h3>
	<p>Содержимое карточки</p>
</div>
```

### Секция с заголовком и содержимым

```svelte
<section>
	<h2
		use:scrollAnimation={{
			animation: animations.fadeInDown,
			delay: 100
		}}
	>
		Заголовок секции
	</h2>

	<p
		use:scrollAnimation={{
			animation: animations.fadeInUp,
			delay: 300
		}}
	>
		Описание секции
	</p>

	<div
		use:scrollAnimation={{
			animation: animations.slideInUp,
			delay: 500
		}}
	>
		Контент секции
	</div>
</section>
```

### Сетка карточек

```svelte
<div class="grid grid-cols-3 gap-4">
	{#each cards as card, index}
		<div
			use:scrollAnimation={{
				animation: animations.fadeInUp,
				delay: 100 + index * 100,
				threshold: 0.1
			}}
		>
			<img src={card.image} alt={card.title} />
			<h3>{card.title}</h3>
			<p>{card.description}</p>
		</div>
	{/each}
</div>
```

## Продвинутые примеры

### Динамическая анимация на основе индекса

```svelte
<script>
	const getAnimation = (index) => {
		const animations = [
			animations.fadeInLeft,
			animations.fadeInRight,
			animations.slideInUp,
			animations.zoomIn
		];
		return animations[index % animations.length];
	};
</script>

{#each items as item, index}
	<div
		use:scrollAnimation={{
			animation: getAnimation(index),
			delay: 100 + index * 50
		}}
	>
		{item}
	</div>
{/each}
```

### Условная анимация

```svelte
<script>
	let enableAnimations = true;
</script>

{#if enableAnimations}
	<div use:scrollAnimation={{ animation: animations.fadeIn }}>С анимацией</div>
{:else}
	<div>Без анимации</div>
{/if}
```

### Комбинированные анимации

```svelte
<!-- Контейнер появляется первым -->
<div
	use:scrollAnimation={{
		animation: animations.fadeIn,
		delay: 100
	}}
>
	<!-- Затем появляется заголовок -->
	<h3
		use:scrollAnimation={{
			animation: animations.slideInDown,
			delay: 300
		}}
	>
		Заголовок
	</h3>

	<!-- И наконец содержимое -->
	<p
		use:scrollAnimation={{
			animation: animations.slideInUp,
			delay: 500
		}}
	>
		Содержимое
	</p>
</div>
```

### Кастомные CSS классы

```svelte
<div
	use:scrollAnimation={{
		animation: 'animate-fade-in animate-duration-1000 zoom-in-90 slide-in-from-bottom-8'
	}}
>
	Элемент с кастомной комбинацией анимаций
</div>
```

## Формы и интерактивные элементы

### Форма с последовательным появлением полей

```svelte
<form>
	<div
		use:scrollAnimation={{
			animation: animations.fadeInLeft,
			delay: 100
		}}
	>
		<input type="text" placeholder="Имя" />
	</div>

	<div
		use:scrollAnimation={{
			animation: animations.fadeInLeft,
			delay: 200
		}}
	>
		<input type="email" placeholder="Email" />
	</div>

	<div
		use:scrollAnimation={{
			animation: animations.fadeInLeft,
			delay: 300
		}}
	>
		<textarea placeholder="Сообщение"></textarea>
	</div>

	<div
		use:scrollAnimation={{
			animation: animations.zoomIn,
			delay: 400
		}}
	>
		<button type="submit">Отправить</button>
	</div>
</form>
```

### Кнопки Call-to-Action

```svelte
<div class="cta-section">
	<h2 use:scrollAnimation={{ animation: animations.fadeInDown }}>Готовы начать?</h2>

	<div
		use:scrollAnimation={{
			animation: animations.zoomIn,
			delay: 300
		}}
	>
		<button class="primary-button">Начать сейчас</button>
	</div>
</div>
```

## Изображения и медиа

### Галерея изображений

```svelte
<div class="gallery">
	{#each images as image, index}
		<img
			src={image.url}
			alt={image.alt}
			use:scrollAnimation={{
				animation: animations.zoomIn,
				delay: 100 + index * 100,
				threshold: 0.2
			}}
		/>
	{/each}
</div>
```

### Видео с анимацией

```svelte
<div
	use:scrollAnimation={{
		animation: animations.fadeIn,
		threshold: 0.5 // Начать анимацию когда видео наполовину в viewport
	}}
>
	<video autoplay muted loop>
		<source src="video.mp4" type="video/mp4" />
	</video>
</div>
```

## Типичные паттерны

### Hero секция

```svelte
<section class="hero">
	<h1
		use:scrollAnimation={{
			animation: animations.fadeInDown,
			delay: 200
		}}
	>
		Главный заголовок
	</h1>

	<p
		use:scrollAnimation={{
			animation: animations.fadeInUp,
			delay: 400
		}}
	>
		Подзаголовок
	</p>

	<div
		use:scrollAnimation={{
			animation: animations.zoomIn,
			delay: 600
		}}
	>
		<button>Призыв к действию</button>
	</div>
</section>
```

### Секция с особенностями (Features)

```svelte
<section class="features">
	<h2 use:scrollAnimation={{ animation: animations.fadeInDown }}>Наши особенности</h2>

	<div class="features-grid">
		{#each features as feature, index}
			<div
				use:scrollAnimation={{
					animation: index % 2 === 0 ? animations.slideInLeft : animations.slideInRight,
					delay: 100 + index * 150
				}}
			>
				<div class="icon">{feature.icon}</div>
				<h3>{feature.title}</h3>
				<p>{feature.description}</p>
			</div>
		{/each}
	</div>
</section>
```

### Блок с отзывами (Testimonials)

```svelte
<section class="testimonials">
	<h2 use:scrollAnimation={{ animation: animations.fadeIn }}>Что говорят наши клиенты</h2>

	<div class="testimonials-list">
		{#each testimonials as testimonial, index}
			<div
				use:scrollAnimation={{
					animation: animations.fadeInUp,
					delay: 200 + index * 200,
					threshold: 0.3
				}}
			>
				<p class="quote">"{testimonial.text}"</p>
				<p class="author">- {testimonial.author}</p>
			</div>
		{/each}
	</div>
</section>
```

## Советы по использованию

### Оптимальные задержки

- Для заголовков: 100-300мс
- Для текста: 300-500мс
- Для кнопок/CTA: 500-700мс
- Между элементами списка: 50-150мс

### Оптимальные пороги (threshold)

- Для крупных элементов: 0.1-0.2 (10-20%)
- Для средних элементов: 0.2-0.3 (20-30%)
- Для мелких элементов: 0.1 (10%)
- Для полного просмотра: 0.8-1.0 (80-100%)

### Выбор анимации

- Заголовки: `fadeInDown`, `fadeIn`
- Описания: `fadeInUp`, `fadeIn`
- Карточки слева: `slideInLeft`, `fadeInLeft`
- Карточки справа: `slideInRight`, `fadeInRight`
- Кнопки/CTA: `zoomIn`, `bounce`
- Изображения: `zoomIn`, `fadeIn`
- Списки: `slideInUp`, `fadeInUp`





