# Отображение номеров договоров и закупок в модальном окне проекта

## Описание изменения

В модальном окне просмотра проекта теперь отображаются номера договоров и закупок из базы данных вместо порядковых номеров.

## Дата изменения

11 декабря 2025

## Затронутые файлы

### Frontend (b5-agent)

**Файл:** `b5-agent/src/lib/components/BonusDetailsSection.svelte`

#### Изменения в разделе "Бонусы по договорам"

**Было:**
```svelte
<span class="text-sm font-medium text-white">
    Договор {index + 1}
</span>
```

**Стало:**
```svelte
<span class="text-sm font-medium text-white">
    {#if contract.contract_number}
        Договор {contract.contract_number}
    {:else}
        Договор без номера
    {/if}
</span>
```

#### Изменения в разделе "Бонусы по закупкам"

**Было:**
```svelte
<span class="text-sm font-medium text-white">
    Закупка {index + 1}
</span>
```

**Стало:**
```svelte
<span class="text-sm font-medium text-white">
    {#if order.order_number}
        Закупка {order.order_number}
    {:else}
        Закупка без номера
    {/if}
</span>
```

## Структура данных

### Backend (b5-api-2)

Данные уже возвращаются с бэкенда через GraphQL API:

**GraphQL Schema:** `b5-api-2/graphql/project.graphql`

```graphql
type ContractBonusInfo {
    id: ID!
    contract_number: String
    contract_amount: Float
    agent_percentage: Float!
    curator_percentage: Float!
    agent_bonus: Float!
    curator_bonus: Float!
    is_active: Boolean!
}

type OrderBonusInfo {
    id: ID!
    order_number: String!
    order_amount: Float
    agent_percentage: Float!
    curator_percentage: Float!
    agent_bonus: Float!
    curator_bonus: Float!
    is_active: Boolean!
}
```

**Service:** `b5-api-2/app/Services/BonusCalculationService.php`

Метод `getProjectBonusSummary()` возвращает:
- `contract_number` для каждого договора
- `order_number` для каждой закупки

### Database (b5-db-2)

**Таблица contracts:**
- Поле: `contract_number` (string, nullable, unique)
- Автогенерация: формат `DOC-XX-0000` (если не указан вручную)

**Таблица orders:**
- Поле: `order_number` (string, unique)
- Автогенерация: формат `ORD-XXXX-0000` (если не указан вручную)

## GraphQL запросы

Все необходимые поля уже включены в GraphQL запросы:

### Server-side (SSR)
**Файл:** `b5-agent/src/routes/(protected)/projects/+page.server.js`

### Client-side
**Файл:** `b5-agent/src/lib/api/projects.js`

Оба запроса включают:
```graphql
bonusDetails {
    contracts {
        id
        contract_number
        contract_amount
        agent_percentage
        curator_percentage
        agent_bonus
        curator_bonus
        is_active
    }
    orders {
        id
        order_number
        order_amount
        agent_percentage
        curator_percentage
        agent_bonus
        curator_bonus
        is_active
    }
}
```

## Примеры отображения

### Договор с номером
```
Договор DOC-AB-1234
Сумма договора: 1 000 000 ₽
% агента: 3%
Бонус агента: 30 000 ₽
```

### Договор без номера
```
Договор без номера
Сумма договора: 500 000 ₽
% агента: 3% (по умолчанию)
Бонус агента: 15 000 ₽
```

### Закупка с номером
```
Закупка ORD-2024-0001
Сумма закупки: 250 000 ₽
% агента: 5%
Бонус агента: 12 500 ₽
```

### Закупка без номера
```
Закупка без номера
Сумма закупки: 100 000 ₽
% агента: 5% (по умолчанию)
Бонус агента: 5 000 ₽
```

## Тестирование

### Шаги для проверки

1. Откройте страницу `/projects`
2. Кликните на любой проект в таблице
3. В модальном окне перейдите к разделу "Информация о бонусах"
4. Проверьте, что:
   - Для договоров отображается номер в формате `Договор DOC-XX-0000` или `Договор без номера`
   - Для закупок отображается номер в формате `Закупка ORD-XXXX-0000` или `Закупка без номера`

### Ожидаемое поведение

- ✅ Если у договора/закупки есть номер в БД — отображается реальный номер
- ✅ Если номер отсутствует (null) — отображается "без номера"
- ✅ Все остальные данные (суммы, проценты, бонусы) отображаются корректно

## Связанные документы

- [BONUS_DISPLAY_FIX.md](../../BONUS_DISPLAY_FIX.md) - Исправление отображения бонусов
- [TESTING_BONUS_DISPLAY.md](../../TESTING_BONUS_DISPLAY.md) - Инструкция по тестированию бонусов
- [DASHBOARD_STATS_FIX.md](../../DASHBOARD_STATS_FIX.md) - Исправление статистики на дашборде

## Примечания

- Номера договоров и закупок генерируются автоматически при создании, если не указаны вручную
- Формат автогенерации определен в моделях `Contract` и `Order` на бэкенде
- Изменение не требует миграций БД — поля уже существуют
- Изменение не требует обновления GraphQL схемы — поля уже включены
