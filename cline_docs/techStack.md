# Technology Stack

## Important Version Management Note
⚠️ Do not modify package versions independently. Always use:
```bash
npx expo install --check  # To check for compatible versions
npx expo install --fix    # To fix version mismatches
```

## Development Tools
- Expo CLI for all development operations
- EAS for all builds and updates
- Never use react-native CLI directly
- Always use expo/eas commands for:
  * Installing dependencies
  * Building apps
  * Running development servers
  * Managing updates
  * Handling assets
  * Native module linking

## Core Framework
- Expo SDK (version managed by expo install)
- React Native (version managed by expo)
- TypeScript for type safety
- Expo Router for navigation

## Key Dependencies
Note: All versions should be managed through `bun install`:
- @expo/vector-icons
- expo-router
- expo-location
- expo-updates
- react-native-reanimated
- react-native-gesture-handler
- @react-native-community/slider

## Build & Deployment
- EAS Build for all native builds
- EAS Update for OTA updates
- Never use manual build processes
- Always use EAS commands:
  * eas build
  * eas update
  * eas submit

## Development Environment
- VSCode with TypeScript support
- Expo Development Client
- EAS CLI tools
- No direct Android Studio/Xcode usage needed

## Version Management
### Do:
- Use `bun install` for all package management
- Let Expo manage version compatibility
- Use EAS for all build processes
- Follow Expo's version recommendations

### Don't:
- Manually edit package versions
- Use npm/yarn/bun directly for installs
- Mix expo and react-native CLI commands
- Override Expo's version management

## Testing
- Expo testing tools
- Jest configuration from Expo
- React Native Testing Library

## Environment & Configuration
- app.json for Expo configuration
- eas.json for build profiles
- All managed through Expo/EAS

## Notes
- Always check Expo documentation for latest practices
- Use EAS for all production workflows
- Let Expo manage native module linking
- Follow Expo's version compatibility guides
- Use `expo prebuild` for native module linking
- Use bun
