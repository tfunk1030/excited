# Stop any running Metro processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*metro*" } | Stop-Process -Force

# Clean Android build files
Write-Host "Cleaning Android build files..." -ForegroundColor Green
./gradlew clean
./gradlew cleanBuildCache

# Clean React Native caches
Write-Host "Cleaning React Native caches..." -ForegroundColor Green
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue android/app/build
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue android/.gradle
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue android/build

# Clean node_modules
Write-Host "Cleaning node_modules..." -ForegroundColor Green
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue node_modules
Remove-Item -Force -ErrorAction SilentlyContinue yarn.lock

# Clean Watchman
Write-Host "Cleaning Watchman..." -ForegroundColor Green
watchman watch-del-all

# Reinstall dependencies
Write-Host "Reinstalling dependencies..." -ForegroundColor Green
yarn install

# Validate environment
Write-Host "Validating environment..." -ForegroundColor Green
./validateEnvironment.sh

# Rebuild the project
Write-Host "Rebuilding project..." -ForegroundColor Green
./gradlew assembleDebug 