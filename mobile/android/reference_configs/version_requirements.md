# Android Build Version Requirements

This document specifies the exact versions of build tools required for successful Android builds. These versions are known to work together and should not be changed without thorough testing.

## Core Build Tools

- Ninja: 1.12.1
  - Location: C:\Users\tfunk\AppData\Local\Android\Sdk\ninja\ninja-win\ninja.exe
- CMake: 3.31.2
- Gradle: 8.10.2
- Android Gradle Plugin: 7.3.1

## Runtime Versions

- Kotlin: 1.9.24 (DO NOT CHANGE THIS VERSION)
- Groovy: 3.0.22
- Ant: 1.10.14 (compiled on August 16 2023)
- JVM Versions:
  - Launcher JVM: 11.0.2 (Oracle Corporation)
  - Daemon JVM: Eclipse Adoptium 17 (from org.gradle.java.home)

## IMPORTANT VERSION NOTICE

These versions are FINAL and MUST NOT be changed without explicit approval. The Kotlin version 1.9.24 is especially critical - DO NOT modify this under any circumstances as it is specifically chosen to maintain compatibility with our build system.

## Android SDK Configuration

Known working versions - DO NOT CHANGE:
- compileSdkVersion: 34
- buildToolsVersion: "35.0.0"
- minSdkVersion: 21
- targetSdkVersion: 34

## Important Notes

1. These are the EXACT versions that have been verified to work together with React Native 0.72.7
2. DO NOT update any versions without explicit testing and approval
3. All version changes must be documented and tested thoroughly
4. These versions are specifically chosen to work with our current setup
5. Gradle 7.6 is required for compatibility with React Native 0.72.7 and @react-native/gradle-plugin

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
