Write-Host "Fixing React Native configuration..." -ForegroundColor Green

# Check if Metro is running and kill it
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*metro*" } | Stop-Process -Force

# Clear Metro cache
Write-Host "Clearing Metro cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "$env:TEMP/metro-*"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "$env:APPDATA/Temp/metro-*"

# Reset React Native cache
Write-Host "Resetting React Native cache..." -ForegroundColor Yellow
watchman watch-del-all
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue node_modules
Remove-Item -Force -ErrorAction SilentlyContinue yarn.lock
yarn cache clean

# Reinstall dependencies
Write-Host "Reinstalling dependencies..." -ForegroundColor Yellow
yarn install

# Reset Android build
Write-Host "Resetting Android build..." -ForegroundColor Yellow
cd android
./gradlew clean
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue .gradle
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue build
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue app/build

# Rebuild Android
Write-Host "Rebuilding Android..." -ForegroundColor Yellow
./gradlew assembleDebug

# Reset ADB
Write-Host "Resetting ADB reverse port..." -ForegroundColor Yellow
adb reverse tcp:8081 tcp:8081

Write-Host "React Native fix complete! Try running your app now." -ForegroundColor Green 