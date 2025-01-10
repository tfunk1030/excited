# PowerShell script to backup Gradle configuration files

# Create backup directory with timestamp
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "backup_$timestamp"
New-Item -ItemType Directory -Path $backupDir

# Files to backup
$filesToBackup = @(
    "gradle/wrapper/gradle-wrapper.properties",
    "build.gradle",
    "app/build.gradle",
    "settings.gradle",
    "gradle.properties",
    "version.gradle"
)

# Backup each file
foreach ($file in $filesToBackup) {
    $sourceFile = $file
    $destFile = Join-Path $backupDir $file
    
    # Create directory structure if needed
    $destDir = Split-Path -Parent $destFile
    if (!(Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir
    }
    
    # Copy file if it exists
    if (Test-Path $sourceFile) {
        Copy-Item $sourceFile $destFile -Force
        Write-Host "Backed up: $file"
    } else {
        Write-Host "Warning: $file not found"
    }
}

Write-Host "`nBackup completed in: $backupDir"

# Create restore script in backup directory
$restoreScript = @"
# PowerShell script to restore Gradle configuration files
`$filesToRestore = @(
    "gradle/wrapper/gradle-wrapper.properties",
    "build.gradle",
    "app/build.gradle",
    "settings.gradle",
    "gradle.properties",
    "version.gradle"
)

foreach (`$file in `$filesToRestore) {
    `$sourceFile = `$file
    `$destFile = Join-Path ".." `$file
    
    if (Test-Path `$sourceFile) {
        Copy-Item `$sourceFile `$destFile -Force
        Write-Host "Restored: `$file"
    } else {
        Write-Host "Warning: `$file not found in backup"
    }
}

Write-Host "`nRestore completed"
"@

Set-Content -Path (Join-Path $backupDir "restore_configs.ps1") -Value $restoreScript
Write-Host "Created restore script: restore_configs.ps1"
