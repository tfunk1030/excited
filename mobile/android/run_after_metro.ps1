# Ensure port forwarding is set up
adb reverse tcp:8081 tcp:8081

# Build and run the app
./gradlew clean
./gradlew assembleDebug
./gradlew installDebug

# Run the app
npx react-native run-android