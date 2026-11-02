import assert from 'node:assert/strict';
import { projects, siteURL } from '../config/sites.mjs';

let checked = 0;
async function get(url) {
  checked++;
  return fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(20_000) });
}
async function page(url) {
  const response = await get(url);
  assert.equal(response.status, 200, `${url}: HTTP ${response.status}`);
  const html = await response.text();
  assert.match(html, /<title>[^<]+<\/title>/, `${url}: falta el título`);
  const origin = new URL(url).origin;
  const base = new URL(html.match(/<base\b[^>]*href="([^"]+)"/)?.[1] || url, url);
  const assets = new Set([...html.matchAll(/\b(?:src|href)="([^"#]+)"/g)]
    .map(match => new URL(match[1], base))
    .filter(asset => asset.origin === origin && /\.(?:m?js|css|png|webp|svg|woff2?)(?:$|\?)/.test(asset.pathname))
    .map(asset => asset.href));
  await Promise.all([...assets].map(async asset => {
    const result = await get(asset);
    assert.equal(result.status, 200, `${asset}: asset HTTP ${result.status}`);
    assert.ok(!result.headers.get('content-type')?.includes('text/html'), `${asset}: devolvió HTML`);
    await result.arrayBuffer();
  }));
  console.log(`OK ${url}: ${assets.size} assets`);
}
for (const site of [{ url: `${siteURL}/`, pages: [] }, ...projects]) {
  await Promise.all(['', ...site.pages].map(path => page(new URL(path, site.url).href)));
  const robots = await get(new URL('/robots.txt', site.url));
  assert.equal(robots.status, 200, `${site.url}: robots.txt`);
  const sitemaps = [...(await robots.text()).matchAll(/^Sitemap:\s*(\S+)/gm)].map(match => new URL(match[1]));
  assert.ok(sitemaps.length, `${site.url}: falta sitemap`);
  for (const sitemap of sitemaps) {
    assert.equal(sitemap.origin, new URL(site.url).origin);
    const response = await get(sitemap);
    assert.equal(response.status, 200, sitemap.href);
    assert.ok((await response.text()).includes(site.url));
  }
}
console.log(`OK: ${checked} solicitudes en los cuatro dominios.`);
