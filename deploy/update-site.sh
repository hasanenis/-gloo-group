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
systemctl reload nginx

echo "Deployment updated successfully for $SITE_SLUG."
