/**
 * Manual Navigation Testing Script
 * Copy and paste this into browser console to test navigation
 */

console.log('🚀 Starting Navigation Tests...');

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

function logTest(message, passed = true) {
  const emoji = passed ? '✅' : '❌';
  console.log(`${emoji} ${message}`);
  if (passed) {
    testResults.passed++;
  } else {
    testResults.failed++;
    testResults.errors.push(message);
  }
}

// Test 1: Check if main navigation elements exist
console.log('\n📋 Test 1: Main Navigation Elements');

const nav = document.querySelector('nav');
logTest('Navigation element exists', !!nav);

const mobileMenuButton = document.querySelector('button[onclick*="openMobileMenu"]') || 
                        document.querySelector('button:has(svg[data-slot="icon"])');
logTest('Mobile menu button exists', !!mobileMenuButton);

const desktopMenu = document.querySelector('.hidden.lg\\:flex.lg\\:gap-x-12');
logTest('Desktop menu container exists', !!desktopMenu);

// Test 2: Check public navigation links
console.log('\n📋 Test 2: Public Navigation Links');

const publicLinks = [
  { href: '/', name: 'Главная' },
  { href: '/about', name: 'О проекте' },
  { href: '/payments', name: 'Выплаты' },
  { href: '/152fz', name: '152 ФЗ' }
];

publicLinks.forEach(link => {
  const element = document.querySelector(`a[href="${link.href}"]`);
  logTest(`${link.name} link exists`, !!element);
  if (element) {
    logTest(`${link.name} link is visible`, element.offsetParent !== null);
  }
});

// Test 3: Check authentication state and related links
console.log('\n📋 Test 3: Authentication State');

// Try to detect authentication state
const logoutButton = document.querySelector('button[onclick*="logout"]');
const loginLink = document.querySelector('a[href="/login"]');
const registerLink = document.querySelector('a[href="/register"]');

const isAuthenticated = !!logoutButton && logoutButton.offsetParent !== null;
console.log(`🔐 Authentication state: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`);

if (isAuthenticated) {
  logTest('Logout button visible when authenticated', !!logoutButton && logoutButton.offsetParent !== null);
  logTest('Login link hidden when authenticated', !loginLink || loginLink.offsetParent === null);
  logTest('Register link hidden when authenticated', !registerLink || registerLink.offsetParent === null);
  
  // Check protected links
  const protectedLinks = [
    { href: '/dashboard', name: 'Личный кабинет' },
    { href: '/profile', name: 'Профиль' },
    { href: '/agents', name: 'Агенты' },
    { href: '/projects', name: 'Проекты' },
    { href: '/finances', name: 'Финансы' }
  ];
  
  protectedLinks.forEach(link => {
    const element = document.querySelector(`a[href="${link.href}"]`);
    logTest(`${link.name} link visible when authenticated`, !!element && element.offsetParent !== null);
  });
} else {
  logTest('Login link visible when not authenticated', !!loginLink && loginLink.offsetParent !== null);
  logTest('Register link visible when not authenticated', !!registerLink && registerLink.offsetParent !== null);
  logTest('Logout button hidden when not authenticated', !logoutButton || logoutButton.offsetParent === null);
}

// Test 4: Check active link highlighting
console.log('\n📋 Test 4: Active Link Highlighting');

const currentPath = window.location.pathname;
console.log(`📍 Current path: ${currentPath}`);

const allLinks = document.querySelectorAll('nav a[href]');
let activeLinksFound = 0;

allLinks.forEach(link => {
  const href = link.getAttribute('href');
  const isCurrentPage = href === currentPath;
  const hasActiveClass = link.classList.contains('text-blue-400') || 
                       link.classList.contains('font-semibold') ||
                       link.classList.contains('bg-gray-800');
  
  if (isCurrentPage && hasActiveClass) {
    logTest(`Active highlighting for ${href}`, true);
    activeLinksFound++;
  } else if (isCurrentPage && !hasActiveClass) {
    logTest(`Missing active highlighting for ${href}`, false);
  }
});

if (activeLinksFound === 0 && currentPath !== '/test-navigation') {
  console.log('⚠️ No active links found for current path');
}

// Test 5: Mobile menu functionality
console.log('\n📋 Test 5: Mobile Menu');

const mobileMenu = document.querySelector('.lg\\:hidden[role="dialog"]');
logTest('Mobile menu container exists', !!mobileMenu);

const closeButton = document.querySelector('button[onclick*="closeMobileMenu"]');
logTest('Mobile menu close button exists', !!closeButton);

// Check if mobile menu has all the same links
if (mobileMenu) {
  publicLinks.forEach(link => {
    const mobileLink = mobileMenu.querySelector(`a[href="${link.href}"]`);
    logTest(`${link.name} exists in mobile menu`, !!mobileLink);
  });
}

// Test 6: Responsive design
console.log('\n📋 Test 6: Responsive Design');

const desktopOnlyElements = document.querySelectorAll('.hidden.lg\\:flex');
logTest('Desktop-only elements exist', desktopOnlyElements.length > 0);

const mobileOnlyElements = document.querySelectorAll('.lg\\:hidden');
logTest('Mobile-only elements exist', mobileOnlyElements.length > 0);

// Final results
console.log('\n📊 Test Results Summary:');
console.log(`✅ Passed: ${testResults.passed}`);
console.log(`❌ Failed: ${testResults.failed}`);
console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);

if (testResults.errors.length > 0) {
  console.log('\n🔍 Failed Tests:');
  testResults.errors.forEach((error, index) => {
    console.log(`${index + 1}. ${error}`);
  });
}

console.log('\n🎯 Manual Tests to Perform:');
console.log('1. Resize browser to mobile width and test mobile menu');
console.log('2. Click all navigation links to verify they work');
console.log('3. Test login/logout flow and verify menu changes');
console.log('4. Try accessing protected pages without authentication');
console.log('5. Verify active link highlighting on different pages');

// Return results for programmatic access
window.navigationTestResults = testResults;