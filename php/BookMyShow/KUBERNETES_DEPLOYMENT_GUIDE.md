# Complete Guide: Deploying a Laravel + React Application on Kubernetes with Minikube

## Introduction

As a beginner stepping into the world of Kubernetes, deploying a full-stack application can seem overwhelming. In this comprehensive guide, I'll walk you through deploying a Laravel + React application (BookMyShow) on Kubernetes using Minikube on Windows. By the end of this guide, you'll understand not just *how* to deploy, but *why* each step matters.

## What is Kubernetes and Why Use It?

**Kubernetes** (often abbreviated as K8s) is an open-source container orchestration platform. Think of it as an intelligent manager that:

- Automatically deploys and manages containers
- Scales applications up or down based on demand
- Handles service discovery and load balancing
- Self-heals by restarting failed containers

**Minikube** is a lightweight Kubernetes implementation that creates a local Kubernetes cluster on your machine—perfect for learning and development.

## Prerequisites

Before we begin, ensure you have the following installed on your Windows machine:

1. **Docker Desktop** - Provides containerization capabilities
2. **Minikube** - Local Kubernetes cluster
3. **kubectl** - Command-line tool for interacting with Kubernetes

### Verify Installation

Open PowerShell and verify installations:

```powershell
# Check Docker
docker --version

# Check Minikube
minikube version

# Check kubectl
kubectl version --client
```

## Understanding the Architecture

Our application consists of multiple components:

```
┌─────────────────────────────────────────┐
│         Kubernetes Cluster              │
│                                         │
│  ┌────────────┐  ┌──────────────┐     │
│  │   Laravel  │  │    MySQL     │     │
│  │  + React   │──│   Database   │     │
│  │   (Pod)    │  │    (Pod)     │     │
│  └────────────┘  └──────────────┘     │
│         │                               │
│         │         ┌──────────────┐     │
│         └─────────│    Redis     │     │
│                   │    (Pod)     │     │
│                   └──────────────┘     │
│                                         │
│         ┌──────────────┐               │
│         │  phpMyAdmin  │               │
│         │    (Pod)     │               │
│         └──────────────┘               │
└─────────────────────────────────────────┘
```

## Key Kubernetes Concepts Explained

### 1. Pods
A **Pod** is the smallest deployable unit in Kubernetes. It's a wrapper around one or more containers. In our case, we have separate pods for:
- Laravel application
- MySQL database
- Redis cache
- phpMyAdmin

### 2. Deployments
A **Deployment** describes the desired state for your pods. It ensures the specified number of pod replicas are running and handles updates.

### 3. Services
A **Service** provides a stable network endpoint to access pods. Even when pods restart and get new IP addresses, the service remains constant.

### 4. Persistent Volumes
**Persistent Volumes (PV)** provide storage that persists beyond pod lifecycles. Essential for databases where data must survive pod restarts.

### 5. Secrets
**Secrets** store sensitive information like passwords and API keys securely.

### 6. Init Containers
**Init Containers** run before the main application container starts. They're perfect for setup tasks like installing dependencies.

## Step-by-Step Deployment Guide

### Step 1: Start Minikube

First, ensure Docker Desktop is running, then start Minikube:

```powershell
minikube start
```

**What happens here?**
- Minikube creates a virtual machine
- Installs Kubernetes components
- Sets up a single-node cluster

### Step 2: Configure Docker Environment

When building Docker images for Minikube, we need to use Minikube's Docker daemon instead of Docker Desktop's:

```powershell
minikube -p minikube docker-env --shell powershell | Invoke-Expression
```

**Why is this important?**
When you build an image using your local Docker, Minikube can't see it because it runs in its own VM. This command configures your terminal to use Minikube's Docker daemon, so images you build are directly accessible to Minikube.

### Step 3: Build Your Application Image

```powershell
docker build -t sail-8.5/app:latest .
```

**Understanding the Dockerfile:**
Your Dockerfile typically:
1. Starts from a base PHP image with necessary extensions
2. Installs Composer dependencies
3. Copies application code
4. Sets up permissions
5. Configures the web server

