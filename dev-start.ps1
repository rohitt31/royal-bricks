# Royal Bricks Development Server Startup Script
# This script starts both frontend and backend servers

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Royal Bricks Development Servers" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Starting Backend Server..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host '🔧 Backend Server' -ForegroundColor Magenta; npm run dev"

Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "`nStarting Frontend Server..." -ForegroundColor Cyan
Write-Host "🎨 Frontend Server" -ForegroundColor Cyan
npm run dev

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  Both servers are running!" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:8080" -ForegroundColor Green
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green
