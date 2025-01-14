Write-Host "🧹 Starting clean installation process..." -ForegroundColor Cyan

Write-Host "`n1. Running cleanup..." -ForegroundColor Yellow
bun run clean
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Cleanup failed" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "`n2. Installing dependencies..." -ForegroundColor Yellow
bun install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Installation failed" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "`n3. Checking dependencies..." -ForegroundColor Yellow
npx expo install --check
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Dependencies check failed" -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "`n4. Fixing dependencies..." -ForegroundColor Yellow
npx expo install --fix
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Dependencies fix failed" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-host "`n5. Running Expo doctor..." -ForegroundColor Yellow
npx expo-doctor
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Expo doctor failed" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "`n6. Running Expo prebuild..." -ForegroundColor Yellow
npx expo prebuild --clean
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prebuild failed" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "`n7. Starting development server..." -ForegroundColor Yellow
bun start