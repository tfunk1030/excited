# Stop Gradle daemon
Write-Host "Stopping Gradle daemon..."
./gradlew --stop

# Clean Gradle caches
Write-Host "Cleaning Gradle caches..."
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "$env:USERPROFILE\.gradle\caches\*"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "$env:USERPROFILE\.gradle\daemon\*"
# Clean project
Write-Host "Cleaning project..."
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "build"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "app\build"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue ".gradle"

Write-Host "Clean completed"