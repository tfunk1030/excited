# React Native Android Reference Configurations

This directory contains reference configurations for React Native 0.71.x Android builds. These files serve as templates and troubleshooting guides for common issues.

## Files Overview

### Build Configuration Files
1. `gradle-wrapper.properties`
   - Defines Gradle version (7.3.1 recommended for RN 0.71.x)
   - DO NOT use Gradle 8.x until React Native 0.73
   - Controls Gradle distribution and network settings

2. `build.gradle` (root)
   - Root project configuration
   - Defines build tool versions
   - Sets up repositories
   - Configures Android Gradle Plugin version (7.3.1)

3. `app_build.gradle`
   - Application-level build configuration
   - React Native integration settings
   - Dependencies and build types
   - Java/Kotlin compatibility settings

4. `gradle.properties`
   - System-wide Gradle settings
   - React Native specific flags
   - Performance optimization settings
   - New architecture and Hermes flags

5. `settings.gradle`
   - Project structure configuration
   - Module inclusion settings
   - Native module linking

### Native Code Files
6. `MainApplication.kt`
   - Main React Native application class
   - Package registration
   - React Native host configuration
   - New architecture setup

7. `ReactNativeFlipper.java`
   - Debug tooling configuration
   - Network inspection setup
   - Database and preference inspection
   - Performance monitoring

### Build Settings Files
8. `proguard-rules.pro`
   - Code obfuscation rules
   - Keep rules for React Native
   - Native module preservation
   - Third-party library configurations

9. `local.properties`
   - Local SDK path configuration
   - NDK settings
   - Build tools configuration
   - Java home settings

## Version Compatibility Matrix

| Component               | Version | Notes                                    |
|------------------------|---------|------------------------------------------|
| React Native           | 0.71.x  | Base version for these configurations    |
| Gradle                 | 7.3.1   | DO NOT use 8.x until RN 0.73            |
| Android Gradle Plugin  | 7.3.1   | Must match Gradle version compatibility  |
| Kotlin                 | 1.7.20  | Required for RN 0.71.x                  |
| Java                   | 11/17   | Both versions supported                  |
| Build Tools            | 33.0.0  | Minimum for RN 0.71.x                   |
| compileSdk             | 33      | Target Android 13                        |
| minSdk                 | 21      | Android 5.0 minimum                      |
| targetSdk             | 33      | Match compileSdk for best compatibility |

## Common Issues and Solutions

### 1. Metadata Cache Corruption
```
Could not read workspace metadata from .gradle/caches/x.x.x/transforms/.../metadata.bin
```
Solution:
- Use correct Gradle version (7.3.1)
- Clear Gradle caches completely
- Kill all Java processes
- Rebuild with clean environment

### 2. Native Module Issues
- Verify proguard-rules.pro includes module-specific rules
- Check MainApplication.kt package registration
- Ensure settings.gradle includes all modules
- Validate native module versions

### 3. Build Process
1. Stop Gradle daemon
2. Clear caches and kill processes
3. Verify environment variables
4. Sync project with Gradle
5. Clean build
6. Rebuild with --info flag

## Usage Instructions

1. Environment Setup
   - Install correct Java version
   - Set ANDROID_HOME environment variable
   - Configure local.properties
   - Verify Android SDK installation

2. Configuration Setup
   - Compare your files with these references
   - Match versions exactly
   - Update Gradle wrapper if needed
   - Configure proguard rules

3. Build Process
   - Clean project and caches
   - Sync with Gradle files
   - Build with debug info
   - Monitor build output

4. Validation Steps
   - Verify native module initialization
   - Check Flipper integration
   - Test debug and release variants
   - Validate ProGuard configuration

## Maintenance Notes

- Keep reference files updated with RN versions
- Document any custom configurations
- Monitor dependency updates
- Maintain version compatibility
- Regular clean builds
- Backup working configurations

## Additional Resources

- [React Native Android Setup Guide](https://reactnative.dev/docs/environment-setup)
- [Android Gradle Plugin Documentation](https://developer.android.com/studio/build)
- [ProGuard Manual](https://www.guardsquare.com/manual/configuration/usage)
- [Kotlin Documentation](https://kotlinlang.org/docs/android-overview.html)
