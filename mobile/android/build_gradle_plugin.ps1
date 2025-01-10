# Build React Native Gradle Plugin
Write-Host "Building React Native Gradle Plugin..."

# Navigate to the gradle plugin directory
Push-Location ..\node_modules\@react-native\gradle-plugin

# Run the build
./gradlew build

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "Gradle plugin built successfully"
} else {
    Write-Error "Failed to build Gradle plugin"
    exit 1
}

# Return to original directory
Pop-Location
