# Исправление отображения бонусов в модальном окне проекта

## Проблема

В модальном окне просмотра проекта на странице `/projects` некорректно отображались суммы и бонусы:

1. В разделе "Бонусы по договорам" не указывалось дефолтное значение бонуса агенту (3%)
2. Не отображался посчитанный бонус агента

## Причина

В сервисе `BonusCalculationService` (backend) дефолтные значения процентов применялись только при пересчете бонусов, но не при возврате данных через GraphQL API. Если в базе данных поля `agent_percentage` или `curator_percentage` были `null`, они возвращались как `null` вместо дефолтных значений.

## Решение

### 1. Backend (b5-api-2)

**Файл:** `b5-api-2/app/Services/BonusCalculationService.php`

В методе `getProjectBonusSummary()` добавлены дефолтные значения при формировании данных для возврата:

```php
// Для договоров
'agent_percentage' => $contract->agent_percentage ?? 3.0,
'curator_percentage' => $contract->curator_percentage ?? 2.0,

// Для закупок (уже было)
'agent_percentage' => $order->agent_percentage ?? 5.0,
'curator_percentage' => $order->curator_percentage ?? 5.0,
```

### 2. Frontend (b5-agent)

**Файл:** `b5-agent/src/lib/components/BonusDetailsSection.svelte`

#### Улучшено отображение процентов:

- Добавлено отображение дефолтных значений с пометкой "(по умолчанию)"
- Улучшены подписи полей ("Сумма договора" вместо "Сумма")
- Добавлена обработка `null` значений с fallback на дефолты

```svelte
<p class="text-gray-300">
  {contract.agent_percentage ?? 3}%
  {#if !contract.agent_percentage}
    <span class="text-xs text-gray-500">(по умолчанию)</span>
  {/if}
</p>
```

#### Улучшена функция форматирования валюты:

```javascript
function formatCurrency(amount) {
  if (amount === null || amount === undefined || amount === 0) {
    return '0 ₽';
  }
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}
```

## Дефолтные значения бонусов

### Договоры (Contracts)
- **Агент:** 3%
- **Куратор:** 2%

### Закупки (Orders)
- **Агент:** 5%
- **Куратор:** 5%

## Результат

Теперь в модальном окне проекта:

1. ✅ Отображается процент бонуса агента (3% по умолчанию для договоров)
2. ✅ Показывается посчитанный бонус агента
3. ✅ Явно указывается, когда используется дефолтное значение
4. ✅ Корректно форматируются суммы в рублях
5. ✅ Улучшена читаемость с более понятными подписями полей

## Тестирование

Для проверки исправлений:

1. Откройте страницу `/projects` в b5-agent
2. Кликните на любой проект для открытия модального окна
3. Проверьте раздел "Бонусы по договорам":
   - Должен отображаться процент агента (3% или другое значение)
   - Должен отображаться посчитанный бонус агента
   - Если процент не задан явно, должна быть пометка "(по умолчанию)"
4. Проверьте раздел "Бонусы по закупкам" (если есть):
   - Должен отображаться процент агента (5% или другое значение)
   - Должен отображаться посчитанный бонус агента

## Связанные файлы

### Backend
- `b5-api-2/app/Services/BonusCalculationService.php` - сервис расчета бонусов
- `b5-api-2/app/GraphQL/Resolvers/ProjectBonusResolver.php` - GraphQL резолвер
- `b5-api-2/graphql/project.graphql` - GraphQL схема

### Frontend
- `b5-agent/src/lib/components/BonusDetailsSection.svelte` - компонент отображения бонусов
- `b5-agent/src/lib/components/ProjectDetailsModal.svelte` - модальное окно проекта
- `b5-agent/src/routes/(protected)/projects/+page.svelte` - страница проектов
- `b5-agent/src/lib/api/projects.js` - API клиент для проектов
