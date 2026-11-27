#!/usr/bin/env bash
# Demonstration traffic switch. This is a controlled selector-based canary,
# not weighted traffic splitting; use a service mesh/Ingress controller for true percentages.
set -euo pipefail
NAMESPACE=devopsflow
MODE="${1:-}"
case "$MODE" in
  start)
    kubectl patch service task-app -n "$NAMESPACE" --type merge -p '{"spec":{"selector":{"app":"task-app","track":"canary"}}}'
    echo "Service now routes to the canary track."
    ;;
  promote)
    kubectl patch service task-app -n "$NAMESPACE" --type merge -p '{"spec":{"selector":{"app":"task-app","track":"stable"}}}'
    echo "Stable track selected. Update stable image after validation to complete promotion."
    ;;
  rollback)
    kubectl patch service task-app -n "$NAMESPACE" --type merge -p '{"spec":{"selector":{"app":"task-app","track":"stable"}}}'
    echo "Rollback: service routes to stable track."
    ;;
  *) echo "Usage: $0 {start|promote|rollback}"; exit 2;;
esac