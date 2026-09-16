$ErrorActionPreference = 'Stop'

Write-Host "Stopping any old Node/Vite processes..." -ForegroundColor Cyan
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "Installing LLeveLL and Three.js dependencies..." -ForegroundColor Cyan
npm install

Write-Host "Starting Vite with local-network access..." -ForegroundColor Green
npm run dev -- --host 0.0.0.0
