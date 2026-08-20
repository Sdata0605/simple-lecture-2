# Local-only Simple Lecture runner. Always binds this folder to port 8082.
# Do not use on production. Production keeps vite.config.ts / npm run build unchanged.

$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..\..")).Path
Set-Location $RepoRoot

$Port = 8082
Write-Host "Starting Simple Lecture locally on http://localhost:$Port"
Write-Host "Repo: $RepoRoot"

$listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
    Select-Object -First 1
if ($listener) {
    Write-Host "Port $Port is in use (PID $($listener.OwningProcess)). Stopping it..."
    Stop-Process -Id $listener.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

if (-not (Test-Path (Join-Path $RepoRoot "node_modules"))) {
    Write-Host "node_modules missing. Running npm install..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed."
    }
}

# CLI --port overrides vite.config.ts (production default stays 8080).
Write-Host "Launching Vite on 127.0.0.1:$Port (local only)..."
npx vite --host 127.0.0.1 --port $Port --strictPort
