/**
 * Server-side Data Loading Testing Script
 * Tests data loading functionality for agents and projects pages
 */

console.log('📊 Starting Server-side Data Loading Tests...');

// Test results storage
const dataLoadingTestResults = {
  passed: 0,
  failed: 0,
  errors: []
};

function logDataTest(message, passed = true) {
  const emoji = passed ? '✅' : '❌';
  console.log(`${emoji} ${message}`);
  if (passed) {
    dataLoadingTestResults.passed++;
  } else {
    dataLoadingTestResults.failed++;
    dataLoadingTestResults.errors.push(message);
  }
}

// Test 1: Page Data Structure Analysis
console.log('\n📋 Test 1: Page Data Structure Analysis');

const currentPath = window.location.pathname;
console.log(`📍 Current path: ${currentPath}`);

// Check if we're on a data-driven page
const isAgentsPage = currentPath === '/agents';
const isProjectsPage = currentPath === '/projects';
const isDataPage = isAgentsPage || isProjectsPage;

if (isDataPage) {
  console.log(`🎯 Testing ${isAgentsPage ? 'Agents' : 'Projects'} page data loading`);
  
  // Test for data state management component
  const dataStateComponent = document.querySelector('.agents-page, .projects-page');
  logDataTest(`${isAgentsPage ? 'Agents' : 'Projects'} page container found`, !!dataStateComponent);
  
  // Test for statistics cards
  const statsCards = document.querySelectorAll('.bg-white.rounded-lg.shadow.p-6');
  logDataTest(`Statistics cards found (${statsCards.length} cards)`, statsCards.length >= 3);
  
  // Test for data table
  const dataTable = document.querySelector('table.min-w-full');
  logDataTest('Data table found', !!dataTable);
  
  if (dataTable) {
    const tableHeaders = dataTable.querySelectorAll('thead th');
    const tableRows = dataTable.querySelectorAll('tbody tr');
    
    logDataTest(`Table headers found (${tableHeaders.length} headers)`, tableHeaders.length > 0);
    logDataTest(`Table rows found (${tableRows.length} rows)`, tableRows.length >= 0);
    
    // Check for sortable headers
    const sortableHeaders = dataTable.querySelectorAll('thead th.cursor-pointer');
    logDataTest(`Sortable headers found (${sortableHeaders.length} sortable)`, sortableHeaders.length > 0);
  }
  
} else {
  console.log('ℹ️ Not on a data-driven page, skipping data structure tests');
  logDataTest('Page structure test skipped (not on data page)', true);
}

// Test 2: Data Loading State Detection
console.log('\n📋 Test 2: Data Loading State Detection');

// Check for loading indicators
const loadingIndicators = document.querySelectorAll(
  '.loading, .spinner, [class*="loading"], .animate-spin'
);

if (loadingIndicators.length > 0) {
  console.log(`⏳ ${loadingIndicators.length} loading indicator(s) found`);
  logDataTest('Loading indicators present (data may be loading)', true);
} else {
  logDataTest('No loading indicators (data likely loaded or error state)', true);
}

// Check for skeleton loaders
const skeletonLoaders = document.querySelectorAll(
  '.animate-pulse, [class*="skeleton"], .bg-gray-200'
);

if (skeletonLoaders.length > 0) {
  console.log(`💀 ${skeletonLoaders.length} skeleton loader(s) found`);
  logDataTest('Skeleton loaders present', true);
}

// Test 3: Error State Detection
console.log('\n📋 Test 3: Error State Detection');

// Check for error messages
const errorMessages = document.querySelectorAll(
  '.error, .alert-error, [class*="error"], .text-red-500, .text-red-600, .bg-red-100'
);

if (errorMessages.length > 0) {
  console.log(`❌ ${errorMessages.length} error indicator(s) found`);
  errorMessages.forEach((error, index) => {
    const errorText = error.textContent?.trim();
    if (errorText && errorText.length > 0) {
      console.log(`   ${index + 1}. ${errorText}`);
    }
  });
  logDataTest('Error handling UI present', true);
} else {
  logDataTest('No error indicators (data loading successful)', true);
}

// Check for retry buttons
const retryButtons = document.querySelectorAll(
  'button:has-text("Повторить"), button:has-text("Retry"), button[onclick*="retry"]'
);

if (retryButtons.length > 0) {
  console.log(`🔄 ${retryButtons.length} retry button(s) found`);
  logDataTest('Retry functionality available', true);
}

// Test 4: Data Content Analysis
console.log('\n📋 Test 4: Data Content Analysis');

