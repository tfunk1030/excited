# Golf Shot Calculator - Setup Guide

## Prerequisites

1. Node.js (v16 or higher)
2. Java Development Kit (JDK) 11 or higher
3. Android Studio with:
   - Android SDK Platform 33
   - Android SDK Build-Tools
   - Android Virtual Device

## Environment Setup

1. Install Android Studio
   - Download and install Android Studio from [https://developer.android.com/studio](https://developer.android.com/studio)
   - During installation, ensure you select:
     - Android SDK
     - Android SDK Platform
     - Android Virtual Device
     - Performance (Intel HAXM)

2. Configure Android SDK
   - Open Android Studio
   - Go to Tools > SDK Manager
   - In SDK Platforms tab, select:
     - Android 13 (API Level 33)
   - In SDK Tools tab, select:
     - Android SDK Build-Tools
     - Android SDK Command-line Tools
     - Android Emulator
     - Android SDK Platform-Tools

3. Set up Environment Variables
   ```bash
   # Add these to your system environment variables
   ANDROID_HOME=C:\Users\[YourUsername]\AppData\Local\Android\Sdk
   Path=%ANDROID_HOME%\platform-tools
   ```

## Project Setup

1. Install dependencies
   ```bash
   cd mobile
   npm install
   ```

2. Create Android Virtual Device (AVD)
   - Open Android Studio
   - Go to Tools > Device Manager
   - Click "Create Virtual Device"
   - Select a device definition (e.g., Pixel 6)
   - Select a system image (API 33)
   - Complete the AVD creation

## Running the App

1. Start the Android Emulator
   - Open Android Studio
   - Go to Tools > Device Manager
   - Click the play button next to your AVD

2. Start Metro and Run the App
   ```bash
   # In one terminal:
   cd mobile
   npm start

   # In another terminal:
   cd mobile
   npm run android
   ```

## Troubleshooting

### Common Issues

1. Metro Server Port Issues
   - If port 8081 is in use:
     ```bash
     npm start -- --port 8082
     ```
   - Update the port in android/app/src/main/java/com/[projectname]/MainActivity.java

2. Permission Issues
   - Run terminal/command prompt as administrator
   - Check Android SDK permissions

3. Build Errors
   - Clean the project:
     ```bash
     cd android
     ./gradlew clean
     ```
   - Clear Metro cache:
     ```bash
     npm start -- --reset-cache
     ```

### Weather API Setup

1. API Keys
   - Create accounts and obtain API keys for:
     - Tomorrow.io
     - OpenWeatherMap
     - Google Maps (for elevation data)

2. Configure API Keys
   - Create a `.env.local` file in the mobile directory:
     ```
     TOMORROW_API_KEY=your_key_here
     OPENWEATHER_API_KEY=your_key_here
     MAPS_API_KEY=your_key_here
     ```

## Project Structure

```
mobile/
├── src/
│   ├── components/
│   │   └── shared/
│   │       └── Card.tsx
│   ├── navigation/
│   │   └── BottomTabNavigator.tsx
│   ├── screens/
│   │   ├── Weather/
│   │   │   └── WeatherScreen.tsx
│   │   └── Shot/
│   │       └── ShotScreen.tsx
│   ├── services/
│   │   ├── weatherAPI.ts
│   │   ├── weatherService.ts
│   │   └── cacheService.ts
│   └── styles/
│       └── theme.ts
└── __tests__/
    └── App.test.tsx
```

## Features Implemented

1. Weather Service
   - Real-time weather data fetching
   - Elevation data integration
   - Caching system for offline use
   - Error handling and fallback providers

2. UI Components
   - Weather display with icons
   - Shot impact calculations
   - Loading states and error handling
   - Pull-to-refresh functionality

## Next Steps

1. Shot Calculator Integration
   - Connect weather data to shot calculations
   - Implement unit conversions
   - Add shot history tracking

2. UI Polish
   - Add animations
   - Improve error messages
   - Add offline mode indicator

3. Testing
   - Add more unit tests
   - Implement integration tests
   - Add UI tests
