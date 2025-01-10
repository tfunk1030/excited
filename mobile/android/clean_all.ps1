# Stop Gradle daemon
Write-Host "Stopping Gradle daemon..."
./gradlew --stop

# Clean Gradle caches
Write-Host "Cleaning Gradle caches..."
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "$env:USERPROFILE\.gradle\caches\*"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "$env:USERPROFILE\.gradle\daemon\*"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "$env:USERPROFILE\.gradle\wrapper\*"

# Clean project
Write-Host "Cleaning project..."
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "build"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "app\build"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue ".gradle"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "gradle\wrapper\dists\*"

# Clean node_modules gradle files
Write-Host "Cleaning node_modules gradle files..."
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "..\node_modules\@react-native\gradle-plugin\.gradle"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "..\node_modules\@react-native-community\cli-platform-android\.gradle"

Write-Host "Clean completed"
