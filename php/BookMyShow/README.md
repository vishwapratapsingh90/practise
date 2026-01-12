# BookMyShow

## About Project

This project is Laravel framework based which uses Vite + Reactjs for UI & MySql for RDBMS.

It facilitates the admins to create events and schedule it venue, date and time, while customers can book a ticket for the events and provide rating for the paid events.

## Project Setup

### in Windows wsl or Ubuntu

#### A light-weight command-line interface for interacting with Laravel's default Docker development environment.

To check and remove the existing docker images if any.

`usr1:/BookMyShow$ ./vendor/bin/sail down`

To rebuild docker images via. Laravel sail.

`usr1:/BookMyShow$ ./vendor/bin/sail build --no-cache`

To bring the docker container up.

`usr1:/BookMyShow$ ./vendor/bin/sail up -d`

#### Only need during first time project creation to add Laravel encryption token key.

`usr1:/BookMyShow$ ./vendor/bin/sail php artisan key:generate`

#### Run the migrations to set up your MySQL database

`usr1:/BookMyShow$ ./vendor/bin/sail php artisan migrate`

#### Install Node dependencies inside Docker

`usr1:/BookMyShow$ ./vendor/bin/sail npm install`

#### Start the Vite development server for React

`usr1:/BookMyShow$ ./vendor/bin/sail npm run dev`

### in Windows with Docker Desktop and Minikube

#### Prerequisites

- Docker Desktop must be installed and running
- Minikube must be installed
- kubectl must be installed

#### Navigate to Project Directory

```powershell
cd c:\Users\invsi1\wwwroot\practise\php\BookMyShow
```

#### Start Minikube

```powershell
minikube start
```

#### Initial Deployment

Apply Kubernetes configurations in the following order:

```powershell
# Apply secrets and persistent volumes
kubectl apply -f k8s\secrets.yaml
kubectl apply -f k8s\persistent-volumes.yaml

# Deploy database and services
kubectl apply -f k8s\mysql-deployment.yaml
kubectl apply -f k8s\redis-deployment.yaml
kubectl apply -f k8s\phpmyadmin-deployment.yaml

# Wait for MySQL to be ready
kubectl wait --for=condition=ready pod -l tier=database --timeout=120s

# Deploy the application
kubectl apply -f k8s\deployment.yaml
kubectl apply -f k8s\service.yaml

# Wait for app pod to be ready
kubectl wait --for=condition=ready pod -l tier=frontend --timeout=120s
```

#### Run Database Migrations and Seeders

```powershell
# Get pod name
$podName = kubectl get pods -l tier=frontend -o jsonpath='{.items[0].metadata.name}'

# Run migrations and seeders
kubectl exec -it $podName -- php artisan migrate
kubectl exec -it $podName -- php artisan db:seed
```

#### Troubleshooting: Image Pull Issues

If you encounter image pull errors, build the Docker image using Minikube's Docker daemon:

```powershell
# Configure PowerShell to use Minikube's Docker daemon
minikube -p minikube docker-env --shell powershell | Invoke-Expression

# Build the Docker image
docker build -t sail-8.5/app:latest .

# Verify the image was built
docker images | Select-String "sail-8.5"

# Delete existing pod to force fresh start
kubectl delete pod -l tier=frontend

# Wait for new pod to be ready
kubectl wait --for=condition=ready pod -l tier=frontend --timeout=120s

# Get the new pod name and run migrations
$podName = kubectl get pods -l tier=frontend -o jsonpath='{.items[0].metadata.name}'
kubectl exec -it $podName -- php artisan migrate
kubectl exec -it $podName -- php artisan db:seed
```

#### Install Node Dependencies and Start Vite Dev Server

Node dependencies are automatically installed via init container when the pod starts. You only need to start the Vite dev server:

```powershell
# Get pod name
$podName = kubectl get pods -l tier=frontend -o jsonpath='{.items[0].metadata.name}'

# Start Vite dev server (runs in background inside pod)
kubectl exec -it $podName -- npm run dev -- --host 0.0.0.0
```

#### Fixing CORS Issues (if encountered)

If you encounter CORS errors when accessing the application locally:

