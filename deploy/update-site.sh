#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: bash deploy/update-site.sh <site-slug>"
  exit 1
fi

SITE_SLUG="$1"
APP_DIR="/var/www/$SITE_SLUG/current"

if [ ! -d "$APP_DIR/.git" ]; then
  echo "Missing git repository at $APP_DIR"
  exit 1
fi

cd "$APP_DIR"
git pull --ff-only
npm ci
npm run build

# Hetzner may serve this site through Coolify's Docker Nginx rather than the
# host systemd unit. Reload whichever web server actually owns the site.
if systemctl is-active --quiet nginx; then
  nginx -t
  systemctl reload nginx
elif command -v docker >/dev/null 2>&1; then
  WEB_CONTAINER="$(docker ps -q --filter "label=com.docker.compose.service=${SITE_SLUG}-web" | head -n 1)"
  if [ -n "$WEB_CONTAINER" ]; then
    docker exec "$WEB_CONTAINER" nginx -t
    docker exec "$WEB_CONTAINER" nginx -s reload
  else
    echo "No active Nginx service or Docker web container found for $SITE_SLUG"
    exit 1
  fi
else
  echo "No active Nginx service or Docker runtime found for $SITE_SLUG"
  exit 1
fi

echo "Deployment updated successfully for $SITE_SLUG."
