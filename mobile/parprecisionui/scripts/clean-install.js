const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Directories to remove
const cleanupDirs = [
  'node_modules',
  '.expo',
  'ios/Pods',
  'android/.gradle',
  'android/app/build',
  'web-build',
  'dist',
  '.turbo'
];

// Files to remove
const cleanupFiles = [
  'yarn.lock',
  'package-lock.json',
  'pnpm-lock.yaml',
  'bun.lockb',
  'ios/Podfile.lock'
];

function cleanProject() {
  console.log('🧹 Cleaning project...');

  // Clear Metro bundler cache
  try {
    execSync('npx react-native start --reset-cache --no-interactive', { stdio: 'inherit' });
  } catch (error) {
    console.log('Note: Metro bundler cache reset attempted');
  }

  // Clear Watchman watches
  try {
    execSync('watchman watch-del-all', { stdio: 'inherit' });
  } catch (error) {
    console.log('Note: Watchman cleanup skipped (may not be installed)');
  }

  // Remove directories
  cleanupDirs.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (fs.existsSync(dirPath)) {
      console.log(`Removing ${dir}...`);
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  });

  // Remove files
  cleanupFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      console.log(`Removing ${file}...`);
      fs.unlinkSync(filePath);
    }
  });

  // Clear bun cache
  try {
    execSync('bun cache rm', { stdio: 'inherit' });
  } catch (error) {
    console.log('Note: bun cache cleanup attempted');
  }

  // Clear expo cache and check dependencies
  try {
    execSync('expo doctor --fix-dependencies', { stdio: 'inherit' });
  } catch (error) {
    console.log('Note: expo dependencies check attempted');
  }

  console.log('\n✨ Cleanup complete!\n');
  console.log('Next steps:');
  console.log('1. Run: bun install');
  console.log('2. Run: npx expo prebuild --clean');
  console.log('3. Run: bun start');
}

cleanProject();