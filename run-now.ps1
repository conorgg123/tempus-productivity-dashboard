# PowerShell script to run the Electron app with proper error handling
Write-Host "========= STARTING PRODUCTIVITY DASHBOARD =========" -ForegroundColor Green
Write-Host "Terminating existing processes..." -ForegroundColor Yellow

# Kill any existing processes
taskkill /F /IM node.exe /T 2>$null
taskkill /F /IM electron.exe /T 2>$null
Start-Sleep -Seconds 2

# Clean build directories
Write-Host "Cleaning build cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
}
if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache"
}

# Install any missing dependencies
Write-Host "Installing required dependencies..." -ForegroundColor Yellow
npm install electron electron-builder --save-dev

# Start Next.js in a separate window
Write-Host "Starting Next.js server..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev" -NoNewWindow

# Wait for Next.js to initialize
Write-Host "Waiting for Next.js to initialize (20 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

# Find which port Next.js is running on
Write-Host "Finding Next.js port..." -ForegroundColor Yellow
$foundPort = $null
foreach ($port in 3000..3009) {
    try {
        $testConnection = New-Object System.Net.Sockets.TcpClient
        $testConnection.Connect("localhost", $port)
        if ($testConnection.Connected) {
            $foundPort = $port
            $testConnection.Close()
            Write-Host "Found Next.js running on port $foundPort" -ForegroundColor Green
            break
        }
    }
    catch {
        # Port not in use
    }
}

if ($foundPort) {
    # Start Electron pointing to the found port
    Write-Host "Starting Electron with port $foundPort..." -ForegroundColor Green
    $env:ELECTRON_START_URL = "http://localhost:$foundPort"
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c npx electron ." -NoNewWindow
    
    Write-Host "Application started! You should see the window shortly." -ForegroundColor Green
    Write-Host "If you see a blank screen:" -ForegroundColor Yellow
    Write-Host "1. Wait a few more seconds for Next.js to fully initialize" -ForegroundColor Yellow
    Write-Host "2. Try refreshing the Electron window (Ctrl+R)" -ForegroundColor Yellow
    Write-Host "3. Check the Next.js window for any error messages" -ForegroundColor Yellow
}
else {
    Write-Host "Could not find Next.js running on any port. Please check for errors." -ForegroundColor Red
} 