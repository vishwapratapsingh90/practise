# BookMyShow Kubernetes Deployment

This directory contains Kubernetes manifests for deploying the BookMyShow Laravel application locally.

## Prerequisites

- Docker Desktop with Kubernetes enabled
- kubectl CLI installed
- Laravel Sail (for building the Docker image)

## Directory Structure

```
k8s/
├── README.md                    # This file
├── secrets.yaml                 # Secrets (database password, app key)
├── persistent-volumes.yaml      # PV and PVC for MySQL and app storage
├── mysql-deployment.yaml        # MySQL database deployment and service
├── phpmyadmin-deployment.yaml   # phpMyAdmin deployment and service
├── redis-deployment.yaml        # Redis cache deployment and service
├── deployment.yaml              # Laravel application deployment
└── service.yaml                 # Laravel application service (NodePort)
```

## Quick Start

### 1. Build the Docker Image

```powershell
# Navigate to project root
cd c:\Users\invsi1\wwwroot\practise\php\BookMyShow

# Build image from Sail's Dockerfile
docker build -t sail-8.5/app:latest -f ./vendor/laravel/sail/runtimes/8.5/Dockerfile .
```

### 2. Create and Configure Secrets

```powershell
# Copy the example secrets file
cp k8s/secrets.yaml.example k8s/secrets.yaml

# Generate Laravel app key
php artisan key:generate --show
# Output example: base64:abcdefghijklmnopqrstuvwxyz1234567890

# Encode it to base64 (in PowerShell)
$key = "base64:your-generated-key-from-above"
$encodedKey = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($key))
Write-Host "Encoded APP_KEY: $encodedKey"

# Encode MySQL password (in PowerShell)
$password = "your-mysql-password"
$encodedPassword = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($password))
Write-Host "Encoded Password: $encodedPassword"

# Update k8s/secrets.yaml with the encoded values
# Replace YOUR_BASE64_ENCODED_PASSWORD_HERE with $encodedPassword
# Replace YOUR_BASE64_ENCODED_APP_KEY_HERE with $encodedKey
```

### 3. Deploy to Kubernetes

```powershell
# Apply manifests in order
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/persistent-volumes.yaml
kubectl apply -f k8s/mysql-deployment.yaml
kubectl apply -f k8s/phpmyadmin-deployment.yaml
kubectl apply -f k8s/redis-deployment.yaml

# Wait for MySQL to be ready
kubectl wait --for=condition=ready pod -l tier=database --timeout=120s

# Deploy the app
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### 4. Run Database Migrations

```powershell
# Get the pod name
kubectl get pods -l tier=frontend

# Run migrations
kubectl exec -it <pod-name> -- php artisan migrate

# Seed database (optional)
kubectl exec -it <pod-name> -- php artisan db:seed
```

### 5. Access the Application

Open your browser and navigate to:
- **Application**: http://localhost:30080
- **API**: http://localhost:30080/api/v1
- **phpMyAdmin**: http://localhost:30081
  - **Server**: mysql-service
  - **Username**: root or sail
  - **Password**: secret123 (or your custom password)

## Management Commands

### View All Resources

```powershell
kubectl get all -l app=bookmyshow
```

### View Logs

```powershell
# Application logs
kubectl logs -l tier=frontend -f

# MySQL logs
kubectl logs -l tier=database -f

# Redis logs
kubectl logs -l tier=cache -f
```

### Access MySQL Database

```powershell
# Get MySQL pod name
kubectl get pods -l tier=database

# Connect to MySQL
kubectl exec -it <mysql-pod-name> -- mysql -u sail -p
# Password: secret123 (or your custom password)
```

### Execute Artisan Commands

```powershell
# Get app pod name
kubectl get pods -l tier=frontend

# Run artisan commands
kubectl exec -it <app-pod-name> -- php artisan tinker
kubectl exec -it <app-pod-name> -- php artisan route:list
kubectl exec -it <app-pod-name> -- php artisan cache:clear
kubectl exec -it <app-pod-name> -- php artisan config:clear
```

### Scale the Application

```powershell
# Scale to 3 replicas
kubectl scale deployment bookmyshow-app --replicas=3

# Check scaling
kubectl get pods -l tier=frontend
```

### Update the Application

```powershell
# Rebuild the image
docker build -t sail-8.3/app:latest -f ./vendor/laravel/sail/runtimes/8.3/Dockerfile .

# Restart the deployment
kubectl rollout restart deployment bookmyshow-app

# Check rollout status
kubectl rollout status deployment bookmyshow-app
```

## Troubleshooting

### Pods Not Starting

```powershell
# Check pod status
kubectl get pods

# Describe pod for events
kubectl describe pod <pod-name>

# Check logs
kubectl logs <pod-name>
```

### Database Connection Issues

```powershell
# Verify MySQL service
kubectl get service mysql-service

# Check if MySQL is running
kubectl get pods -l tier=database

# Test connection from app pod
kubectl exec -it <app-pod-name> -- mysql -h mysql-service -u sail -p
```

### Image Pull Errors

```powershell
# Verify image exists locally
docker images | grep sail

# Ensure imagePullPolicy is set to Never for local images
```

### Storage Issues

```powershell
# Check PV and PVC status
kubectl get pv
kubectl get pvc

# On Windows with Docker Desktop, ensure volumes are accessible
```

## Cleanup

### Delete All Resources

```powershell
kubectl delete -f k8s/service.yaml
kubectl delete -f k8s/deployment.yaml
kubectl delete -f k8s/redis-deployment.yaml
kubectl delete -f k8s/mysql-deployment.yaml
kubectl delete -f k8s/persistent-volumes.yaml
kubectl delete -f k8s/secrets.yaml
```

### Or delete by label

```powershell
kubectl delete all -l app=bookmyshow
kubectl delete pvc -l app=bookmyshow
kubectl delete pv -l app=bookmyshow
kubectl delete secret -l app=bookmyshow
```

## Configuration

### Customizing Secrets

Edit `secrets.yaml` and update:
- MySQL password
- APP_KEY

Remember to base64 encode all secret values:

```powershell
# In PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("your-secret"))
```

### Customizing Resources

Edit resource limits in deployment files:
- `deployment.yaml` - Application resources
- `mysql-deployment.yaml` - MySQL resources
- `redis-deployment.yaml` - Redis resources

### Changing Port

To change the NodePort (default 30080), edit `service.yaml`:

```yaml
nodePort: 30080  # Change to any port between 30000-32767
```

## Differences from Laravel Sail

| Feature | Laravel Sail | Kubernetes |
|---------|-------------|------------|
| Orchestration | Docker Compose | Kubernetes |
| Networking | Docker networks | Services & Ingress |
| Storage | Docker volumes | PersistentVolumes |
| Scaling | Manual | Automatic |
| Health checks | Limited | Built-in probes |
| Load balancing | None | Automatic |

## Production Considerations

For production deployment, consider:

1. Use **Ingress** instead of NodePort
2. Implement **TLS/SSL** certificates
3. Set up **ConfigMaps** for configuration
4. Use **StatefulSets** for MySQL
5. Implement **network policies**
6. Add **resource quotas** and limits
7. Set up **monitoring** (Prometheus/Grafana)
8. Configure **logging** (ELK stack)
9. Use **Helm charts** for easier management
10. Set up **CI/CD pipelines**

## Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Laravel Documentation](https://laravel.com/docs)
- [Laravel Sail](https://laravel.com/docs/sail)
- [Docker Desktop Kubernetes](https://docs.docker.com/desktop/kubernetes/)
