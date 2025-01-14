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
    $env:REACT_NATIVE_PACKAGE_NAME = "com.excited_mobile"
    ./gradlew $Command
}

# Verify Java version
Write-Host "Verifying Java version..."
java -version

# Clean project
Run-GradleCommand "clean" "Cleaning project..."

# Update Gradle wrapper
Write-Host "Updating Gradle wrapper..."
./gradlew wrapper
./gradlew wrapper --gradle-version 8.10.2

# Build project
Run-GradleCommand "build" "Building project..."
