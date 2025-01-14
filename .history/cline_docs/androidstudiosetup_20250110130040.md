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
