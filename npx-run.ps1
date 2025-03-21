Write-Host "Starting Productivity Dashboard..." -ForegroundColor Green

# Kill any existing processes
Write-Host "Stopping previous processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name electron -ErrorAction SilentlyContinue | Stop-Process -Force

# Clean up .next directory
Write-Host "Cleaning build cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
}

# Start Next.js in a new window
Write-Host "Starting Next.js..." -ForegroundColor Cyan
Start-Process -FilePath "cmd.exe" -ArgumentList "/k npm run dev" -NoNewWindow

# Wait for Next.js to start
Write-Host "Waiting for Next.js to start (15 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Start Electron with npx to ensure it's found
Write-Host "Starting Electron..." -ForegroundColor Green
npx electron . 