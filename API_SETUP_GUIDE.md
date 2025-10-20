# Настройка API для работы с реальными данными проектов

## Текущая конфигурация

Страница проектов настроена для работы с реальными API серверами:

### API Endpoints

- **GraphQL API (проекты):** `http://localhost:8000/graphql`
- **Auth API (авторизация):** `http://localhost:8001/api`

### Необходимые серверы

1. **b5-api2** (порт 8000)
   - GraphQL сервер для данных проектов
   - Должен поддерживать запрос `projects(first: Int!, page: Int)`

2. **b5-auth-2** (порт 8001)
   - Сервер авторизации
   - Должен поддерживать `/api/user` для проверки авторизации

## Запуск серверов

### 1. Запуск b5-auth-2

```bash
cd path/to/b5-auth-2
# Команды запуска для вашего auth сервера
```

### 2. Запуск b5-api2

```bash
cd path/to/b5-api2
# Команды запуска для вашего GraphQL сервера
```

## Проверка подключения

После запуска серверов:

1. **Откройте браузер** и перейдите на `/projects`
2. **Авторизуйтесь** если потребуется
3. **Проверьте консоль** браузера на наличие ошибок

### Ожидаемое поведение

✅ **При успешном подключении:**

- Загружаются реальные данные проектов
- Показываются актуальные статистики
- Работают поиск, фильтрация, сортировка

❌ **При отсутствии серверов:**

- Показывается сообщение "Проблема с подключением к серверу"
- Предлагается кнопка "Повторить"

## GraphQL Schema

Страница ожидает следующую структуру данных:

```graphql
type Query {
	projects(first: Int!, page: Int): ProjectConnection
}

type ProjectConnection {
	data: [Project!]!
	paginatorInfo: PaginatorInfo!
}

type Project {
	id: ID!
	value: String
	city: String
	description: String
	is_active: Boolean!
	contract_amount: Float
	contract_name: String
	contract_date: String
	planned_completion_date: String
	agent_id: ID
	agent: Agent
	created_at: String!
	updated_at: String!
}

type Agent {
	id: ID!
	name: String!
	email: String!
}

type PaginatorInfo {
	currentPage: Int!
	lastPage: Int!
	total: Int!
	perPage: Int!
	hasMorePages: Boolean!
}
```

## Отладка

### Проверка в консоли браузера

```javascript
// Проверить конфигурацию API
console.log('API Config:', window.__APP_CONFIG__ || 'Using defaults');

// Проверить доступность GraphQL
fetch('http://localhost:8000/graphql', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ query: '{ __schema { types { name } } }' })
})
	.then((r) => r.json())
	.then(console.log);
```

### Проверка авторизации

```javascript
// Проверить авторизацию
fetch('http://localhost:8001/api/user', {
	credentials: 'include'
})
	.then((r) => r.json())
	.then(console.log);
```

## Возврат к тестовым данным

Если нужно временно вернуть тестовые данные, замените в `+page.js` блок:

```javascript
// Return error state with detailed information...
```

На блок с тестовыми данными из предыдущей версии файла.
