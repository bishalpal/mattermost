#!/bin/bash
set -e -u -o pipefail
cd "$(dirname "$0")"
. .e2erc

BRANCH_DEFAULT=$(git branch --show-current)
export BRANCH=${BRANCH:-$BRANCH_DEFAULT}
BUILD_ID_DEFAULT=$(date +%s)
export BUILD_ID=${BUILD_ID:-$BUILD_ID_DEFAULT}
export CI_BASE_URL="${CI_BASE_URL:-localhost}"
export SITE_URL="${SITE_URL:-http://server:8065}"

# Cleanup old containers, if any
mme2e_log "Stopping leftover E2E containers, if any are running"
${MME2E_DC_SERVER} down -v --remove-orphans

# Wait for the required server image
mme2e_log "Waiting for server image to be available"
mme2e_wait_image "$SERVER_IMAGE" 30 60

# Launch mattermost-server, and wait for it to be healthy
mme2e_log "Starting E2E containers"
${MME2E_DC_SERVER} create
${MME2E_DC_SERVER} up -d
if ! mme2e_wait_service_healthy server 60 10; then
  mme2e_log "Mattermost container not healthy, retry attempts exhausted. Giving up." >&2
  exit 1
fi
mme2e_log "Mattermost container is running and healthy"
