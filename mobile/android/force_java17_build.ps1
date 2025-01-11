# Kill any running Gradle daemons
Write-Host "Stopping Gradle daemon..."
./gradlew --stop

# Set Java 17 environment variables
$javaHome = "C:\Program Files\Eclipse Adoptium\jdk-17.0.13.11-hotspot"
$env:JAVA_HOME = $javaHome
$env:PATH = "$javaHome\bin;$env:PATH"

# Verify Java version
Write-Host "Verifying Java version..."
java -version

# Clean Gradle cache
Write-Host "Cleaning Gradle cache..."
Remove-Item -Path "$env:USERPROFILE\.gradle\caches\8.10.2\transforms" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:USERPROFILE\.gradle\caches\transforms-*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:USERPROFILE\.gradle\caches\build-cache-*" -Recurse -Force -ErrorAction SilentlyContinue

# Clean project
Write-Host "Cleaning project..."
./gradlew clean

# Build project with debug info
Write-Host "Building project..."
./gradlew assembleDebug --info --stacktrace
