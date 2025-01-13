# Kill any running Gradle daemons
Get-Process | Where-Object { $_.ProcessName -like "*java*" -or $_.ProcessName -like "*gradle*" } | ForEach-Object {
    Write-Host "Killing process: $($_.ProcessName) (ID: $($_.Id))"
    try {
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    } catch {
        Write-Host "Could not kill process: $_"
    }
}

# Clean Gradle caches
$gradleDirs = @(
    "$env:USERPROFILE\.gradle",
    "..\node_modules\@react-native\gradle-plugin\.gradle",
    ".\.gradle"
)

foreach ($dir in $gradleDirs) {
    if (Test-Path $dir) {
        Write-Host "Cleaning $dir..."
        try {
            Get-ChildItem -Path $dir -Recurse -Force | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
        } catch {
            Write-Host "Error cleaning directory"
        }
    }
}

Write-Host "Cleanup complete. Please try your build command again."