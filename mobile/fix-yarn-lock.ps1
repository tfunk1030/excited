# Kill any processes that might be locking node_modules
Write-Host "Stopping processes..."
Stop-Process -Name "java" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "yarn" -Force -ErrorAction SilentlyContinue

# Remove lock files
Write-Host "Removing lock files..."
Remove-Item -Path "yarn.lock" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue

# Clean gradle plugin directory
Write-Host "Cleaning gradle plugin..."
Remove-Item -Path "node_modules\@react-native\gradle-plugin\.gradle" -Recurse -Force -ErrorAction SilentlyContinue

# Remove node_modules
Write-Host "Removing node_modules..."
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue

# Fresh install with yarn
Write-Host "Installing dependencies with yarn..."
yarn install --force 