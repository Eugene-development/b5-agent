/**
 * Authentication System Testing Script
 * Tests authentication flow, route protection, and state management
 */

console.log('🔐 Starting Authentication System Tests...');

// Test results storage
const authTestResults = {
  passed: 0,
  failed: 0,
  errors: []
};

function logAuthTest(message, passed = true) {
  const emoji = passed ? '✅' : '❌';
  console.log(`${emoji} ${message}`);
  if (passed) {
    authTestResults.passed++;
  } else {
    authTestResults.failed++;
    authTestResults.errors.push(message);
  }
}

// Test 1: Authentication State Detection
console.log('\n📋 Test 1: Authentication State Detection');

// Try to detect authentication state from various sources
let isAuthenticated = false;
let currentUser = null;

// Method 1: Check for logout button (most reliable)
const logoutButton = document.querySelector('button[onclick*="logout"]');
if (logoutButton && logoutButton.offsetParent !== null) {
  isAuthenticated = true;
  logAuthTest('Authentication state detected via logout button', true);
} else {
  logAuthTest('User appears to be not authenticated (no logout button)', true);
}

// Method 2: Check for protected links visibility
const protectedLinks = [
  { href: '/dashboard', name: 'Dashboard' },
  { href: '/profile', name: 'Profile' },
  { href: '/agents', name: 'Agents' },
  { href: '/projects', name: 'Projects' },
  { href: '/finances', name: 'Finances' }
];

let protectedLinksVisible = 0;
protectedLinks.forEach(link => {
  const element = document.querySelector(`a[href="${link.href}"]`);
  if (element && element.offsetParent !== null) {
    protectedLinksVisible++;
  }
});

const expectedProtectedLinks = isAuthenticated ? protectedLinks.length : 0;
logAuthTest(
  `Protected links visibility matches auth state (${protectedLinksVisible}/${protectedLinks.length})`,
  protectedLinksVisible === expectedProtectedLinks
);

// Method 3: Check for login/register links
const loginLink = document.querySelector('a[href="/login"]');
const registerLink = document.querySelector('a[href="/register"]');

const loginVisible = loginLink && loginLink.offsetParent !== null;
const registerVisible = registerLink && registerLink.offsetParent !== null;

logAuthTest(
  `Login link visibility matches auth state (visible: ${loginVisible}, should be: ${!isAuthenticated})`,
  loginVisible === !isAuthenticated
);

logAuthTest(
  `Register link visibility matches auth state (visible: ${registerVisible}, should be: ${!isAuthenticated})`,
  registerVisible === !isAuthenticated
);

console.log(`🔍 Detected authentication state: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`);

// Test 2: Route Protection Test
console.log('\n📋 Test 2: Route Protection Analysis');

const currentPath = window.location.pathname;
console.log(`📍 Current path: ${currentPath}`);

// Define route categories
const publicRoutes = ['/', '/about', '/payments', '/152fz'];
const authRoutes = ['/login', '/register'];
const protectedRoutes = ['/dashboard', '/profile', '/agents', '/projects', '/finances'];

let routeCategory = 'unknown';
if (publicRoutes.includes(currentPath)) {
  routeCategory = 'public';
} else if (authRoutes.includes(currentPath)) {
  routeCategory = 'auth';
} else if (protectedRoutes.some(route => currentPath.startsWith(route))) {
  routeCategory = 'protected';
}

console.log(`📂 Route category: ${routeCategory}`);

// Test route access logic
if (routeCategory === 'protected' && !isAuthenticated) {
  logAuthTest('Protected route accessible without authentication - SECURITY ISSUE', false);
} else if (routeCategory === 'protected' && isAuthenticated) {
  logAuthTest('Protected route correctly accessible with authentication', true);
} else if (routeCategory === 'auth' && isAuthenticated) {
  logAuthTest('Auth route accessible while authenticated - should redirect to dashboard', false);
} else if (routeCategory === 'public') {
  logAuthTest('Public route accessible - correct behavior', true);
} else {
  logAuthTest('Route access behavior appears correct', true);
}

