# Colorflu Road / Paint / Wipe Film

## Delivery status

The cartoon cutout and floating-droplet opening have been removed.
The React intro now supports a real fullscreen video with media-time cues,
a continuous paint coating, and a center-to-bottom reveal of the live website.

**The live-action demo is generated and integrated.** Two free five-second
HeyGen Video 1 website previews were generated without a payment prompt. The
connected Runway Free workspace did not expose a video model; no paid generation
was submitted through either plugin.

The first shot shows an adult walking on an asphalt road and throwing paint at
glass. The second is a close-up of hands using a real-looking squeegee. This is a
two-shot edit, not a single continuous take of the same visible person. The free
text-only preview could not use the existing reference plate to lock identity.

The two shots are joined under full paint coverage. Three.js removes the green
backing in the wiping shot to reveal the actual homepage. The source leaves thin
paint edges; those fade away over the final 0.65 seconds. The reveal follows the
filmed blade downwards rather than pretending a still image is animated.

Both website exports have NO audio stream. Original sound remains only in the
retained source clips. Video is also muted and playsInline, with no loop.
The old preview browser tabs were closed to stop their repeating audio.

This remains a local demo. Commercial-use rights for this specific free preview
route have not been independently cleared; verify them before public deployment.
The general marketing pages and localized pages describe different plan benefits.

## Film direction

A single continuous realistic commercial shot, approximately 10 seconds.
One adult Indian painter in an ivory T-shirt, charcoal work trousers and white
sneakers walks naturally toward camera along an asphalt studio lane. His steps
have grounded heel-to-toe contact, a realistic weight shift and a gently swinging
metal paint bucket. A long rubber squeegee is held in the other hand.

0-3 seconds: approach along the road. Maintain the reference character, wardrobe,
architecture, road perspective and natural lighting. No jump cuts or artificial
camera spins. Keep person, bucket and squeegee inside the central portrait-safe area.

3-4.6 seconds: he plants his feet, swings and tips the bucket toward the lens.
Thick cyan, magenta, yellow, violet and coral liquid flies forward with believable
momentum. The paint hits the lens and fully coats EVERY corner. No transparent
gap around the edges; no confetti, floating capsules, emoji or cartoon character.

4.6-6.1 seconds: brief completely opaque wet paint coverage, with viscous drips.
The painter raises the squeegee toward the painted glass; its blade contacts the
surface, rather than floating in front of it.

6.1-9.2 seconds: deliberate wiping begins in the center. The first broad stroke
opens upward and sideways; a second continuous pass sweeps toward the bottom,
pushing wet paint with its rubber edge. The website's actual DOM is composited
underneath by the browser, not generated as illegible text inside the film.
Keep the wiper edge timing coherent with the configured reveal mask.

9.2-10 seconds: all paint clears. The brand and website content settle into view.
No required second landing screen or extra Enter click after a completed film.

## Reference plate

- Asset: `public/intro/road-reference.png`
- Created with the built-in image generator; original retained in Codex generated images.
- Generation prompt: realistic Bengaluru studio lane, grey asphalt with central
  white dashed markings, concrete studios with cyan / magenta / yellow doors,
  soft overcast daylight; one adult Indian painter walking toward a waist-height
  35 mm camera carrying a metal paint bucket and long rubber squeegee. Natural
  proportions, ivory T-shirt, charcoal trousers, worn white shoes. Full body
  centered in the portrait-safe area, no words, logos, duplicated people or cartoon styling.

## Integration

Current delivered assets:

- `public/intro/colorflu-road-film.mp4`: 1344 x 768, H.264, 24 fps, 236 frames,
  9.833 seconds, approximately 3.0 MiB, no audio.
- `public/intro/colorflu-road-mobile.mp4`: 432 x 768 portrait crop, same timing,
  approximately 1.3 MiB, no audio.
