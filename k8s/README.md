# Kubernetes Deployment Guide

This guide explains how to deploy the Vehicle Tracking System to Kubernetes (minikube) with all microservices: Frontend, Backend, Prometheus, and Grafana.

## Prerequisites

1. **Minikube installed and running**
   ```bash
   minikube start --driver=docker
   ```

2. **kubectl installed**
   ```bash
   kubectl version
   ```

3. **Docker installed** (for building images)

## Quick Start

### Option 1: Using the deployment script (Recommended)

```bash
cd k8s
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual deployment

1. **Set minikube docker environment**
   ```bash
   eval $(minikube docker-env)
   ```

2. **Build Docker images**
   ```bash
   docker build -t vehicle-tracking-backend:latest -f ../backend/Dockerfile ..
   docker build -t vehicle-tracking-frontend:latest -f ../frontend/Dockerfile ..
   ```

3. **Deploy to Kubernetes**
   ```bash
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
   ```

## Accessing Services

After deployment, access services using NodePort:

- **Frontend**: `http://<minikube-ip>:30080`
- **Backend API**: `http://<minikube-ip>:30081`
- **Prometheus**: `http://<minikube-ip>:30090`
- **Grafana**: `http://<minikube-ip>:30091`

To get minikube IP:
```bash
minikube ip
```

Or use minikube service command:
```bash
minikube service frontend-service -n vehicle-tracking
minikube service backend-service -n vehicle-tracking
minikube service prometheus-service -n vehicle-tracking
minikube service grafana-service -n vehicle-tracking
```

## Service Communication

### Inside Kubernetes
- Services communicate using service names:
  - Frontend → Backend: `http://backend-service:5001`
  - Prometheus → Backend: `http://backend-service:5001/api/metrics`
  - Grafana → Prometheus: `http://prometheus-service:9090`

### From Browser
- Browser accesses services via NodePort URLs:
  - Frontend: `http://<minikube-ip>:30080`
  - Backend: `http://<minikube-ip>:30081`
  - Prometheus: `http://<minikube-ip>:30090`
  - Grafana: `http://<minikube-ip>:30091`

## Useful Commands

### Check deployment status
```bash
kubectl get pods -n vehicle-tracking
kubectl get services -n vehicle-tracking
kubectl get deployments -n vehicle-tracking
```

### View logs
```bash
# Backend logs
kubectl logs -f deployment/backend-deployment -n vehicle-tracking

# Frontend logs
kubectl logs -f deployment/frontend-deployment -n vehicle-tracking

# Prometheus logs
kubectl logs -f deployment/prometheus-deployment -n vehicle-tracking

# Grafana logs
kubectl logs -f deployment/grafana-deployment -n vehicle-tracking
```

### Restart a service
```bash
kubectl rollout restart deployment/backend-deployment -n vehicle-tracking
kubectl rollout restart deployment/frontend-deployment -n vehicle-tracking
```

### Delete everything
```bash
kubectl delete namespace vehicle-tracking
```

## Configuring Grafana

1. Access Grafana at `http://<minikube-ip>:30091`
2. Login with:
   - Username: `admin`
   - Password: `admin`
3. Add Prometheus as data source:
   - URL: `http://prometheus-service:9090`
   - Access: Server (default)
4. Create dashboards using Prometheus metrics

## Troubleshooting

### Pods not starting
```bash
kubectl describe pod <pod-name> -n vehicle-tracking
kubectl logs <pod-name> -n vehicle-tracking
```

### Images not found
Make sure you've built images with minikube docker environment:
```bash
eval $(minikube docker-env)
docker images | grep vehicle-tracking
```

### Services not accessible
Check if services are running:
```bash
kubectl get svc -n vehicle-tracking
minikube service list
```

### Port conflicts
If ports 30080, 30081, 30090, or 30091 are in use, modify the `nodePort` values in the service YAML files.

## Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│         Kubernetes (minikube)            │
│                                          │
│  ┌──────────────┐      ┌──────────────┐ │
│  │   Frontend   │─────▶│   Backend    │ │
│  │  (Next.js)   │      │  (Express)   │ │
│  │  Port: 3000  │      │  Port: 5001  │ │
│  │ NodePort:    │      │ NodePort:    │ │
│  │    30080     │      │    30081     │ │
│  └──────────────┘      └──────┬───────┘ │
│                               │         │
│                               ▼         │
│                        ┌──────────────┐  │
│                        │  Prometheus  │  │
│                        │  Port: 9090  │  │
│                        │ NodePort:   │  │
│                        │    30090    │  │
│                        └──────┬──────┘  │
│                               │         │
│                               ▼         │
│                        ┌──────────────┐  │
│                        │   Grafana    │  │
│                        │  Port: 3000  │  │
│                        │ NodePort:    │  │
│                        │    30091     │  │
│                        └──────────────┘  │
└──────────────────────────────────────────┘
```
