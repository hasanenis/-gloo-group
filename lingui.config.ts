import { formatter } from '@lingui/format-po';
import type { LinguiConfig } from '@lingui/conf';

const config: LinguiConfig = {
  locales: ['en', 'fr', 'ar-DZ', 'tr'],
  sourceLocale: 'en',
  catalogs: [
    {
      path: 'src/locales/{locale}/messages',
      include: ['src'],
      exclude: ['**/node_modules/**'],
    },
  ],
  format: formatter({ explicitIdAsDefault: true }),
};

export default config;
