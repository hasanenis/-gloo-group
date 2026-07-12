# Localization baseline audit

Run `npm run i18n:inventory`, `npm run validate:lingui`, and `npm run audit:project-locales -- --strict` before each migration wave. The baseline is measured per route and per locale; no release may hide missing copy through fallback.
