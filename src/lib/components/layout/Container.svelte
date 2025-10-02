<script>
	/**
	 * Adaptive Container Component
	 * Provides responsive containers with proper spacing and layout patterns
	 * Supports various layout types and responsive behavior
	 */

	let {
		// Container size variants
		size = 'default',
		// Layout type
		layout = 'default',
		// Custom padding
		padding = 'default',
		// Center content
		center = true,
		// Full width on mobile
		fullWidthMobile = true,
		// Custom CSS classes
		class: className = '',
		// Children content
		children,
		// HTML element type
		element = 'div',
		...restProps
	} = $props();

	// Container size classes
	const sizeClasses = {
		xs: 'container-xs',
		sm: 'container-sm',
		md: 'container-md',
		lg: 'container-lg',
		xl: 'container-xl',
		'2xl': 'container-2xl',
		default: 'container',
		full: 'container-full'
	};

	// Layout pattern classes
	const layoutClasses = {
		default: 'layout-default',
		grid: 'layout-grid',
		flex: 'layout-flex',
		sidebar: 'layout-sidebar',
		hero: 'layout-hero',
		article: 'layout-article'
	};

	// Padding classes
	const paddingClasses = {
		none: 'p-0',
		xs: 'p-2 sm:p-3',
		sm: 'p-3 sm:p-4',
		default: 'p-4 sm:p-6 lg:p-8',
		lg: 'p-6 sm:p-8 lg:p-12',
		xl: 'p-8 sm:p-12 lg:p-16'
	};

	// Compute final classes
	const containerClasses = $derived(
		[
			'adaptive-container',
			sizeClasses[size] || sizeClasses.default,
			layoutClasses[layout] || layoutClasses.default,
			paddingClasses[padding] || paddingClasses.default,
			center ? 'mx-auto' : '',
			fullWidthMobile ? 'w-full' : '',
			className
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<svelte:element this={element} class={containerClasses} {...restProps}>
	{@render children?.()}
</svelte:element>

<style>
	/* Base container styles */
	.adaptive-container {
		position: relative;
		width: 100%;
	}

	/* Container size variants */
	.container-xs {
		max-width: 20rem; /* 320px */
	}

	.container-sm {
		max-width: 24rem; /* 384px */
	}

	.container-md {
		max-width: 28rem; /* 448px */
	}

	.container-lg {
		max-width: 32rem; /* 512px */
	}

	.container-xl {
		max-width: 36rem; /* 576px */
	}

	.container-2xl {
		max-width: 42rem; /* 672px */
	}

	.container {
		max-width: 100%;
	}

	.container-full {
		max-width: none;
		width: 100%;
	}

	/* Layout patterns */
	.layout-default {
		/* Standard container layout */
	}

	.layout-grid {
		display: grid;
		gap: 1rem;
	}

	.layout-flex {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.layout-sidebar {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: 1fr;
	}

	.layout-hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		min-height: 50vh;
	}

	.layout-article {
		max-width: 65ch;
		margin-left: auto;
		margin-right: auto;
	}

	/* Responsive breakpoints */
	@media (min-width: 640px) {
		.container {
			max-width: 640px;
		}

		.layout-grid {
			gap: 1.5rem;
		}

		.layout-flex {
			gap: 1.5rem;
		}

		.layout-sidebar {
			grid-template-columns: 250px 1fr;
			gap: 2rem;
		}
	}

	@media (min-width: 768px) {
		.container {
			max-width: 768px;
		}

		.layout-grid {
			gap: 2rem;
		}

		.layout-flex {
			gap: 2rem;
		}

		.layout-sidebar {
			grid-template-columns: 280px 1fr;
			gap: 2.5rem;
		}
	}

	@media (min-width: 1024px) {
		.container {
			max-width: 1024px;
		}

		.layout-grid {
			gap: 2.5rem;
		}

		.layout-flex {
			gap: 2.5rem;
		}

		.layout-sidebar {
			grid-template-columns: 320px 1fr;
			gap: 3rem;
		}

		.layout-flex {
			flex-direction: row;
		}
	}

	@media (min-width: 1280px) {
		.container {
			max-width: 1280px;
		}
	}

	@media (min-width: 1536px) {
		.container {
			max-width: 1536px;
		}
	}

	/* Enhanced responsive utilities */
	@media (max-width: 639px) {
		.layout-sidebar {
			grid-template-columns: 1fr;
		}

		.layout-flex {
			flex-direction: column;
		}
	}

	/* Performance optimizations */
	.adaptive-container {
		contain: layout style;
	}

	/* Smooth transitions for layout changes */
	.adaptive-container {
		transition: max-width var(--transition-normal, 0.2s) ease-in-out;
	}
</style>
