#!/usr/bin/env bash
# Local-only Simple Lecture runner. Always binds this folder to port 8082.
# Do not use on production. Production keeps vite.config.ts / npm run build unchanged.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
cd "$ROOT"

PORT=8082
echo "Starting Simple Lecture locally on http://localhost:${PORT}"
echo "Repo: ${ROOT}"

if command -v lsof >/dev/null 2>&1; then
  PIDS="$(lsof -ti tcp:"${PORT}" -sTCP:LISTEN || true)"
  if [ -n "${PIDS}" ]; then
    echo "Port ${PORT} is in use. Stopping: ${PIDS}"
    kill ${PIDS} 2>/dev/null || true
    sleep 1
  fi
fi

if [ ! -d node_modules ]; then
  echo "node_modules missing. Running npm install..."
  npm install
fi

# CLI --port overrides vite.config.ts (production default stays 8080).
echo "Launching Vite on 0.0.0.0:${PORT} (local / this machine only)..."
npx vite --host 0.0.0.0 --port "${PORT}" --strictPort
