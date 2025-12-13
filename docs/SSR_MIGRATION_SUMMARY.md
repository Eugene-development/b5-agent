# Миграция на SSR для защищенных страниц

## Обзор

Исправлена проблема с загрузкой данных на продакшене для страниц `/finances` и `/dashboard`. Обе страницы теперь используют Server-Side Rendering (SSR) с JWT токенами из httpOnly cookies.

## Проблема

На продакшене страницы не загружали данные, хотя локально всё работало:

- **Причина**: Использование клиентского `+page.js` вместо серверного `+page.server.js`
- **Следствие**: При SSR на сервере нет доступа к `localStorage` с JWT токеном
- **Результат**: GraphQL запросы без авторизации возвращали пустые данные

## Решение

### 1. Страница `/finances`

#### Изменения:
- ✅ Создан `+page.server.js` с серверным load function
- ✅ Удален клиентский `+page.js`
- ✅ Обновлен `+page.svelte` для работы с серверными данными
- ✅ Добавлен fallback на клиентскую загрузку
- ✅ Создан `FinancesPageSkeleton.svelte` для улучшения UX

#### Файлы:
- `src/routes/(protected)/finances/+page.server.js` - новый
- `src/routes/(protected)/finances/+page.svelte` - обновлен
- `src/lib/components/finances/FinancesPageSkeleton.svelte` - новый
- `src/routes/(protected)/finances/+page.js` - удален

### 2. Страница `/dashboard`

#### Изменения:
- ✅ Создан `+page.server.js` с серверным load function
- ✅ Удален клиентский `+page.js`
- ✅ Обновлен `+page.svelte` для работы с серверными данными
- ✅ Добавлен fallback на клиентскую загрузку

#### Файлы:
- `src/routes/(protected)/dashboard/+page.server.js` - новый
- `src/routes/(protected)/dashboard/+page.svelte` - обновлен
- `src/routes/(protected)/dashboard/+page.js` - удален

## Архитектура решения

### Серверный load function

```javascript
export async function load({ locals, fetch, depends }) {
  depends('page-name');
  
  // Проверка httpOnly cookie
  if (!locals?.user || !locals?.token) {
    return {
      // Пустые данные + флаг для клиентской загрузки
      needsClientLoad: true
    };
  }
  
  // Загрузка с JWT из locals.token
  return loadData(locals.token, fetch);
}
```

### Компонент страницы

```javascript
// Реактивное обновление при изменении серверных данных
$effect(() => {
  if (data.stats) {
    stats = data.stats instanceof Promise 
      ? await data.stats 
      : data.stats;
  }
});

// Fallback на клиентскую загрузку
onMount(async () => {
  if (needsClientLoad) {
    await loadDataOnClient();
  }
});
```

## Преимущества

1. **SSR работает корректно** - данные рендерятся на сервере
2. **Быстрая загрузка** - пользователь видит контент сразу
3. **SEO-friendly** - контент доступен поисковикам
4. **Надежность** - fallback на клиентскую загрузку
5. **Единообразие** - все защищенные страницы работают одинаково
6. **Улучшенный UX** - skeleton loader показывает процесс загрузки

## Технические детали

### JWT токен из httpOnly cookie

Токен извлекается в `hooks.server.js`:

```javascript
export async function handle({ event, resolve }) {
  const token = event.cookies.get('b5_auth_token');
  
  if (token) {
    // Декодирование JWT
    const payload = decodeJWT(token);
    
    // Добавление в locals
    event.locals.user = payload;
    event.locals.token = token;
    event.locals.isAuthenticated = true;
  }
  
  return await resolve(event);
}
```

### GraphQL запросы на сервере

Используется утилита `makeServerGraphQLRequest`:

```javascript
import { makeServerGraphQLRequest } from '$lib/api/server.js';

const data = await makeServerGraphQLRequest(
  locals.token,  // JWT из httpOnly cookie
  QUERY,         // GraphQL запрос
  variables,     // Переменные
  fetch          // SvelteKit fetch
);
```

### Обработка ошибок

```javascript
try {
  return await loadData(token, fetch);
} catch (error) {
  const errorType = categorizeError(error);
  const userMessage = getUserFriendlyErrorMessage(errorType);
  
  return {
    data: [],
    error: userMessage,
    errorType,
    canRetry: errorType !== 'auth'
  };
}
```

## Логирование

### Успешная загрузка:
```
🚀 Finances SSR: Starting server-side load
👤 Finances SSR: Loading data for user: user@example.com
💰 Finances SSR: Starting data load
✅ Finances SSR: Loaded data in 234ms
```

### Нет httpOnly cookie:
```
⚠️ Finances SSR: No authentication token found in httpOnly cookie
🔄 Finances: Loading data on client (no httpOnly cookie)
```

### Ошибка:
```
❌ Finances SSR: Failed to load data: { error: "...", type: "network" }
```

## Проверка на продакшене

### 1. Проверка SSR
- Откройте страницу с полной перезагрузкой (Ctrl+Shift+R)
- В Network tab проверьте первый HTML запрос
- HTML должен содержать данные (не пустые таблицы)

### 2. Проверка httpOnly cookie
- DevTools → Application → Cookies
- Должна быть `b5_auth_token` с флагом HttpOnly

### 3. Проверка логов сервера
- Должны быть логи успешной загрузки
- Не должно быть ошибок 401 Unauthorized

## Связанные страницы

Страницы с аналогичной реализацией:

| Страница | SSR | httpOnly cookie | Fallback |
|----------|-----|-----------------|----------|
| `/projects` | ✅ | ✅ | ✅ |
| `/finances` | ✅ | ✅ | ✅ |
| `/dashboard` | ✅ | ✅ | ✅ |

## Документация

- `FINANCES_SSR_FIX.md` - детальное описание исправления для `/finances`
- `TESTING_FINANCES_SSR.md` - инструкция по тестированию
- `SSR_MIGRATION_SUMMARY.md` - этот файл

## Рекомендации для новых страниц

При создании новых защищенных страниц с данными:

1. **Используйте `+page.server.js`** вместо `+page.js`
2. **Получайте токен из `locals.token`** (httpOnly cookie)
3. **Используйте `makeServerGraphQLRequest`** для запросов
4. **Добавляйте fallback** на клиентскую загрузку
5. **Логируйте процесс** для отладки
6. **Обрабатывайте ошибки** с категоризацией
7. **Тестируйте на продакшене** с полной перезагрузкой

## Пример шаблона

```javascript
// +page.server.js
import { makeServerGraphQLRequest } from '$lib/api/server.js';

const QUERY = `query { ... }`;

async function loadData(token, fetch) {
  const data = await makeServerGraphQLRequest(token, QUERY, {}, fetch);
  return { data, error: null };
}

export async function load({ locals, fetch, depends }) {
  depends('page-name');
  
  if (!locals?.user || !locals?.token) {
    return { data: [], needsClientLoad: true };
  }
  
  return loadData(locals.token, fetch);
}
```

```svelte
<!-- +page.svelte -->
<script>
  import { onMount } from 'svelte';
  
  let { data } = $props();
  let localData = $state(data.data);
  
  $effect(() => {
    localData = data.data;
  });
  
  onMount(async () => {
    if (data.needsClientLoad) {
      await loadDataOnClient();
    }
  });
</script>

{#if !localData}
  <Skeleton />
{:else}
  <Content data={localData} />
{/if}
```

## Итог

Обе страницы теперь корректно работают на продакшене с SSR и httpOnly cookies. Данные загружаются на сервере при первом рендере, что обеспечивает быструю загрузку и SEO-оптимизацию.
