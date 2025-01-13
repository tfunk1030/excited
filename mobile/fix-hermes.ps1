# Stop any running processes
Write-Host "Stopping processes..."
Stop-Process -Name "java" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

# Clean npm cache
Write-Host "Cleaning npm cache..."
npm cache clean --force

# Remove existing node_modules
Write-Host "Removing node_modules..."
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue

# Remove package-lock.json
Write-Host "Removing package-lock.json..."
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue

# Install specific Hermes version that matches React Native
Write-Host "Installing specific Hermes version..."
npm install --save-exact hermes-engine@0.11.0

# Install remaining dependencies
Write-Host "Installing remaining dependencies..."
npm install

# Run temp-setup script for native modules
Write-Host "Setting up native modules..."
./temp-setup.ps1 