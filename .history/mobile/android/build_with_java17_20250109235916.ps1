# Set Java 17 environment
$javaHome = "C:\Users\tfunk\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2"

# Verify Java installation
if (-not (Test-Path $javaHome)) {
    Write-Error "Java 17 not found at $javaHome"
    exit 1
}

# Set environment variables
$env:JAVA_HOME = $javaHome
$env:PATH = "$javaHome\bin;$env:PATH"

# Verify Java version
Write-Host "Verifying Java version..."
java -version

# Kill any running Gradle daemons
Write-Host "Stopping Gradle daemon..."
./gradlew --stop

# Clean Gradle cache
Write-Host "Cleaning Gradle cache..."
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "C:\Users\tfunk\.gradle\caches"

# Clean project
Write-Host "Cleaning project..."
$env:JAVA_HOME = $javaHome
$env:PATH = "$javaHome\bin;$env:PATH"
./gradlew clean

# Update Gradle wrapper
Write-Host "Updating Gradle wrapper..."
$env:JAVA_HOME = $javaHome
$env:PATH = "$javaHome\bin;$env:PATH"
./gradlew wrapper --gradle-version 8.10.2

# Build project
Write-Host "Building project..."
$env:JAVA_HOME = $javaHome
$env:PATH = "$javaHome\bin;$env:PATH"
$env:REACT_NATIVE_PACKAGE_NAME = "com.excited_mobile"
./gradlew build --info
