# Исправление мерцания уведомления о секретном ключе

## Проблема
При отправке формы создания проекта на короткое время уведомление под полем секретного ключа менялось с:
- ✓ "Ваш секретный ключ подставлен автоматически" (зеленый)
на:
- ⚠ "Секретный ключ не найден. Проверьте профиль." (желтый)

Затем форма закрывалась.

## Причина
После успешной отправки формы вызывался метод `form.reset()`, который очищал ВСЕ поля формы, включая поле секретного ключа. Это приводило к:

1. `secretKeyInput` становился пустой строкой
2. Условие `{#if secretKeyInput}` становилось `false`
3. Отображалось желтое предупреждение
4. Через некоторое время срабатывал `$effect()` и восстанавливал значение
5. Но к этому времени форма уже закрывалась

## Решение

### До исправления
```javascript
if (result.success) {
  successMessage = result.message || 'Заявка успешно отправлена';
  form.reset(); // ← Очищает ВСЕ поля, включая секретный ключ
  secretKeyInput = authState.user?.key || ''; // ← Пытается восстановить
  // ...
}
```

### После исправления
```javascript
if (result.success) {
  successMessage = result.message || 'Заявка успешно отправлена';
  
  // Reset only client data fields, keep secret key
  const clientNameInput = form.querySelector('#client_name');
  const phoneInput = form.querySelector('#phone');
  const addressInput = form.querySelector('#address');
  const commentInput = form.querySelector('#comment');
  
  if (clientNameInput) clientNameInput.value = '';
  if (phoneInput) phoneInput.value = '';
  if (addressInput) addressInput.value = '';
  if (commentInput) commentInput.value = '';
  
  // Secret key remains unchanged ← Ключ не трогаем!
  // ...
}
```

## Преимущества решения

1. **Нет мерцания** - секретный ключ остается неизменным
2. **Лучший UX** - пользователь не видит предупреждений
3. **Производительность** - не нужно восстанавливать значение
4. **Надежность** - нет зависимости от времени срабатывания `$effect()`

## Альтернативные решения (не использованы)

### 1. Сохранение и восстановление
```javascript
const savedSecretKey = secretKeyInput;
form.reset();
secretKeyInput = savedSecretKey;
```
**Проблема:** Все равно есть короткий момент между reset и восстановлением

### 2. Исключение поля из формы
```html
<input ... form="none">
```
**Проблема:** Поле не будет участвовать в валидации формы

### 3. Использование атрибута data-no-reset
```html
<input ... data-no-reset="true">
```
**Проблема:** Нужна дополнительная логика для обработки этого атрибута

## Тестирование

1. Откройте форму создания проекта
2. Заполните все поля
3. Отправьте форму
4. Наблюдайте:
   - ✓ Зеленое уведомление остается зеленым
   - ✓ Поля клиента очищаются
   - ✓ Секретный ключ остается на месте
   - ✓ Нет мерцания или смены цвета уведомления

## Связанные файлы
- `b5-agent/src/lib/components/ProjectSubmitModal.svelte` - основной файл с исправлением
- `b5-agent/DASHBOARD_FORM_UPDATE.md` - общая документация
