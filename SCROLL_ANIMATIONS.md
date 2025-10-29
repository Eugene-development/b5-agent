# Scroll Animations Documentation

## Обзор

В проекте b5-agent реализована система анимаций при скролле с использованием Intersection Observer API и библиотеки `tailwindcss-animated`. Анимации применены ко всем компонентам на главной странице для создания динамичного и привлекательного пользовательского интерфейса.

## Технологии

- **Intersection Observer API** - нативный браузерный API для отслеживания видимости элементов
- **tailwindcss-animated** - библиотека готовых CSS анимаций для Tailwind CSS
- **Svelte Actions** - механизм Svelte для добавления функциональности к DOM элементам

## Структура

### Основной файл: `src/lib/actions/scrollAnimation.js`

Содержит:

- `scrollAnimation` - Svelte action для применения анимаций
- `animations` - предустановленные анимации

### Параметры scrollAnimation

```javascript
{
  animation: string,     // CSS классы анимации
  threshold: number,     // Порог видимости (0-1), по умолчанию 0.1
  once: boolean,        // Анимировать только один раз, по умолчанию true
  delay: number         // Задержка перед анимацией в мс, по умолчанию 0
}
```

### Предустановленные анимации

- `fadeIn` - плавное появление
- `fadeInUp` - появление снизу с затуханием
- `fadeInDown` - появление сверху с затуханием
- `fadeInLeft` - появление слева с затуханием
- `fadeInRight` - появление справа с затуханием
- `slideInUp` - скольжение снизу
- `slideInDown` - скольжение сверху
- `slideInLeft` - скольжение слева
- `slideInRight` - скольжение справа
- `zoomIn` - увеличение с появлением
- `zoomInUp` - увеличение с появлением снизу
- `bounce` - эффект подпрыгивания
- `spin` - вращение с появлением

## Использование

### Базовый пример

```svelte
<script>
	import { scrollAnimation, animations } from '$lib/actions/scrollAnimation.js';
</script>

<div use:scrollAnimation={{ animation: animations.fadeIn }}>
	Этот элемент появится с анимацией fadeIn
</div>
```

### С параметрами

```svelte
<div
	use:scrollAnimation={{
		animation: animations.slideInLeft,
		delay: 500,
		threshold: 0.2,
		once: true
	}}
>
	Этот элемент появится с анимацией slideInLeft через 500мс
</div>
```

### Кастомные классы анимации

```svelte
<div
	use:scrollAnimation={{
		animation: 'animate-fade-in animate-duration-1000 zoom-in-95'
	}}
>
	Кастомная анимация
</div>
```

## Применение на главной странице

### Main компонент (Hero секция)

- **Заголовок**: `fadeInDown` с задержкой 200мс
- **Описание**: `fadeInUp` с задержкой 400мс
- **Карточки преимуществ**: `slideInLeft` с возрастающей задержкой (600-900мс)
- **Изображение**: `zoomInUp` с задержкой 400мс

### Users компонент (Для кого сервис)

- **Заголовок**: `fadeInDown` с задержкой 100мс
- **Описание**: `fadeInUp` с задержкой 300мс
- **Карточки**: чередующиеся `slideInLeft` и `slideInRight` (200-500мс)

### Advantages компонент (Преимущества)

- **Заголовок**: `fadeInDown` с задержкой 100мс
- **Описание**: `fadeInUp` с задержкой 300мс
- **Карточки**: чередующиеся `fadeInLeft` и `fadeInRight` (200-700мс)

### Questions компонент (FAQ)

- **Иконка**: `zoomIn` с задержкой 100мс
- **Заголовок**: `fadeInDown` с задержкой 200мс
- **Описание**: `fadeInUp` с задержкой 300мс
- **Вопросы**: `slideInUp` с возрастающей задержкой (100-700мс)
- **CTA блок**: `zoomIn` с задержкой 200мс

### CTA компонент (Призыв к действию)

- **Заголовок**: `fadeInDown` с задержкой 100мс
- **Описание**: `fadeInUp` с задержкой 300мс
- **Кнопка**: `zoomIn` с задержкой 500мс

## Производительность

- Intersection Observer API имеет высокую производительность
- Анимации используют CSS transitions, которые оптимизированы браузером
- Все observers корректно отключаются при размонтировании компонента
- Таймауты очищаются в методе `destroy`

## Настройка

### Изменение порога видимости

Для изменения порога видимости элемента (когда начинается анимация), измените параметр `threshold`:

```svelte
<div
	use:scrollAnimation={{
		animation: animations.fadeIn,
		threshold: 0.5 // Элемент должен быть виден на 50%
	}}
>
	Контент
</div>
```

### Повторяемые анимации

Для анимаций, которые должны повторяться при каждом входе в зону видимости:

```svelte
<div
	use:scrollAnimation={{
		animation: animations.fadeIn,
		once: false // Анимация будет повторяться
	}}
>
	Контент
</div>
```

### Добавление новых анимаций

Добавьте новую анимацию в объект `animations` в файле `scrollAnimation.js`:

```javascript
export const animations = {
	// ... существующие анимации
	myCustomAnimation: 'animate-fade-in animate-duration-500 slide-in-from-bottom-8'
};
```

## Браузерная совместимость

Intersection Observer API поддерживается во всех современных браузерах:

- Chrome 51+
- Firefox 55+
- Safari 12.1+
- Edge 15+

Для старых браузеров можно использовать полифилл: `intersection-observer`

## Отладка

Для отладки анимаций можно:

1. Проверить применение классов через DevTools
2. Изменить `threshold` для более раннего срабатывания
3. Увеличить `delay` для лучшей видимости эффекта
4. Установить `once: false` для проверки повторных анимаций

## Примеры кода

### Динамическая задержка для списка элементов

```svelte
{#each items as item, index}
	<div
		use:scrollAnimation={{
			animation: animations.fadeInUp,
			delay: 100 + index * 100
		}}
	>
		{item.content}
	</div>
{/each}
```

### Разные анимации для четных и нечетных элементов

```svelte
{#each items as item, index}
	<div
		use:scrollAnimation={{
			animation: index % 2 === 0 ? animations.slideInLeft : animations.slideInRight
		}}
	>
		{item.content}
	</div>
{/each}
```

## Дополнительные ресурсы

- [Intersection Observer API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [tailwindcss-animated GitHub](https://github.com/jamiebuilds/tailwindcss-animate)
- [Svelte Actions Documentation](https://svelte.dev/docs/svelte-action)

