"""Render the First Print concept as a standalone silent MP4."""
import math
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[1]
out = root / "docs" / "first-print.mp4"
ff = next((root / ".tools/video/imageio_ffmpeg/binaries").glob("*.exe"))
logo = Image.open(root / "images/colorflu-logo.jpg").convert("RGB")
logo.thumbnail((164, 148))
def font(size, bold=False):
    return ImageFont.truetype("C:/Windows/Fonts/" + ("arialbd.ttf" if bold else "arial.ttf"), size)
small, label, big = font(14), font(22, True), font(52, True)
def ease(x):
    x = max(0, min(1, x))
    return x*x*(3-2*x)
with subprocess.Popen([str(ff), "-y", "-loglevel", "error", "-f", "rawvideo",
        "-pix_fmt", "rgb24", "-s", "960x540", "-r", "30", "-i", "-", "-an",
        "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags",
        "+faststart", str(out)], stdin=subprocess.PIPE) as proc:
    for frame in range(120):
        t = frame / 30
        im = Image.new("RGB", (960,540), "#171a1c")
        d = ImageDraw.Draw(im)
        d.text((42,30), "COLORFLU   /   PRINT STUDIO", font=small, fill="#dde1dd")
        d.text((760,30), "DTF    /    FILM 01", font=small, fill="#dde1dd")
        d.ellipse((114,395,882,475), fill="#101214")
        for x in (192,729):
            d.rectangle((x,252,x+27,417),fill="#42484c")
            d.rounded_rectangle((x-20,411,x+55,420),4,fill="#787f81")
        d.polygon([(125,154),(185,107),(772,107),(832,154)], fill="#697074")
        d.rounded_rectangle((125,150,832,284),12,fill="#353b40",outline="#899093",width=2)
        d.rounded_rectangle((160,173,740,246),6,fill="#111618")
        d.rectangle((172,184,728,189),fill="#8e999b")
        d.rectangle((166,229,737,237),fill="#555f63")
        d.rounded_rectangle((761,170,809,198),4,fill="#14292c")
        d.line((769,186,798,186),fill="#41cad3",width=3)
        for i,c in enumerate(("#28bdd2","#e33a87","#f5cd2a","#101213")):
            d.rectangle((766+10*i,209,772+10*i,216),fill=c)
        d.text((148,253),"COLORFLU",font=small,fill="white")
        p = max(0,min(1,(t-.5)/2.1))
        depth = int(20+154*p)
        paper = Image.new("RGB",(278,176),"#ffffff")
        paper.paste(logo,((278-logo.width)//2,10))
        im.paste(paper.crop((0,176-depth,278,176-depth+depth)),(331,232))
        x = int(188+482*(.5-.5*math.cos(math.pi*6*p)))
        d.rounded_rectangle((x,177,x+46,232),5,fill="#909b9e",outline="#c2cbcd")
        d.rectangle((x+6,213,x+39,232),fill="#252c30")
        d.line((x+7,231,x+38,231),fill="#28bdd2",width=2)
        d.text((42,466),"The First Print",font=big,fill="white")
        end = Image.new("RGB",im.size,"#ffffff")
        end.paste(logo,((960-logo.width)//2,115))
        e=ImageDraw.Draw(end)
        e.text((480,315),"Explore DTF Machines    /    Customize Apparel",font=label,anchor="mm",fill="#202627")
        for i,c in enumerate(("#28bdd2","#e33a87","#f5cd2a","#171a1c")):
            e.rectangle((408+36*i,280,443+36*i,283),fill=c)
        im=Image.blend(im,end,ease((t-2.75)/.65))
        proc.stdin.write(im.tobytes())
    proc.stdin.close()
    if proc.wait(): raise SystemExit("Encoding failed")
print(out)