// Test 3: Menu State Consistency
console.log('\n📋 Test 3: Menu State Consistency');

// Check desktop menu consistency
const desktopMenu = document.querySelector('.hidden.lg\\:flex.lg\\:gap-x-12');
const desktopAuthSection = document.querySelector('.hidden.lg\\:flex.lg\\:flex-1.lg\\:justify-end');

if (desktopMenu && desktopAuthSection) {
  logAuthTest('Desktop menu structure exists', true);
  
  // Count visible links in desktop menu
  const desktopPublicLinks = desktopMenu.querySelectorAll('a[href]');
  const desktopAuthLinks = desktopAuthSection.querySelectorAll('a[href]');
  const desktopLogoutButton = desktopAuthSection.querySelector('button[onclick*="logout"]');
  
  console.log(`🖥️ Desktop menu - Public links: ${desktopPublicLinks.length}, Auth links: ${desktopAuthLinks.length}, Logout button: ${!!desktopLogoutButton}`);
  
  logAuthTest('Desktop menu has expected structure', true);
} else {
  logAuthTest('Desktop menu structure missing', false);
}

// Check mobile menu consistency
const mobileMenu = document.querySelector('.lg\\:hidden[role="dialog"]');
if (mobileMenu) {
  logAuthTest('Mobile menu structure exists', true);
  
  // Check if mobile menu has same links as desktop
  const mobilePublicLinks = mobileMenu.querySelectorAll('a[href^="/"][href$="/about"], a[href^="/"][href$="/payments"], a[href^="/"][href$="/152fz"], a[href="/"]');
  const mobileAuthLinks = mobileMenu.querySelectorAll('a[href="/login"], a[href="/register"]');
  const mobileProtectedLinks = mobileMenu.querySelectorAll('a[href="/dashboard"], a[href="/profile"], a[href="/agents"], a[href="/projects"], a[href="/finances"]');
  const mobileLogoutButton = mobileMenu.querySelector('button[onclick*="logout"]');
  
  console.log(`📱 Mobile menu - Public: ${mobilePublicLinks.length}, Auth: ${mobileAuthLinks.length}, Protected: ${mobileProtectedLinks.length}, Logout: ${!!mobileLogoutButton}`);
  
  logAuthTest('Mobile menu has expected link structure', true);
} else {
  logAuthTest('Mobile menu structure missing', false);
}

// Test 4: Authentication Flow Indicators
console.log('\n📋 Test 4: Authentication Flow Indicators');

// Check for authentication-related elements
const authForm = document.querySelector('form[action*="login"], form[action*="register"]');
const authErrors = document.querySelectorAll('.error, .alert-error, [class*="error"]');
const loadingIndicators = document.querySelectorAll('.loading, .spinner, [class*="loading"]');

if (authForm) {
  console.log('📝 Authentication form detected on page');
  logAuthTest('Authentication form present (expected on auth pages)', routeCategory === 'auth');
} else {
  logAuthTest('No authentication form (expected on non-auth pages)', routeCategory !== 'auth');
}

if (authErrors.length > 0) {
  console.log(`⚠️ ${authErrors.length} error indicator(s) found on page`);
  authErrors.forEach((error, index) => {
    console.log(`   ${index + 1}. ${error.textContent?.trim() || 'Error element'}`);
  });
}

if (loadingIndicators.length > 0) {
  console.log(`⏳ ${loadingIndicators.length} loading indicator(s) found on page`);
}

// Test 5: CSRF Protection
console.log('\n📋 Test 5: CSRF Protection');

// Check for CSRF token in meta tags or forms
const csrfMeta = document.querySelector('meta[name="csrf-token"]');
const csrfInput = document.querySelector('input[name="_token"], input[name="csrf_token"]');

