# Check if port 8081 is in use
$portInUse = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue

if ($portInUse) {
    Write-Host "Port 8081 is in use. Attempting to free it..."
    Stop-Process -Id (Get-NetTCPConnection -LocalPort 8081).OwningProcess -Force
}

# Start the React Native development server
Set-Location $PSScriptRoot/..
npm start