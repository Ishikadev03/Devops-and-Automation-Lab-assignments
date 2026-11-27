#!/usr/bin/env bash
set -euo pipefail
IMAGE="${1:-devopsflow-task-app:local}"
if command -v minikube >/dev/null 2>&1; then minikube image load "$IMAGE"; fi
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/app-config.yaml
kubectl apply -f kubernetes/postgres.yaml
sed "s|IMAGE_PLACEHOLDER|$IMAGE|g" kubernetes/app-deployment.yaml | kubectl apply -f -
kubectl apply -f kubernetes/service.yaml
kubectl rollout status deployment/postgres -n devopsflow --timeout=180s
kubectl rollout status deployment/task-app-stable -n devopsflow --timeout=180s
echo "Deployment ready. Run: kubectl port-forward svc/task-app 8080:80 -n devopsflow"