### Step 4: Deploy in the Correct Order

Kubernetes resources must be deployed in a specific order:

```powershell
# 1. Secrets first (needed by other services)
kubectl apply -f k8s\secrets.yaml

# 2. Storage volumes
kubectl apply -f k8s\persistent-volumes.yaml

# 3. Database and supporting services
kubectl apply -f k8s\mysql-deployment.yaml
kubectl apply -f k8s\redis-deployment.yaml
kubectl apply -f k8s\phpmyadmin-deployment.yaml

# 4. Wait for database to be ready
kubectl wait --for=condition=ready pod -l tier=database --timeout=120s

# 5. Finally, deploy the application
kubectl apply -f k8s\deployment.yaml
kubectl apply -f k8s\service.yaml

# 6. Wait for application to be ready
kubectl wait --for=condition=ready pod -l tier=frontend --timeout=120s
```

**Why this order?**
- Secrets must exist before services reference them
- Databases must be ready before applications try to connect
- The `kubectl wait` command ensures each layer is fully operational before proceeding

### Step 5: Initialize the Database

Once pods are running, initialize your database:

```powershell
# Get the pod name dynamically
$podName = kubectl get pods -l tier=frontend -o jsonpath='{.items[0].metadata.name}'

# Run migrations
kubectl exec -it $podName -- php artisan migrate

# Seed database with sample data
kubectl exec -it $podName -- php artisan db:seed
```

**Understanding `kubectl exec`:**
This command runs a command inside a running container, similar to SSH-ing into a server. The `-it` flags mean:
- `-i`: Keep stdin open (interactive)
- `-t`: Allocate a pseudo-TTY (terminal)

### Step 6: Start the Development Server

For Laravel + React applications using Vite, we need to start the Vite development server:

```powershell
kubectl exec -it $podName -- npm run dev -- --host 0.0.0.0
```

**Why `--host 0.0.0.0`?**
By default, Vite binds to `localhost`, which is only accessible from within the container. Using `0.0.0.0` makes it accessible from outside the container.

### Step 7: Handle CORS with Port Forwarding

Modern web development often involves CORS (Cross-Origin Resource Sharing) challenges. Here's the solution:

```powershell
# Port-forward the Vite dev server
Start-Job -Name "port-5173" -ScriptBlock { 
    kubectl port-forward $using:podName 5173:5173 
}
```

**What is port-forwarding?**
Port-forwarding creates a tunnel from your local machine to a pod. When your browser on `localhost:5173` makes a request, it's forwarded to the pod's port 5173.

### Step 8: Access Your Application

```powershell
# Get the application URL
minikube service bookmyshow-service --url

# Get phpMyAdmin URL
minikube service phpmyadmin-service --url
```

**Understanding Minikube Services:**
Minikube exposes services through NodePort, which maps a port on the Minikube VM to your service. The `--url` flag returns the accessible URL.

## Understanding the Kubernetes Configuration Files

### secrets.yaml - Securing Sensitive Data

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secret
type: Opaque
data:
  password: cGFzc3dvcmQ=  # base64 encoded
```

**Key Points:**
- Secrets are base64 encoded (not encrypted!)
- In production, use tools like Sealed Secrets or external secret managers
- Never commit real secrets to version control

### deployment.yaml - Application Blueprint

The deployment file contains:

**Init Containers:**
```yaml
initContainers:
- name: init-permissions
  # Sets up file permissions
- name: npm-install
  # Installs Node dependencies
```

**Why Init Containers?**
They run sequentially before the main container starts, perfect for:
- Setting up permissions
- Installing dependencies
- Running database migrations
- Downloading configuration

**Main Container:**
```yaml
containers:
- name: app
  image: sail-8.5/app:latest
  imagePullPolicy: Never  # Use local image
```

**imagePullPolicy: Never** tells Kubernetes not to pull from a registry, using the local image we built instead.

**Volume Mounts:**
```yaml
volumeMounts:
- name: app-storage
  mountPath: /var/www/html/storage
- name: node-modules
  mountPath: /var/www/html/node_modules
