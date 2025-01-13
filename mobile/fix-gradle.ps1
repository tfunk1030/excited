# Stop Java and Metro processes
Write-Host "Stopping Java and Metro processes..."
Stop-Process -Name "java" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

# Remove Gradle caches
Write-Host "Removing Gradle caches..."
Remove-Item -Path "$env:USERPROFILE\.gradle\caches" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "android\.gradle" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "android\app\build" -Recurse -Force -ErrorAction SilentlyContinue

# Clean Android build
Write-Host "Cleaning Android build..."
Set-Location android
./gradlew clean
Set-Location ..

# Ensure ADB is connected
Write-Host "Setting up ADB connection..."
adb kill-server
adb start-server
adb reverse tcp:8081 tcp:8081

# Start Metro in a new window
Write-Host "Starting Metro bundler..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx expo start --clear"

# Wait for Metro to start
Write-Host "Waiting for Metro to initialize..."
Start-Sleep -Seconds 15

# Regenerate autolinking files
Write-Host "Regenerating autolinking files..."
$autolinkingPath = "android\app\build\generated\autolinking"
New-Item -ItemType Directory -Force -Path $autolinkingPath
@"
{
    "dependencies": {}
}
"@ | Out-File -FilePath "$autolinkingPath\autolinking.json" -Encoding UTF8

# Rebuild with fresh configuration
Write-Host "Rebuilding project..."
npx expo prebuild
npx expo run:android --no-bundler 