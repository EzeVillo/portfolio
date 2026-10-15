import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import projectSlash from '../netlify/edge-functions/project-slash.js';

describe('Project path normalization before proxying', () => {
  for (const path of ['/ibit-to-btc', '/ibit-to-btc/ar', '/git-review-workflow', '/truco-a-3']) {
    it(`redirects ${path} once, preserving query parameters and the public origin`, async () => {
      const query = '?ref=readme&lang=es';
      const next = async () => { assert.fail('The bare entry path must not reach the proxy'); };
      const response = await projectSlash(new Request(`https://ezevillo.com${path}${query}`), { next });
      assert.equal(response.status, 301);
      assert.equal(response.headers.get('location'), `https://ezevillo.com${path}/${query}`);

      const proxied = new Response('project page');
      let calls = 0;
      const normalized = await projectSlash(new Request(response.headers.get('location')), {
        next: async () => { calls++; return proxied; },
      });
      assert.equal(normalized, proxied);
      assert.equal(normalized.headers.has('location'), false);
      assert.equal(calls, 1);
    });
  }

  it('keeps the home, assets, APIs and other paths unchanged', async () => {
    for (const path of ['/', '/assets/favicon.svg', '/ibit-to-btc/assets/app.js', '/ibit-to-btc/api/rates',
      '/ibit-to-btc/sitemap.xml', '/git-review-workflow/logo.svg', '/truco-a-3/mesa/123', '/unknown']) {
      const untouched = new Response(path);
      let calls = 0;
      const response = await projectSlash(new Request(`https://ezevillo.com${path}`), {
        next: async () => { calls++; return untouched; },
      });
      assert.equal(response, untouched);
      assert.equal(calls, 1);
    }
  });
});
