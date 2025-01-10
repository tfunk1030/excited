# Script to fix common Gradle issues in React Native Android builds

Write-Host "Stopping Gradle daemon..."
./gradlew --stop

# Kill any running Java processes
Write-Host "Stopping Java processes..."
Get-Process -Name "*java*" -ErrorAction SilentlyContinue | Stop-Process -Force

# Set correct Java home
$javaHome = "C:\Program Files\Eclipse Adoptium\jdk-17.0.13.11-hotspot"
if (Test-Path $javaHome) {
    Write-Host "Setting JAVA_HOME to $javaHome"
    $env:JAVA_HOME = $javaHome
    
    # Also update the Path
    $env:Path = "$javaHome\bin;$env:Path"
} else {
    Write-Error "Java 17 not found at $javaHome. Please install JDK 17."
    exit 1
}

# Clean Gradle caches
Write-Host "Cleaning Gradle caches..."
$gradleHome = "$env:USERPROFILE\.gradle"
if (Test-Path $gradleHome) {
    try {
        # Remove specific problematic directories
        Remove-Item "$gradleHome\caches" -Recurse -Force -ErrorAction SilentlyContinue
        Remove-Item "$gradleHome\daemon" -Recurse -Force -ErrorAction SilentlyContinue
        Remove-Item "$gradleHome\wrapper\dists" -Recurse -Force -ErrorAction SilentlyContinue
    } catch {
        Write-Warning "Some files could not be deleted. This is normal if Gradle is still running."
    }
}

# Recreate essential directories
Write-Host "Recreating essential directories..."
New-Item -ItemType Directory -Force -Path "$gradleHome\caches" | Out-Null
New-Item -ItemType Directory -Force -Path "$gradleHome\daemon" | Out-Null
New-Item -ItemType Directory -Force -Path "$gradleHome\wrapper\dists" | Out-Null

# Clean Android build directories
Write-Host "Cleaning Android build directories..."
Remove-Item "app\build" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "build" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item ".gradle" -Recurse -Force -ErrorAction SilentlyContinue

# Update Gradle wrapper properties to use correct version
Write-Host "Updating Gradle wrapper properties..."
$wrapperContent = @"
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-7.6.3-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
"@
$wrapperPath = "gradle\wrapper\gradle-wrapper.properties"
$wrapperContent | Set-Content $wrapperPath -Force

# Update local.properties with correct SDK path
Write-Host "Updating local.properties..."
$localProperties = "local.properties"
$sdkDir = $env:ANDROID_HOME -replace "\\", "\\"
if ($sdkDir) {
    "sdk.dir=$sdkDir" | Set-Content $localProperties -Force
}

# Download and install Gradle wrapper
Write-Host "Installing Gradle wrapper..."
./gradlew wrapper --gradle-version 7.6.3 --distribution-type bin

# Clean and build project
Write-Host "Cleaning and building project..."
./gradlew clean

Write-Host "Building project with debug info..."
./gradlew assembleDebug --info

# Additional cleanup if needed
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Trying additional cleanup..."
    
    # Remove node_modules/.cache
    Remove-Item "../node_modules/.cache" -Recurse -Force -ErrorAction SilentlyContinue
    
    # Clear Metro bundler cache
    Remove-Item "$env:TEMP/metro-*" -Recurse -Force -ErrorAction SilentlyContinue
    
    # Try rebuild
    Write-Host "Attempting rebuild..."
    ./gradlew clean assembleDebug --info
}
