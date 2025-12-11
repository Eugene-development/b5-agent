# Исправление страницы финансов

## Проблема

На странице `/finances` отображалось 0 начисленных бонусов, хотя на странице `/projects` бонусы были видны.

## Причина

Страница финансов использует данные из таблицы `agent_bonuses`, которая была пустой. Бонусы на странице проектов рассчитываются из полей `agent_bonus` в таблицах `contracts` и `orders`.

## Решение

### Backend (b5-api-2)

1. **Исправлен метод получения ID агента** в `BonusService::getAgentIdFromProject()`
   - Теперь корректно находит агента из поля `projects.user_id`

2. **Добавлены Model Events** в `Contract` и `Order`
   - Автоматически создают записи в `agent_bonuses` при создании договоров/закупок

3. **Создана команда миграции** `php artisan bonuses:migrate`
   - Мигрировала существующие договоры и закупки в таблицу `agent_bonuses`
   - Результат: 15 записей, общая сумма 73,672.78 ₽

### Frontend (b5-agent)

Изменений не требуется. Страница `/finances` использует GraphQL API, который теперь возвращает корректные данные.

## Проверка

1. Откройте страницу `/finances` в браузере
2. Убедитесь, что отображаются карточки статистики:
   - **Начислено**: 73,670.53 ₽
   - **Доступно к выплате**: 0 ₽
   - **Выплачено**: 0 ₽
3. Проверьте таблицу бонусов - должно быть 14-15 записей

## Структура данных

### GraphQL Query

```graphql
query GetAgentBonuses($filters: AgentBonusFilters) {
  agentBonuses(filters: $filters) {
    id
    agent_id
    contract_id
    order_id
    commission_amount
    status {
      id
      code
      name
    }
    accrued_at
    available_at
    paid_at
    source_type
    source_amount
    project_name
    created_at
    updated_at
  }
}
```

### GraphQL Query для статистики

```graphql
query GetAgentBonusStats($filters: AgentBonusFilters) {
  agentBonusStats(filters: $filters) {
    total_accrued
    total_available
    total_paid
  }
}
```

## Связанные файлы

**Frontend**:
- `src/routes/(protected)/finances/+page.js` - загрузка данных
- `src/routes/(protected)/finances/+page.svelte` - страница финансов
- `src/lib/api/finances.js` - API клиент
- `src/lib/components/finances/BonusStatsCards.svelte` - карточки статистики
- `src/lib/components/finances/BonusesTable.svelte` - таблица бонусов

**Backend**:
- `b5-api-2/app/Services/BonusService.php` - сервис управления бонусами
- `b5-api-2/app/GraphQL/Queries/AgentBonusesQuery.php` - запрос бонусов
- `b5-api-2/app/GraphQL/Queries/AgentBonusStatsQuery.php` - запрос статистики
- `b5-api-2/docs/AGENT_BONUSES_FIX.md` - подробная документация

## Дальнейшие улучшения

- Автоматический переход бонусов в статус "доступно к выплате" при оплате партнером
- Создание выплат агентам через админку
- Уведомления о начислении и выплате бонусов
