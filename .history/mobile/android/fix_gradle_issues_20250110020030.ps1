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
}

# Clean Android build directories
Write-Host "Cleaning Android build directories..."
try {
    Get-ChildItem -Path "." -Include "build", ".gradle" -Recurse -Directory | 
        ForEach-Object { Remove-Item $_.FullName -Recurse -Force }
} catch {
    Handle-Error $_.Exception.Message
}

# Update Gradle wrapper properties
Write-Host "Updating Gradle wrapper properties..."
try {
    $wrapperPath = "gradle/wrapper/gradle-wrapper.properties"
    $wrapperContent = @"
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.0.0-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
"@
    Set-Content -Path $wrapperPath -Value $wrapperContent -Force
} catch {
    Handle-Error $_.Exception.Message
}

# Clean and build project
Write-Host "Cleaning and building project..."
try {
    # Clean project
    ./gradlew clean --no-daemon --refresh-dependencies

    # Update wrapper
    ./gradlew wrapper --gradle-version 8.0.0 --no-daemon

    # Build with debug info
    Write-Host "Building project with debug info..."
    ./gradlew assembleDebug --info --stacktrace --no-daemon --refresh-dependencies
} catch {
    Handle-Error $_.Exception.Message
    Write-Host "Build failed. Check the error messages above for details." -ForegroundColor Red
    exit 1
}
