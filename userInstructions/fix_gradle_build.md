# Fixing Gradle Build Issues

This document outlines the steps to resolve the Gradle build issues in the React Native Android project.

## Problem Description
The build is failing with a metadata cache corruption error:
```
Could not read workspace metadata from C:\Users\tfunk\.gradle\caches\8.10.2\transforms\...metadata.bin
```

## Solution Steps

1. **Stop All Java and Gradle Processes**
   - Stops any running Gradle daemons
   - Forcefully terminates any Java processes
   - Ensures no locked files or processes interfere

2. **Set Java 17 Environment**
   - Ensures the correct Java version is being used
   - React Native Android build requires Java 17
   - Sets both JAVA_HOME and PATH variables
   - Verifies Java version before proceeding

3. **Complete Gradle Reset**
   - Removes entire .gradle directory
   - Recreates essential directory structure
   - Ensures clean state without any cached artifacts
   - Prevents issues with corrupted caches

4. **Clean Android Build Directories**
   - Recursively removes all build directories
   - Removes all .gradle directories in the project
   - Uses PowerShell's Get-ChildItem for thorough cleanup
   - Handles errors gracefully with recovery attempts

5. **Reset Gradle Configuration**
   - Updates Gradle wrapper to version 8.0.0
   - Directly modifies wrapper properties file
   - Sets appropriate network timeouts
   - Validates distribution URLs

6. **Build with Enhanced Options**
   - Uses --no-daemon for clean builds
   - Adds --refresh-dependencies flag
   - Includes --info and --stacktrace for debugging
   - Implements error handling and recovery

## Usage

1. Open PowerShell in the android directory
2. Run the fix script:
   ```powershell
   ./fix_gradle_issues.ps1
   ```

## Expected Outcome
- Clean Gradle environment
- Resolved cache corruption
- Successful build completion

## Troubleshooting
If issues persist after running the script:

1. **Java Environment Issues**
   - Verify JAVA_HOME points to Java 17
   - Check PATH includes Java 17 bin directory
   - Ensure no other Java versions are in use
   - Run `java -version` to confirm

2. **Gradle Configuration**
   - Check gradle-wrapper.properties is updated
   - Verify distributionUrl points to 8.0.0
   - Ensure wrapper jar file is present
   - Review gradle.properties settings

3. **Process Issues**
   - Use Task Manager to check for stuck Java processes
   - Look for locked .gradle directories
   - Check for running Android Studio instances
   - Verify no other Gradle daemons are running

4. **Project Configuration**
   - Review build.gradle files for conflicts
   - Check React Native version compatibility
   - Verify Android SDK installation
   - Ensure all native modules are properly linked

5. **Cache Issues**
   - Manually delete %USERPROFILE%\.gradle
   - Clear Android Studio caches if installed
   - Remove project-level .gradle directory
   - Clean Android build folders

6. **Common Error Solutions**
   - Metadata cache corruption: Complete cache cleanup
   - Transform issues: Remove transforms directory
   - Daemon problems: Kill all Java processes
   - SDK issues: Verify local.properties
