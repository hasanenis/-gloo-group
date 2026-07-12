# Hetzner deploy notes

This repository can be deployed as a static Vite build behind Nginx, and the scripts are now reusable for multiple sites on the same server.

## Server layout

Each site gets its own directory:

- `/var/www/<site-slug>/current`
- `/var/www/<site-slug>/current/dist`

Examples:

- `igloogroupe` -> `/var/www/igloogroupe/current`
- `leosclothes` -> `/var/www/leosclothes/current`

## DNS

If Cloudflare proxy is enabled, the origin should still point to the Hetzner server IP for each hostname.

Examples:

- `A @ -> 65.21.176.223`
- `A www -> 65.21.176.223`

## First install

1. Clone each repository on the server:
   - `/var/www/igloogroupe/current`
   - `/var/www/leosclothes/current`
2. Run the installer once per site:

```bash
bash deploy/install-hetzner.sh igloogroupe igloogroupe.com www.igloogroupe.com admin@igloogroupe.com
bash deploy/install-hetzner.sh leosclothes leosclothes.com www.leosclothes.com admin@leosclothes.com
```

3. Confirm Nginx and HTTPS are active:
   - `systemctl status nginx`
   - `curl -I https://igloogroupe.com`
   - `curl -I https://www.igloogroupe.com`

## Update deploy

Run once per site:

```bash
bash deploy/update-site.sh igloogroupe
bash deploy/update-site.sh leosclothes
```

## Auto-deploy on push

`deploy/auto-deploy.sh <site-slug>` checks `origin/main` and, only if there's
a new commit, runs `update-site.sh`. It's meant to run on a schedule via cron
so pushes to `main` go live without a manual SSH step.

Install once per site on the server:

```bash
crontab -e
# add:
*/2 * * * * /var/www/igloogroupe/current/deploy/auto-deploy.sh igloogroupe >> /var/log/igloogroupe-auto-deploy.log 2>&1
```

Logs land in `/var/log/<site-slug>-auto-deploy.log`.

## Notes

- The Nginx template includes `try_files ... /index.html` so React Router routes keep working on refresh.
- If the second site uses a different domain than `leosclothes.com`, use that real domain in the install command.
