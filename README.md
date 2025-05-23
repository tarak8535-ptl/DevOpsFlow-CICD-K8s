# DevOpsFlow-CICD-K8s

## Overview
DevOpsFlow-CICD-K8s is a comprehensive full-stack application demonstrating modern DevOps practices with CI/CD pipeline and Kubernetes orchestration. It showcases:
- **Backend**: Node.js-based microservice architecture
- **Frontend**: React application with responsive design
- **Infrastructure as Code**: Kubernetes manifests and Helm charts
- **CI/CD**: Automated Jenkins pipeline
- **Containerization**: Docker with multi-stage builds
- **Observability**: Complete monitoring and logging stack

---

## Features
- **Microservices Architecture**
  - RESTful API backend services
  - React-based frontend with modern UI/UX
  - Service mesh integration ready
- **Kubernetes Deployment**
  - Production-grade manifests
  - Helm charts for environment templating
  - Horizontal Pod Autoscaling (HPA)
  - ConfigMaps and Secrets management
- **CI/CD Pipeline**
  - Automated Jenkins workflow
  - Multi-environment deployment strategy
  - Automated testing and quality gates
- **Observability Stack**
  - Prometheus for metrics collection
  - Grafana dashboards for visualization
  - EFK (Elasticsearch, Fluentd, Kibana) for logging
  - Distributed tracing support
- **Security Features**
  - Container image scanning
  - Kubernetes RBAC implementation
  - Network policies
  - Secret management
- **High Availability**
  - Pod disruption budgets
  - Multi-replica deployments
  - Rolling update strategies

---

## File Structure
```
DevOpsFlow-CICD-K8s/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── dashboard.js
│   │   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env
├── frontend/
│   ├── public/
│   │   ├── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   ├── App.js
│   │   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env
├── helm/
│   ├── templates/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   ├── values.yaml
├── k8s/
│   ├── namespace.yml
│   ├── backend-deployment.yml
│   ├── service.yml
├── Jenkinsfile
├── .gitignore
```

---

## Prerequisites
- Docker Desktop 4.x or newer
- Kubernetes 1.24+ cluster
- Helm 3.x
- Node.js 18.x or newer
- Jenkins 2.x with Kubernetes plugin

---

## Quick Start

### Local Development
1. **Backend Setup**
```bash
cd backend
npm install
npm start
```

2. **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

### Docker Deployment
```bash
# Backend
cd backend
docker build -t backend:latest .
docker run -p 5000:5000 backend:latest

# Frontend
cd frontend
docker build -t frontend:latest .
docker run -p 3000:3000 frontend:latest
```

### Kubernetes Deployment
```bash
# Create namespace
kubectl apply -f k8s/namespace.yml

# Deploy application
kubectl apply -f k8s/

# Verify deployment
kubectl get pods -n devops-flow
```

### Helm Installation
```bash
helm install devops-flow ./helm --namespace devops-flow
```

---

## CI/CD Pipeline Stages

1. **Source Control**
   - Git checkout
   - Code quality checks
   - Security scanning

2. **Build & Test**
   - Dependencies installation
   - Unit tests
   - Integration tests
   - Code coverage

3. **Container Build**
   - Multi-stage Docker builds
   - Image scanning
   - Registry push

4. **Kubernetes Deployment**
   - Namespace configuration
   - Secret injection
   - Rolling updates

5. **Validation**
   - Health checks
   - Smoke tests
   - Performance validation

---

## Configuration

### Backend Environment Variables
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/devops
LOG_LEVEL=info
```

### Frontend Environment Variables
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

### Kubernetes ConfigMap Example
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  NODE_ENV: production
  LOG_LEVEL: info
```

---

## Best Practices

### Security
- Regular security patches
- RBAC implementation
- Network policies
- Secret rotation
- Image scanning

### Monitoring
- Resource utilization metrics
- Application performance monitoring
- Alert configuration
- Log aggregation

### High Availability
- Multi-replica deployments
- Pod anti-affinity rules
- Resource limits and requests
- Liveness and readiness probes

---

## Troubleshooting

### Common Issues
1. **Pod Startup Failures**
   - Check logs: `kubectl logs <pod-name>`
   - Verify resources: `kubectl describe pod <pod-name>`

2. **Service Discovery Issues**
   - Validate service: `kubectl get svc`
   - Check endpoints: `kubectl get endpoints`

3. **Pipeline Failures**
   - Review Jenkins logs
   - Verify credentials
   - Check resource constraints

---

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

---

## License
MIT License - see LICENSE file for details