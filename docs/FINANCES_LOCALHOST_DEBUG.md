# Проблема с отображением данных на странице Финансы (localhost)

## Описание проблемы

На странице Финансы в b5-agent на localhost не отображаются данные по бонусам, хотя на странице Проекты данные есть. На продакшене (сервере) данные отображаются корректно.

## Диагностика

### 1. Проверка токена в localStorage

Открой консоль браузера (F12) и выполни:

```javascript
// Проверка наличия токена
console.log('Token:', localStorage.getItem('b5_auth_token'));

// Проверка данных пользователя
console.log('User:', localStorage.getItem('b5_agent_user_data'));
```

**Ожидаемый результат:** Должен быть JWT токен и данные пользователя.

### 2. Проверка сетевых запросов

1. Открой DevTools → Network (Сеть)
2. Обнови страницу Финансы
3. Найди запросы к `/graphql`
4. Проверь:
   - Есть ли заголовок `Authorization: Bearer <token>`
   - Какой статус ответа (200, 401, 500?)
   - Что в теле ответа

### 3. Проверка консоли

Ищи в консоли сообщения:
- `🔄 Finances: Loading data on client (no httpOnly cookie)`
- `✅ Finances: Client-side data loaded`
- `❌ Failed to load finances data:`

## Возможные причины

### Причина 1: Токен не сохраняется в localStorage

**Проверка:**
```javascript
localStorage.getItem('b5_auth_token')
```

**Решение:** Перелогиниться. При логине токен должен сохраниться в localStorage через `setAuthToken()`.

### Причина 2: Неправильный URL API

**Проверка:**
```javascript
console.log('API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('AUTH_API_URL:', import.meta.env.VITE_AUTH_API_URL);
```

**Ожидаемые значения (из .env.development):**
- `VITE_API_BASE_URL=http://localhost:8000`
- `VITE_AUTH_API_URL=http://localhost:8001`

**Решение:** Проверь файл `b5-agent/.env.development` и перезапусти dev-сервер.

### Причина 3: API сервер не запущен

**Проверка:**
```bash
# Проверь, запущен ли b5-api-2 на порту 8000
curl http://localhost:8000/graphql

# Проверь, запущен ли b5-auth-2 на порту 8001
curl http://localhost:8001/api/user
```

**Решение:** Запусти API серверы:
```bash
# В корне проекта
./bp-api-2.sh
./bp-auth-2.sh
```

### Причина 4: CORS проблемы

**Проверка:** В консоли браузера ищи ошибки типа:
```
Access to fetch at 'http://localhost:8000/graphql' from origin 'http://localhost:5040' has been blocked by CORS policy
```

**Решение:** Проверь настройки CORS в b5-api-2 и b5-auth-2.

### Причина 5: Токен истек или невалиден

**Проверка:** Статус ответа 401 Unauthorized

**Решение:** Перелогиниться.

## Сравнение с работающей страницей Проекты

### Страница Проекты работает потому что:

1. **SSR загрузка:** Использует `+page.server.js` с токеном из httpOnly cookie
2. **Fallback на клиент:** Если нет cookie, загружает через `loadProjectsOnClient()`
3. **Правильный user_id:** Берет из `getUserData()` → localStorage

### Страница Финансы должна работать так же:

1. **SSR загрузка:** Использует `+page.server.js` с токеном из httpOnly cookie ✅
2. **Fallback на клиент:** Использует `loadAllDataOnClient()` ✅
3. **НО:** Не требует user_id, запросы идут от имени текущего пользователя

## Пошаговая диагностика

### Шаг 1: Проверь токен

```javascript
// В консоли браузера
const token = localStorage.getItem('b5_auth_token');
console.log('Token exists:', !!token);
console.log('Token length:', token?.length);
console.log('Token preview:', token?.substring(0, 50));
```

### Шаг 2: Проверь API URL

```javascript
// В консоли браузера
console.log('API Config:', {
  API_BASE_URL: 'http://localhost:8000',
  AUTH_API_URL: 'http://localhost:8001',
  FRONTEND_URL: 'http://localhost:5040'
});
```

### Шаг 3: Проверь запрос вручную

```javascript
// В консоли браузера
const token = localStorage.getItem('b5_auth_token');

fetch('http://localhost:8000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    query: `
      query GetAgentBonuses {
        agentBonuses(filters: null) {
          id
          commission_amount
          status {
            code
            name
          }
        }
      }
    `
  })
})
.then(r => r.json())
.then(data => console.log('Bonuses:', data))
.catch(err => console.error('Error:', err));
```

### Шаг 4: Проверь логи сервера

Смотри логи b5-api-2:
```bash
# Если запущен через Docker
docker logs b5-api-2

# Если запущен локально
# Смотри вывод в терминале где запущен ./bp-api-2.sh
```

## Быстрое решение

1. **Перелогинься** - это обновит токен в localStorage
2. **Обнови страницу** Финансы
3. **Проверь консоль** на наличие ошибок

## Если ничего не помогло

Добавь дополнительное логирование в `b5-agent/src/routes/(protected)/finances/+page.svelte`:

```javascript
// В функции loadAllDataOnClient() после строки 92
async function loadAllDataOnClient() {
	console.log('🔄 Finances: Loading data on client (no httpOnly cookie)');
	
	// ДОБАВЬ ЭТО:
	const token = localStorage.getItem('b5_auth_token');
	console.log('🔍 Debug:', {
		hasToken: !!token,
		tokenLength: token?.length,
		tokenPreview: token?.substring(0, 30),
		apiBaseUrl: 'http://localhost:8000'
	});
	
	loading = true;
	// ... остальной код
}
```

Затем обнови страницу и посмотри что выводится в консоль.
