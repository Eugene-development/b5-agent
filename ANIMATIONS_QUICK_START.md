# Быстрый старт: Анимации при скролле

## Что было добавлено

✨ Анимации при скролле для всех компонентов главной страницы с использованием:

- Intersection Observer API
- Библиотека tailwindcss-animated
- Svelte Actions

## Установка (уже выполнено)

Библиотека уже установлена и настроена:

- ✅ `tailwindcss-animated@2.0.0` установлен в package.json
- ✅ Плагин подключен в `src/app.css`
- ✅ Action создан в `src/lib/actions/scrollAnimation.js`

## Как использовать

### 1. Импортируйте в компонент

```svelte
<script>
	import { scrollAnimation, animations } from '$lib/actions/scrollAnimation.js';
</script>
```

### 2. Примените к элементу

```svelte
<div use:scrollAnimation={{ animation: animations.fadeIn }}>Ваш контент</div>
```

### 3. Настройте параметры (опционально)

```svelte
<div
	use:scrollAnimation={{
		animation: animations.slideInUp,
		delay: 300, // Задержка в мс
		threshold: 0.2, // Порог видимости (0-1)
		once: true // Анимировать только один раз
	}}
>
	Ваш контент
</div>
```

## Доступные анимации

```javascript
animations.fadeIn; // Плавное появление
animations.fadeInUp; // Появление снизу
animations.fadeInDown; // Появление сверху
animations.fadeInLeft; // Появление слева
animations.fadeInRight; // Появление справа
animations.slideInUp; // Скольжение снизу
animations.slideInDown; // Скольжение сверху
animations.slideInLeft; // Скольжение слева
animations.slideInRight; // Скольжение справа
animations.zoomIn; // Увеличение
animations.zoomInUp; // Увеличение снизу
animations.bounce; // Подпрыгивание
animations.spin; // Вращение
```

## Примеры из проекта

### Заголовок с появлением сверху

```svelte
<h1 use:scrollAnimation={{ animation: animations.fadeInDown, delay: 100 }}>Заголовок</h1>
```

### Карточки с динамической задержкой

```svelte
{#each items as item, index}
	<div
		use:scrollAnimation={{
			animation: animations.slideInUp,
			delay: 100 + index * 100
		}}
	>
		{item.content}
	</div>
{/each}
```

### Чередующиеся анимации

```svelte
{#each items as item, index}
	<div
		use:scrollAnimation={{
			animation: index % 2 === 0 ? animations.fadeInLeft : animations.fadeInRight
		}}
	>
		{item.content}
	</div>
{/each}
```

## Где применено

- ✅ **Main** - Hero секция с заголовком, описанием, карточками и изображением
- ✅ **Users** - Секция "Для кого сервис" с 4 карточками
- ✅ **Advantages** - Секция преимуществ с 6 карточками
- ✅ **Questions** - FAQ секция с вопросами
- ✅ **CTA** - Призыв к действию

## Тестирование

1. Запустите проект:

```bash
npm run dev
```

2. Откройте главную страницу: `http://localhost:5173`

3. Скроллируйте страницу вниз - элементы будут появляться с анимациями

4. Обновите страницу и повторите для проверки повторяемости

## Настройка

Для изменения анимаций отредактируйте параметры в файлах компонентов:

- `src/routes/(app)/(home)/UI/Main/index.svelte`
- `src/routes/(app)/(home)/UI/Users/index.svelte`
- `src/routes/(app)/(home)/UI/Advantages/index.svelte`
- `src/routes/(app)/(home)/UI/Questions/index.svelte`
- `src/routes/(app)/(home)/UI/CTA/index.svelte`

## Производительность

- ⚡ Высокая производительность благодаря Intersection Observer API
- ⚡ CSS-анимации оптимизированы браузером
- ⚡ Автоматическая очистка ресурсов при размонтировании

## Поддержка браузеров

✅ Chrome 51+
✅ Firefox 55+
✅ Safari 12.1+
✅ Edge 15+

## Полная документация

Подробная документация доступна в файле [SCROLL_ANIMATIONS.md](./SCROLL_ANIMATIONS.md)

## Проблемы?

Если анимации не работают:

1. Проверьте консоль браузера на ошибки
2. Убедитесь, что элемент видим на странице
3. Попробуйте увеличить `threshold` или уменьшить `delay`
4. Проверьте, что `tailwindcss-animated` правильно установлен