```powershell
# Port-forward Vite dev server in background
Start-Job -ScriptBlock { kubectl port-forward $using:podName 5173:5173 }

# Check job status
Get-Job

# Copy updated Vite config to pod
kubectl cp vite.config.js ${podName}:/var/www/html/vite.config.js

# Restart Vite dev server
kubectl exec -it $podName -- npm run dev -- --host 0.0.0.0
```

To stop background jobs:

```powershell
# Stop all jobs
Get-Job | Stop-Job
Get-Job | Remove-Job
```

#### Build Production Assets

```powershell
kubectl exec -it $podName -- npm run build
```

#### Access the Application

Get the Minikube service URLs:

```powershell
# Get URLs only
minikube service bookmyshow-service --url
minikube service phpmyadmin-service --url

# Or open in browser automatically
minikube service bookmyshow-service
minikube service phpmyadmin-service
```

#### Monitoring and Debugging

```powershell
# View all resources
kubectl get all

# Check all pods status
kubectl get pods

# Check pods with detailed information
kubectl get pods -o wide

# View application logs (follow mode)
kubectl logs -l tier=frontend -f

# Get Minikube IP address
minikube ip
```

#### Restart and Cleanup Commands

```powershell
# Force restart deployment
kubectl rollout restart deployment bookmyshow-app

# Clean up all resources
kubectl delete -f k8s\service.yaml
kubectl delete -f k8s\deployment.yaml
kubectl delete -f k8s\phpmyadmin-deployment.yaml
kubectl delete -f k8s\redis-deployment.yaml
kubectl delete -f k8s\mysql-deployment.yaml
kubectl delete -f k8s\persistent-volumes.yaml
kubectl delete -f k8s\secrets.yaml

# Stop Minikube
minikube stop

# Delete Minikube cluster (complete reset)
minikube delete
```

#### Rebuilding After Minikube Restart

```powershell
# Start Minikube
minikube start

# Configure Docker daemon
minikube -p minikube docker-env --shell powershell | Invoke-Expression

# Verify image exists (rebuild if needed)
docker images | Select-String "sail-8.5"
```

#### Daily Startup Commands (After Minikube Restart)

After restarting your computer or minikube, run these commands to get everything running:

```powershell
# 1. Start Minikube
minikube start

# 2. Wait for pods to be ready
kubectl wait --for=condition=ready pod -l tier=frontend --timeout=120s

# 3. Get the pod name
$podName = kubectl get pods -l tier=frontend -o jsonpath='{.items[0].metadata.name}'

# 4. Start Vite dev server in background
Start-Job -Name "vite-dev" -ScriptBlock { 
    kubectl exec -it $using:podName -- npm run dev -- --host 0.0.0.0 
}

# 5. Port-forward Vite dev server in background (required for CORS)
Start-Job -Name "port-5173" -ScriptBlock { 
    kubectl port-forward $using:podName 5173:5173 
}

# 6. Check background jobs status
Get-Job

# 7. Get application URLs
Write-Host "`nApplication URLs:" -ForegroundColor Green
minikube service bookmyshow-service --url
minikube service phpmyadmin-service --url

# Optional: If vite.config.js was updated and image not rebuilt
# kubectl cp vite.config.js ${podName}:/var/www/html/vite.config.js
```

To view job output or stop jobs:

```powershell
# View job output
Receive-Job -Name "vite-dev"
Receive-Job -Name "port-5173"

# Stop all background jobs
Get-Job | Stop-Job
Get-Job | Remove-Job
```

## Screenshots

### Home Page

![Home Page](./public/images/screenshots/Home.png)

### Login Page

![Login Page](./public/images/screenshots/Login.png)

### User Registration Page

![Registration Page](./public/images/screenshots/Registration.png)

### Admin Dashboard

![Admin Dashboard Page](./public/images/screenshots/AdminDashboard.png)

### Manage Roles

![Manage Roles](./public/images/screenshots/ManageRoles.png)

### Manage Permissions

![Manage Permissions](./public/images/screenshots/ManagePermissions.png)

## API Document

[Swagger YAML](./public/BookMyShow.swagger.yaml)

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
