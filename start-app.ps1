# Set the location to the script directory
Set-Location -Path $PSScriptRoot

# Run the batch file using cmd.exe directly
Write-Host "Starting app using CMD..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/c run-cmd.bat" -NoNewWindow

# Provide instructions
Write-Host "App should start momentarily." -ForegroundColor Cyan
Write-Host "You can close this window, the app will continue running in the other windows." -ForegroundColor Yellow 