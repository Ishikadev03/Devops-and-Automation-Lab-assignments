#!/usr/bin/env bash
set -euo pipefail
URL="${1:-http://localhost:3000/health}"
curl --fail --silent --show-error "$URL"
echo