"""Prepare silent, natural-speed web clips from the two retained source shots."""
import argparse
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument("--ffmpeg", required=True)
args = parser.parse_args()
sources = ROOT / "docs" / "intro-sources"
output = ROOT / "public" / "intro"

def render(*options):
    subprocess.run([args.ffmpeg, "-nostdin", "-hide_banner", "-y", *map(str, options)], check=True)

# Both shots retain their original cadence. The paint-covered overlap hides the cut.
graph = (
    "[0:v]trim=duration=5,setpts=PTS-STARTPTS,fps=24,format=yuv420p[a];"
    "[1:v]trim=duration=5,setpts=PTS-STARTPTS,fps=24,format=yuv420p[b];"
    "[a][b]xfade=transition=fade:duration=0.166667:offset=4.833333[v]"
)
render("-i", sources / "walk-throw-original.mp4", "-i", sources / "wipe-original.mp4",
       "-filter_complex", graph, "-map", "[v]", "-an", "-c:v", "libx264",
       "-crf", "21", "-preset", "medium", "-pix_fmt", "yuv420p",
       "-movflags", "+faststart", output / "colorflu-road-film.mp4")
render("-i", output / "colorflu-road-film.mp4", "-vf", "crop=432:768:(iw-432)/2:0",
       "-an", "-c:v", "libx264", "-crf", "21", "-preset", "medium",
       "-pix_fmt", "yuv420p", "-movflags", "+faststart", output / "colorflu-road-mobile.mp4")
render("-i", output / "colorflu-road-film.mp4", "-frames:v", "1", "-update", "1",
       output / "road-film-poster.jpg")
