# Stop any running Metro processes
Get-Process -Name node | Stop-Process -Force

# Clean Android build with new Gradle version
./gradlew clean
./gradlew cleanBuildCache

# Set Metro port
$env:RCT_METRO_PORT=8081

# Set Java version for the process
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"

# Set up reverse port forwarding
adb reverse tcp:8081 tcp:8081

# Remove build directories and caches
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue android/app/build
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue android/.gradle
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue android/build

# Verify Java version
Write-Host "Using Java version:"
java -version

# Run validation checks
./gradlew lint
./gradlew test

# Start Metro with clean cache
Set-Location ..
npx react-native start --reset-cache
