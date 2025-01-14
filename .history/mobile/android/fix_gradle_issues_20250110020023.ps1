# Stop any running Gradle daemons
Write-Host "Stopping Gradle daemon..."
./gradlew --stop

# Set Java 17 environment variables
$javaHome = "C:\Users\tfunk\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2"
$env:JAVA_HOME = $javaHome
$env:PATH = "$javaHome\bin;$env:PATH"

# Verify Java version
Write-Host "Verifying Java version..."
java -version

# Function to handle errors
function Handle-Error {
    param($ErrorMessage)
    Write-Host "Error: $ErrorMessage" -ForegroundColor Red
    Write-Host "Attempting recovery..." -ForegroundColor Yellow
}

# Clean Gradle caches thoroughly
Write-Host "Cleaning Gradle caches..."
$gradleHome = "$env:USERPROFILE\.gradle"

try {
    # Stop all Java processes
    Write-Host "Stopping Java processes..."
    Get-Process -Name "*java*" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    
    # Remove entire .gradle directory
    if (Test-Path $gradleHome) {
        Write-Host "Removing entire .gradle directory..."
        Remove-Item -Path $gradleHome -Recurse -Force
    }
    
    # Recreate essential directories
    Write-Host "Recreating essential directories..."
    New-Item -ItemType Directory -Path $gradleHome -Force | Out-Null
    New-Item -ItemType Directory -Path "$gradleHome\wrapper" -Force | Out-Null
    New-Item -ItemType Directory -Path "$gradleHome\wrapper\dists" -Force | Out-Null
} catch {
    Handle-Error $_.Exception.Message
Write-Host "Cleaning project..."
./gradlew clean

# Update Gradle wrapper
Write-Host "Updating Gradle wrapper..."
./gradlew wrapper --gradle-version 8.0.0

# Build project with debug info
Write-Host "Building project..."
./gradlew assembleDebug --info --stacktrace --no-daemon
