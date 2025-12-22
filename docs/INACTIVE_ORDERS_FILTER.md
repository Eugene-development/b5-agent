# Фильтрация неактивных заказов в модальном окне проекта

## Проблема
В модальном окне просмотра проекта отображались все заказы, включая неактивные. При этом для неактивных заказов бонусы не начислялись, но сами заказы показывались в списке.

## Решение
Добавлена фильтрация заказов по статусу `is_active` в компоненте `BonusDetailsSection.svelte`.

## Изменения

### Файл: `src/lib/components/BonusDetailsSection.svelte`

**До:**
```svelte
{#if bonusDetails.orders && bonusDetails.orders.length > 0}
    <div>
        <h4 class="mb-2 text-sm font-semibold text-amber-500">
            Бонусы по заказам ({bonusDetails.orders.length})
        </h4>
        <div class="space-y-2">
            {#each bonusDetails.orders as order}
```

**После:**
```svelte
{#if bonusDetails.orders && bonusDetails.orders.filter(order => order.is_active).length > 0}
    <div>
        <h4 class="mb-2 text-sm font-semibold text-amber-500">
            Бонусы по заказам ({bonusDetails.orders.filter(order => order.is_active).length})
        </h4>
        <div class="space-y-2">
            {#each bonusDetails.orders.filter(order => order.is_active) as order}
```

## Результат
Теперь в модальном окне просмотра проекта отображаются только активные заказы. Неактивные заказы полностью скрыты от агента.

## Дата изменения
22 декабря 2024
