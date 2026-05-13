#!/usr/bin/env node

/**
 * ZHUST Command Center - Installation Verification Script
 * Run this to verify all project files are in place
 * Usage: node verify-installation.js
 */

const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;

// Required files and directories
const requiredFiles = [
  'README.md',
  'ARCHITECTURE.md',
  'DEPLOYMENT.md',
  'DEVELOPMENT.md',
  'PROJECT_SUMMARY.md',
  'INDEX.md',
  'QUICKSTART.bat',
  'QUICKSTART.sh',
  '.gitignore',
  'server/index.js',
  'server/package.json',
  'server/data.json',
  'client/package.json',
  'client/index.html',
  'client/vite.config.js',
  'client/tailwind.config.js',
  'client/postcss.config.js',
  'client/eslint.config.js',
  'client/src/App.jsx',
  'client/src/main.jsx',
  'client/src/index.css',
  'client/src/components/Navbar.jsx',
  'client/src/components/Sidebar.jsx',
  'client/src/pages/Dashboard.jsx',
  'client/src/pages/WeeklyHorizon.jsx',
  'client/src/pages/SprintBoard.jsx',
  'client/src/pages/KnowledgeVault.jsx',
  'client/src/pages/SystemToolkit.jsx',
  'client/src/hooks/useApp.js',
  'client/src/hooks/usePDFExport.js',
  'client/src/context/AppContext.jsx',
];

const requiredDirectories = [
  'server',
  'client',
  'client/src',
  'client/src/components',
  'client/src/pages',
  'client/src/hooks',
  'client/src/context',
  'client/public',
];

console.log('\n🏛️ ZHUST Command Center - Installation Verification\n');
console.log('=' .repeat(60));

let allGood = true;
let checkedCount = 0;
let missingCount = 0;

// Check directories
console.log('\n📁 Checking Directories...\n');
requiredDirectories.forEach((dir) => {
  const dirPath = path.join(projectRoot, dir);
  const exists = fs.existsSync(dirPath);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${dir}`);
  if (!exists) {
    allGood = false;
    missingCount++;
  }
  checkedCount++;
});

// Check files
console.log('\n📄 Checking Files...\n');
requiredFiles.forEach((file) => {
  const filePath = path.join(projectRoot, file);
  const exists = fs.existsSync(filePath);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${file}`);
  if (!exists) {
    allGood = false;
    missingCount++;
  }
  checkedCount++;
});

console.log('\n' + '='.repeat(60));

// Summary
console.log('\n📊 Verification Summary:\n');
console.log(`Total items checked: ${checkedCount}`);
console.log(`Items found: ${checkedCount - missingCount}`);
console.log(`Items missing: ${missingCount}`);

if (allGood) {
  console.log('\n✅ All files and directories present!');
  console.log('\n🚀 Next Steps:');
  console.log('   1. cd server && npm install');
  console.log('   2. npm run dev (in another terminal)');
  console.log('   3. cd client && npm install');
  console.log('   4. npm run dev (in another terminal)');
  console.log('   5. Open http://localhost:5173 in your browser');
} else {
  console.log('\n⚠️  Some files are missing!');
  console.log('   Make sure you extracted all files correctly.');
}

console.log('\n' + '='.repeat(60) + '\n');

process.exit(allGood ? 0 : 1);
