#!/bin/bash
set -e

echo "Tearing down DevOpsFlow..."

helm uninstall devopsflow --namespace devops 2>/dev/null || true
kubectl delete namespace devops 2>/dev/null || true
kubectl delete namespace argocd 2>/dev/null || true

echo "Done. Namespaces deleted. Docker Desktop K8s cluster is still running."
