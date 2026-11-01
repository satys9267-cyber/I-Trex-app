# I-Trex Automated Deployment Wrapper for Windows PowerShell
param(
    [string]$Message = ""
)

$ErrorActionPreference = "Stop"

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "   I-TREX INNOVATIONS // WINDOWS DEPLOYMENT SCRIPT   " -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Cyan

if ($Message -ne "") {
    node scripts/deploy.js "$Message"
} else {
    node scripts/deploy.js
}
