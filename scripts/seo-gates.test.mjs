import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const dist = path.join(root, 'dist');
const siteUrl = 'https://igloogroupe.com';
const locales = ['en', 'fr', 'tr', 'ar'];

async function readBuiltPage(locale, route = '') {
  const file = path.join(dist, locale, ...(route ? route.split('/') : []), 'index.html');
  return fs.readFile(file, 'utf8');
}

function locsFromSitemap(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/gu)].map((match) => match[1]);
}

function schemaFromHtml(html) {
  const match = html.match(/<script type="application\/ld\+json" data-seo-schema="true">([\s\S]*?)<\/script>/u);
  assert.ok(match, 'built page must contain the SEO JSON-LD script');
  return JSON.parse(match[1]);
}

test('built sitemap contains 80 localized canonical URLs', async () => {
  const xml = await fs.readFile(path.join(dist, 'sitemap.xml'), 'utf8');
  const locs = locsFromSitemap(xml);
  assert.equal(locs.length, 80);
  assert.equal(new Set(locs).size, locs.length);
  assert.ok(locs.every((url) => /^https:\/\/igloogroupe\.com\/(?:en|fr|tr|ar)(?:\/|$)/u.test(url)));
  assert.ok(locs.every((url) => !url.includes('/404')));
  assert.match(xml, /hreflang="ar-DZ"/u);
  assert.match(xml, /hreflang="x-default"/u);
});

test('localized pages expose one canonical and five alternate links', async () => {
  const cases = [
    ['en', '', `${siteUrl}/en/`],
    ['fr', 'about', `${siteUrl}/fr/about`],
    ['tr', 'services', `${siteUrl}/tr/services`],
    ['ar', 'services/general-contracting', `${siteUrl}/ar/services/general-contracting`],
  ];

  for (const [locale, route, expectedCanonical] of cases) {
    const html = await readBuiltPage(locale, route);
    const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/gu)].map((match) => match[1]);
    assert.deepEqual(canonicals, [expectedCanonical]);
    const alternates = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/gu)];
    assert.deepEqual(alternates.map((match) => match[1]).sort(), ['ar-DZ', 'en', 'fr', 'tr', 'x-default'].sort());
    const expectedCanonicalLinks = locale === 'en' && route === '' ? 2 : 1;
    assert.equal(alternates.filter((match) => match[2] === expectedCanonical).length, expectedCanonicalLinks);
    assert.match(html, /<meta name="description" content="[^"].+"/u);
    assert.match(html, /<h1[\s\S]*?<\/h1>/u);

    const schema = schemaFromHtml(html);
    const types = schema['@graph'].flatMap((entry) => Array.isArray(entry['@type']) ? entry['@type'] : [entry['@type']]);
    assert.ok(types.includes('Organization'));
    assert.ok(types.includes('WebSite'));
    assert.ok(types.includes('BreadcrumbList'));
    if (route.startsWith('services/')) assert.ok(types.includes('Service'));
  }
});
