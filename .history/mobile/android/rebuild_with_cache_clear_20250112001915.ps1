# Stop any running Metro processes
Get-Process -Name node | Stop-Process -Force

# Clean Android build
.\gradlew clean

# Set Metro port
$env:RCT_METRO_PORT=8081

# Set up reverse port forwarding
adb reverse tcp:8081 tcp:8081

# Remove build directories and caches
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue android/app/build
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue android/.gradle
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue android/build

# Start Metro with clean cache and run the app
Set-Location ..
npx react-native start --reset-cache
