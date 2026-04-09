const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'client/src/main.jsx',
  'client/src/App.jsx',
  'client/src/index.css',
  'client/src/contexts/AuthContext.jsx',
  'client/src/contexts/LeadsContext.jsx',
  'client/src/hooks/useAuth.js',
  'client/src/hooks/useScrape.js',
  'client/src/hooks/useJobStatus.js',
  'client/src/hooks/useLeads.js',
  'client/src/hooks/useHistory.js',
  'client/src/hooks/useAnalytics.js',
  'client/src/hooks/useCredits.js',
  'client/src/api/authApi.js',
  'client/src/api/scrapeApi.js',
  'client/src/api/historyApi.js',
  'client/src/api/analyticsApi.js',
  'client/src/api/creditApi.js',
  'client/src/constants/routes.js',
  'client/src/constants/index.js',
  'client/src/utils/exportCsv.js',
  'client/src/utils/formatDate.js',
  'client/src/utils/scoreColor.js',
  'client/src/utils/validators.js',
  'client/src/components/Navbar/Navbar.jsx',
  'client/src/components/ProtectedRoute/ProtectedRoute.jsx',
  'client/src/components/ProgressBar/ProgressBar.jsx',
  'client/src/components/LeadsTable/LeadsTable.jsx',
  'client/src/components/SearchBar/SearchBar.jsx',
  'client/src/components/CreditBadge/CreditBadge.jsx',
  'client/src/components/ExportButton/ExportButton.jsx',
  'client/src/components/LeadCard/LeadCard.jsx',
  'client/src/components/ScoreBadge/ScoreBadge.jsx',
  'client/src/pages/LoginPage/LoginPage.jsx',
  'client/src/pages/RegisterPage/RegisterPage.jsx',
  'client/src/pages/HomePage/HomePage.jsx',
  'client/src/pages/ResultsPage/ResultsPage.jsx',
  'client/src/pages/HistoryPage/HistoryPage.jsx',
  'client/src/pages/AnalyticsPage/AnalyticsPage.jsx',
  'server/server.js',
  'server/worker.js',
  'server/.env.example',
  'server/package.json',
  'server/src/config/db.js',
  'server/src/config/redis.js',
  'server/src/middleware/authMiddleware.js',
  'server/src/middleware/errorHandler.js',
  'server/src/middleware/rateLimiter.js',
  'server/src/models/User.js',
  'server/src/models/Job.js',
  'server/src/models/Lead.js',
  'server/src/modules/auth/auth.routes.js',
  'server/src/modules/auth/auth.controller.js',
  'server/src/modules/scrape/scrape.routes.js',
  'server/src/modules/scrape/scrape.controller.js',
  'server/src/modules/history/history.routes.js',
  'server/src/modules/history/history.controller.js',
  'server/src/modules/analytics/analytics.routes.js',
  'server/src/modules/analytics/analytics.controller.js',
  'server/src/modules/credits/credits.routes.js',
  'server/src/modules/credits/credits.controller.js',
  'server/src/modules/enrichment/enrichLead.js',
  'server/src/queue/scrapeQueue.js',
  'server/src/scraper/mapsScraper.js',
  'server/src/scraper/websiteCrawler.js',
  'server/src/utils/creditManager.js',
  'server/src/utils/ApiError.js',
  'server/src/utils/textCleaner.js'
];

console.log('🔍 Verifying ProspectMiner AI project structure...\n');
console.log(`Expected files to check: ${requiredFiles.length}\n`);

let missingFiles = [];
let existingFiles = [];

requiredFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    existingFiles.push(file);
  } else {
    missingFiles.push(file);
  }
});

console.log('='.repeat(60));
console.log(`✅ Existing files: ${existingFiles.length}/${requiredFiles.length}`);
console.log(`❌ Missing files: ${missingFiles.length}/${requiredFiles.length}`);
console.log('='.repeat(60));

if (missingFiles.length > 0) {
  console.log('\n📋 Missing files:');
  missingFiles.forEach(file => console.log(`  - ${file}`));
  
  console.log('\n📝 Directory structure check:');
  
  const directories = [
    'client/src/hooks',
    'client/src/api',
    'client/src/constants',
    'client/src/utils',
    'client/src/contexts',
    'client/src/components/CreditBadge',
    'client/src/components/ExportButton',
    'client/src/components/LeadCard',
    'client/src/components/ScoreBadge',
    'server/src/middleware',
    'server/src/queue',
    'server/src/scraper',
    'server/src/modules/enrichment'
  ];
  
  directories.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (fs.existsSync(fullPath)) {
      console.log(`  ✅ ${dir} exists`);
    } else {
      console.log(`  ❌ ${dir} is missing - create this directory`);
    }
  });
  
  console.log('\n⚠️  Please create the missing files and directories listed above.');
} else {
  console.log('\n🎉 All files are present! Your project structure is complete.');
  console.log('\n🚀 You can now start the application:');
  console.log('   1. cd server && npm install');
  console.log('   2. Copy .env.example to .env and fill in your values');
  console.log('   3. npm run dev (in one terminal)');
  console.log('   4. npm run worker (in another terminal)');
  console.log('   5. cd ../client && npm install && npm run dev');
}

console.log('\n🔐 Environment check:');
const envPath = path.join(__dirname, 'server/.env');
if (fs.existsSync(envPath)) {
  console.log('  ✅ server/.env file exists');
} else {
  console.log('  ⚠️  server/.env file missing - copy from .env.example');
}

console.log('\n📦 Dependencies check:');
const serverNodeModules = path.join(__dirname, 'server/node_modules');
const clientNodeModules = path.join(__dirname, 'client/node_modules');

if (fs.existsSync(serverNodeModules)) {
  console.log('  ✅ Server dependencies installed');
} else {
  console.log('  ⚠️  Run: cd server && npm install');
}

if (fs.existsSync(clientNodeModules)) {
  console.log('  ✅ Client dependencies installed');
} else {
  console.log('  ⚠️  Run: cd client && npm install');
}