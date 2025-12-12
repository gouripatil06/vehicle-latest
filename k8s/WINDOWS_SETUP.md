# Windows Setup Guide for Kubernetes Deployment

This guide will help you set up and deploy the Vehicle Tracking System on Windows using minikube.

## Prerequisites

- Windows 10/11 (64-bit)
- Administrator access
- At least 8GB RAM (16GB recommended)
- Internet connection

---

## Step 1: Install Docker Desktop

1. Download Docker Desktop for Windows from: https://www.docker.com/products/docker-desktop
2. Run the installer and follow the setup wizard
3. **Important**: Enable WSL 2 backend when prompted (recommended)
4. Restart your computer if required
5. Open Docker Desktop and wait for it to start
6. Verify installation:
   ```powershell
   docker --version
   ```

---

## Step 2: Install kubectl

### Option A: Using Chocolatey (Recommended)
```powershell
# Open PowerShell as Administrator
choco install kubernetes-cli
```

### Option B: Manual Installation
1. Download kubectl from: https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/
2. Download the latest release (kubectl.exe)
3. Add it to your PATH:
   - Copy `kubectl.exe` to a folder (e.g., `C:\kubectl`)
   - Add that folder to your system PATH
   - Or move it to a folder already in PATH (e.g., `C:\Windows\System32`)

Verify installation:
```powershell
kubectl version --client
```

---

## Step 3: Install Minikube

### Option A: Using Chocolatey (Recommended)
```powershell
# Open PowerShell as Administrator
choco install minikube
```

### Option B: Manual Installation
1. Download minikube from: https://minikube.sigs.k8s.io/docs/start/
2. Download `minikube-windows-amd64.exe`
3. Rename it to `minikube.exe`
4. Move it to a folder in your PATH (e.g., `C:\Windows\System32`)

Verify installation:
```powershell
minikube version
```

---

## Step 4: Start Minikube

1. Open PowerShell (can be regular user, not admin)
2. Start minikube with Docker driver:
   ```powershell
   minikube start --driver=docker
   ```
3. Wait for minikube to start (this may take 2-5 minutes on first run)
4. Verify it's running:
   ```powershell
   minikube status
   kubectl get nodes
   ```

**Note**: If you get errors about Hyper-V or VirtualBox, make sure Docker Desktop is running and use the `--driver=docker` flag.

---

## Step 5: Clone the Repository

1. Open PowerShell in a folder where you want the project (e.g., `C:\Users\YourName\Projects`)
2. Clone the repository:
   ```powershell
   git clone git@github.com:gouripatil06/vehicle-latest.git
   cd vehicle-latest
   ```

**Note**: If you don't have SSH set up, use HTTPS:
```powershell
git clone https://github.com/gouripatil06/vehicle-latest.git
cd vehicle-latest
```

---

## Step 6: Set Up Secret Files

1. You should have the secret files:
   - `k8s/backend-secret.yaml`
   - `k8s/frontend-secret.yaml`

2. Place these files in the `k8s/` folder:
   ```powershell
   # Make sure these files exist
   ls k8s\*secret*.yaml
   ```

---

## Step 7: Set Up Minikube Docker Environment

Before building Docker images, you need to configure Docker to use minikube's Docker daemon:

```powershell
# This sets up the Docker environment for minikube
minikube docker-env | Invoke-Expression
```

**Important**: You need to run this command in **every new PowerShell window** before building images, OR add it to your PowerShell profile.