```

Volumes persist data across pod restarts. We use:
- **PersistentVolumeClaim** for important data (storage)
- **emptyDir** for temporary data (cache, node_modules)

### service.yaml - Network Access

```yaml
apiVersion: v1
kind: Service
metadata:
  name: bookmyshow-service
spec:
  type: NodePort
  selector:
    app: bookmyshow
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080
```

**Service Types:**
- **ClusterIP** (default): Only accessible within cluster
- **NodePort**: Accessible on each node's IP at a static port
- **LoadBalancer**: Cloud provider load balancer (not available in Minikube)

## Essential kubectl Commands

### Viewing Resources

```powershell
# View all resources
kubectl get all

# View specific resources
kubectl get pods
kubectl get deployments
kubectl get services

# Detailed information
kubectl describe pod <pod-name>
kubectl get pods -o wide  # Shows IP addresses and nodes
```

### Logs and Debugging

```powershell
# View logs (last logs)
kubectl logs <pod-name>

# Stream logs (follow mode)
kubectl logs -f <pod-name>

# Logs from all pods with a label
kubectl logs -l tier=frontend -f

# View previous container's logs (if crashed)
kubectl logs <pod-name> --previous
```

### Executing Commands

```powershell
# Run a command
kubectl exec <pod-name> -- ls -la

# Interactive shell
kubectl exec -it <pod-name> -- bash

# Run command in specific container (multi-container pods)
kubectl exec -it <pod-name> -c <container-name> -- bash
```

### Managing Resources

```powershell
# Apply changes
kubectl apply -f <file.yaml>

# Delete resources
kubectl delete -f <file.yaml>
kubectl delete pod <pod-name>

# Force restart deployment
kubectl rollout restart deployment <deployment-name>

# Check rollout status
kubectl rollout status deployment <deployment-name>
```

## Daily Workflow: Starting Your Development Environment

After shutting down or restarting your computer, here's your quick-start routine:

```powershell
# 1. Start Minikube
minikube start

# 2. Wait for pods to be ready (they persist between minikube stops)
kubectl wait --for=condition=ready pod -l tier=frontend --timeout=120s

# 3. Get pod name
$podName = kubectl get pods -l tier=frontend -o jsonpath='{.items[0].metadata.name}'

# 4. Start Vite dev server in background
Start-Job -Name "vite-dev" -ScriptBlock { 
    kubectl exec -it $using:podName -- npm run dev -- --host 0.0.0.0 
}

# 5. Port-forward for CORS
Start-Job -Name "port-5173" -ScriptBlock { 
    kubectl port-forward $using:podName 5173:5173 
}

# 6. Get application URLs
minikube service bookmyshow-service --url
minikube service phpmyadmin-service --url
```

## Common Issues and Solutions

### Issue 1: Image Pull Errors

**Error:** `ErrImagePull` or `ImagePullBackOff`

**Solution:**
```powershell
# Rebuild using Minikube's Docker
minikube -p minikube docker-env --shell powershell | Invoke-Expression
docker build -t sail-8.5/app:latest .
kubectl delete pod -l tier=frontend
```

**Why?** Kubernetes tries to pull from a registry, but our image only exists locally in Minikube's Docker.

### Issue 2: CORS Errors

**Error:** `CORS request did not succeed`

**Solution:**
```powershell
# Port-forward the Vite dev server
Start-Job -ScriptBlock { kubectl port-forward $using:podName 5173:5173 }
```

**Why?** Your browser can't directly access the Vite dev server inside the pod without port-forwarding.

### Issue 3: Port Already in Use

**Error:** `Port 5173 is already in use`

**Solution:**
```powershell
# Kill the existing process
kubectl exec -it $podName -- pkill -f "vite"

# Or restart the pod
kubectl delete pod -l tier=frontend
```

### Issue 4: Database Connection Failed

**Solution:**
```powershell
# Check if MySQL pod is running
kubectl get pods -l tier=database

# Check MySQL logs
kubectl logs -l tier=database