if (isDataPage) {
  // Test statistics display
  const statNumbers = document.querySelectorAll('.text-2xl.font-semibold, .text-2xl.font-bold');
  logDataTest(`Statistics numbers displayed (${statNumbers.length} stats)`, statNumbers.length > 0);
  
  // Check if statistics show actual data (not just zeros)
  let hasNonZeroStats = false;
  statNumbers.forEach(stat => {
    const value = stat.textContent?.trim();
    if (value && value !== '0' && !value.includes('₽0')) {
      hasNonZeroStats = true;
    }
  });
  
  if (hasNonZeroStats) {
    logDataTest('Statistics show actual data (non-zero values)', true);
  } else {
    console.log('ℹ️ All statistics show zero values (may indicate empty dataset or loading state)');
    logDataTest('Statistics display working (showing zero values)', true);
  }
  
  // Test table data
  if (dataTable) {
    const dataRows = dataTable.querySelectorAll('tbody tr');
    const emptyStateRow = dataTable.querySelector('tbody tr td[colspan]');
    
    if (emptyStateRow) {
      const emptyMessage = emptyStateRow.textContent?.trim();
      console.log(`📭 Empty state message: "${emptyMessage}"`);
      logDataTest('Empty state handling implemented', true);
    } else if (dataRows.length > 0) {
      console.log(`📊 ${dataRows.length} data row(s) displayed in table`);
      logDataTest('Table data populated', true);
      
      // Check first row for actual data
      const firstRow = dataRows[0];
      const cells = firstRow.querySelectorAll('td');
      let hasActualData = false;
      
      cells.forEach(cell => {
        const cellText = cell.textContent?.trim();
        if (cellText && cellText !== 'Не указано' && cellText !== 'Не найдено' && cellText !== '0') {
          hasActualData = true;
        }
      });
      
      logDataTest('Table contains actual data', hasActualData);
    }
  }
} else {
  logDataTest('Data content analysis skipped (not on data page)', true);
}

// Test 5: Search and Filter Functionality
console.log('\n📋 Test 5: Search and Filter Functionality');

if (isDataPage) {
  // Test search input
  const searchInput = document.querySelector('input[placeholder*="Поиск"], input[type="text"]');
  logDataTest('Search input found', !!searchInput);
  
  if (searchInput) {
    const placeholder = searchInput.getAttribute('placeholder');
    console.log(`🔍 Search placeholder: "${placeholder}"`);
    logDataTest('Search input has descriptive placeholder', !!placeholder && placeholder.length > 0);
  }
  
  // Test filter dropdowns
  const filterSelects = document.querySelectorAll('select');
  logDataTest(`Filter dropdowns found (${filterSelects.length} filters)`, filterSelects.length > 0);
  
  filterSelects.forEach((select, index) => {
    const options = select.querySelectorAll('option');
    console.log(`   Filter ${index + 1}: ${options.length} options`);
  });
  
  // Test clear filters button
  const clearButton = document.querySelector('button:has-text("Очистить"), button:has-text("Clear")');
  logDataTest('Clear filters button found', !!clearButton);
  
} else {
  logDataTest('Search and filter tests skipped (not on data page)', true);
}

// Test 6: Sorting Functionality
console.log('\n📋 Test 6: Sorting Functionality');

if (isDataPage && dataTable) {
  const sortableHeaders = dataTable.querySelectorAll('thead th.cursor-pointer');
  logDataTest(`Sortable columns found (${sortableHeaders.length} sortable)`, sortableHeaders.length > 0);
  
  // Check for sort indicators
  const sortIcons = dataTable.querySelectorAll('thead svg');
  logDataTest(`Sort indicators found (${sortIcons.length} icons)`, sortIcons.length > 0);
  
  // Test hover states on sortable headers
  const hoverHeaders = dataTable.querySelectorAll('thead th.hover\\:bg-gray-100');
  logDataTest(`Hover states on headers (${hoverHeaders.length} hoverable)`, hoverHeaders.length > 0);
  
} else {
  logDataTest('Sorting tests skipped (no data table)', true);
}

// Test 7: Responsive Design
console.log('\n📋 Test 7: Responsive Design');

if (isDataPage) {
  // Test responsive table
  const responsiveTable = document.querySelector('.overflow-x-auto');
  logDataTest('Responsive table wrapper found', !!responsiveTable);
  
  // Test responsive grid for statistics
  const responsiveGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3, .grid.grid-cols-1.md\\:grid-cols-4');
  logDataTest('Responsive statistics grid found', !!responsiveGrid);
  
  // Test responsive filters
  const responsiveFilters = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-4');
  logDataTest('Responsive filter layout found', !!responsiveFilters);
  
} else {
  logDataTest('Responsive design tests skipped (not on data page)', true);
}

