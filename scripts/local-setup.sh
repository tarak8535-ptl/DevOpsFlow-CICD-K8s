#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== DevOpsFlow Local Setup (Docker Desktop K8s) ==="
echo ""

# ── Prerequisites check ─────────────────────────────────────
for cmd in docker kubectl helm; do
  if ! command -v $cmd &> /dev/null; then
    echo "ERROR: $cmd is not installed."
    exit 1
  fi
done

# ── 1. Verify K8s is running ────────────────────────────────
echo "1/6 Verifying Kubernetes..."
kubectl config use-context docker-desktop 2>/dev/null || true
if ! kubectl cluster-info &>/dev/null; then
  echo "ERROR: Kubernetes is not running."
  echo "Enable it in Docker Desktop: Settings > Kubernetes > Enable Kubernetes"
  exit 1
fi
kubectl cluster-info

# ── 2. Build images ─────────────────────────────────────────
echo ""
echo "2/6 Building Docker images..."
docker build -t devopsflow-auth:latest       "$ROOT_DIR/services/auth"
docker build -t devopsflow-dashboard:latest  "$ROOT_DIR/services/dashboard"
docker build -t devopsflow-logs:latest       "$ROOT_DIR/services/logs"
docker build -t devopsflow-monitoring:latest "$ROOT_DIR/services/monitoring"
docker build -t devopsflow-frontend:latest   "$ROOT_DIR/frontend"

# Docker Desktop K8s can access local images directly — no need to load/push

# ── 3. Deploy with Helm ─────────────────────────────────────
echo ""
echo "3/6 Deploying microservices with Helm..."
helm upgrade --install devopsflow "$ROOT_DIR/helm" \
  --namespace devops --create-namespace \
  --set imagePullPolicy=Never \
  --set frontend.service.type=LoadBalancer \
  --set frontend.service.nodePort=null \
  --wait --timeout 120s

echo ""
echo "    Pods:"
kubectl get pods -n devops

# ── 4. Install ArgoCD ───────────────────────────────────────
echo ""
echo "4/6 Installing ArgoCD..."
kubectl create namespace argocd 2>/dev/null || true
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
echo "     Waiting for ArgoCD to be ready (this takes ~60s)..."
kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=180s

# ── 5. Register ArgoCD application ──────────────────────────
echo ""
echo "5/6 Registering ArgoCD application..."
kubectl apply -f "$ROOT_DIR/argocd/application.yaml"

# ── 6. Print access info ────────────────────────────────────
echo ""
echo "6/6 Setup complete!"
echo ""
ARGOCD_PASS=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d 2>/dev/null || echo "<run command below>")
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  DevOpsFlow is running on Docker Desktop Kubernetes!      ║"
echo "║                                                           ║"
echo "║  App:       http://localhost                              ║"
echo "║  Login:     admin / password                              ║"
echo "║                                                           ║"
echo "║  ArgoCD:    https://localhost:8080                        ║"
echo "║  User:      admin                                         ║"
echo "║  Pass:      $ARGOCD_PASS"
echo "║                                                           ║"
echo "║  Start ArgoCD port-forward:                               ║"
echo "║  kubectl port-forward svc/argocd-server -n argocd 8080:443║"
echo "║                                                           ║"
echo "║  Teardown:  ./scripts/local-teardown.sh                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
