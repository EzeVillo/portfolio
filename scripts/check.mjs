import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../public/', import.meta.url));
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const css = await readFile(resolve(root, 'styles.css'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'IDs duplicados en el HTML');
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'La página necesita un único h1');

for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) {
  assert.ok(ids.includes(match[1]), `Ancla sin destino: #${match[1]}`);
}
for (const match of html.matchAll(/\baria-(?:controls|labelledby)="([^"]+)"/g)) {
  for (const id of match[1].split(' ')) assert.ok(ids.includes(id), `Referencia ARIA sin destino: ${id}`);
}
const assets = new Set([
  ...[...html.matchAll(/\b(?:src|href)="(\/[^"#]+)"/g)].map(match => match[1]),
  ...[...css.matchAll(/url\(['"]?(\/[^'"\)]+)['"]?\)/g)].map(match => match[1]),
]);
for (const asset of assets) await access(resolve(root, '.' + asset));
const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
assert.equal(JSON.parse(jsonLd)['@type'], 'ProfilePage', 'Metadatos de perfil inválidos');
const netlifyConfig = await readFile(new URL('../netlify.toml', import.meta.url), 'utf8');
const jsonLdHash = createHash('sha256').update(jsonLd.replaceAll('\r\n', '\n')).digest('base64');
assert.ok(netlifyConfig.includes(`'sha256-${jsonLdHash}'`), 'Actualizar el hash CSP del JSON-LD en netlify.toml');
assert.ok(html.includes('lang="es-AR"'), 'Idioma de la página no definido');
console.log(`OK: ${assets.size} assets locales, ${ids.length} IDs, anclas, referencias ARIA y metadatos.`);
