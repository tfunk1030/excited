# Set Java 17 environment
$env:JAVA_HOME = "C:\Users\tfunk\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

function Run-GradleCommand {
    param (
        [string]$Command,
        [string]$Description
    )
    Write-Host $Description
    $env:JAVA_HOME = "C:\Users\tfunk\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2"
    $env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
    ./gradlew $Command
}

# Verify Java version
Write-Host "Verifying Java version..."
java -version

# Clean project
Run-GradleCommand "clean" "Cleaning project..."

# Update Gradle wrapper
Run-GradleCommand "wrapper --gradle-version 8.10.2" "Updating Gradle wrapper..."

# Build project
Run-GradleCommand "build" "Building project..."