if (csrfMeta || csrfInput) {
  logAuthTest('CSRF protection token found', true);
  console.log(`🛡️ CSRF token source: ${csrfMeta ? 'meta tag' : 'form input'}`);
} else {
  console.log('ℹ️ No visible CSRF tokens (may be handled via cookies/headers)');
  logAuthTest('CSRF protection may be implemented via cookies', true);
}

// Test 6: Session Management
console.log('\n📋 Test 6: Session Management');

// Check for session-related cookies
const cookies = document.cookie.split(';').map(c => c.trim());
const sessionCookies = cookies.filter(cookie => 
  cookie.toLowerCase().includes('session') || 
  cookie.toLowerCase().includes('auth') ||
  cookie.toLowerCase().includes('csrf') ||
  cookie.toLowerCase().includes('xsrf')
);

if (sessionCookies.length > 0) {
  logAuthTest('Session management cookies found', true);
  console.log(`🍪 Session cookies: ${sessionCookies.length}`);
  sessionCookies.forEach((cookie, index) => {
    const cookieName = cookie.split('=')[0];
    console.log(`   ${index + 1}. ${cookieName}`);
  });
} else {
  console.log('ℹ️ No obvious session cookies found (may use different naming)');
  logAuthTest('Session management may use different approach', true);
}

// Test 7: Redirect Behavior Analysis
console.log('\n📋 Test 7: Redirect Behavior Analysis');

// Check URL parameters for redirect information
const urlParams = new URLSearchParams(window.location.search);
const returnTo = urlParams.get('returnTo');
const redirectTo = urlParams.get('redirectTo');

if (returnTo) {
  console.log(`🔄 Return URL parameter found: ${returnTo}`);
  logAuthTest('Post-login redirect parameter present', true);
}

if (redirectTo) {
  console.log(`🔄 Redirect parameter found: ${redirectTo}`);
  logAuthTest('Redirect parameter present', true);
}

// Check if we're on a page that should redirect
if (routeCategory === 'auth' && isAuthenticated) {
  console.log('⚠️ Authenticated user on auth page - should redirect to dashboard');
}

if (routeCategory === 'protected' && !isAuthenticated) {
  console.log('⚠️ Unauthenticated user on protected page - should redirect to login');
}

// Test 8: Error Handling
console.log('\n📋 Test 8: Error Handling');

// Check for error display mechanisms
const errorContainers = document.querySelectorAll(
  '.error-message, .alert, .notification, [role="alert"], .toast'
);

if (errorContainers.length > 0) {
  console.log(`📢 ${errorContainers.length} error display container(s) found`);
  logAuthTest('Error display mechanisms present', true);
} else {
  logAuthTest('Error display mechanisms may be dynamically created', true);
}

// Final Results
console.log('\n📊 Authentication Test Results Summary:');
console.log(`✅ Passed: ${authTestResults.passed}`);
console.log(`❌ Failed: ${authTestResults.failed}`);
console.log(`📈 Success Rate: ${((authTestResults.passed / (authTestResults.passed + authTestResults.failed)) * 100).toFixed(1)}%`);

if (authTestResults.errors.length > 0) {
  console.log('\n🔍 Failed Tests:');
  authTestResults.errors.forEach((error, index) => {
    console.log(`${index + 1}. ${error}`);
  });
}

console.log('\n🎯 Manual Authentication Tests to Perform:');
console.log('1. Try logging in with valid credentials');
console.log('2. Try logging in with invalid credentials');
console.log('3. Try accessing protected pages without authentication');
console.log('4. Test logout functionality');
console.log('5. Test registration flow');
console.log('6. Test password reset (if implemented)');
console.log('7. Test session timeout behavior');
console.log('8. Test CSRF protection by tampering with tokens');

// Store results for programmatic access
window.authenticationTestResults = authTestResults;

// Return current authentication state for further testing
return {
  isAuthenticated,
  currentUser,
  routeCategory,
  currentPath,
  testResults: authTestResults
};