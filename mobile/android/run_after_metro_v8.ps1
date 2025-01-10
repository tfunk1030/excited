# Ensure Java 17 is being used
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"

# Ensure port forwarding is set up
adb reverse tcp:8081 tcp:8081

# Run pre-build validation
Write-Host "Running pre-build validation..."
./gradlew lint
./gradlew test

# Clean and build with new Gradle version
Write-Host "Cleaning project..."
./gradlew clean

Write-Host "Building debug APK..."
./gradlew assembleDebug --stacktrace

Write-Host "Installing debug APK..."
./gradlew installDebug

# Run performance checks
Write-Host "Running performance checks..."
./gradlew --stop # Ensure Gradle daemon is fresh
./gradlew assembleDebug --profile # Generate build performance report

# Run the app
Write-Host "Starting the app..."
npx react-native run-android

# Display build report location
Write-Host "Build reports available in: android/build/reports/"