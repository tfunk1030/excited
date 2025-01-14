# Android Studio Setup for Build Updates

## Prerequisites

### 1. Android Studio Version
- **Minimum:** Arctic Fox (2020.3.1)
- **Recommended:** Giraffe (2023.2.1) or newer

### 2. SDK Components
Install via SDK Manager:
1. **SDK Platforms**
   - Android 14 (API 34)
   - Android 13 (API 33) [for backward compatibility]

2. **SDK Tools**
   - Android SDK Build-Tools 34
   - Android Emulator
   - Android SDK Platform-Tools
   - CMake
   - NDK (Side by side) - version 25.x

### 3. Command Line Tools
```bash
# Install latest command line tools
sdkmanager --install "cmdline-tools;latest"
```

---

## Required Plugins

### Core Plugins
1. **Kotlin**
   - Version: 1.9.24
   - Install via: Preferences → Plugins → Marketplace

2. **Gradle**
   - Version: 8.1
   - Install via: Preferences → Plugins → Marketplace

3. **React Native Tools**
   - Version: 0.73.0+
   - Install via: Preferences → Plugins → Marketplace

### Recommended Plugins
1. **GitToolBox**
2. **SonarLint**
3. **ADB Idea**
4. **Flutter** (if using Flutter modules)

---

## Environment Configuration

### 1. Java Development Kit (JDK)
- **Version:** 17 (Temurin recommended)
- **Installation:**
  ```bash
  # For macOS/Linux
  brew install --cask temurin17

  # For Windows
  # Download from https://adoptium.net/
  ```

- **Configuration in Android Studio:**
  1. File → Project Structure → SDK Location
  2. Set JDK location to: `/Library/Java/JavaVirtualMachines/temurin-17.jdk`

### 2. Environment Variables
Add to your shell configuration:
```bash
# ~/.zshrc or ~/.bashrc
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

---

## Project Configuration

### 1. Gradle Wrapper Update
```bash
./gradlew wrapper --gradle-version 8.1 --distribution-type all
```

### 2. Local Properties
Ensure `local.properties` contains:
```properties
sdk.dir=/Users/{username}/Library/Android/sdk
ndk.dir=/Users/{username}/Library/Android/sdk/ndk/25.2.9519653
```

### 3. Android Studio Settings
1. **Build Settings**
   - File → Settings → Build, Execution, Deployment → Build Tools → Gradle
   - Set Gradle JDK to: 17
   - Enable: "Only sync the active variant"

2. **Memory Settings**
   - Help → Change Memory Settings
   - Set to at least: 4096 MB

---

## Verification Steps

1. **Check Installation**
   ```bash
   java -version
   # Should show: java version "17.x.x"
   
   ./gradlew -v
   # Should show: Gradle 8.1
   ```

2. **Validate Android Studio Setup**
   - Build → Clean Project
   - Build → Rebuild Project
   - Run → Run 'app'

3. **Check React Native Integration**
   ```bash
   npx react-native run-android
   ```

---

## Troubleshooting

### Common Issues
1. **NDK Not Found**
   - Solution: Install NDK via SDK Manager
   - Required version: 25.x

2. **Java Version Mismatch**
   - Solution: Verify JAVA_HOME points to JDK 17

3. **Gradle Sync Failures**
   - Solution: Delete `.gradle` folder and re-sync

4. **Build Tool Version Conflicts**
   - Solution: Ensure only one version of build tools is installed
```


</rewritten_file>
