# Stop all Java and Gradle processes
Write-Host "Stopping Java and Gradle processes..."
Stop-Process -Name "java" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "adb" -Force -ErrorAction SilentlyContinue

# Remove Gradle caches
Write-Host "Removing Gradle caches..."
Remove-Item -Path "$env:USERPROFILE\.gradle\caches" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".gradle" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "app\build" -Recurse -Force -ErrorAction SilentlyContinue

# Clean Android build
Write-Host "Cleaning Android build..."
./gradlew clean --refresh-dependencies

# Set up ADB
Write-Host "Setting up ADB..."
adb kill-server
adb start-server
adb reverse tcp:8081 tcp:8081

Write-Host "Gradle cleanup complete!" 