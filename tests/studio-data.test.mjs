import test from 'node:test';
import assert from 'node:assert/strict';
import { garments, businessPresets, templateArtwork, artworkKey } from '../src/studio-data.mjs';

test('studio covers tees, hoodies, sweatshirts and caps with valid options', () => {
  assert.deepEqual(garments.map(item => item.id), ['tee', 'hoodie', 'sweatshirt', 'cap']);
  for (const item of garments) {
    assert.ok(item.price > 0);
    assert.ok(item.sizes.length && item.placements.length);
  }
  assert.deepEqual(garments.at(-1).sizes, ['One size']);
  assert.deepEqual(garments.at(-1).placements, ['Front']);
});
test('every business template produces safely encoded SVG artwork', () => {
  for (const preset of businessPresets) {
    const art = decodeURIComponent(templateArtwork('<script>&"', preset.id).split(',')[1]);
    assert.ok(art.includes('&lt;script&gt;&amp;&quot;'));
    assert.ok(!art.includes('<script>'));
    assert.ok(art.endsWith('</svg>'));
  }
});
test('same-length business names keep distinct cart artwork identities', () => {
  const first = templateArtwork('TEAM ONE', 'team');
  const second = templateArtwork('TEAM TWO', 'team');
  assert.equal(first.length, second.length);
  assert.notEqual(artworkKey(first), artworkKey(second));
  assert.equal(artworkKey(first), artworkKey(first));
});
