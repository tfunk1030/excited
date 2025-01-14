# Stop on first error
$ErrorActionPreference = "Stop"

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $scriptPath/..

Write-Host "Creating temporary React Native project..."
npx @react-native-community/cli init TempProject --version 0.76.6

Write-Host "Copying package files..."
if (Test-Path "TempProject/package.json") {
    Copy-Item "TempProject/package.json" "mobile/package.json" -Force
    Copy-Item "TempProject/package-lock.json" "mobile/package-lock.json" -Force
    Write-Host "Package files copied successfully"
} else {
    Write-Host "Error: package.json not found in TempProject"
    exit 1
}

Write-Host "Cleaning up..."
Remove-Item -Recurse -Force "TempProject"

Pop-Location
Write-Host "Done" 