#!/usr/bin/env bash
set -euo pipefail
mkdir -p backups
STAMP="$(date +%Y%m%d-%H%M%S)"
if docker compose ps --status running --services | grep -qx db; then
  docker compose exec -T db pg_dump -U tasks_user tasks > "backups/tasks-$STAMP.sql"
else
  kubectl exec -n devopsflow deployment/postgres -- pg_dump -U tasks_user tasks > "backups/tasks-$STAMP.sql"
fi
echo "Backup created: backups/tasks-$STAMP.sql"