# CloudTarkk InfraGen - Architecture Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CloudTarkk InfraGen                                │
│                         Infrastructure as Code Platform                         │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │    │                 │
│   User Browser  │───▶│  React Frontend │───▶│  Node.js API    │───▶│  Terraform      │
│   (Port 3000)   │    │  (Nginx/80)     │    │  (Port 5000)    │    │  Generator      │
│                 │    │                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │                       │
         │                       │                       │                       │
         ▼                       ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Authentication │    │  5-Step Wizard  │    │  RESTful APIs   │    │  AWS Services   │
│  JWT Tokens     │    │  UI Components  │    │  Route Handlers │    │  Templates      │
│  Rate Limiting  │    │  State Management│    │  Middleware     │    │  Code Generation│
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Application Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            User Journey Flow                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
    │             │      │             │      │             │      │             │
    │   Login     │─────▶│  Dashboard  │─────▶│  Generator  │─────▶│  Download   │
    │             │      │             │      │             │      │             │
    └─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘
          │                      │                      │                      │
          │                      │                      │                      │
          ▼                      ▼                      ▼                      ▼
    ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
    │ JWT Token   │      │ Navigation  │      │ 5-Step      │      │ Terraform   │
    │ Validation  │      │ Cards       │      │ Wizard      │      │ .tf Files   │
    │ Rate Limit  │      │ Monitoring  │      │ Config      │      │ Generated   │
    └─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘
```

## 5-Step Terraform Generator Workflow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        Terraform Generator Architecture                         │
└─────────────────────────────────────────────────────────────────────────────────┘

Step 1: Provider        Step 2: Services       Step 3: Configure      Step 4: Advanced
┌─────────────┐        ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
│             │        │             │        │             │        │             │
│ AWS Region  │───────▶│ Service     │───────▶│ Instance    │───────▶│ Tags &      │
│ Selection   │        │ Selection   │        │ Types       │        │ Variables   │
│             │        │             │        │             │        │             │
└─────────────┘        └─────────────┘        └─────────────┘        └─────────────┘
       │                       │                       │                       │
       │                       │                       │                       │
       ▼                       ▼                       ▼                       ▼
┌─────────────┐        ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
│ 17 AWS      │        │ 11 AWS      │        │ Dropdown    │        │ Custom      │
│ Regions     │        │ Services    │        │ Options     │        │ Variables   │
│ Available   │        │ Supported   │        │ Validation  │        │ Tags        │
└─────────────┘        └─────────────┘        └─────────────┘        └─────────────┘

                                    Step 5: Generate
                                   ┌─────────────┐
                                   │             │
                                   │ Terraform   │──────┐
                                   │ Code Gen    │      │
                                   │             │      │
                                   └─────────────┘      │
                                          │             │
                                          │             ▼
                                          ▼      ┌─────────────┐
                                   ┌─────────────┐│             │
                                   │ Preview &   ││ Download    │
                                   │ Validation  ││ .tf Files   │
                                   │             ││             │
                                   └─────────────┘└─────────────┘
```

