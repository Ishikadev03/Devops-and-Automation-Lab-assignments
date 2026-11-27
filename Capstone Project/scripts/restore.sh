#!/usr/bin/env bash
set -euo pipefail
BACKUP="${1:?Usage: $0 backups/file.sql}"
if docker compose ps --status running --services | grep -qx db; then
  docker compose exec -T db psql -U tasks_user tasks < "$BACKUP"
else
  kubectl exec -i -n devopsflow deployment/postgres -- psql -U tasks_user tasks < "$BACKUP"
fi
echo "Restore command completed from $BACKUP"