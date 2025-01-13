Write-Host "Cleaning and regenerating autolinking files..."

# Ensure we're in the correct directory
Set-Location -Path "C:\Users\tfunk\excited\mobile"

# Clean Android build
Write-Host "Cleaning Android build..."
Set-Location -Path "android"
.\gradlew clean
Set-Location -Path ".."

# Generate codegen files
Write-Host "Generating codegen files..."
npx react-native codegen

# Create the full directory structure
$autolinkingPath = "android\app\build\generated\autolinking\src\main\java"
New-Item -ItemType Directory -Force -Path $autolinkingPath

# Verify the directory was created
if (Test-Path $autolinkingPath) {
    Write-Host "Autolinking directory created successfully at: $autolinkingPath"
} else {
    Write-Host "Failed to create autolinking directory at: $autolinkingPath"
    exit 1
}

# Create autolinking.json file
$autolinkingJson = @"
{
    "dependencies": {}
}
"@
$autolinkingJsonPath = "android\app\build\generated\autolinking\autolinking.json"
$autolinkingJson | Out-File -FilePath $autolinkingJsonPath -Encoding UTF8

# Create a dummy Java file in the java directory
$dummyJavaPath = "$autolinkingPath\DummyAutoLinking.java"
@"
package com.autolinking;

public class DummyAutoLinking {
    // This is a dummy class to ensure the directory is not empty
}
"@ | Out-File -FilePath $dummyJavaPath -Encoding UTF8

Write-Host "Autolinking files regenerated!"

# Display the contents of the created directory
Write-Host "Contents of the created directory:"
Get-ChildItem -Path "android\app\build\generated\autolinking" -Recurse

Write-Host "Script completed. Please check the output above for any issues."

