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

# Clean Gradle caches thoroughly
Write-Host "Cleaning Gradle caches..."
$gradleHome = "$env:USERPROFILE\.gradle"

# Remove specific problematic directories
$dirsToRemove = @(
    "caches\8.10.2",
    "caches\transforms-*",
    "caches\build-cache-*",
    "daemon",
    "native",
    "workers"
)

foreach ($dir in $dirsToRemove) {
    $path = Join-Path $gradleHome $dir
    if (Test-Path $path) {
        Write-Host "Removing $path..."
        Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# Clean Android build directories
Write-Host "Cleaning Android build directories..."
Remove-Item -Path "build" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "app/build" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".gradle" -Recurse -Force -ErrorAction SilentlyContinue

# Clean project
Write-Host "Cleaning project..."
./gradlew clean

# Update Gradle wrapper
Write-Host "Updating Gradle wrapper..."
./gradlew wrapper --gradle-version 8.0.0

# Build project with debug info
Write-Host "Building project..."
./gradlew assembleDebug --info --stacktrace --no-daemon