To add it permanently:
```powershell
# Get your PowerShell profile path
$PROFILE

# If the file doesn't exist, create it
if (!(Test-Path -Path $PROFILE)) {
    New-Item -ItemType File -Path $PROFILE -Force
}

# Add the minikube docker-env command
Add-Content $PROFILE "`n# Minikube Docker Environment`nminikube docker-env | Invoke-Expression"
```

---

## Step 8: Deploy to Kubernetes

1. Navigate to the k8s folder:
   ```powershell
   cd k8s
   ```

2. Run the deployment script:
   ```powershell
   # For fresh build (recommended first time)
   .\deploy.sh --no-cache
   
   # Or normal build (faster, uses cache)
   .\deploy.sh
   ```

**Note**: On Windows, you might need to run:
```powershell
bash deploy.sh --no-cache
```

If bash is not available, you can run the commands manually (see Step 9).

---

## Step 9: Manual Deployment (If Script Doesn't Work)

If the bash script doesn't work on Windows, follow these steps:

### 9.1: Set Minikube Docker Environment
```powershell
minikube docker-env | Invoke-Expression
```

### 9.2: Get Minikube IP
```powershell
$MINIKUBE_IP = minikube ip
$BACKEND_URL = "http://$MINIKUBE_IP:30081"
$FRONTEND_BACKEND_URL = "http://localhost:30081"
```

### 9.3: Build Backend Image
```powershell
cd ..
docker build -t vehicle-tracking-backend:latest -f backend/Dockerfile .
```

### 9.4: Build Frontend Image
```powershell
docker build `
  --build-arg NEXT_PUBLIC_API_URL="$BACKEND_URL" `
  --build-arg NEXT_PUBLIC_BACKEND_URL="$FRONTEND_BACKEND_URL" `
  --build-arg NEXT_PUBLIC_SUPABASE_URL="https://dnfdintwurgpgrpbbfti.supabase.co" `
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuZmRpbnR3dXJncGdycGJiZnRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MzM4ODYsImV4cCI6MjA3OTIwOTg4Nn0.mhxLX7bxvGh2YfNTYGo1shYt-j1d9G4AhrtF8U6m2Ik" `
  --build-arg NEXT_PUBLIC_MAPBOX_TOKEN="pk.eyJ1IjoiZ291cmk0NzkiLCJhIjoiY21pN2I3bTlpMGFpajJrb3Frb2szeWtydCJ9.aZ75dBIwULtLbzl0c3qPQA" `
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_cmVsYXhlZC1jYXRmaXNoLTI5LmNsZXJrLmFjY291bnRzLmRldiQ" `
  --build-arg SUPABASE_URL="https://dnfdintwurgpgrpbbfti.supabase.co" `
  --build-arg SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuZmRpbnR3dXJncGdycGJiZnRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzYzMzg4NiwiZXhwIjoyMDc5MjA5ODg2fQ.lmVXkZ35cd6dIvNEOzTDDCLU3qRoaCdt5tMg20deI1g" `
  --build-arg SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuZmRpbnR3dXJncGdycGJiZnRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MzM4ODYsImV4cCI6MjA3OTIwOTg4Nn0.mhxLX7bxvGh2YfNTYGo1shYt-j1d9G4AhrtF8U6m2Ik" `
  --build-arg BACKEND_URL="$BACKEND_URL" `
  --build-arg SIMULATOR_INTERVAL="2000" `
  --build-arg VEHICLE_COUNT="3" `
  -t vehicle-tracking-frontend:latest `
  -f frontend/Dockerfile .
```

### 9.5: Deploy to Kubernetes
```powershell
cd k8s

# Create namespace
kubectl apply -f namespace.yaml

# Create ConfigMaps and Secrets
kubectl apply -f backend-configmap.yaml
kubectl apply -f backend-secret.yaml
kubectl apply -f frontend-configmap.yaml
kubectl apply -f frontend-secret.yaml
kubectl apply -f prometheus-configmap.yaml

# Deploy services
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f prometheus-deployment.yaml
kubectl apply -f grafana-deployment.yaml

# Wait for deployments
kubectl wait --for=condition=available --timeout=300s deployment/backend-deployment -n vehicle-tracking
kubectl wait --for=condition=available --timeout=300s deployment/frontend-deployment -n vehicle-tracking
kubectl wait --for=condition=available --timeout=300s deployment/prometheus-deployment -n vehicle-tracking
kubectl wait --for=condition=available --timeout=300s deployment/grafana-deployment -n vehicle-tracking
```

---

## Step 10: Set Up Port Forwarding

On Windows, NodePort services work differently. You have two options:

### Option A: Use Port Forwarding (Recommended)

Create a PowerShell script `k8s/port-forward.ps1`:

```powershell
# Port Forward Script for Windows
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

