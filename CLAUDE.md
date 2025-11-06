# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

B5 Agent - агентское приложение для партнерской программы Bonus5. Построено на SvelteKit 2 + Svelte 5 с использованием Tailwind CSS 4. Приложение взаимодействует с двумя backend сервисами:
- **b5-api-2**: GraphQL API сервер (порт 8000)
- **b5-auth-2**: сервер аутентификации (порт 8001)

## Commands

### Development
```bash
npm run dev              # Запуск dev сервера с development конфигурацией
npm run dev:prod         # Запуск dev сервера с production конфигурацией
npm run dev -- --open    # Запуск с автоматическим открытием браузера
```

### Build & Preview
```bash
npm run build            # Production сборка
npm run build:dev        # Development сборка для тестирования
npm run preview          # Предварительный просмотр production сборки
```

### Testing & Linting
```bash
npm test                 # Запуск тестов в watch режиме (vitest)
npm run test:run         # Запуск тестов один раз
npm run lint             # Проверка форматирования (prettier)
npm run format           # Форматирование кода (prettier)
```

## Architecture

### Routing Structure

SvelteKit использует file-based routing с route groups:

- `src/routes/(app)/` - публичные страницы приложения (О проекте, Акции, Вакансии, Партнерство, и т.д.)
- `src/routes/(auth)/` - страницы аутентификации (login, register)
- `src/routes/(protected)/` - защищенные страницы, требующие аутентификации (dashboard)
- `src/routes/layout/` - общие layout компоненты (header, footer)

### Authentication System

Использует **Svelte 5 runes** ($state, $effect) для реактивного управления состоянием:

- `src/lib/auth/auth.svelte.js` - центральное хранилище состояния аутентификации с функциями login/register/logout
- `src/lib/auth/auth-guard.svelte.js` - middleware для защиты маршрутов
- `src/hooks.server.js` - server-side hooks применяет auth middleware
- `src/routes/+layout.server.js` - загружает данные пользователя на сервере
- `src/routes/+layout.svelte` - инициализирует auth состояние из server data

**Важно**: Данные пользователя загружаются на сервере через `+layout.server.js` и инициализируются на клиенте через `initAuthFromServer()`. Не делайте лишние fetch запросы для получения данных пользователя на клиенте.

### Environment Configuration

Проект использует mode-specific env файлы:
- `.env.development` - для development режима
- `.env.production` - для production режима

**Обязательные переменные**:
```
VITE_API_BASE_URL=http://localhost:8000      # GraphQL API (b5-api-2)
VITE_AUTH_API_URL=http://localhost:8001      # Auth API (b5-auth-2)
VITE_FRONTEND_URL=http://localhost:5173      # Frontend URL
```

Конфигурация читается с приоритетом: Vite env vars → runtime env vars → development defaults (см. `src/lib/config/api.js`).

### HTTP Client & API Communication

- `src/lib/utils/http-client.js` - централизованный HTTP клиент с обработкой CSRF, cookies, и 401 ошибок
- `src/lib/api/` - GraphQL запросы и mutations
- `src/lib/utils/errorHandler.svelte.js` - централизованная обработка ошибок

### State Management

Проект использует **Svelte 5 runes** вместо stores:
- `$state()` для реактивного состояния
- `$derived()` для вычисляемых значений
- `$effect()` для side effects

Примеры:
- `src/lib/auth/auth.svelte.js` - auth state
- `src/lib/state/` - другое глобальное состояние

### Component Library

- `src/lib/components/` - переиспользуемые UI компоненты
- `src/lib/` - index.js экспортирует основные компоненты
- Компоненты используют Tailwind CSS 4 с кастомными анимациями через `tailwindcss-animated`

### UI Styling

Проект использует dark theme (bg-gray-950) с gradient акцентами:
- Градиентные цвета: indigo → purple → pink
- Кнопки и интерактивные элементы используют градиенты с shadow effects
- Hover эффекты: `-translate-y-0.5`, `hover:shadow-xl`
- Стандартные цветовые схемы для hover: cyan, purple, indigo, amber, pink

При создании новых страниц следуйте стилю существующих страниц (например, `src/routes/(app)/about/+page.svelte`).

## Key Technologies

- **SvelteKit 2** - фреймворк с SSR
- **Svelte 5** - использует новые runes ($state, $effect, $derived)
- **Tailwind CSS 4** - utility-first CSS с Vite plugin
- **Vitest** - тестирование с jsdom
- **GraphQL** - через graphql-request
- **Adapter Node** - для production деплоя

## Testing

- Тесты находятся рядом с тестируемыми файлами: `*.test.js` или `*.spec.js`
- Mock'и для SvelteKit модулей: `src/test-mocks/app/`
- Setup файл: `src/test-setup.js`
- Используйте `@testing-library/svelte` для компонентных тестов

## Docker

Production деплой через Docker:
- `Dockerfile.production` - multi-stage build
- `entrypoint.sh` - entry point скрипт
- Использует `@sveltejs/adapter-node` для Node.js сервера
