# Android Build Configuration and Fixes

## Current Working Configuration

### Versions
- Android Gradle Plugin: 7.4.2
- Gradle: 7.6
- Kotlin: 1.9.24
- compileSdkVersion: 34
- minSdkVersion: 24
- Metro: 0.76.8
- React Native: (version from package.json)

### Key Configuration Files

1. **babel.config.js**
```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
```

2. **metro.config.js**
```javascript
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  server: {port: 8081},
  watchFolders: [],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

3. **android/build.gradle**
- Added Kotlin version resolution strategy to handle version conflicts
- Updated repositories configuration

### Steps Taken to Fix Build Issues

1. **Kotlin Version Resolution**
   - Added resolution strategy in android/build.gradle to handle Kotlin version conflicts
   - Forced consistent Kotlin version across all dependencies

2. **Metro Configuration**
   - Created metro.config.js with explicit port configuration
   - Reset Metro cache for clean build

3. **Babel Configuration**
   - Updated babel.config.js to include necessary plugins
   - Added support for React Native Reanimated

4. **Android SDK Configuration**
   - Increased minSdkVersion to 24 to support newer features
   - Updated compileSdkVersion to 34

### Current Backup Points

1. **Gradle Configurations**
   - Location: mobile/android/backup_20250110_025549/
   - Contains:
     - build.gradle
     - gradle.properties
     - settings.gradle
     - version.gradle
     - app/build.gradle

2. **Creating New Backup Point**
```powershell
# Create backup directory with timestamp
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "android/backup_$timestamp"
New-Item -ItemType Directory -Path $backupDir

# Copy critical configuration files
Copy-Item "android/build.gradle" "$backupDir/"
Copy-Item "android/gradle.properties" "$backupDir/"
Copy-Item "android/settings.gradle" "$backupDir/"
Copy-Item "android/version.gradle" "$backupDir/"
Copy-Item "android/app/build.gradle" "$backupDir/app/"

# Create restore script
@"
# Restore configuration files
Copy-Item build.gradle ../
Copy-Item gradle.properties ../
Copy-Item settings.gradle ../
Copy-Item version.gradle ../
Copy-Item app/build.gradle ../app/
"@ | Out-File "$backupDir/restore_configs.ps1"
```

### Known Issues and Solutions

1. **Kotlin Version Conflicts**
   - Symptom: Multiple Kotlin versions in dependencies
   - Solution: Use resolution strategy to force consistent version

2. **Metro Connection Issues**
   - Symptom: "No apps connected" warning
   - Solution: Use adb reverse tcp:8081 tcp:8081 and ensure correct Metro port

3. **Build Cache Issues**
   - Symptom: Inconsistent builds
   - Solution: Clean build directories and Gradle cache

### Recommended Build Process

1. Clean existing builds:
```powershell
cd android
./gradlew clean
```

2. Reset Metro cache:
```powershell
npx react-native start --reset-cache
```

3. Set up Metro connection:
```powershell
adb reverse tcp:8081 tcp:8081
```

4. Build and run:
```powershell
npx react-native run-android
```

### Future Considerations

1. **Gradle Plugin Update**
   - Current warning about compileSdkVersion 34
   - Plan to update Android Gradle Plugin when stable version available

2. **Dependency Management**
   - Regular audit of Kotlin/Java dependencies
   - Maintain consistent versions across modules

3. **Build Performance**
   - Monitor build times and cache effectiveness
   - Consider implementing build optimizations