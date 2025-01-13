Write-Host "Cleaning Gradle caches..."
Remove-Item -Path "$env:USERPROFILE\.gradle\caches" -Recurse -Force
Remove-Item -Path "android\.gradle" -Recurse -Force
Remove-Item -Path "android\app\build" -Recurse -Force

Write-Host "Running Gradle clean..."
Set-Location android
./gradlew clean
Set-Location ..

Write-Host "Rebuilding with fresh cache..."
npx expo prebuild 