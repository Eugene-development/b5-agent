# LogoutButton Component

Переиспользуемый компонент кнопки выхода из системы для защищённых страниц приложения.

## Использование

```svelte
<script>
	import LogoutButton from '$lib/components/LogoutButton.svelte';
</script>

<!-- Базовое использование -->
<LogoutButton />

<!-- С кастомными стилями -->
<LogoutButton class="custom-class" />

<!-- С разными вариантами оформления -->
<LogoutButton variant="outline" />
<LogoutButton variant="ghost" />

<!-- С разными размерами -->
<LogoutButton size="sm" />
<LogoutButton size="lg" />

<!-- С колбэками -->
<LogoutButton
	onLogoutStart={handleStart}
	onLogoutComplete={handleComplete}
	onLogoutError={handleError}
/>
```

## Props

| Prop               | Тип                                 | По умолчанию | Описание                                  |
| ------------------ | ----------------------------------- | ------------ | ----------------------------------------- |
| `variant`          | `'default' \| 'outline' \| 'ghost'` | `'default'`  | Вариант оформления кнопки                 |
| `size`             | `'sm' \| 'default' \| 'lg'`         | `'default'`  | Размер кнопки                             |
| `disabled`         | `boolean`                           | `false`      | Отключает кнопку                          |
| `class`            | `string`                            | `''`         | Дополнительные CSS классы                 |
| `onLogoutStart`    | `function`                          | `null`       | Колбэк, вызываемый перед началом выхода   |
| `onLogoutComplete` | `function`                          | `null`       | Колбэк, вызываемый после успешного выхода |
| `onLogoutError`    | `function`                          | `null`       | Колбэк, вызываемый при ошибке выхода      |

## Особенности

- Автоматическое управление состоянием загрузки
- Встроенная обработка ошибок с принудительным редиректом
- Адаптивный дизайн
- Поддержка нескольких вариантов оформления
- Иконка выхода из системы
- Анимация загрузки

## Интеграция

Компонент автоматически:

- Импортирует функцию `logout` из `$lib/auth/auth.svelte.js`
- Управляет состоянием загрузки
- Перенаправляет на главную страницу после выхода
- Обрабатывает ошибки и выполняет принудительный редирект при необходимости

## Замененные страницы

- ✅ `/dashboard` - основная кнопка выхода
- ✅ `/profile` - с обработкой ошибок через колбэк
- ✅ `/projects` - стандартная кнопка выхода
