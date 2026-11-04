import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';

test('real-film manifest points to shipped desktop, mobile and poster assets', async () => {
  const manifest = JSON.parse(await readFile(new URL('../public/intro/film.json', import.meta.url)));
  assert.equal(manifest.mode, 'video');
  assert.equal(manifest.duration, 6);
  assert.equal(manifest.desktop, '/intro/film-to-fabric-web.mp4');
  assert.deepEqual(manifest.resolution, { width: 1920, height: 1080 });
  assert.notEqual(manifest.desktop, manifest.master);
  assert.equal(manifest.fallback, manifest.mobile);
  assert.ok(!JSON.stringify(manifest).includes('road'));
  for (const asset of [manifest.desktop, manifest.mobile, manifest.fallback, manifest.poster]) {
    assert.match(asset, /^\/intro\/[a-z0-9.-]+$/);
    const info = await stat(new URL(`../public${asset}`, import.meta.url));
    assert.ok(info.size > 1000);
  }
});
