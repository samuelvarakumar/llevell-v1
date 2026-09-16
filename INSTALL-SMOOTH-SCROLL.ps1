$ErrorActionPreference = "Stop"

Write-Host "Installing the smooth-scroll dependency..." -ForegroundColor Cyan
npm install

Write-Host "Starting the LLeveLL development server..." -ForegroundColor Green
npm run dev -- --host 0.0.0.0
