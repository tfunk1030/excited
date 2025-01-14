# Android Build Version Requirements

This document specifies the exact versions of build tools required for successful Android builds. These versions are known to work together and should not be changed without thorough testing.

## Core Build Tools

- Ninja: 1.12.1
  - Location: C:\Users\tfunk\AppData\Local\Android\Sdk\ninja\ninja-win\ninja.exe
- CMake: 3.31.2
- Gradle: 7.6 (Compatible with React Native 0.72.7 and @react-native/gradle-plugin)
- Android Gradle Plugin: 7.3.1

## Runtime Versions

- Kotlin: 1.7.20
- Groovy: 3.0.22
- Ant: 1.10.14
- JVM Versions:
  - Launcher JVM: 11.0.2 (Oracle Corporation)
  - Daemon JVM: Eclipse Adoptium 17 (from org.gradle.java.home)

## Android SDK Configuration

Known working versions - DO NOT CHANGE:
- compileSdkVersion: 34
- buildToolsVersion: "35.0.0"
- minSdkVersion: 21
- targetSdkVersion: 34

## Important Notes

1. These are the EXACT versions that have been verified to work together - DO NOT USE ANY DIFFERENT VERSIONS
2. DO NOT update any versions without explicit testing and approval
3. All version changes must be documented and tested thoroughly
4. These versions are specifically chosen to work with our current setup
5. These versions represent the last known working configuration

## Version Update Process

1. Document the current working versions (as shown above)
2. Test any version updates in isolation
3. Update this document when new version combinations are verified
4. Keep backup of known working versions

## Troubleshooting

If build issues occur:
1. Verify all tool versions match these requirements exactly
2. Check tool locations match expected paths
3. Ensure JAVA_HOME and other environment variables are correctly set
4. Roll back to these known working versions if problems persist

## Version Compatibility Notes

- These specific versions are known to work together in our environment
- Do not attempt to update individual components without testing the entire toolchain
- Version changes should only be made when absolutely necessary
- Always maintain a backup of the working configuration
