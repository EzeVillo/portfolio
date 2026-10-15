import assert from 'node:assert/strict';
import { projects, siteURL } from '../config/routes.mjs';

const base = new URL(process.argv[2] || siteURL);
let checked = 0;
async function get(url, options = {}) {
  const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(20_000), ...options });
  checked++;
  return response;
}
async function page(path) {
  const response = await get(new URL(path, base));
  assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
  const html = await response.text();
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert.ok(title, `${path}: falta el título de la página`);
  // Follow the HTML base element, including Angular's project subdirectory.
  const assetBase = new URL(html.match(/<base\b[^>]*href="([^"]+)"/)?.[1] || path, base);
  const assets = new Set([...html.matchAll(/\b(?:src|href)="([^"#]+)"/g)]
    .map(match => new URL(match[1], assetBase))
    .filter(url => url.origin === base.origin && /\.(?:m?js|css|png|webp|svg|woff2?)(?:$|\?)/.test(url.pathname))
    .map(url => url.href));
  await Promise.all([...assets].map(async url => {
    const asset = await get(url);
    assert.equal(asset.status, 200, `${url}: asset HTTP ${asset.status}`);
    assert.ok(!asset.headers.get('content-type')?.includes('text/html'), `${url}: devolvió HTML`);
    await asset.arrayBuffer();
  }));
  console.log(`OK ${path} y ${assets.size} assets`);
  return { response, title };
}

const { response: home } = await page('/');
assert.ok(home.headers.get('content-security-policy')?.includes("default-src 'none'"), 'Falta la CSP de la home');
const pages = projects.flatMap(project => ['', ...(project.pages || [])].map(page => ({
  path: project.path + page,
  origin: new URL(page, project.origin),
})));
await Promise.all(pages.map(async ({ path, origin }) => {
  const [proxied, original] = await Promise.all([page(path), get(origin)]);
  assert.equal(original.status, 200, `${origin}: origen inaccesible`);
  assert.equal(proxied.response.headers.get('content-security-policy'), original.headers.get('content-security-policy'), `${path}: el proxy cambió la CSP del proyecto`);
  const originalHtml = await original.text();
  assert.equal(proxied.title, originalHtml.match(/<title>(.*?)<\/title>/s)?.[1], `${path}: contenido distinto del origen`);
  const query = '?ref=production-check&lang=es';
  const bare = new URL(path.slice(0, -1) + query, base);
  const redirect = await get(bare);
  assert.equal(redirect.status, 301, `${bare}: falta normalizar la barra`);
  assert.equal(redirect.headers.get('location'), new URL(path + query, base).href, `${bare}: redirección incorrecta`);
  await redirect.arrayBuffer();
}));
const robots = await get(new URL('/robots.txt', base));
assert.equal(robots.status, 200, '/robots.txt: no disponible');
const sitemaps = [...(await robots.text()).matchAll(/^Sitemap:\s*(\S+)/gm)].map(match => new URL(match[1]));
assert.ok(sitemaps.length > 0, 'robots.txt: falta el sitemap');
await Promise.all(sitemaps.map(async sitemap => {
  assert.equal(sitemap.origin, siteURL, 'El sitemap debe pertenecer al sitio público');
  const response = await get(new URL(sitemap.pathname, base));
  assert.equal(response.status, 200, `${sitemap.pathname}: HTTP ${response.status}`);
  assert.ok((await response.text()).includes(`${siteURL}/`), `${sitemap.pathname}: faltan las URLs públicas`);
}));
console.log(`OK: ${checked} solicitudes verificadas en ${base.origin}`);
