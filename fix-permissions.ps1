Write-Host "Fixing permissions and cache issues..." -ForegroundColor Green

# Kill existing processes
Write-Host "Stopping existing processes..." -ForegroundColor Yellow
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
Stop-Process -Name electron -Force -ErrorAction SilentlyContinue

# Remove problematic directories with full permissions
Write-Host "Removing cache directories..." -ForegroundColor Yellow
$directories = @(".next", "node_modules\.cache", "out")

foreach ($dir in $directories) {
    $path = Join-Path $PSScriptRoot $dir
    if (Test-Path $path) {
        Write-Host "Removing $path" -ForegroundColor Yellow
        Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# Create starter index.js in pages to ensure compilation works
Write-Host "Creating minimal page files..." -ForegroundColor Yellow
$pagesDir = Join-Path $PSScriptRoot "src\pages"
if (-not (Test-Path $pagesDir)) {
    New-Item -ItemType Directory -Path $pagesDir -Force
}

$indexPath = Join-Path $pagesDir "index.js"
if (-not (Test-Path $indexPath)) {
    @"
import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Home() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Dashboard</Typography>
      <Typography variant="body1">Loading your productivity dashboard...</Typography>
    </Box>
  );
}
"@ | Out-File -FilePath $indexPath -Encoding utf8
}

# Update package.json scripts
Write-Host "Updating package.json scripts..." -ForegroundColor Yellow
$packageJsonPath = Join-Path $PSScriptRoot "package.json"
if (Test-Path $packageJsonPath) {
    $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
    
    # Update scripts
    $packageJson.scripts.dev = "next dev"
    $packageJson.scripts.build = "next build"
    $packageJson.scripts.start = "next start"
    $packageJson.scripts."electron-dev" = "concurrently \"npx next dev\" \"npx wait-on http-get://localhost:3000 http-get://localhost:3001 http-get://localhost:3002 http-get://localhost:3003 http-get://localhost:3004 http-get://localhost:3005 http-get://localhost:3006 -t 60000 && npx electron .\""
    
    # Save changes
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath -Encoding UTF8
}

Write-Host "Permissions and cache issues fixed!" -ForegroundColor Green
Write-Host "Now you can run: " -NoNewline
Write-Host ".\run-cmd.bat" -ForegroundColor Cyan 