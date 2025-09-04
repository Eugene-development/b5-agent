/**
 * Navigation Testing Script
 * Tests all navigation links and menu functionality
 */

import { browser } from '$app/environment';

// List of all expected routes and their accessibility
const routes = {
  public: [
    { path: '/', name: 'Главная', menuSelector: 'a[href="/"]' },
    { path: '/about', name: 'О проекте', menuSelector: 'a[href="/about"]' },
    { path: '/payments', name: 'Выплаты', menuSelector: 'a[href="/payments"]' },
    { path: '/152fz', name: '152 ФЗ', menuSelector: 'a[href="/152fz"]' },
    { path: '/login', name: 'Вход', menuSelector: 'a[href="/login"]', authRequired: false },
    { path: '/register', name: 'Регистрация', menuSelector: 'a[href="/register"]', authRequired: false }
  ],
  protected: [
    { path: '/dashboard', name: 'Личный кабинет', menuSelector: 'a[href="/dashboard"]', authRequired: true },
    { path: '/profile', name: 'Профиль', menuSelector: 'a[href="/profile"]', authRequired: true },
    { path: '/agents', name: 'Агенты', menuSelector: 'a[href="/agents"]', authRequired: true },
    { path: '/projects', name: 'Проекты', menuSelector: 'a[href="/projects"]', authRequired: true },
    { path: '/finances', name: 'Финансы', menuSelector: 'a[href="/finances"]', authRequired: true }
  ]
};

/**
 * Test navigation functionality
 */
