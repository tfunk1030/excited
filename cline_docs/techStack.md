# Technology Stack

## Frontend Technologies
- React Native (v0.72.7)
- React Navigation (Bottom Tabs v6.5.11)
- React Native Safe Area Context (v4.8.2)
- React Native Screens (v4.4.0)
- React Native Reanimated (v3.6.1)
- React Native Fast Image (v8.6.3)

## Backend Technologies
(To be defined based on project requirements)

## Development Tools
### Android Build Tools
- Gradle (v8.10.2)
- Android Gradle Plugin (v7.3.1)
- Kotlin (v1.9.24)
- CMake (v3.31.2)
- Ninja (v1.12.1)

### Runtime Environment
- Java:
  - Launcher JVM: 11.0.2 (Oracle Corporation)
  - Daemon JVM: Eclipse Adoptium 17
- Groovy (v3.0.22)
- Ant (v1.10.14)

### SDK Configuration
- compileSdkVersion: 34
- buildToolsVersion: "35.0.0"
- minSdkVersion: 21
- targetSdkVersion: 34

## Architecture Decisions
### Android Build Configuration
- Maintaining reference configurations for consistent builds
- Version-specific build scripts for different scenarios
- Strict version control for build tools
- Comprehensive error recovery procedures

### Development Environment
- Dual JVM setup for optimal build performance
- Specific version requirements for all build tools
- Validated configuration templates

## External Dependencies
### Core Dependencies
- React Native and related packages (see Frontend Technologies)
- Android build tools and SDKs
- Java Development Kits (JDK 11 and 17)

### Build System
- Gradle build system with specific version requirements
- ProGuard for code optimization
- Custom build scripts for various scenarios

## Infrastructure
### Local Development
- Android SDK installation
- Specific tool versions and locations
- Environment variable configuration
- Build cache management

### Build Process
- Clean build procedures
- Cache management
- Version verification
- Configuration validation
- Error recovery procedures
