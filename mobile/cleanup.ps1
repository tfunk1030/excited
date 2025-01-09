# Change to mobile directory
Set-Location mobile

Write-Host "Cleaning project..."

# Clean Android build
Set-Location android
.\gradlew.bat clean
Set-Location ..

# Remove node_modules and reinstall
Write-Host "Removing node_modules..."
if (Test-Path node_modules) {
    Remove-Item -Recurse -Force node_modules
}

Write-Host "Installing dependencies..."
npm install

Write-Host "Starting Metro server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx react-native start --port 9000"

Write-Host "Waiting for Metro server to start..."
Start-Sleep -Seconds 5

Write-Host "Starting Android build..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx react-native run-android"

Write-Host "Cleanup complete!"
