# DevOpsFlow-GitHub-K8s

## Overview
DevOpsFlow-CICD-K8s is a comprehensive full-stack application demonstrating modern DevOps practices with CI/CD pipeline and Kubernetes orchestration, using 100% open source tools. It showcases:
- **Backend**: Node.js-based microservice architecture
- **Frontend**: React application with responsive design
- **Infrastructure as Code**: Kubernetes manifests and Helm charts
- **CI/CD**: GitHub Actions, Bitbucket Pipelines, or Jenkins
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
  - Bitbucket Pipelines support
  - Jenkins pipeline integration
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
├── .github/
│   └── workflows/
│       └── ci-cd.yml                # GitHub Actions workflow configuration
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js              # Authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.js              # Authentication routes
│   │   │   ├── dashboard.js         # Dashboard API endpoints
│   │   │   ├── logs.js              # Logging API endpoints
│   │   │   └── monitoring.js        # Monitoring API endpoints
│   │   └── server.js                # Main server entry point
│   ├── Dockerfile                   # Backend container definition
│   └── package.json                 # Backend dependencies
├── frontend/
│   ├── nginx/
│   │   └── nginx.conf               # Nginx configuration for frontend
│   ├── public/
│   │   └── index.html               # HTML entry point
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js         # Dashboard component
│   │   │   ├── DeploymentLogs.js    # Logs display component
│   │   │   ├── Login.js             # Authentication component
│   │   │   └── Monitoring.js        # Monitoring component
│   │   ├── App.js                   # Main React component
│   │   └── index.js                 # React entry point
│   ├── Dockerfile                   # Frontend container definition
│   └── package.json                 # Frontend dependencies
├── helm/
│   ├── templates/
│   │   └── deployment.yaml          # Kubernetes deployment template
│   ├── Chart.yml                    # Helm chart definition
│   └── values.yml                   # Helm values configuration
├── k8s/
│   ├── backend-deployment.yml       # Backend Kubernetes deployment
│   ├── deployment.yml               # Main Kubernetes deployment
│   ├── ingress.yml                  # Ingress configuration
│   ├── namespace.yml                # Namespace definition
│   └── service.yml                  # Service definition
├── .gitignore                       # Git ignore file
├── bitbucket-pipelines.yml          # Bitbucket Pipelines configuration
├── Jenkinsfile                      # Jenkins pipeline definition
└── README.md                        # Project documentation
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
- **Bitbucket Pipelines**: Integrated CI/CD for Bitbucket
- **Jenkins**: Self-hosted automation server
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
- GitHub account with Actions enabled, Bitbucket account with Pipelines enabled, or Jenkins server

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

## Deployment Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Git Push       │────▶│  CI/CD Pipeline │────▶│  Container      │
│                 │     │                 │     │  Registry       │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌─────────────────┐     ┌─────────────────┐    ┌──────────────┐    │
│  │                 │     │                 │    │              │    │
│  │  ArgoCD         │────▶│  Kubernetes     │───▶│ Application  │    │
│  │  GitOps         │     │  API Server     │    │ Deployment   │    │
│  │                 │     │                 │    │              │    │
│  └─────────────────┘     └─────────────────┘    └──────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
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

## CI/CD Pipeline Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │     │                 │
│  Code Changes   │────▶│  Test & Scan    │────▶│  Build & Push   │────▶│    Deploy       │
│                 │     │                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │                       │
        ▼                       ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Git Push       │     │  Unit Tests     │     │  Docker Build   │     │  Staging        │
│  Pull Request   │     │  Linting        │     │  Image Tagging  │     │  (Automatic)    │
│  Branch Merge   │     │  Security Scan  │     │  Registry Push  │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
                                                                                │
                                                                                │
                                                                                ▼
                                                                        ┌─────────────────┐
                                                                        │  Production     │
                                                                        │  (Manual        │
                                                                        │   Approval)     │
                                                                        └─────────────────┘
