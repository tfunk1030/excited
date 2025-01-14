# Native Configuration Properties

The following properties have been removed from app.json and need to be configured directly in the native projects:

## Android (android/app/src/main/AndroidManifest.xml)
- orientation: portrait
- icon: Set in res/mipmap folders
- userInterfaceStyle: Set in styles.xml
- splash: Configure in res/drawable and styles.xml
- adaptiveIcon: Set in res/mipmap-anydpi-v26

## iOS (ios/[ProjectName]/Info.plist)
- orientation: UISupportedInterfaceOrientations
- icon: Set in Assets.xcassets
- userInterfaceStyle: UIUserInterfaceStyle
- splash: Configure in LaunchScreen.storyboard
- bundleIdentifier: Set in project settings

## Common
- scheme: Configure in native deep linking setup
- plugins: Configure each plugin's native requirements separately

## Notes
- These configurations were previously managed through app.json
- Now using Prebuild, they must be managed in native projects directly
- Reference Expo documentation for detailed native configuration steps
- Keep this document updated when making changes to native configurations