export class NavigationTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  /**
   * Log test results
   */
  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  /**
   * Test if element exists and is visible
   */
  testElementExists(selector, description) {
    try {
      const element = document.querySelector(selector);
      if (element) {
        const isVisible = element.offsetParent !== null;
        if (isVisible) {
          this.log(`✅ ${description}: Element found and visible`, 'success');
          this.results.passed++;
          return true;
        } else {
          this.log(`❌ ${description}: Element found but not visible`, 'error');
          this.results.failed++;
          this.results.errors.push(`${description}: Element not visible`);
          return false;
        }
      } else {
        this.log(`❌ ${description}: Element not found`, 'error');
        this.results.failed++;
        this.results.errors.push(`${description}: Element not found`);
        return false;
      }
    } catch (error) {
      this.log(`❌ ${description}: Error - ${error.message}`, 'error');
      this.results.failed++;
      this.results.errors.push(`${description}: ${error.message}`);
      return false;
    }
  }

  /**
   * Test menu links visibility based on authentication state
   */
  testMenuLinks(isAuthenticated = false) {
    this.log(`\n🔍 Testing menu links (authenticated: ${isAuthenticated})`);

    // Test public links (always visible)
    routes.public.forEach(route => {
      if (route.authRequired === false && isAuthenticated) {
        // Login/Register links should not be visible when authenticated
        const element = document.querySelector(route.menuSelector);
        if (!element || element.offsetParent === null) {
          this.log(`✅ ${route.name}: Correctly hidden when authenticated`, 'success');
          this.results.passed++;
        } else {
          this.log(`❌ ${route.name}: Should be hidden when authenticated`, 'error');
          this.results.failed++;
          this.results.errors.push(`${route.name}: Should be hidden when authenticated`);
        }
      } else if (route.authRequired !== false) {
        this.testElementExists(route.menuSelector, `Menu link: ${route.name}`);
      }
    });

    // Test protected links (only visible when authenticated)
    routes.protected.forEach(route => {
      if (isAuthenticated) {
        this.testElementExists(route.menuSelector, `Protected menu link: ${route.name}`);
      } else {
        const element = document.querySelector(route.menuSelector);
        if (!element || element.offsetParent === null) {
          this.log(`✅ ${route.name}: Correctly hidden when not authenticated`, 'success');
          this.results.passed++;
        } else {
          this.log(`❌ ${route.name}: Should be hidden when not authenticated`, 'error');
          this.results.failed++;
          this.results.errors.push(`${route.name}: Should be hidden when not authenticated`);
        }
      }
    });

    // Test logout button (only visible when authenticated)
    const logoutButton = document.querySelector('button:has-text("Выход")') || 
                        document.querySelector('button[onclick*="logout"]');
    if (isAuthenticated) {
      if (logoutButton && logoutButton.offsetParent !== null) {
        this.log(`✅ Logout button: Correctly visible when authenticated`, 'success');
        this.results.passed++;
      } else {
        this.log(`❌ Logout button: Should be visible when authenticated`, 'error');
        this.results.failed++;
        this.results.errors.push(`Logout button: Should be visible when authenticated`);
      }
    } else {
      if (!logoutButton || logoutButton.offsetParent === null) {
        this.log(`✅ Logout button: Correctly hidden when not authenticated`, 'success');
        this.results.passed++;
      } else {
        this.log(`❌ Logout button: Should be hidden when not authenticated`, 'error');
        this.results.failed++;
        this.results.errors.push(`Logout button: Should be hidden when not authenticated`);
      }
    }
  }

  /**
   * Test mobile menu functionality
   */
  testMobileMenu() {
    this.log(`\n📱 Testing mobile menu functionality`);

    // Test mobile menu button
    const mobileMenuButton = document.querySelector('button[onclick*="openMobileMenu"]') ||
                            document.querySelector('button:has(svg[data-slot="icon"])');
    
    if (mobileMenuButton) {
      this.log(`✅ Mobile menu button: Found`, 'success');
      this.results.passed++;

      // Test if mobile menu button is hidden on desktop
      const isHiddenOnDesktop = mobileMenuButton.closest('.lg\\:hidden');
      if (isHiddenOnDesktop) {
        this.log(`✅ Mobile menu button: Correctly hidden on desktop`, 'success');
        this.results.passed++;
      } else {
        this.log(`❌ Mobile menu button: Should be hidden on desktop`, 'error');
        this.results.failed++;
        this.results.errors.push(`Mobile menu button: Should be hidden on desktop`);
      }
    } else {
      this.log(`❌ Mobile menu button: Not found`, 'error');
      this.results.failed++;
      this.results.errors.push(`Mobile menu button: Not found`);
    }

    // Test mobile menu container
    const mobileMenuContainer = document.querySelector('.lg\\:hidden[role="dialog"]');
    if (mobileMenuContainer) {
      this.log(`✅ Mobile menu container: Found`, 'success');
      this.results.passed++;
    } else {
      this.log(`❌ Mobile menu container: Not found`, 'error');
      this.results.failed++;
      this.results.errors.push(`Mobile menu container: Not found`);
    }

    // Test mobile menu close button
    const closeButton = document.querySelector('button[onclick*="closeMobileMenu"]');
    if (closeButton) {
      this.log(`✅ Mobile menu close button: Found`, 'success');
      this.results.passed++;
    } else {
      this.log(`❌ Mobile menu close button: Not found`, 'error');
      this.results.failed++;
      this.results.errors.push(`Mobile menu close button: Not found`);
    }
  }

  /**
   * Test desktop menu visibility
   */
  testDesktopMenu() {
    this.log(`\n🖥️ Testing desktop menu functionality`);

    // Test desktop menu container
    const desktopMenu = document.querySelector('.hidden.lg\\:flex.lg\\:gap-x-12');
    if (desktopMenu) {
      this.log(`✅ Desktop menu container: Found`, 'success');
      this.results.passed++;
    } else {
      this.log(`❌ Desktop menu container: Not found`, 'error');
      this.results.failed++;
      this.results.errors.push(`Desktop menu container: Not found`);
    }

    // Test desktop auth section
    const desktopAuthSection = document.querySelector('.hidden.lg\\:flex.lg\\:flex-1.lg\\:justify-end');
    if (desktopAuthSection) {
      this.log(`✅ Desktop auth section: Found`, 'success');
      this.results.passed++;
    } else {
      this.log(`❌ Desktop auth section: Not found`, 'error');
      this.results.failed++;
      this.results.errors.push(`Desktop auth section: Not found`);
    }
  }

  /**
   * Test active link highlighting
   */
  testActiveLinkHighlighting(currentPath) {
    this.log(`\n🎯 Testing active link highlighting for path: ${currentPath}`);

    // Find all navigation links
    const navLinks = document.querySelectorAll('nav a[href]');
    let activeLinksFound = 0;

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isCurrentPage = href === currentPath;
      const hasActiveClass = link.classList.contains('text-blue-400') || 
                           link.classList.contains('font-semibold') ||
                           link.classList.contains('bg-gray-800');

      if (isCurrentPage && hasActiveClass) {
        this.log(`✅ Active link highlighting: ${href} correctly highlighted`, 'success');
        this.results.passed++;
        activeLinksFound++;
      } else if (isCurrentPage && !hasActiveClass) {
        this.log(`❌ Active link highlighting: ${href} should be highlighted`, 'error');
        this.results.failed++;
        this.results.errors.push(`Active link highlighting: ${href} should be highlighted`);
      } else if (!isCurrentPage && hasActiveClass) {
        this.log(`❌ Active link highlighting: ${href} should not be highlighted`, 'error');
        this.results.failed++;
        this.results.errors.push(`Active link highlighting: ${href} should not be highlighted`);
      }
    });

    if (activeLinksFound === 0 && currentPath !== '/') {
      this.log(`⚠️ No active links found for current path: ${currentPath}`, 'error');
    }
  }

  /**
   * Run all navigation tests
   */
  async runAllTests(isAuthenticated = false, currentPath = '/') {
    if (!browser) {
      this.log('❌ Tests can only run in browser environment', 'error');
      return this.results;
    }

    this.log(`\n🚀 Starting navigation tests...`);
    this.log(`Authentication state: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`);
    this.log(`Current path: ${currentPath}`);

    // Wait for DOM to be ready
    await new Promise(resolve => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });

    // Run all tests
    this.testDesktopMenu();
    this.testMobileMenu();
    this.testMenuLinks(isAuthenticated);
    this.testActiveLinkHighlighting(currentPath);

    // Print summary
    this.log(`\n📊 Test Summary:`);
    this.log(`✅ Passed: ${this.results.passed}`);
    this.log(`❌ Failed: ${this.results.failed}`);
    this.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);

    if (this.results.errors.length > 0) {
      this.log(`\n🔍 Errors found:`);
      this.results.errors.forEach((error, index) => {
        this.log(`${index + 1}. ${error}`, 'error');
      });
    }

    return this.results;
  }
}

// Export for use in components
export function createNavigationTester() {
  return new NavigationTester();
}