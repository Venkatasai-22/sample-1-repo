# Intro Resolution

The approved Film to Fabric animation is rendered directly from its geometric
scene at 7680 x 4320, 30 fps, six seconds. It is not an enlargement of the old
960 x 540 movie. Text is rasterized with correspondingly larger fonts and
geometry is projected to full-resolution pixel coordinates.

The logo remains a supplied raster asset, so increasing video resolution does
not invent detail in that original image. The isometric, flat-shaded artwork
also remains the approved design; resolution does not add realistic materials.

Render commands:

```
python scripts/render-film-to-fabric.py --width 7680
python scripts/render-film-to-fabric.py --width 1920
```

After observed playback lag, the website no longer automatically loads 8K.
Desktop uses an optimized 1920 x 1080 H.264 High profile level 4.1 export;
phones use 1280 x 720 Baseline level 3.1. Both use fast-start metadata and a
two-second keyframe interval. A media error, loading timeout or three seconds
of continuous buffering switches desktop to the lighter 720p file. A further
failure exposes the poster and Enter/Skip controls. Pause cancels the buffering
timer. Progress updates modify a CSS property rather than rerendering React.
The 8K master remains separately available through the manifest's master URL,
but is not selected for autoplay. Playback stays muted and skippable.
No visible 8K, concept or runtime annotations are baked into the animation.

Playback quality is limited by the viewer's display, browser and decoder.
An 8K file does not make a lower-resolution display show 8K detail.
