# Android Studio Setup Guide for React Native

## Installation Steps

1. Download Android Studio from https://developer.android.com/studio

2. Run the installer and choose "Custom" installation when prompted

3. Select all of these components:
   - Android SDK
   - Android SDK Platform
   - Performance (Intel® HAXM)
   - Android Virtual Device
   - Android SDK Build-Tools

4. Choose the installation location (default is fine)

5. After installation completes, launch Android Studio

6. In the Android Studio welcome screen, click "More Actions" > "SDK Manager"

7. In SDK Platforms tab:
   - Check "Show Package Details"
   - Expand "Android 13.0 (Tiramisu)" (API Level 33)
   - Select:
     - Android SDK Platform 33
     - Google APIs Intel x86 Atom System Image
     - Google APIs ARM 64 v8a System Image

8. In SDK Tools tab:
   - Check "Show Package Details"
   - Select:
     - Android SDK Build-Tools 33.0.0
     - Android SDK Command-line Tools (latest)
     - Android Emulator
     - Android SDK Platform-Tools

9. Click "Apply" to download and install the selected components

10. Set up environment variables:
    - Open Windows System Properties (Win + Pause|Break)
    - Click "Advanced system settings"
    - Click "Environment Variables"
    - Under "System Variables" click "New"
    - Add:
      ```
      Variable name: ANDROID_HOME
      Variable value: C:\Users\[YourUsername]\AppData\Local\Android\Sdk
      ```
    - Select "Path" under System Variables and click "Edit"
    - Click "New" and add:
      ```
      %ANDROID_HOME%\platform-tools
      ```

11. Create an Android Virtual Device (AVD):
    - In Android Studio, click "More Actions" > "Virtual Device Manager"
    - Click "Create Virtual Device"
    - Select "Pixel 6" (or any other phone)
    - Click "Next"
    - Select "API 33" system image (download if needed)
    - Click "Next"
    - Name your AVD (e.g., "Pixel6_API33")
    - Click "Finish"

## Verification

1. Open Command Prompt and run:
   ```
   adb --version
   ```
   Should show Android Debug Bridge version

2. Run:
   ```
   android --version
   ```
   Should show Android Command Line Tools version

## Next Steps

After completing the setup:
1. Start the Android Virtual Device from Android Studio's Device Manager
2. Return to the terminal in the project directory
3. We'll start the Metro bundler and run the app

Let me know once you've completed these steps and we'll proceed with running the app.