# Verify service exists
kubectl get service mysql-service
```

**Debugging Tips:**
- Services use DNS names (e.g., `mysql-service`)
- Check environment variables are correct
- Ensure secrets are created before deployments

## Best Practices

### 1. Use Labels Consistently

Labels help organize and select resources:

```yaml
labels:
  app: bookmyshow
  tier: frontend
  environment: development
```

### 2. Set Resource Limits

Prevent resource exhaustion:

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### 3. Use Health Checks

Add liveness and readiness probes:

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 80
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /ready
    port: 80
  initialDelaySeconds: 10
  periodSeconds: 5
```

### 4. Namespace Your Resources

For larger projects, use namespaces:

```powershell
# Create namespace
kubectl create namespace bookmyshow

# Deploy to namespace
kubectl apply -f deployment.yaml -n bookmyshow

# Set default namespace
kubectl config set-context --current --namespace=bookmyshow
```

### 5. Use ConfigMaps for Configuration

Separate configuration from code:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: "local"
  LOG_LEVEL: "debug"
```

## Monitoring and Observability

### Viewing Resource Usage

```powershell
# Pod resource usage
kubectl top pods

# Node resource usage
kubectl top nodes

# Describe for events
kubectl describe pod <pod-name>
```

### Accessing Kubernetes Dashboard

```powershell
# Start dashboard
minikube dashboard
```

This opens a web UI showing all cluster resources visually.

## Cleaning Up

### Partial Cleanup (Keep Cluster)

```powershell
# Delete all application resources
kubectl delete -f k8s\service.yaml
kubectl delete -f k8s\deployment.yaml
kubectl delete -f k8s\phpmyadmin-deployment.yaml
kubectl delete -f k8s\redis-deployment.yaml
kubectl delete -f k8s\mysql-deployment.yaml
kubectl delete -f k8s\persistent-volumes.yaml
kubectl delete -f k8s\secrets.yaml

# Stop Minikube (preserves cluster state)
minikube stop
```

### Complete Cleanup

```powershell
# Delete entire cluster
minikube delete

# This removes everything: all pods, services, volumes
```

## Understanding PowerShell Background Jobs

PowerShell jobs let processes run in the background:

```powershell
# Start a background job
Start-Job -Name "my-job" -ScriptBlock { 
    # Long-running command
}

# List jobs
Get-Job

# View job output
Receive-Job -Name "my-job"

# Stop and remove
Stop-Job -Name "my-job"
Remove-Job -Name "my-job"
```

**When to use jobs:**
- Port-forwarding (needs to stay active)
- Running dev servers
- Any long-running process that blocks your terminal

## Advanced Topics to Explore Next

### 1. Helm Charts
Package manager for Kubernetes—like npm for K8s.

### 2. Ingress Controllers
Advanced routing and load balancing.

### 3. StatefulSets
For stateful applications like databases with specific pod identity requirements.

### 4. Horizontal Pod Autoscaling
Automatically scale pods based on CPU/memory usage.

### 5. CI/CD Integration
Automate deployment with GitHub Actions, Jenkins, or GitLab CI.

## Conclusion

Congratulations! You've successfully deployed a full-stack Laravel + React application on Kubernetes using Minikube. You now understand:

- Core Kubernetes concepts (Pods, Deployments, Services)
- How to use kubectl effectively
- Troubleshooting common issues
- Daily development workflow with Kubernetes
- Best practices for container orchestration

Kubernetes has a steep learning curve, but with hands-on practice like this, you'll quickly become proficient. The skills you've learned here apply not just to local development with Minikube, but also to production Kubernetes clusters in the cloud (AWS EKS, Google GKE, Azure AKS).

## Additional Resources

- **Official Kubernetes Documentation**: https://kubernetes.io/docs/
- **Minikube Documentation**: https://minikube.sigs.k8s.io/docs/
- **kubectl Cheat Sheet**: https://kubernetes.io/docs/reference/kubectl/cheatsheet/
- **Interactive Tutorial**: https://kubernetes.io/docs/tutorials/kubernetes-basics/

Happy Kubernetes learning! 🚀

---

*This guide is based on deploying the BookMyShow application on Windows with Docker Desktop and Minikube. For production deployments, consider additional security measures, monitoring solutions, and cloud-native services.*
