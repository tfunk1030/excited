@echo off
echo Cleaning project...

cd android
call clean.bat
cd ..

echo Removing node_modules...
rmdir /s /q node_modules

echo Installing dependencies...
call npm install

echo Building Android project...
cd android
call gradlew clean
cd ..

echo Starting Metro server...
start cmd /k "npx react-native start --port 9000"

echo Starting Android build...
timeout /t 5
start cmd /k "npx react-native run-android"

echo Cleanup complete!
