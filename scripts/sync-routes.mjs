import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { projects, siteURL, netlifyURL, entryPaths } from '../config/routes.mjs';

const check = process.argv.includes('--check');
for (const value of [siteURL, netlifyURL]) {
  const url = new URL(value);
  assert.ok(url.protocol === 'https:' && url.origin === value, `Dominio inválido: ${value}`);
}
assert.equal(new Set(entryPaths).size, entryPaths.length, 'Entradas de proyectos duplicadas');
for (const { path, origin, pages = [] } of projects) {
  assert.match(path, /^\/(?:[a-z0-9-]+\/)+$/, `Ruta inválida: ${path}`);
  const url = new URL(origin);
  assert.ok(url.protocol === 'https:' && !url.username && !url.password && !url.search && !url.hash && url.pathname.endsWith('/'), `Origen inválido: ${origin}`);
  assert.ok(![siteURL, netlifyURL].includes(url.origin), `El proxy no puede volver al portfolio: ${origin}`);
  for (const page of pages) assert.match(page, /^(?:[a-z0-9-]+\/)+$/, `Subpágina inválida: ${page}`);
}

function redirect(from, to, status) {
  return ['[[redirects]]', `  from = ${JSON.stringify(from)}`, `  to = ${JSON.stringify(to)}`, `  status = ${status}`, '  force = true'].join('\n');
}
const rules = [
  redirect(`${netlifyURL}/*`, `${siteURL}/:splat`, 301),
  ...projects.flatMap(({ path, origin }) => [
    redirect(path.slice(0, -1), origin, 200),
    redirect(`${path}*`, `${origin}:splat`, 200),
  ]),
].join('\n\n');

const netlifyPath = new URL('../netlify.toml', import.meta.url);
const netlify = (await readFile(netlifyPath, 'utf8')).replaceAll('\r\n', '\n');
const generated = /# BEGIN GENERATED ROUTES\n[\s\S]*?# END GENERATED ROUTES/;
assert.ok(generated.test(netlify), 'Falta el bloque de rutas generadas en netlify.toml');
const expectedNetlify = netlify.replace(generated, `# BEGIN GENERATED ROUTES\n# Generated from config/routes.mjs by npm run routes.\n${rules}\n# END GENERATED ROUTES`);

const edgePath = new URL('../netlify/edge-functions/project-slash.js', import.meta.url);
const edge = (await readFile(edgePath, 'utf8')).replaceAll('\r\n', '\n');
const entries = /^const entryPaths = .*;$/m;
assert.ok(entries.test(edge), 'Falta la declaración de entradas en la Edge Function');
const expectedEdge = edge.replace(entries, `const entryPaths = ${JSON.stringify(entryPaths)};`);

if (check) {
  assert.equal(netlify, expectedNetlify, 'Rutas de Netlify desactualizadas: ejecutar npm run routes');
  assert.equal(edge, expectedEdge, 'Entradas desactualizadas: ejecutar npm run routes');
} else {
  await writeFile(netlifyPath, expectedNetlify);
  await writeFile(edgePath, expectedEdge);
}
console.log(`OK: ${projects.length} proxies y ${entryPaths.length} entradas ${check ? 'sincronizados' : 'generados'}.`);
