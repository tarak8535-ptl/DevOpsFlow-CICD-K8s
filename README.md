# DevOpsFlow-CICD-K8s

## Overview
DevOpsFlow-CICD-K8s is a full-stack application demonstrating a CI/CD pipeline with Kubernetes. It includes:
- A **backend** service built with Node.js.
- A **frontend** service built with React.
- Kubernetes manifests for deployment.
- Helm charts for templating Kubernetes resources.
- A Jenkins pipeline for CI/CD automation.
- Docker for containerization.

This project is designed to showcase a complete DevOps workflow, from development to deployment.

---

## Features
- **Backend**: Provides RESTful API services.
- **Frontend**: A React-based user interface.
- **Kubernetes**: Manifests for deploying the application to a Kubernetes cluster.
- **Helm**: Templated Kubernetes manifests for easier deployment.
- **CI/CD**: Jenkins pipeline for automated build, test, and deployment.
- **Monitoring**: Integrated monitoring with Prometheus and Grafana.
- **Logging**: Centralized logging using Elasticsearch, Fluentd, and Kibana (EFK stack).
- **Testing**: Automated unit and integration tests for both backend and frontend.
- **Security**: Basic security measures, including image scanning and Kubernetes RBAC.
- **Scalability**: Horizontal Pod Autoscaling (HPA) configured for Kubernetes deployments.

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
- **Docker**: Install Docker to build and run containerized applications.
- **Kubernetes**: Install and configure `kubectl` for managing Kubernetes clusters.
- **Helm**: Install Helm for templating Kubernetes manifests.
- **Node.js**: Install Node.js for running the backend and frontend locally.
- **Jenkins**: Set up Jenkins for CI/CD.

---

## How to Run

### 1. **Backend**
- Navigate to the `backend` directory:
  ```bash
  cd backend
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Start the server:
  ```bash
  npm start
  ```

### 2. **Frontend**
- Navigate to the `frontend` directory:
  ```bash
  cd frontend
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Start the development server:
  ```bash
  npm start
  ```

### 3. **Docker**
- Build and run the backend Docker image:
  ```bash
  cd backend
  docker build -t backend:latest .
  docker run -p 5000:5000 backend:latest
  ```
- Build and run the frontend Docker image:
  ```bash
  cd frontend
  docker build -t frontend:latest .
  docker run -p 3000:3000 frontend:latest
  ```

### 4. **Kubernetes**
- Apply the namespace:
  ```bash
  kubectl apply -f k8s/namespace.yml
  ```
- Deploy the backend and frontend:
  ```bash
  kubectl apply -f k8s/
  ```

### 5. **Helm**
- Install the Helm chart:
  ```bash
  helm install devops-flow ./helm
  ```

---

## CI/CD Pipeline
The Jenkins pipeline (`Jenkinsfile`) includes the following stages:
1. **Checkout**: Clones the repository.
2. **Build and Test**: Installs dependencies and runs tests.
3. **Docker Build & Push**: Builds Docker images and pushes them to a registry.
4. **Configure kubectl**: Sets the Kubernetes namespace.
5. **Deploy to Kubernetes**: Applies Kubernetes manifests.

---

## Environment Variables
Use `.env` files to manage environment-specific configurations for both the backend and frontend.

### Backend `.env` Example:
```
PORT=5000
DATABASE_URL=mongodb://localhost:27017/devops
```

### Frontend `.env` Example:
```
REACT_APP_API_URL=http://localhost:5000
```

---

## Notes
- Update the Docker image repository in the Kubernetes manifests and Jenkinsfile as needed.
- Ensure all dependencies are installed before running the application.
- Use `.dockerignore` files to optimize Docker image builds.

---
