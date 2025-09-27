# B5 Agent

Агентское приложение для проекта Bonus5, построенное на SvelteKit.

## Настройка окружения

Проект использует переменные окружения для конфигурации. Создайте файлы окружения:

```sh
# Скопируйте example файлы
cp .env.development.example .env.development
cp .env.production.example .env.production
```

При необходимости отредактируйте переменные в файлах под ваше окружение.

### Переменные окружения

- `VITE_API_BASE_URL` - URL GraphQL API сервера [[memory:7942004]]
- `VITE_AUTH_API_URL` - URL сервера аутентификации [[memory:7942004]]
- `VITE_FRONTEND_URL` - URL frontend приложения агента

## Разработка

Установите зависимости и запустите dev сервер:

```sh
npm install
npm run dev

# или откройте в браузере автоматически
npm run dev -- --open

# для тестирования с production конфигурацией
npm run dev:prod
```

## Сборка

Для создания production версии:

```sh
npm run build        # production сборка
npm run build:dev    # development сборка для тестирования
```

Предварительный просмотр production сборки:

```sh
npm run preview
```

## Структура проекта

- `/src/lib/config/api.js` - конфигурация API endpoints
- `/src/routes/` - страницы и маршруты приложения
- `/src/lib/components/` - переиспользуемые компоненты
- `/src/lib/auth/` - система аутентификации
- `/static/` - статические файлы

## Особенности агентского приложения

Это frontend для агентов системы Bonus5. Включает в себя:

- Систему аутентификации через b5-auth-2
- Интеграцию с GraphQL API через b5-api2
- Управление проектами агента
- Личный кабинет и финансы