# Start port forwards in background jobs
Start-Job -ScriptBlock { kubectl port-forward -n vehicle-tracking service/frontend-service 30080:3000 }
Start-Job -ScriptBlock { kubectl port-forward -n vehicle-tracking service/backend-service 30081:5001 }
Start-Job -ScriptBlock { kubectl port-forward -n vehicle-tracking service/prometheus-service 30090:9090 }
Start-Job -ScriptBlock { kubectl port-forward -n vehicle-tracking service/grafana-service 30091:3000 }

Write-Host "Port forwarding started! Check jobs with: Get-Job" -ForegroundColor Green
Write-Host "Stop all with: Get-Job | Stop-Job; Get-Job | Remove-Job" -ForegroundColor Yellow

# Keep script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host "Stopping port forwards..." -ForegroundColor Yellow
    Get-Job | Stop-Job
    Get-Job | Remove-Job
}
```

Run it:
```powershell
cd k8s
.\port-forward.ps1
```

### Option B: Use Minikube Service Command

```powershell
# Open services in browser automatically
minikube service frontend-service -n vehicle-tracking
minikube service backend-service -n vehicle-tracking
minikube service prometheus-service -n vehicle-tracking
minikube service grafana-service -n vehicle-tracking
```

---

## Step 11: Access Your Services

After port forwarding is set up, access:

- **Frontend**: http://localhost:30080
- **Backend API**: http://localhost:30081
- **Prometheus**: http://localhost:30090
- **Grafana**: http://localhost:30091

---

## Windows-Specific Differences

### 1. Path Separators
- Windows uses `\` instead of `/`
- PowerShell handles both, but be aware

### 2. Environment Variables
- Use `$env:VARIABLE` instead of `$VARIABLE` in PowerShell
- Or use `%VARIABLE%` in CMD

### 3. Script Execution
- PowerShell scripts need execution policy:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

### 4. Docker Commands
- Use backticks `` ` `` for line continuation in PowerShell
- Or use `^` in CMD

### 5. Minikube Docker Environment
- Must run `minikube docker-env | Invoke-Expression` in each new PowerShell window
- Or add to PowerShell profile for persistence

---

## Troubleshooting

### Minikube won't start
```powershell
# Check Docker is running
docker ps

# Try with explicit driver
minikube start --driver=docker

# If still fails, check logs
minikube logs
```

### Can't build Docker images
```powershell
# Make sure minikube docker-env is set
minikube docker-env | Invoke-Expression

# Verify
docker ps
```

### Port forwarding not working
```powershell
# Check if ports are already in use
netstat -ano | findstr :30080

# Kill process using port (replace PID)
taskkill /PID <PID> /F
```

### Pods not starting
```powershell
# Check pod status
kubectl get pods -n vehicle-tracking

# Check pod logs
kubectl logs <pod-name> -n vehicle-tracking

# Describe pod for errors
kubectl describe pod <pod-name> -n vehicle-tracking
```

---

## Quick Reference Commands

```powershell
# Check status
kubectl get pods -n vehicle-tracking
kubectl get services -n vehicle-tracking

# View logs
kubectl logs -f deployment/frontend-deployment -n vehicle-tracking
kubectl logs -f deployment/backend-deployment -n vehicle-tracking

# Restart a service
kubectl rollout restart deployment/frontend-deployment -n vehicle-tracking

# Delete everything
kubectl delete namespace vehicle-tracking

# Stop minikube
minikube stop

# Delete minikube cluster
minikube delete
```

---

## Next Steps

1. ✅ All services deployed and running
2. ✅ Port forwarding active
3. ✅ Access frontend at http://localhost:30080
4. ✅ Test the application

If you encounter any issues, check the logs and refer to the troubleshooting section above.
