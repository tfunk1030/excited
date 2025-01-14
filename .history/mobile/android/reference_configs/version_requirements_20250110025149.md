# Android Build Version Requirements

This document specifies the exact versions of build tools required for successful Android builds.

## Core Build Tools

- Ninja: 1.12.1
  - Location: C:\Users\tfunk\AppData\Local\Android\Sdk\ninja\ninja-win\ninja.exe
- CMake: 3.31.2
- Gradle: 8.10.2

## Runtime Versions

- Kotlin: 1.9.24
- Groovy: 3.0.22
- Ant: 1.10.14
- JVM Versions:
  - Launcher JVM: 11.0.2 (Oracle Corporation)
  - Daemon JVM: Eclipse Adoptium 17 (from org.gradle.java.home)

## Android SDK Configuration

Based on compatibility research:
- compileSdkVersion: 33 (maximum recommended for current setup)
- buildToolsVersion: "33.0.0"
- minSdkVersion: 21
- targetSdkVersion: 33
- Android Gradle Plugin: 7.3.1 (most stable with our Gradle version)

## Important Notes

1. These versions have been verified to work together in our build environment
2. Changing any of these versions may cause build failures
3. When updating any component, all versions should be verified for compatibility
4. Android SDK 33 is the maximum recommended version for Android Gradle Plugin 7.3.1
5. JDK 17 support requires careful configuration with Gradle 8.x

## Version Update Process

1. Document the current working versions (as shown above)
2. Test any version updates in isolation
3. Update this document when new version combinations are verified
4. Keep backup of known working versions

## Troubleshooting

If build issues occur:
1. Verify all tool versions match these requirements
2. Check tool locations match expected paths
3. Ensure JAVA_HOME and other environment variables are correctly set
4. Consider rolling back to these known working versions if problems persist

## Version Compatibility Notes

- Android Gradle Plugin 7.3.1 is recommended for stability with SDK 33
- Gradle 8.10.2 works with JDK 17, but requires proper configuration
- compileSdkVersion and targetSdkVersion should match at 33 for best compatibility
- Higher SDK versions (34+) may cause issues with current Gradle plugin version
