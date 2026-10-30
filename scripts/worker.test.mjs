import assert from 'node:assert/strict';
import { test } from 'node:test';
import worker from '../cloudflare/worker.mjs';
import { entryPaths, projects } from '../config/routes.mjs';

for (const path of entryPaths) {
  test(`Cloudflare: normaliza ${path} sin perder parámetros`, async () => {
    const response = await worker.fetch(new Request(`https://ezevillo.com${path}?ref=test&lang=es`), {});
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('location'), `https://ezevillo.com${path}/?ref=test&lang=es`);
  });
}
for (const project of projects) {
  for (const suffix of ['', 'assets/app.js', 'ruta/interna?ref=test']) {
    test(`Cloudflare: ${project.path}${suffix} usa el servicio correcto`, async () => {
      let received;
      const env = { [project.binding]: { fetch: async request => {
        received = request;
        return new Response('project', { headers: { 'Content-Security-Policy': "default-src 'self'", 'Cache-Control': 'max-age=60' } });
      } } };
      const response = await worker.fetch(new Request(`https://ezevillo.com${project.path}${suffix}`, { headers: { 'X-Test': 'forwarded' } }), env);
      assert.equal(response.status, 200);
      assert.equal(await response.text(), 'project');
      assert.equal(received.url, `https://ezevillo.com${project.stripPrefix ? '/' : project.path}${suffix}`);
      assert.equal(received.headers.get('x-test'), 'forwarded');
      assert.equal(response.headers.get('content-security-policy'), "default-src 'self'");
      assert.equal(response.headers.get('cache-control'), 'max-age=60');
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    });
  }
}
test('Cloudflare: rechaza escrituras, rutas ajenas y no expone errores internos', async () => {
  assert.equal((await worker.fetch(new Request('https://ezevillo.com/truco-a-3/', { method: 'POST' }), {})).status, 405);
  assert.equal((await worker.fetch(new Request('https://ezevillo.com/truco-a-3-otro/'), {})).status, 404);
  const response = await worker.fetch(new Request('https://ezevillo.com/ibit-to-btc/'), { IBIT: { fetch() { throw new Error('private details'); } } });
  assert.equal(response.status, 502);
  assert.ok(!(await response.text()).includes('private details'));
});
test('Cloudflare: conserva el prefijo en redirecciones del sitio hijo', async () => {
  for (const location of ['/guides/example/?ref=1', 'https://ezevillo.com/guides/example/?ref=1']) {
    const response = await worker.fetch(new Request('https://ezevillo.com/git-review-workflow/guides/example?ref=1'), {
      GIT_REVIEW: { fetch: async () => new Response(null, { status: 307, headers: { Location: location } }) },
    });
    assert.equal(response.status, 307);
    assert.equal(response.headers.get('location'), 'https://ezevillo.com/git-review-workflow/guides/example/?ref=1');
  }
});
