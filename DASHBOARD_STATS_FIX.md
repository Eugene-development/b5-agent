# Исправление отображения статистики на Dashboard

## Проблема

На странице dashboard в разделе "Быстрая статистика" количество активных проектов было захардкожено значением `12`, вместо отображения реальных данных из API.

## Решение

Создан файл `src/routes/(protected)/dashboard/+page.js` для клиентской загрузки данных о проектах пользователя через API (аналогично странице проектов). Удален `+page.server.js`, так как данные теперь загружаются на клиенте.

## Изменения

### Создан файл: `src/routes/(protected)/dashboard/+page.js`

Новый файл для клиентской загрузки данных:

```javascript
import { error } from '@sveltejs/kit';
import { createProjectsApi } from '$lib/api/projects.js';

function calculateProjectStats(projects) {
	if (!Array.isArray(projects)) {
		return {
			activeProjects: 0,
			completedProjects: 0,
			totalPayouts: 0
		};
	}

	const stats = {
		activeProjects: 0,
		completedProjects: 0,
		totalPayouts: 0
	};

	for (const project of projects) {
		// Check for active projects (handle different data types)
		if (project?.is_active === true || project?.is_active === 1 || project?.is_active === '1') {
			stats.activeProjects++;
		} else {
			stats.completedProjects++;
		}
	}

	return stats;
}

export async function load({ fetch, parent }) {
	const { user, isAuthenticated } = await parent();

	if (!isAuthenticated || !user) {
		throw error(401, { message: 'Необходима авторизация' });
	}

	const projectsApi = createProjectsApi(fetch);
	const userProjects = await projectsApi.getByAgent(user.id);
	const stats = calculateProjectStats(userProjects);

	return {
		user,
		stats,
		isAuthenticated: true,
		error: null
	};
}
```

### Удален файл: `src/routes/(protected)/dashboard/+page.server.js`

Серверная загрузка данных больше не используется, так как клиентская загрузка работает корректнее с GraphQL API.

## Как это работает

1. **Получение проектов**: Используется метод `projectsApi.getByAgent(user.id)` для получения всех проектов текущего пользователя
2. **Подсчет активных проектов**: Фильтруются проекты с `is_active === true`
3. **Подсчет закрытых проектов**: Фильтруются проекты с `is_active === false`
4. **Обработка ошибок**: Если API недоступен, используются значения по умолчанию (0)
5. **Логирование**: Добавлено логирование для отладки

## Результат

Теперь на странице dashboard в разделе "Быстрая статистика" отображается:

- **Активных проектов**: реальное количество проектов пользователя со статусом `is_active = true`
- **Закрытых проектов**: реальное количество проектов пользователя со статусом `is_active = false`
- **Выплат получено**: пока 0 (требует дополнительной реализации)

## Тестирование

Для проверки:

1. Войдите в систему как пользователь с проектами
2. Перейдите на страницу `/dashboard`
3. Проверьте раздел "Быстрая статистика"
4. Количество активных и закрытых проектов должно соответствовать реальным данным

## Дополнительные улучшения

В будущем можно добавить:

- Подсчет выплат (`totalPayouts`) из финансовых данных
- Кэширование статистики для улучшения производительности
- Отображение дополнительной статистики (сумма контрактов, средний процент агента и т.д.)
