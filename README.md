# DevOpsFlow-CICD-K8s

## Overview
DevOpsFlow-CICD-K8s is a comprehensive full-stack application demonstrating modern DevOps practices with CI/CD pipeline and Kubernetes orchestration, using 100% open source tools. It showcases:
- **Backend**: Node.js-based microservice architecture
- **Frontend**: React application with responsive design
- **Infrastructure as Code**: Kubernetes manifests and Helm charts
- **CI/CD**: GitLab CI or Jenkins pipelines
- **Containerization**: Docker with multi-stage builds
- **Observability**: Prometheus, Grafana, and EFK stack

---

## Features
- **Microservices Architecture**
  - RESTful API backend services
  - React-based frontend with modern UI/UX
  - Istio service mesh integration
- **Kubernetes Deployment**
  - Production-grade manifests
  - Helm charts for environment templating
  - Horizontal Pod Autoscaling (HPA)
  - Sealed Secrets for secure configuration
- **CI/CD Pipeline**
  - GitLab CI or Jenkins workflow
  - ArgoCD for GitOps deployment
  - SonarQube for code quality
  - Trivy for container scanning
- **Observability Stack**
  - Prometheus for metrics collection
  - Grafana dashboards for visualization
  - EFK (Elasticsearch, Fluentd, Kibana) for logging
  - Jaeger for distributed tracing
- **Security Features**
  - JWT-based authentication and authorization
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
├── .gitlab-ci.yml
├── Jenkinsfile
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
- **GitLab CI**: Continuous integration and delivery
- **Jenkins**: Automation server
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
- GitLab Runner or Jenkins

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

## CI/CD Pipeline Implementation

### GitLab CI Pipeline
The `.gitlab-ci.yml` file defines a pipeline with the following stages:

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
   - Container registry push

4. **Deployment**
   - ArgoCD application deployment
   - Kubernetes manifest application

### Jenkins Pipeline
The `Jenkinsfile` implements:

1. **Source Control**
   - Git checkout
   - Code quality checks with SonarQube

2. **Build & Test**
   - Dependencies installation
   - Unit and integration tests

3. **Container Build**
   - Multi-stage Docker builds
   - Trivy image scanning
   - Registry push

4. **Kubernetes Deployment**
   - Namespace configuration
   - Secret injection with Vault
   - Rolling updates

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
The application implements a JWT-based authentication and authorization system:
- Login endpoint at `/api/auth/login` for obtaining JWT tokens
- Token verification middleware that protects sensitive routes
- Protected routes: `/api/dashboard`, `/api/logs`, `/api/monitoring`

Example API usage:
```bash
# Login to get a token
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"password"}'

# Access protected routes with the token
curl http://localhost:5000/api/dashboard -H "Authorization: Bearer fake-jwt-token"
```

### Container Scanning
```bash
# Scan container image with Trivy
trivy image backend:latest
```

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

2. **Service Discovery Issues**
   - Validate service: `kubectl get svc`
   - Check endpoints: `kubectl get endpoints`
   - Verify Istio configuration: `istioctl analyze`

3. **Pipeline Failures**
   - Review CI logs
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