# Create backup first
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "backup_pre_v8_$timestamp"
Write-Host "Creating backup in $backupDir"
New-Item -ItemType Directory -Path $backupDir/app -Force
Copy-Item "build.gradle" "$backupDir/"
Copy-Item "gradle.properties" "$backupDir/"
Copy-Item "settings.gradle" "$backupDir/"
Copy-Item "version.gradle" "$backupDir/"
Copy-Item "app/build.gradle" "$backupDir/app/"

# Create restore script in backup directory
@"
# Restore configuration files
Copy-Item build.gradle ../
Copy-Item gradle.properties ../
Copy-Item settings.gradle ../
Copy-Item version.gradle ../
Copy-Item app/build.gradle ../app/
"@ | Out-File "$backupDir/restore_configs.ps1"

Write-Host "Backup created. Starting updates..."

# Update build.gradle
$buildGradle = Get-Content "build.gradle" -Raw
$buildGradle = $buildGradle -replace 'androidGradlePluginVersion\s*=\s*"7.3.1"', 'androidGradlePluginVersion = "8.1.0"'
$buildGradle = $buildGradle -replace 'kotlinVersion\s*=\s*"1.7.20"', 'kotlinVersion = "1.9.24"'
$buildGradle | Set-Content "build.gradle"

# Update gradle.properties
$gradleProps = Get-Content "gradle.properties" -Raw
if (-not ($gradleProps -match "android.suppressUnsupportedCompileSdk=34")) {
    Add-Content "gradle.properties" "`nandroid.suppressUnsupportedCompileSdk=34"
}
if (-not ($gradleProps -match "android.disableAutomaticComponentCreation=true")) {
    Add-Content "gradle.properties" "`nandroid.disableAutomaticComponentCreation=true"
}

# Update Java version in app/build.gradle
$appBuildGradle = Get-Content "app/build.gradle" -Raw
if (-not ($appBuildGradle -match "compileOptions {")) {
    $appBuildGradle += @"

android {
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}
"@
    $appBuildGradle | Set-Content "app/build.gradle"
}

Write-Host "Updates completed. Please review the changes in:"
Write-Host "1. build.gradle"
Write-Host "2. gradle.properties"
Write-Host "3. app/build.gradle"
Write-Host "`nTo test the new configuration, run:"
Write-Host "./rebuild_with_cache_clear_v8.ps1"
Write-Host "`nTo rollback if needed:"
Write-Host "cd $backupDir"
Write-Host "./restore_configs.ps1"