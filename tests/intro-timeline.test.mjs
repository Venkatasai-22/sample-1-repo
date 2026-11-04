import test from 'node:test';
import assert from 'node:assert/strict';
import { frameAt, isValidCues, PREVIEW_CUES, wipeBounds } from '../src/intro/timeline.mjs';

test('paint starts clear, then fully covers before any wipe', () => {
  assert.deepEqual(frameAt(-1, PREVIEW_CUES), { fill: 0, wipe: 0, complete: false });
  assert.deepEqual(frameAt(1, PREVIEW_CUES), { fill: 1, wipe: 0, complete: false });
});
test('transition ends completely clear', () => {
  assert.deepEqual(frameAt(3.5, PREVIEW_CUES), { fill: 1, wipe: 1, complete: true });
  assert.deepEqual(frameAt(99, PREVIEW_CUES), { fill: 1, wipe: 1, complete: true });
});
test('wipe opens in the center and reaches every edge', () => {
  assert.deepEqual(wipeBounds(0), { top: .46, bottom: .46, halfWidth: 0 });
  const middle = wipeBounds(.6), end = wipeBounds(1);
  assert.equal(middle.top, 0);
  assert.ok(middle.bottom > .46 && middle.bottom < 1);
  assert.ok(end.halfWidth > .5 && end.bottom > 1 && end.top === 0);
});
test('invalid or unordered film cues are rejected', () => {
  assert.equal(isValidCues(PREVIEW_CUES), true);
  assert.equal(isValidCues(null), false);
  assert.equal(isValidCues({ ...PREVIEW_CUES, wipeEnd: .2 }), false);
  assert.equal(isValidCues({ ...PREVIEW_CUES, paintCovered: '1' }), false);
  assert.equal(isValidCues({ ...PREVIEW_CUES, wipeStart: Infinity }), false);
});
