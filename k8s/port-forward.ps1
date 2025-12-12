# Port Forward Script for Windows PowerShell
# This script sets up port forwarding for all Kubernetes services

Write-Host "🔌 Setting up port forwarding for all services..." -ForegroundColor Green
Write-Host ""
Write-Host "Access your services at:" -ForegroundColor Yellow
Write-Host "  Frontend:    http://localhost:30080"
Write-Host "  Backend:     http://localhost:30081"
Write-Host "  Prometheus:  http://localhost:30090"
Write-Host "  Grafana:     http://localhost:30091"
Write-Host ""
Write-Host "Starting port forwards (press Ctrl+C to stop all)..." -ForegroundColor Green
Write-Host ""

# Function to start port forward
function Start-PortForward {
    param(
        [string]$ServiceName,
        [int]$LocalPort,
        [int]$RemotePort,
        [string]$Namespace = "vehicle-tracking"
    )
    
    $job = Start-Job -ScriptBlock {
        param($svc, $local, $remote, $ns)
        kubectl port-forward -n $ns service/$svc ${local}:${remote}
    } -ArgumentList $ServiceName, $LocalPort, $RemotePort, $Namespace
    
    Write-Host "✅ Started port forward for $ServiceName : $LocalPort -> $RemotePort" -ForegroundColor Green
    return $job
}

# Start all port forwards
$jobs = @()
$jobs += Start-PortForward -ServiceName "frontend-service" -LocalPort 30080 -RemotePort 3000
$jobs += Start-PortForward -ServiceName "backend-service" -LocalPort 30081 -RemotePort 5001
$jobs += Start-PortForward -ServiceName "prometheus-service" -LocalPort 30090 -RemotePort 9090
$jobs += Start-PortForward -ServiceName "grafana-service" -LocalPort 30091 -RemotePort 3000

Write-Host ""
Write-Host "✅ All port forwards started!" -ForegroundColor Green
Write-Host ""
Write-Host "To check status: Get-Job" -ForegroundColor Cyan
Write-Host "To view logs: Receive-Job -Id <JobId>" -ForegroundColor Cyan
Write-Host "To stop all: Get-Job | Stop-Job; Get-Job | Remove-Job" -ForegroundColor Yellow
Write-Host ""

# Keep script running and handle cleanup
try {
    while ($true) {
        Start-Sleep -Seconds 1
        
        # Check if any job failed
        $failed = Get-Job | Where-Object { $_.State -eq "Failed" }
        if ($failed) {
            Write-Host "⚠️  Some port forwards failed. Check with: Get-Job" -ForegroundColor Yellow
        }
    }
} finally {
    Write-Host ""
    Write-Host "Stopping all port forwards..." -ForegroundColor Yellow
    Get-Job | Stop-Job
    Get-Job | Remove-Job
    Write-Host "✅ All port forwards stopped." -ForegroundColor Green
}
