$ErrorActionPreference = "Stop"

Write-Host "Cleaning old dependencies..." -ForegroundColor Cyan

if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
}

if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
}

Write-Host "Installing corrected dependencies..." -ForegroundColor Cyan
npm install

Write-Host "Starting NOVA website..." -ForegroundColor Green
npm run dev