## Backend API Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Backend Services (Node.js)                           │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │    │                 │
│  Express.js     │───▶│  Route Handlers │───▶│  Services Layer │───▶│  Response       │
│  Server         │    │  /api/*         │    │  Business Logic │    │  JSON/Files     │
│                 │    │                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘

API Endpoints:
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Authentication                                                                  │
│ POST /api/auth/login          - JWT token generation                           │
│                                                                                 │
│ Dashboard                                                                       │
│ GET  /api/dashboard           - Dashboard data                                  │
│                                                                                 │
│ Terraform Generator                                                             │
│ GET  /api/terraform/services  - Available AWS services                         │
│ GET  /api/terraform/regions   - AWS regions list                               │
│ GET  /api/terraform/instances - EC2 instance types                             │
│ POST /api/terraform/generate  - Generate Terraform code                        │
│                                                                                 │
│ Monitoring                                                                      │
│ GET  /api/monitoring          - System metrics                                 │
│ GET  /api/logs                - Application logs                               │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Frontend Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        React Frontend Components                               │
└─────────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │             │
                              │   App.js    │
                              │   Router    │
                              │             │
                              └──────┬──────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
            ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
            │             │  │             │  │             │
            │  Login.js   │  │Dashboard.js │  │Navigation.js│
            │             │  │             │  │             │
            └─────────────┘  └──────┬──────┘  └─────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │             │ │             │ │             │
            │Terraform    │ │Monitoring.js│ │DeploymentLogs│
            │Generator.js │ │             │ │.js          │
            │             │ │             │ │             │
            └─────────────┘ └─────────────┘ └─────────────┘

Utility Layer:
┌─────────────────────────────────────────────────────────────────────────────────┐
│ utils/api.js - Centralized API configuration                                   │
│ - Base URL configuration                                                        │
│ - Authentication token handling                                                 │
│ - Error handling and retry logic                                               │
│ - Request/Response interceptors                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## AWS Services Integration

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          AWS Services Templates                                │
└─────────────────────────────────────────────────────────────────────────────────┘

Compute Services          Storage Services          Network Services
┌─────────────┐           ┌─────────────┐           ┌─────────────┐
│             │           │             │           │             │
│    EC2      │           │     S3      │           │    VPC      │
│ Instances   │           │  Buckets    │           │  Networks   │
│             │           │             │           │             │
└─────────────┘           └─────────────┘           └─────────────┘

Database Services         Serverless Services       Security Services
┌─────────────┐           ┌─────────────┐           ┌─────────────┐
│             │           │             │           │             │
│    RDS      │           │   Lambda    │           │    IAM      │
│ Databases   │           │ Functions   │           │ 4 Types     │
│             │           │             │           │             │
└─────────────┘           └─────────────┘           └─────────────┘

Monitoring Services       Load Balancing
┌─────────────┐           ┌─────────────┐
│             │           │             │
│ CloudWatch  │           │    ELB      │
│  Metrics    │           │Load Balancer│
│             │           │             │
└─────────────┘           └─────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            Kubernetes Deployment                               │
└─────────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │             │
                              │   Ingress   │
                              │ Controller  │
                              │             │
                              └──────┬──────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
            ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
            │             │  │             │  │             │
            │  Frontend   │  │  Backend    │  │ Monitoring  │
            │  Service    │  │  Service    │  │  Stack      │
            │             │  │             │  │             │
            └─────────────┘  └─────────────┘  └─────────────┘
                    │                │                │
                    ▼                ▼                ▼
            ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
            │  React App  │  │  Node.js    │  │ Prometheus  │
            │  Nginx      │  │  Express    │  │ Grafana     │
            │  Port 80    │  │  Port 5000  │  │ EFK Stack   │
            └─────────────┘  └─────────────┘  └─────────────┘

Security Features:
┌─────────────────────────────────────────────────────────────────────────────────┐
│ - Non-root container execution                                                 │
│ - Security contexts with seccomp profiles                                      │
│ - Resource limits and requests                                                 │
│ - Health probes (liveness/readiness)                                           │
│ - Network policies and RBAC                                                    │
│ - Sealed secrets management                                                    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## CI/CD Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CI/CD Pipeline                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

Source Code          Build & Test         Security Scan        Deploy
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│ Git Push    │────▶│ Unit Tests  │────▶│ Trivy Scan  │────▶│ Kubernetes  │
│ PR Merge    │     │ Linting     │     │ OWASP Check │     │ Deployment  │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘

Supported Platforms:
┌─────────────────────────────────────────────────────────────────────────────────┐
│ GitHub Actions    - .github/workflows/ci-cd.yml                                │
│ Bitbucket Pipelines - bitbucket-pipelines.yml                                  │
│ Jenkins          - Jenkinsfile                                                 │
│ ArgoCD           - GitOps deployment                                           │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Technology Stack                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

Frontend                 Backend                  Infrastructure
┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│ React 18    │          │ Node.js 18  │          │ Kubernetes  │
│ JavaScript  │          │ Express.js  │          │ Docker      │
│ CSS3        │          │ JWT Auth    │          │ Helm        │
│ HTML5       │          │ CORS        │          │ Nginx       │
└─────────────┘          └─────────────┘          └─────────────┘

Monitoring               Security                 CI/CD
┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│ Prometheus  │          │ JWT Tokens  │          │ GitHub      │
│ Grafana     │          │ Rate Limit  │          │ Actions     │
│ EFK Stack   │          │ HTTPS/TLS   │          │ Bitbucket   │
│ Jaeger      │          │ RBAC        │          │ Jenkins     │
└─────────────┘          └─────────────┘          └─────────────┘
```