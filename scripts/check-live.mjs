import assert from 'node:assert/strict';

const base = new URL(process.argv[2] || 'https://ezevillo.com');
const origins = {
  '/ibit-to-btc/': 'https://neon-macaron-a52e5c.netlify.app/ibit-to-btc/',
  '/ibit-to-btc/ar/': 'https://neon-macaron-a52e5c.netlify.app/ibit-to-btc/ar/',
  '/git-review-workflow/': 'https://ezevillo-git-review-workflow.netlify.app/',
  '/truco-a-3/': 'https://ezevillo-truco-a-3.netlify.app/truco-a-3/',
};
let checked = 0;
async function get(url, options = {}) {
  const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(20_000), ...options });
  checked++;
  return response;
}
async function page(path, marker) {
  const response = await get(new URL(path, base));
  assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
  const html = await response.text();
  assert.ok(html.includes(marker), `${path}: contenido inesperado`);
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
  return response;
}

const home = await page('/', 'De una idea');
assert.ok(home.headers.get('content-security-policy')?.includes("default-src 'none'"), 'Falta la CSP de la home');
await Promise.all(Object.entries(origins).map(async ([path, origin]) => {
  const marker = path.includes('ibit') ? 'IBIT to BTC' : path.includes('truco') ? 'Truco a 3' : 'git review';
  const [proxied, original] = await Promise.all([page(path, marker), get(origin)]);
  assert.equal(original.status, 200, `${origin}: origen inaccesible`);
  assert.equal(proxied.headers.get('content-security-policy'), original.headers.get('content-security-policy'), `${path}: el proxy cambió la CSP del proyecto`);
  await original.arrayBuffer();
  const query = '?ref=production-check&lang=es';
  const bare = new URL(path.slice(0, -1) + query, base);
  const redirect = await get(bare);
  assert.equal(redirect.status, 301, `${bare}: falta normalizar la barra`);
  assert.equal(redirect.headers.get('location'), new URL(path + query, base).href, `${bare}: redirección incorrecta`);
  await redirect.arrayBuffer();
}));
await Promise.all(['/robots.txt', '/sitemap.xml', '/ibit-to-btc/sitemap.xml'].map(async path => {
  const response = await get(new URL(path, base));
  assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
  assert.ok((await response.text()).includes('https://ezevillo.com/'), `${path}: faltan las URLs públicas`);
}));
console.log(`OK: ${checked} solicitudes verificadas en ${base.origin}`);
