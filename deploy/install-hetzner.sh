#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run this script as root."
  exit 1
fi

if [ "$#" -lt 4 ]; then
  echo "Usage: bash deploy/install-hetzner.sh <site-slug> <domain> <www-domain> <email> [node-major]"
  exit 1
fi

SITE_SLUG="$1"
DOMAIN="$2"
WWW_DOMAIN="$3"
LETSENCRYPT_EMAIL="$4"
NODE_MAJOR="${5:-22}"

APP_DIR="/var/www/$SITE_SLUG"
REPO_DIR="$APP_DIR/current"
NGINX_CONF_TARGET="/etc/nginx/sites-available/$DOMAIN.conf"

export DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get install -y ca-certificates curl gnupg nginx certbot python3-certbot-nginx

mkdir -p /etc/apt/keyrings
if [ ! -f /etc/apt/keyrings/nodesource.gpg ]; then
  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
    | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
fi

cat >/etc/apt/sources.list.d/nodesource.list <<EOF
deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main
EOF

apt-get update
apt-get install -y nodejs git

mkdir -p "$APP_DIR"

if [ ! -d "$REPO_DIR/.git" ]; then
  echo "Repository is not present at $REPO_DIR"
  echo "Clone it first, then rerun this script."
  exit 1
fi

cd "$REPO_DIR"
npm ci
npm run build

sed \
  -e "s|{{DOMAIN}}|$DOMAIN|g" \
  -e "s|{{WWW_DOMAIN}}|$WWW_DOMAIN|g" \
  -e "s|{{SITE_SLUG}}|$SITE_SLUG|g" \
  "$REPO_DIR/deploy/nginx/site.conf.template" >"$NGINX_CONF_TARGET"

ln -sfn "$NGINX_CONF_TARGET" "/etc/nginx/sites-enabled/$DOMAIN.conf"
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl enable nginx
systemctl restart nginx

ufw allow OpenSSH || true
ufw allow 'Nginx Full' || true

certbot --nginx --non-interactive --agree-tos --redirect -m "$LETSENCRYPT_EMAIL" \
  -d "$DOMAIN" -d "$WWW_DOMAIN"

systemctl reload nginx

echo "Install completed for $DOMAIN"