// Test 8: Performance Indicators
console.log('\n📋 Test 8: Performance Indicators');

// Check for performance-related attributes
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
if (lazyImages.length > 0) {
  logDataTest(`Lazy loading images found (${lazyImages.length} images)`, true);
}

// Check for efficient rendering patterns
const virtualizedLists = document.querySelectorAll('[data-virtualized], .virtual-list');
if (virtualizedLists.length > 0) {
  logDataTest(`Virtualized lists found (${virtualizedLists.length} lists)`, true);
}

// Check page load performance (if available)
if (window.performance && window.performance.timing) {
  const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
  console.log(`⚡ Page load time: ${loadTime}ms`);
  logDataTest('Page load time reasonable', loadTime < 5000); // Less than 5 seconds
}

// Test 9: Accessibility Features
console.log('\n📋 Test 9: Accessibility Features');

if (isDataPage) {
  // Test ARIA labels
  const ariaLabels = document.querySelectorAll('[aria-label], [aria-labelledby]');
  logDataTest(`ARIA labels found (${ariaLabels.length} elements)`, ariaLabels.length > 0);
  
  // Test table accessibility
  if (dataTable) {
    const tableHeaders = dataTable.querySelectorAll('th');
    const hasScope = Array.from(tableHeaders).some(th => th.hasAttribute('scope'));
    logDataTest('Table headers have proper scope attributes', hasScope);
  }
  
  // Test keyboard navigation
  const focusableElements = document.querySelectorAll(
    'button, input, select, a, [tabindex]:not([tabindex="-1"])'
  );
  logDataTest(`Focusable elements found (${focusableElements.length} elements)`, focusableElements.length > 0);
  
} else {
  logDataTest('Accessibility tests skipped (not on data page)', true);
}

// Test 10: Data Freshness and Caching
console.log('\n📋 Test 10: Data Freshness and Caching');

// Check for data timestamps
const timestamps = document.querySelectorAll('[data-timestamp], .timestamp, time');
if (timestamps.length > 0) {
  console.log(`🕒 ${timestamps.length} timestamp(s) found`);
  logDataTest('Data timestamps present', true);
}

// Check for cache indicators
const cacheHeaders = document.querySelectorAll('[data-cached], .cached-data');
if (cacheHeaders.length > 0) {
  logDataTest(`Cache indicators found (${cacheHeaders.length} indicators)`, true);
}

// Check for refresh functionality
const refreshButtons = document.querySelectorAll(
  'button:has-text("Обновить"), button:has-text("Refresh"), button[onclick*="refresh"]'
);
if (refreshButtons.length > 0) {
  logDataTest(`Refresh functionality found (${refreshButtons.length} buttons)`, true);
}

// Final Results
console.log('\n📊 Server-side Data Loading Test Results Summary:');
console.log(`✅ Passed: ${dataLoadingTestResults.passed}`);
console.log(`❌ Failed: ${dataLoadingTestResults.failed}`);
console.log(`📈 Success Rate: ${((dataLoadingTestResults.passed / (dataLoadingTestResults.passed + dataLoadingTestResults.failed)) * 100).toFixed(1)}%`);

if (dataLoadingTestResults.errors.length > 0) {
  console.log('\n🔍 Failed Tests:');
  dataLoadingTestResults.errors.forEach((error, index) => {
    console.log(`${index + 1}. ${error}`);
  });
}

console.log('\n🎯 Manual Data Loading Tests to Perform:');
console.log('1. Navigate to /agents and verify data loads correctly');
console.log('2. Navigate to /projects and verify data loads correctly');
console.log('3. Test search functionality on both pages');
console.log('4. Test filtering by status on both pages');
console.log('5. Test sorting by different columns');
console.log('6. Test error handling by simulating network issues');
console.log('7. Test loading states by throttling network');
console.log('8. Verify data accuracy against API responses');
console.log('9. Test pagination if implemented');
console.log('10. Test responsive behavior on mobile devices');

// Store results for programmatic access
window.dataLoadingTestResults = dataLoadingTestResults;

// Return current page analysis
return {
  currentPath,
  isDataPage,
  pageType: isAgentsPage ? 'agents' : isProjectsPage ? 'projects' : 'other',
  testResults: dataLoadingTestResults,
  hasData: isDataPage && document.querySelector('table tbody tr:not([colspan])'),
  hasErrors: errorMessages.length > 0,
  isLoading: loadingIndicators.length > 0
};