# Stop the Gradle daemon
Write-Host "Stopping Gradle daemon..."
./gradlew --stop

# Clear problematic Gradle caches
Write-Host "Clearing Gradle caches..."
Remove-Item -Path "$env:USERPROFILE\.gradle\caches\8.10.2" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:USERPROFILE\.gradle\caches\transforms*" -Recurse -Force -ErrorAction SilentlyContinue

# Clean the project
Write-Host "Cleaning project..."
./gradlew clean

# Clear build directory
Write-Host "Clearing build directory..."
Remove-Item -Path "build" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "app/build" -Recurse -Force -ErrorAction SilentlyContinue

# Rebuild the project
Write-Host "Rebuilding project..."
./gradlew assembleDebug --no-daemon

Write-Host "Build process completed"
