Write-Host "Setting up native modules..."

# Generate codegen files
Write-Host "Generating codegen files..."
npx react-native codegen

# Create necessary directories
Write-Host "Creating native module directories..."
$modules = @(
    "react-native-reanimated",
    "@react-native-async-storage/async-storage",
    "react-native-gesture-handler",
    "react-native-screens"
)

foreach ($module in $modules) {
    $path = "node_modules/$module/android/build/generated/source/codegen/jni"
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Force -Path $path
    }
}

# Create autolinking directory and file
New-Item -ItemType Directory -Force -Path "android/build/generated/autolinking"
@"
{
    "dependencies": {}
}
"@ | Out-File -FilePath "android/build/generated/autolinking/autolinking.json" -Encoding UTF8

# Clean and rebuild
Write-Host "Cleaning Android build..."
Set-Location android
./gradlew clean
Set-Location ..

Write-Host "Starting build..."
npx react-native run-android --active-arch-only

Write-Host "Native module setup complete!"

# List platforms directory content
Get-ChildItem "C:\Users\tfunk\AppData\Local\Android\Sdk\platforms"

# List build-tools directory content
Get-ChildItem "C:\Users\tfunk\AppData\Local\Android\Sdk\build-tools"