- `public/intro/road-film-poster.jpg`: first frame of the actual delivered film.
- `src/intro/FilmSurface.js`: video texture, aspect-preserving cover crop, timed
  chroma key and final edge fade. Green is only keyed after wipeStart.
- `public/intro/film.json`: actual local sources and inspected timings.

Natural-speed source mapping: walk 0-5 seconds -> sequence 0-5; wiping 0-5 seconds
-> sequence 4.833-9.833, with a 0.167-second paint-covered dissolve.

Rebuild with `python scripts/prepare-intro.py --ffmpeg <absolute-ffmpeg-path>`.
The editable script retains original speed and strips audio explicitly.

Export H.264 MP4 with fast-start metadata, muted by default, preferably 1080p
desktop 16:9 and separately composed mobile 9:16. Target 3-8 MB for each delivery;
actual compression must be checked against visual quality. No external autoplay audio.

Set `desktop` and `mobile` in `public/intro/film.json` to the local media URLs after
visual QA. Set `cues` to the actual inspected clip timing, not the proposed timing
above. They must be finite and strictly ordered. A missing mobile version uses a
central crop of desktop, so confirm that hands and the bucket are not cropped out.

The renderer advances from video.currentTime, not independent timers. Playback
stalls and pauses do not let the paint transition run ahead. A failed download or
blocked autoplay returns to the still plate with a play / enter option. Reduced
motion skips video and the paint animation. Skip and Escape always exit. Browser
visibility loss pauses video. The latest intro has a new session key so existing
demo visitors can see it once; the header replay control remains available.

## Checks

Run: `node --test tests/intro-timeline.test.mjs tests/film-manifest.test.mjs`

Local-only review harness: `/tests/intro-review.html` (not included in dist).
Optional test flags: `?no-webgl`, `?reduced`, `?missing-video`.

Verified at 1280 x 720 and 390 x 844: nonblank road footage, dedicated mobile
source, moving/seekable video, full coverage at 5.1 seconds, and a transparent
center at 6.6 seconds. WebGL pixel samples at all four corners returned alpha
255 at full coverage; the exposed center returned alpha 0 during wiping on
both viewports. Skip removes the overlay and returns focus to the home link.
No horizontal overflow. Reduced motion creates neither video nor canvas.
Unavailable video returns to the poster with a usable Skip control. Denied
WebGL uses the CSS paint reveal, never exposing the unkeyed green background.
Screenshots and source contact sheets are retained in `docs/intro-qa`.

## Source Ledger

- Provider page: https://www.heygen.com/models/heygen-video-1
- Website allowance displayed: two five-second 768p clips per day.
- Walk source: `docs/intro-sources/walk-throw-original.mp4`, 1344 x 768,
  24 fps, container duration 5.258 seconds, H.264 and 32 kHz stereo AAC.
- Wipe source: `docs/intro-sources/wipe-original.mp4`, same dimensions, cadence,
  codecs and container duration. Source files are retained unchanged.
- Walk generation ID: `01a1a16d-aac2-752e-a5e4-d16928824cc4`.
- Wipe generation ID: `01a1a175-cdf1-7aef-8a8f-3116713c1817`.
- Walk prompt: realistic adult Indian artist, ivory tee and charcoal trousers,
  two steps down a studio road with cyan and magenta doors, holding a metal
  bucket; throw its cyan/magenta/yellow contents at glass in front of the lens;
  natural motion, no cartoon, no lettering, footsteps and splash.
- Wipe prompt: opaque wet cyan/magenta/yellow paint on glass; adult hand with
  black rubber squeegee, clearing downwards and across sides to uniform chroma
  green; no face, no text, no music or speech. The generated result uses both
  hands in its later stroke, which is preserved rather than hidden.

Browser checks must cover desktop, portrait phone, reduced motion, unavailable
video, denied WebGL, skip during playback, all-corners paint coverage, final mask
clearance, no horizontal overflow and keyboard focus return.
