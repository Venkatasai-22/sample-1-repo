import test from 'node:test';
import assert from 'node:assert/strict';
import { routes, resolveRoute } from '../src/routes.mjs';

test('each destination has a unique directly resolvable URL', () => {
  const paths = Object.values(routes).map(route => route.path);
  assert.equal(new Set(paths).size, paths.length);
  for (const [key, route] of Object.entries(routes)) {
    assert.equal(resolveRoute(route.path), key);
    if (key !== 'home') assert.equal(resolveRoute(`${route.path}/`), key);
  }
});
test('legacy bookmarks still resolve to the correct dedicated page', () => {
  assert.equal(resolveRoute('/', '#shop'), 'apparel');
  assert.equal(resolveRoute('/', '#supplies'), 'produce');
  assert.equal(resolveRoute('/', '#studio'), 'studio');
  assert.equal(resolveRoute('/', '#bulk'), 'bulk');
  assert.equal(resolveRoute('/not-a-page'), 'not-found');
});
