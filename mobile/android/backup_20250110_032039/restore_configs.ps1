# PowerShell script to restore Gradle configuration files
$filesToRestore = @(
    "gradle/wrapper/gradle-wrapper.properties",
    "build.gradle",
    "app/build.gradle",
    "settings.gradle",
    "gradle.properties",
    "version.gradle"
)

foreach ($file in $filesToRestore) {
    $sourceFile = $file
    $destFile = Join-Path ".." $file
    
    if (Test-Path $sourceFile) {
        Copy-Item $sourceFile $destFile -Force
        Write-Host "Restored: $file"
    } else {
        Write-Host "Warning: $file not found in backup"
    }
}

Write-Host "
Restore completed"
