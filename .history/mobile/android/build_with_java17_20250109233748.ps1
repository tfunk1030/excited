# Set Java 17 environment
$env:JAVA_HOME = "C:\Users\tfunk\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Verify Java version
Write-Host "Verifying Java version..."
java -version

# Clean project
Write-Host "Cleaning project..."
./gradlew clean

# Update Gradle wrapper
Write-Host "Updating Gradle wrapper..."
./gradlew wrapper --gradle-version 8.10.2

# Build project
Write-Host "Building project..."
./gradlew build
