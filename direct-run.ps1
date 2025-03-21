Write-Host "Starting direct launch..." -ForegroundColor Green

# Kill any existing Electron processes
Get-Process -Name electron -ErrorAction SilentlyContinue | Stop-Process -Force

# Check if a Next.js server is running
$portsToCheck = 3000..3010

$runningPort = $null
foreach ($port in $portsToCheck) {
    try {
        $testConnection = New-Object System.Net.Sockets.TcpClient('localhost', $port)
        if ($testConnection.Connected) {
            $runningPort = $port
            $testConnection.Close()
            break
        }
    } catch {
        # Port not available, continue checking
    }
}

if ($runningPort -eq $null) {
    Write-Host "Starting Next.js on port 3006..." -ForegroundColor Cyan
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev" -NoNewWindow
    Write-Host "Waiting 15 seconds for Next.js to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15
    $runningPort = 3006
} else {
    Write-Host "Found Next.js running on port $runningPort" -ForegroundColor Green
}

# Start Electron with direct URL
Write-Host "Starting Electron pointing to port $runningPort..." -ForegroundColor Green
$env:ELECTRON_START_URL = "http://localhost:$runningPort"
Start-Process -FilePath "cmd.exe" -ArgumentList "/c electron ." -NoNewWindow

Write-Host "Direct launch complete! Electron window should appear shortly." -ForegroundColor Green 