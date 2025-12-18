# Исправление проблемы с httpOnly куками на продакшене

## Проблема

На продакшене (домен `bonus5.ru`) данные на странице финансов не отображались, хотя в dev режиме всё работало корректно. Проблема была связана с неправильной настройкой httpOnly куки для JWT токена.

## Причина

При установке httpOnly куки в `/api/auth/login-jwt/+server.js` не указывался параметр `domain`. Это приводило к тому, что:

1. Кука привязывалась только к текущему домену без возможности использования на поддоменах
2. При SSR запросах на сервере кука могла не передаваться корректно
3. На продакшене с доменом `bonus5.ru` кука не была доступна для всех частей приложения

## Решение

### 1. Исправлен `/api/auth/login-jwt/+server.js`

Добавлен параметр `domain` при установке куки:

```javascript
// Determine cookie domain based on environment
const isProduction = process.env.NODE_ENV === 'production';
const cookieDomain = isProduction ? '.bonus5.ru' : undefined;

cookies.set('b5_auth_token', cookieValue, {
	path: '/',
	httpOnly: true,
	secure: isProduction,
	sameSite: 'lax',
	domain: cookieDomain, // ← Добавлено
	maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24
});
```

**Важно:** Домен указывается с точкой в начале (`.bonus5.ru`), чтобы кука была доступна для всех поддоменов.

### 2. Исправлен `/api/auth/logout-jwt/+server.js`

Добавлен параметр `domain` при удалении куки:

```javascript
const isProduction = process.env.NODE_ENV === 'production';
const cookieDomain = isProduction ? '.bonus5.ru' : undefined;

cookies.delete('b5_auth_token', { 
	path: '/',
	domain: cookieDomain // ← Добавлено
});
```

## Как работает

### Development (localhost)
- `domain: undefined` - кука привязывается к `localhost`
- Работает для локальной разработки

### Production (bonus5.ru)
- `domain: '.bonus5.ru'` - кука доступна для:
  - `bonus5.ru`
  - `www.bonus5.ru`
  - Любых поддоменов `*.bonus5.ru`

## Проверка на продакшене

После деплоя проверьте:

1. **Логин:** Откройте DevTools → Application → Cookies и убедитесь, что кука `b5_auth_token` имеет:
   - Domain: `.bonus5.ru`
   - HttpOnly: ✓
   - Secure: ✓
   - SameSite: Lax

2. **SSR запросы:** На странице финансов данные должны загружаться через SSR (проверьте в Network tab, что данные приходят в HTML)

3. **Logout:** После выхода кука должна быть удалена

## Дополнительные настройки

Если используются другие домены или поддомены, обновите переменную `cookieDomain` в обоих файлах:

```javascript
const cookieDomain = isProduction ? '.ваш-домен.ru' : undefined;
```

## Связанные файлы

- `b5-agent/src/routes/api/auth/login-jwt/+server.js` - установка куки при логине
- `b5-agent/src/routes/api/auth/logout-jwt/+server.js` - удаление куки при logout
- `b5-agent/src/hooks.server.js` - чтение куки для SSR
- `b5-agent/src/routes/(protected)/finances/+page.server.js` - использование токена из куки для загрузки данных
