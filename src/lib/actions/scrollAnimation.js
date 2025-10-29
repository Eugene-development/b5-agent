/**
 * Svelte action для добавления анимаций при скролле используя Intersection Observer API
 * @param {HTMLElement} node - DOM элемент
 * @param {Object} options - Опции анимации
 * @param {string} options.animation - CSS классы анимации (например, 'animate-fade-in animate-duration-1000')
 * @param {number} options.threshold - Процент видимости элемента для запуска анимации (0-1)
 * @param {boolean} options.once - Анимировать только один раз
 * @param {number} options.delay - Задержка перед началом анимации в мс
 */
export function scrollAnimation(node, options = {}) {
	const { animation = 'animate-fade-in', threshold = 0.1, once = true, delay = 0 } = options;

	// Добавляем начальный класс для скрытия элемента
	node.style.opacity = '0';
	node.style.transform = 'translateY(20px)';

	let timeoutId;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					// Применяем задержку если указана
					timeoutId = setTimeout(() => {
						// Удаляем inline стили
						node.style.opacity = '';
						node.style.transform = '';

						// Добавляем классы анимации
						const animationClasses = animation.split(' ');
						node.classList.add(...animationClasses);
					}, delay);

					// Если анимация должна произойти только один раз
					if (once) {
						observer.unobserve(node);
					}
				} else if (!once) {
					// Если анимация повторяется, убираем классы когда элемент не виден
					const animationClasses = animation.split(' ');
					node.classList.remove(...animationClasses);
					node.style.opacity = '0';
					node.style.transform = 'translateY(20px)';
				}
			});
		},
		{
			threshold,
			rootMargin: '0px'
		}
	);

	observer.observe(node);

	return {
		destroy() {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			observer.disconnect();
		}
	};
}

/**
 * Предустановленные анимации для быстрого использования
 */
export const animations = {
	fadeIn: 'animate-fade-in animate-duration-700 animate-ease-out',
	fadeInUp: 'animate-fade-in-up animate-duration-700 animate-ease-out',
	fadeInDown: 'animate-fade-in-down animate-duration-700 animate-ease-out',
	fadeInLeft: 'animate-fade-in-left animate-duration-700 animate-ease-out',
	fadeInRight: 'animate-fade-in-right animate-duration-700 animate-ease-out',
	slideInUp: 'animate-fade-in slide-in-from-bottom-4 animate-duration-700 animate-ease-out',
	slideInDown: 'animate-fade-in slide-in-from-top-4 animate-duration-700 animate-ease-out',
	slideInLeft: 'animate-fade-in slide-in-from-left-4 animate-duration-700 animate-ease-out',
	slideInRight: 'animate-fade-in slide-in-from-right-4 animate-duration-700 animate-ease-out',
	zoomIn: 'animate-fade-in zoom-in-95 animate-duration-700 animate-ease-out',
	zoomInUp:
		'animate-fade-in zoom-in-95 slide-in-from-bottom-2 animate-duration-700 animate-ease-out',
	bounce: 'animate-bounce animate-duration-1000 animate-delay-200',
	spin: 'animate-fade-in spin-in-45 animate-duration-1000 animate-ease-out'
};
