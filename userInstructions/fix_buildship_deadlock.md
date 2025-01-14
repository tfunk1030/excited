# Fix Buildship Deadlock Issue

If you're experiencing a Buildship deadlock in VS Code (Java processes hanging, workspace not updating), follow these steps:

1. Save all your work and close VS Code completely

2. Open PowerShell and navigate to the Android project directory:
   ```powershell
   cd mobile/android
   ```

3. Run the fix script:
   ```powershell
   powershell -ExecutionPolicy Bypass -File ./fix_buildship_deadlock.ps1
   ```

4. Wait for the script to complete. It will:
   - Kill any hanging Java processes
   - Clean the VS Code workspace metadata
   - Clean Gradle caches
   - Run Gradle clean

5. Restart VS Code

6. The workspace should now be responsive and Gradle builds should work properly.

## What the Script Does

The script performs several cleanup operations:
- Terminates all Java processes to clear any locks
- Removes Eclipse/Buildship workspace metadata that might be corrupted
- Cleans Gradle caches to ensure fresh dependency resolution
- Runs a Gradle clean to ensure a fresh build state

## Manual Steps (if script doesn't work)

If the script doesn't resolve the issue:

1. Close VS Code
2. Open Task Manager and end all Java processes
3. Delete the following directories:
   - `%APPDATA%\Code\User\workspaceStorage\.metadata`
   - `%USERPROFILE%\.gradle\caches`
   - `mobile/android/build`
   - `mobile/android/app/build`
4. Restart VS Code
5. Run `./gradlew clean --refresh-dependencies` from the android directory

## Prevention

To prevent Buildship deadlocks:
- Avoid interrupting Gradle builds
- Let VS Code finish indexing before making changes
- Keep your React Native and Gradle plugin versions in sync