```

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
- Parallel execution of backend and frontend tests
- Automatic deployment to staging for the staging branch
- Manual approval required for production deployment
- Artifact storage for test coverage reports
- Caching for faster builds

### Bitbucket Pipelines
The `bitbucket-pipelines.yml` file implements a similar pipeline structure:

1. **Build & Test**
   - Parallel test execution for backend and frontend
   - Dependency caching for faster builds
   - Artifact collection for test reports

2. **Security Scan**
   - Trivy integration via Bitbucket Pipes
   - Vulnerability scanning for application code

3. **Container Build**
   - Docker image building and pushing to Docker Hub
   - Branch-based image tagging

4. **Deployment**
   - Kubernetes deployment using kubectl Pipe
   - ArgoCD integration for GitOps workflow
   - Manual trigger for production deployment

The pipeline leverages Bitbucket-specific features:
- Reusable step definitions
- Bitbucket Pipes for standardized operations
- Branch-specific workflows
- Pull request validation
- Deployment environments with approvals

### Jenkins Pipeline
The `Jenkinsfile` defines a declarative pipeline with these key stages:

1. **Testing**
   - Parallel execution of backend and frontend tests
   - Docker-based Node.js agents for consistent environments
   - JUnit test reporting and HTML coverage reports

2. **Security Scanning**
   - Parallel Trivy scans for backend and frontend code
   - Vulnerability assessment with configurable severity levels

3. **Build & Push**
   - Conditional image building for main and staging branches
   - Secure credential handling for registry authentication
   - Optimized build process for efficiency

4. **Deployment**
   - Branch-specific deployment strategies
   - Kubernetes integration with kubectl
   - Manual approval gate for production deployments
   - ArgoCD integration for GitOps workflow

The pipeline includes:
- Workspace cleanup to ensure clean builds
- Credential management for secure operations
- Detailed reporting and visualization of test results
- Parallel execution for improved performance

---

## CI/CD Platform Comparison

| Feature | GitHub Actions | Bitbucket Pipelines | Jenkins |
|---------|---------------|---------------------|---------|
| **Hosting** | Cloud-hosted | Cloud-hosted | Self-hosted |
| **Configuration** | YAML | YAML | Groovy DSL |
| **Container Registry** | GitHub Container Registry | Docker Hub | Any registry |
| **Parallelism** | Job-level | Step-level | Stage-level |
| **Caching** | Built-in | Built-in | Plugin-based |
| **Approvals** | Environment protection rules | Deployment permissions | Input steps |
| **Secrets** | GitHub Secrets | Repository Variables | Credentials plugin |
| **Reporting** | Built-in | Built-in | Plugin-based |
| **Scalability** | Auto-scaling | Auto-scaling | Manual scaling |
| **Integration** | GitHub ecosystem | Atlassian ecosystem | Plugin ecosystem |

---

## Application Architecture Flow

```
                                  ┌─────────────────┐
                                  │                 │
                                  │    Internet     │
                                  │                 │
                                  └────────┬────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           Kubernetes Cluster                        │
│                                                                     │
│  ┌─────────────────┐     ┌─────────────────┐    ┌──────────────┐    │
│  │                 │     │                 │    │              │    │
│  │    Ingress      │────▶│    Frontend     │───▶│   Backend    │    │
│  │    Controller   │     │    Service      │    │   Service    │    │
│  │                 │     │                 │    │              │    │
│  └─────────────────┘     └─────────────────┘    └──────┬───────┘    │
│                                                        │            │
│                                                        ▼            │
│                                                 ┌──────────────┐    │
│                                                 │  Database    │    │
│                                                 │  Service     │    │
│                                                 │              │    │
│                                                 └──────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

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

## Observability Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Kubernetes Cluster                        │
│                                                                     │
│  ┌─────────────────┐     ┌─────────────────┐    ┌──────────────┐    │
│  │                 │     │                 │    │              │    │
│  │    Frontend     │     │    Backend      │    │  Database    │    │
│  │    Pods         │     │    Pods         │    │  Pods        │    │
│  │                 │     │                 │    │              │    │
│  └────────┬────────┘     └────────┬────────┘    └──────┬───────┘    │
│           │                       │                     │           │
│           │                       │                     │           │
│           ▼                       ▼                     ▼           │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                                                             │    │
│  │                   Prometheus Metrics                        │    │
│  │                                                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                │                                    │
│                                ▼                                    │
│  ┌─────────────────┐     ┌─────────────────┐    ┌──────────────┐    │
│  │                 │     │                 │    │              │    │
│  │    Grafana      │     │    Fluentd      │    │ Elasticsearch│    │
│  │    Dashboards   │     │    Collectors   │    │              │    │
│  │                 │     │                 │    │              │    │
│  └─────────────────┘     └────────┬────────┘    └──────┬───────┘    │
│                                   │                     │           │
│                                   │                     │           │
│                                   ▼                     ▼           │
│                          ┌─────────────────┐    ┌──────────────┐    │
│                          │                 │    │              │    │
│                          │    Alerts       │    │   Kibana     │    │
│                          │                 │    │              │    │
│                          └─────────────────┘    └──────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Security Implementation

## Security Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Source Code    │────▶│  Dependencies   │────▶│  Container      │
│  Security Scan  │     │  Security Scan  │     │  Security Scan  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           Kubernetes Cluster                        │
│                                                                     │
│  ┌─────────────────┐     ┌─────────────────┐    ┌──────────────┐    │
│  │                 │     │                 │    │              │    │
│  │  OPA Gatekeeper │────▶│  RBAC Policies  │───▶│ Pod Security │    │
│  │  Policies       │     │                 │    │ Context      │    │
│  │                 │     │                 │    │              │    │
│  └─────────────────┘     └─────────────────┘    └──────────────┘    │
│                                                                     │
│  ┌─────────────────┐     ┌─────────────────┐    ┌──────────────┐    │
│  │                 │     │                 │    │              │    │
│  │  Network        │────▶│  Vault Secret   │───▶│ Runtime      │    │
│  │  Policies       │     │  Management     │    │ Security     │    │
│  │                 │     │                 │    │              │    │
│  └─────────────────┘     └─────────────────┘    └──────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

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
   - For Bitbucket Pipelines, check the Pipelines section in your repository
   - For Jenkins, check the build console output and Blue Ocean visualization
   - Verify secrets are properly configured (GitHub Secrets, Bitbucket Variables, or Jenkins Credentials)
   - Check resource constraints in workflow runners or Jenkins agents
   - Ensure proper permissions for GITHUB_TOKEN, Bitbucket Pipeline permissions, or Jenkins credentials

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