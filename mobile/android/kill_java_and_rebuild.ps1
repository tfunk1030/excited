# Kill all Java processes
Write-Host "Killing all Java processes..."
Get-Process java -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process javaw -ErrorAction SilentlyContinue | Stop-Process -Force

# Kill Gradle daemon
Write-Host "Stopping Gradle daemon..."
./gradlew --stop

# Clean Gradle caches
Write-Host "Cleaning Gradle caches..."
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "$env:USERPROFILE\.gradle\caches"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue ".gradle"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "build"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "app\build"

# Set Java 17 environment
$javaHome = "C:\Program Files\Eclipse Adoptium\jdk-17.0.13.11-hotspot"
$env:JAVA_HOME = $javaHome
$env:PATH = "$javaHome\bin;$env:PATH"

# Verify Java version
Write-Host "Verifying Java version..."
java -version

# Build project
Write-Host "Building project..."
./gradlew build --info
