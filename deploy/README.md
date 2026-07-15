# Hetzner deploy notes

This repository can be deployed as a static Vite build behind Nginx, and the scripts are now reusable for multiple sites on the same server.

## Read this first: `git push` does NOT update the live site

These are two separate systems:

1. **GitHub** (`origin`, `git@github.com:hasanenis/-gloo-group.git`) - just source control.
2. **The Hetzner VPS** (`65.21.176.223`, SSH as `root`) - runs its own git checkout at
   `/var/www/igloogroupe/current` and serves the site from
   `/var/www/igloogroupe/current/dist` via Nginx.

`dist/` is a **build artifact** (`npm run build` output). It does not update itself.
Pushing to GitHub only changes what's sitting in GitHub - it has zero effect on the
live site until something on the server does `git pull` **and** rebuilds **and**
reloads Nginx. A bare `git pull` on the server updates the source tree but leaves
`dist/` (and therefore the live site) exactly as stale as before.

As of 2026-07, that whole chain runs automatically - see "Auto-deploy on push" below.
If you're an AI/dev picking this repo up cold and the live site looks out of date
after a push, check the auto-deploy log (command below) before assuming anything
is broken.

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

## Manual deploy

Run once per site (this is what the auto-deploy mechanism below calls internally):

```bash
bash deploy/update-site.sh igloogroupe
bash deploy/update-site.sh leosclothes
```

It does, in order: `git pull --ff-only` -> `npm ci` -> `npm run build` -> `systemctl reload nginx`.
If any step fails (most commonly the build step, see "Content validation gate" below),
the script stops (`set -euo pipefail`) and Nginx is never reloaded - the old `dist/`
keeps serving traffic with no user-visible error.

## Auto-deploy on push

`deploy/auto-deploy.sh <site-slug>` is what actually makes "push to `main`" ship
to production. On every run it:

1. `git fetch origin main`
2. Compares local `HEAD` to `origin/main`.
3. If they match, exits immediately and silently (no log output, no build).
4. If they differ, logs a timestamp and runs `update-site.sh <site-slug>`
   (pull + build + reload, as above).

It's installed as a **root crontab entry on the server**, not tracked in git
(crontab state lives outside the repo):

```bash
ssh root@65.21.176.223
crontab -l   # inspect current entries
crontab -e
# should contain:
*/2 * * * * /var/www/igloogroupe/current/deploy/auto-deploy.sh igloogroupe >> /var/log/igloogroupe-auto-deploy.log 2>&1
```

A `flock` on `/tmp/<site-slug>-auto-deploy.lock` prevents overlapping runs if a
build takes longer than 2 minutes.

**End-to-end timing:** push to `main` -> live site updated, typically within ~2
minutes, no manual SSH step required.

### Checking status (for a human or an AI picking this up cold)

```bash
# Is the server's checkout current?
ssh root@65.21.176.223 "cd /var/www/igloogroupe/current && git log -1 --oneline && git rev-parse origin/main"

# When was the live build actually produced?
ssh root@65.21.176.223 "stat -c '%y' /var/www/igloogroupe/current/dist/index.html"

# What has auto-deploy actually done/attempted?
ssh root@65.21.176.223 "tail -50 /var/log/igloogroupe-auto-deploy.log"

# Force a deploy right now instead of waiting for the next cron tick
# (only runs update-site.sh if there IS a new commit vs. what's already deployed)
ssh root@65.21.176.223 "bash /var/www/igloogroupe/current/deploy/auto-deploy.sh igloogroupe"
```

### Known failure modes - read before panicking

- **Build fails silently.** If `npm run build` errors, `update-site.sh` stops
  before reloading Nginx. The site keeps serving the old build with no crash,
  no 500, nothing visible - the only signal is the auto-deploy log. Always
  check the log before assuming a push "didn't take."

- **Content validation gate** (`scripts/content-validate.ts`): any page content
  document with `status: "approved"` must have `revision` and `sourceRevision`
  matching `/^v\d+[-:]/` (i.e. any `v<number>-` or `v<number>:` prefix - `v1-<hash>`
  from the canonical pipeline and legacy labels like `v3-natural-fr` are both
  valid). If this regex ever gets narrowed back to a literal `v1-` prefix, every
  page still on a `v3-natural-*` label will fail the build. This has already
  bitten a deploy once (2026-07) - if `npm run build` fails with "approved
  documents need revisions", check this rule and the actual `revision` values
  in `content/pages/**/*.json` before changing content.

- **Server-side uncommitted changes block `git pull --ff-only`.** The server
  checkout is a real working directory; if anyone ever edits files directly on
  the box (has happened before), `git pull --ff-only` refuses rather than
  clobbering that work. Don't force past this with `git reset --hard` or
  `git clean -fd` without checking what's there first - `git stash push -u`
  first, confirm with a human what the stash contains, decide separately
  whether to drop it.

- **Transient `error: cannot lock ref 'refs/remotes/origin/main'...`** in the
  log means a fetch collided with another concurrent git operation (e.g. a
  human SSH'd in and ran `git pull` manually at the same moment cron fired).
  Harmless - the next cron tick two minutes later resolves it. One occurrence
  is not an incident.

- **Don't assume a slow/failed `git push` from a dev machine is a network
  problem.** This repo's history briefly ballooned to ~2.3GB of unused binary
  assets (`İgloo project data/`, `public/Upscaled/`, `storybook-static/` - none
  referenced anywhere in the app) baked into commits that had never reached
  origin. Those were stripped with `git filter-branch` scoped to
  `origin/main..HEAD` before the first push (safe specifically because that
  range had never been pushed - no shared history was rewritten). All three
  paths are now gitignored. If push size balloons again, check for new large
  blobs before blaming the connection:
  `git rev-list --objects origin/main..HEAD | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sort -k3 -n -r | head`

## Notes

- The Nginx template includes `try_files ... /index.html` so React Router routes keep working on refresh.
- If the second site uses a different domain than `leosclothes.com`, use that real domain in the install command.
