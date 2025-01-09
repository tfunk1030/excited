@echo off
echo Cleaning Android build...

REM Stop any running Android processes
adb kill-server

REM Clean Gradle cache
call gradlew clean

REM Clear Metro bundler cache
cd ..
rmdir /s /q node_modules\.cache
del /f /q node_modules\.package-lock.json

REM Clean Gradle daemon
call gradlew --stop

REM Clean Android build folders
cd android
rmdir /s /q app\build
rmdir /s /q build
rmdir /s /q .gradle

REM Clean temp files
del /f /q temp\*

REM Restart ADB server
adb start-server

echo Android build cleaned successfully!
echo.
echo Next steps:
echo 1. Run 'npm install' to reinstall dependencies
echo 2. Run 'npx react-native start --port 9000' to start Metro
echo 3. In a new terminal, run 'npx react-native run-android'
