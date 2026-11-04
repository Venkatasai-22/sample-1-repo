export const PREVIEW_CUES = Object.freeze({
  paintStart: 0,
  paintCovered: 0.85,
  wipeStart: 1.15,
  wipeEnd: 3.5,
});

export function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function progress(time, from, to) {
  return clamp((time - from) / (to - from));
}

export function isValidCues(cues) {
  const values = [cues?.paintStart, cues?.paintCovered, cues?.wipeStart, cues?.wipeEnd];
  return values.every((v, i) => Number.isFinite(v) && v >= 0 && (!i || v > values[i - 1]));
}

// The first stroke opens the center upward; the second clears down to the bottom edge.
export function wipeBounds(wipe) {
  return {
    top: 0.46 * (1 - progress(wipe, 0, 0.4)),
    bottom: 0.46 + 0.56 * progress(wipe, 0.32, 1),
    halfWidth: 0.53 * progress(wipe, 0, 0.38),
  };
}

export function frameAt(time, cues) {
  return {
    fill: progress(time, cues.paintStart, cues.paintCovered),
    wipe: progress(time, cues.wipeStart, cues.wipeEnd),
    complete: time >= cues.wipeEnd,
  };
}
