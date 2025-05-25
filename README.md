# DevOpsFlow-GitHub-K8s

## Overview
DevOpsFlow-CICD-K8s is a comprehensive full-stack application demonstrating modern DevOps practices with CI/CD pipeline and Kubernetes orchestration, using 100% open source tools. It showcases:
- **Backend**: Node.js-based microservice architecture
- **Frontend**: React application with responsive design
- **Infrastructure as Code**: Kubernetes manifests and Helm charts
- **CI/CD**: GitHub Actions pipelines
- **Containerization**: Docker with multi-stage builds
- **Observability**: Prometheus, Grafana, and EFK stack

---

## Features
- **Microservices Architecture**
  - RESTful API backend services
  - React-based frontend with modern UI/UX
  - Istio service mesh integration
- **Kubernetes Deployment**
  - Production-grade manifests with security contexts
  - Helm charts for environment templating
  - Horizontal Pod Autoscaling (HPA)
  - Sealed Secrets for secure configuration
  - Resource limits and health probes
- **CI/CD Pipeline**
  - GitHub Actions workflow
  - ArgoCD for GitOps deployment
  - SonarQube for code quality
  - Trivy for container scanning
- **Observability Stack**
  - Prometheus for metrics collection with authentication
  - Grafana dashboards for visualization
  - EFK (Elasticsearch, Fluentd, Kibana) for logging
  - Jaeger for distributed tracing
- **Security Features**
  - JWT-based authentication with brute force protection
  - Secure token verification with timing attack prevention
  - Enhanced web security headers (CSP, HSTS)
  - Rate limiting and payload size restrictions
  - Non-root container execution with least privilege
  - Trivy and Clair for image scanning
  - OPA Gatekeeper for policy enforcement
  - Kubernetes RBAC implementation
  - Vault for secret management
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
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── dashboard.js
│   │   │   ├── logs.js
│   │   │   ├── monitoring.js
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
├── .github/
│   ├── workflows/
│   │   ├── ci-cd.yml
├── .gitignore
```

---

## Open Source Tools Used

### Infrastructure
- **Kubernetes**: Container orchestration
- **Helm**: Package management for Kubernetes
- **Istio**: Service mesh for microservices
- **Cert-Manager**: Certificate management

### CI/CD
- **GitHub Actions**: Continuous integration and delivery
- **ArgoCD**: GitOps continuous delivery
- **Tekton**: Cloud-native CI/CD

### Monitoring & Observability
- **Prometheus**: Metrics collection and alerting
- **Grafana**: Metrics visualization
- **Elasticsearch**: Log storage and search
- **Fluentd**: Log collection and forwarding
- **Kibana**: Log visualization
- **Jaeger**: Distributed tracing

### Security
- **Trivy**: Container vulnerability scanner
- **OPA Gatekeeper**: Policy enforcement
- **Vault**: Secret management
- **Falco**: Runtime security monitoring

---

## Prerequisites
- Docker 20.x or newer
- Kubernetes 1.24+ cluster (Minikube, k3s, or kind for local development)
- Helm 3.x
- Node.js 18.x or newer
- GitHub account with Actions enabled

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
docker run -p 5000:5000 --user 1001 backend:latest

# Frontend
cd frontend
docker build -t frontend:latest .
docker run -p 80:80 --user nginx frontend:latest
```

### Kubernetes Deployment
```bash
# Create namespace
kubectl apply -f k8s/namespace.yml

# Deploy application
kubectl apply -f k8s/

# Verify deployment
kubectl get pods -n devops
kubectl get pods -n devops -o jsonpath='{.items[*].spec.containers[*].securityContext}'
```

### Helm Installation
```bash
helm install devops-flow ./helm --namespace devops
```

### Testing Authentication
```bash
# Login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Access protected endpoint
curl http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer fake-jwt-token"
```

---

## CI/CD Pipeline Implementation

### GitHub Actions Pipeline
The `.github/workflows/ci-cd.yml` file defines a pipeline with the following stages:

1. **Build & Test**
   - Dependencies installation
   - Unit and integration tests
   - SonarQube code quality analysis

2. **Security Scan**
   - Trivy container scanning
   - OWASP dependency check
   - Secret scanning with git-secrets

3. **Container Build**
   - Multi-stage Docker builds
   - Container registry push to GitHub Container Registry (GHCR)

4. **Deployment**
   - ArgoCD application deployment
   - Kubernetes manifest application

The workflow includes:
- Separate jobs for backend and frontend components
- Automatic deployment to staging for the staging branch
- Manual approval required for production deployment
- Artifact storage for test coverage reports
- Caching for faster builds

---

## Observability Setup

### Prometheus & Grafana
```bash
# Install Prometheus Operator
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack

# Access Grafana
kubectl port-forward svc/prometheus-grafana 3000:80
```

### EFK Stack
```bash
# Install Elasticsearch
helm repo add elastic https://helm.elastic.co
helm install elasticsearch elastic/elasticsearch

# Install Fluentd
helm repo add fluent https://fluent.github.io/helm-charts
helm install fluentd fluent/fluentd

# Install Kibana
helm install kibana elastic/kibana
```

---

## Security Implementation

### Authentication & Authorization
The application implements a robust authentication and authorization system:
- Login endpoint at `/api/auth/login` for obtaining JWT tokens with rate limiting to prevent brute force attacks
- Secure token verification middleware using constant-time comparison to prevent timing attacks
- Protected routes: `/api/dashboard`, `/api/logs`, `/api/monitoring`, `/metrics`

Example API usage:
```bash
# Login to get a token
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"password"}'

# Access protected routes with the token
curl http://localhost:5000/api/dashboard -H "Authorization: Bearer fake-jwt-token"
```

### Container Security
```bash
# Scan container image with Trivy
trivy image backend:latest
```

### Kubernetes Security
- Non-root container execution
- Read-only root filesystem
- Dropped capabilities
- Resource limits and requests
- Security contexts with seccomp profiles
- Health probes for liveness and readiness

### Web Security
- Strict Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- XSS protection headers
- CORS restrictions
- Request rate limiting
- Payload size limits

### Secret Management with Vault
```bash
# Install Vault
helm repo add hashicorp https://helm.releases.hashicorp.com
helm install vault hashicorp/vault

# Initialize Vault
kubectl exec vault-0 -- vault operator init
```

### OPA Gatekeeper
```bash
# Install OPA Gatekeeper
kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/master/deploy/gatekeeper.yaml

# Apply policy
kubectl apply -f policies/require-labels.yaml
```

---

## Troubleshooting

### Common Issues
1. **Pod Startup Failures**
   - Check logs: `kubectl logs <pod-name>`
   - Verify resources: `kubectl describe pod <pod-name>`
   - Check security contexts: `kubectl get pod <pod-name> -o yaml | grep -A 20 securityContext`

2. **Service Discovery Issues**
   - Validate service: `kubectl get svc`
   - Check endpoints: `kubectl get endpoints`
   - Verify Istio configuration: `istioctl analyze`

3. **Pipeline Failures**
   - Review GitHub Actions logs in the Actions tab
   - Verify GitHub secrets are properly configured
   - Check resource constraints in workflow runners
   - Ensure proper permissions for GITHUB_TOKEN

4. **Authentication Issues**
   - Verify token format: `Authorization: Bearer <token>`
   - Check for rate limiting lockouts
   - Ensure proper CORS configuration for cross-origin requests

5. **Security Policy Failures**
   - Check container security contexts
   - Verify resource limits are properly set
   - Review OPA Gatekeeper policies

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