# Android Build Quick Reference

## Common Tasks

### First Time Setup
1. Run complete rebuild with cache clear:
```powershell
./rebuild_with_cache_clear.ps1
```

2. In a new terminal, run the app:
```powershell
./run_after_metro.ps1
```

### Daily Development
- Metro is already running: Use `./run_after_metro.ps1`
- Fresh start needed: Use `./rebuild_with_cache_clear.ps1`

### Backup Current Configuration
```powershell
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "backup_$timestamp"
New-Item -ItemType Directory -Path $backupDir/app -Force
Copy-Item "build.gradle" "$backupDir/"
Copy-Item "gradle.properties" "$backupDir/"
Copy-Item "settings.gradle" "$backupDir/"
Copy-Item "version.gradle" "$backupDir/"
Copy-Item "app/build.gradle" "$backupDir/app/"
```

### Restore from Backup
1. Navigate to the backup directory
2. Run `./restore_configs.ps1`

## Troubleshooting

### Metro Connection Issues
If you see "No apps connected" warning:
```powershell
adb reverse tcp:8081 tcp:8081
```

### Build Failures
1. Clean the project:
```powershell
./gradlew clean
```

2. Remove build directories:
```powershell
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue app/build
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue .gradle
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue build
```

### For More Details
See full documentation in `cline_docs/android_build_fixes.md`