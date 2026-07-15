#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: bash deploy/auto-deploy.sh <site-slug>"
  exit 1
fi

SITE_SLUG="$1"
APP_DIR="/var/www/$SITE_SLUG/current"
LOCK_FILE="/tmp/${SITE_SLUG}-auto-deploy.lock"

exec 200>"$LOCK_FILE"
flock -n 200 || exit 0

cd "$APP_DIR"
git fetch origin main --quiet

LOCAL_REV="$(git rev-parse HEAD)"
REMOTE_REV="$(git rev-parse origin/main)"

if [ "$LOCAL_REV" = "$REMOTE_REV" ]; then
  exit 0
fi

echo "$(date -u +'%Y-%m-%dT%H:%M:%SZ') new commit $REMOTE_REV detected, deploying $SITE_SLUG"
bash deploy/update-site.sh "$SITE_SLUG"
echo "$(date -u +'%Y-%m-%dT%H:%M:%SZ') deploy finished for $SITE_SLUG"
