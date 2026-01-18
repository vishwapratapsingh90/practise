# sync-to-pod.ps1 - Sync local changes to Kubernetes pod
# This script helps sync local development changes to the running Kubernetes pod

param(
    [string]$FilePath = "",
    [switch]$AllJS,
    [switch]$AllPHP,
    [switch]$Config
)

# Get the frontend pod name
$podName = kubectl get pods -l tier=frontend -o jsonpath='{.items[0].metadata.name}'

if (-not $podName) {
    Write-Host "ERROR: No frontend pod found. Is Minikube running?" -ForegroundColor Red
    exit 1
}

Write-Host "Using pod: $podName" -ForegroundColor Cyan

if ($FilePath) {
    # Sync specific file
    if (-not (Test-Path $FilePath)) {
        Write-Host "ERROR: File not found: $FilePath" -ForegroundColor Red
        exit 1
    }

    $relativePath = $FilePath -replace '^.*\\BookMyShow\\', ''
    $remotePath = "/var/www/html/$($relativePath -replace '\\', '/')"

    kubectl cp $FilePath "${podName}:${remotePath}"

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Synced: $FilePath" -ForegroundColor Green
        Write-Host "  → $remotePath" -ForegroundColor Gray
    } else {
        Write-Host "✗ Failed to sync file" -ForegroundColor Red
        exit 1
    }
}
elseif ($AllJS) {
    # Sync all JS/JSX files
    Write-Host "Syncing all JavaScript/React files..." -ForegroundColor Yellow
    kubectl cp "resources/js" "${podName}:/var/www/html/resources/js"

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Synced all JS files" -ForegroundColor Green
        Write-Host "Note: Vite should auto-reload in browser" -ForegroundColor Gray
    } else {
        Write-Host "✗ Failed to sync JS files" -ForegroundColor Red
        exit 1
    }
}
elseif ($AllPHP) {
    # Sync PHP files
    Write-Host "Syncing PHP application files..." -ForegroundColor Yellow
    kubectl cp "app" "${podName}:/var/www/html/app"
    kubectl cp "routes" "${podName}:/var/www/html/routes"

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Synced PHP files (app/, routes/)" -ForegroundColor Green
        Write-Host "Note: Laravel auto-loads changes, no restart needed" -ForegroundColor Gray
    } else {
        Write-Host "✗ Failed to sync PHP files" -ForegroundColor Red
        exit 1
    }
}
elseif ($Config) {
    # Sync configuration files
    Write-Host "Syncing configuration files..." -ForegroundColor Yellow
    kubectl cp ".env" "${podName}:/var/www/html/.env"
    kubectl cp "vite.config.js" "${podName}:/var/www/html/vite.config.js"

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Synced config files" -ForegroundColor Green
        Write-Host "Note: You may need to restart services for changes to take effect" -ForegroundColor Yellow
    } else {
        Write-Host "✗ Failed to sync config files" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host ""
    Write-Host "BookMyShow - Sync Local Changes to Kubernetes Pod" -ForegroundColor Cyan
    Write-Host "=================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\sync-to-pod.ps1 -FilePath <path>   Sync a specific file"
    Write-Host "  .\sync-to-pod.ps1 -AllJS             Sync all React/JS files"
    Write-Host "  .\sync-to-pod.ps1 -AllPHP            Sync all PHP files"
    Write-Host "  .\sync-to-pod.ps1 -Config            Sync config files (.env, vite.config.js)"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Green
    Write-Host "  .\sync-to-pod.ps1 -FilePath 'resources\js\pages\admin\ViewRoles.jsx'"
    Write-Host "  .\sync-to-pod.ps1 -FilePath 'app\Http\Controllers\RoleController.php'"
    Write-Host "  .\sync-to-pod.ps1 -AllJS"
    Write-Host "  .\sync-to-pod.ps1 -AllPHP"
    Write-Host "  .\sync-to-pod.ps1 -Config"
    Write-Host ""
}
