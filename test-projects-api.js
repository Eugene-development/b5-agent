/**
 * Простой тест для проверки API проектов
 * Запустите: node test-projects-api.js
 */

import { createProjectsApi } from './src/lib/api/projects.js';

// Мок fetch функции для тестирования
const mockFetch = async (url, options) => {
	console.log('Mock fetch called:', url, options?.method || 'GET');
	
	// Симуляция GraphQL ответа
	return {
		ok: true,
		json: async () => ({
			data: {
				projects: {
					data: [
						{
							id: 1,
							value: 'Тестовый проект 1',
							city: 'Москва',
							description: 'Описание тестового проекта',
							is_active: true,
							contract_amount: 100000,
							agent: {
								id: 1,
								name: 'Тестовый агент',
								email: 'agent@test.com'
							},
							created_at: '2024-01-01T00:00:00Z'
						},
						{
							id: 2,
							value: 'Тестовый проект 2',
							city: 'СПб',
							description: 'Описание второго проекта',
							is_active: false,
							contract_amount: 200000,
							agent: {
								id: 2,
								name: 'Второй агент',
								email: 'agent2@test.com'
							},
							created_at: '2024-01-02T00:00:00Z'
						}
					],
					paginatorInfo: {
						currentPage: 1,
						lastPage: 1,
						total: 2,
						perPage: 100,
						hasMorePages: false
					}
				}
			}
		})
	};
};

async function testProjectsApi() {
	console.log('🧪 Тестирование API проектов...\n');
	
	try {
		// Создаем API клиент с мок fetch
		const projectsApi = createProjectsApi(mockFetch);
		
		// Тест 1: Получение всех проектов
		console.log('1️⃣ Тестируем получение всех проектов...');
		const result = await projectsApi.getAll({ first: 100, page: 1 });
		console.log('✅ Получено проектов:', result.data.length);
		console.log('📊 Пагинация:', result.paginatorInfo);
		
		// Тест 2: Получение статистики
		console.log('\n2️⃣ Тестируем получение статистики...');
		const stats = await projectsApi.getStats();
		console.log('✅ Статистика:', stats);
		
		// Тест 3: Поиск проектов
		console.log('\n3️⃣ Тестируем поиск проектов...');
		const searchResult = await projectsApi.search('Москва');
		console.log('✅ Найдено проектов:', searchResult.data.length);
		
		console.log('\n🎉 Все тесты прошли успешно!');
		
	} catch (error) {
		console.error('❌ Ошибка при тестировании:', error.message);
		console.error(error.stack);
	}
}

// Запускаем тесты
testProjectsApi();