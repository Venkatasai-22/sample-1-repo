"""Isometric Film to Fabric concept; geometry and motion remain editable."""
import math
import argparse
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FF = next((ROOT / '.tools/video/imageio_ffmpeg/binaries').glob('*.exe'))
parser = argparse.ArgumentParser()
parser.add_argument('--width', type=int, default=960)
parser.add_argument('--start-frame', type=int, default=0)
args = parser.parse_args()
W, H = args.width, args.width * 9 // 16
S = W / 960
logo = Image.open(ROOT / 'images/colorflu-logo.jpg').convert('RGBA')
factor = 160*S / max(logo.size)
logo = logo.resize((round(logo.width*factor), round(logo.height*factor)), Image.Resampling.LANCZOS)
font = lambda n, bold=False: ImageFont.truetype('C:/Windows/Fonts/arial' + ('bd' if bold else '') + '.ttf', n)
tiny, title, heading = font(13), font(24, True), font(43, True)

class ScaledDraw:
    def __init__(self, image):
        self.draw = ImageDraw.Draw(image)
    def coords(self, points):
        return [tuple(v*S for v in p) if isinstance(p, tuple) else p*S for p in points]
    def polygon(self, points, **kwargs):
        self.draw.polygon(self.coords(points), **kwargs)
    def ellipse(self, points, **kwargs):
        self.draw.ellipse(self.coords(points), **kwargs)
    def line(self, points, **kwargs):
        kwargs['width'] = max(1, round(kwargs.get('width', 1)*S))
        self.draw.line(self.coords(points), **kwargs)
    def text(self, xy, text, font, **kwargs):
        self.draw.text(tuple(v*S for v in xy), text, font=font.font_variant(size=round(font.size*S)), **kwargs)

def ease(x):
    x = max(0, min(1, x))
    return x*x*(3-2*x)

def point(x, y, z):
    return (480 + 36*x - 24*y, 336 + 14*x + 19*y - 42*z)

def polygon(d, pts, fill, outline=None):
    d.polygon([point(*p) for p in pts], fill=fill, outline=outline)

def box(d, x, y, z, a, b, c, colors):
    polygon(d, [(x,y,z),(x+a,y,z),(x+a,y,z+c),(x,y,z+c)], colors[0])
    polygon(d, [(x+a,y,z),(x+a,y+b,z),(x+a,y+b,z+c),(x+a,y,z+c)], colors[1])
    polygon(d, [(x,y,z+c),(x+a,y,z+c),(x+a,y+b,z+c),(x,y+b,z+c)], colors[2])

def decal(im, image, x, y, z, width, depth):
    p = tuple(v*S for v in point(x,y,z))
    q = tuple(v*S for v in point(x+width,y,z))
    r = tuple(v*S for v in point(x,y+depth,z))
    ax, ay = (q[0]-p[0])/image.width, (q[1]-p[1])/image.width
    bx, by = (r[0]-p[0])/image.height, (r[1]-p[1])/image.height
    det = ax*by-ay*bx
    a,b,d,e = by/det,-bx/det,-ay/det,ax/det
    corners = [p,q,r,(q[0]+r[0]-p[0],q[1]+r[1]-p[1])]
    left, top = math.floor(min(v[0] for v in corners)), math.floor(min(v[1] for v in corners))
    right, bottom = math.ceil(max(v[0] for v in corners)), math.ceil(max(v[1] for v in corners))
    warped = image.transform((right-left,bottom-top), Image.Transform.AFFINE,
        (a,b,a*(left-p[0])+b*(top-p[1]),d,e,d*(left-p[0])+e*(top-p[1])), Image.Resampling.BICUBIC)
    im.alpha_composite(warped,(left,top))

suffix = '-tail' if args.start_frame else ''
output = ROOT / f'docs/film-to-fabric-{W}{suffix}.mp4'
proc = subprocess.Popen([str(FF),'-nostdin','-y','-loglevel','error','-f','rawvideo',
    '-pix_fmt','rgb24','-s',f'{W}x{H}','-r','30','-i','-','-an','-c:v','libx264',
    '-preset','ultrafast','-threads','4','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(output)],stdin=subprocess.PIPE)
try:
    for frame in range(args.start_frame, 180):
        t = frame/30
        im = Image.new('RGBA',(W,H),'#edf1f2')
        d = ScaledDraw(im)
        # Stage is an unframed showroom floor; solids have three lit faces.
        d.ellipse((160,276,795,443),fill='#d5dfe1')
        for i in range(-7,9):
            d.line([point(i,-3,0),point(i,4,0)],fill='#e2e8e9')
        # Printer chassis, legs, front cavity and cyan registration light.
        for x in (-6.5,-2):
            box(d,x,-.1,0,.32,1.5,1.6,('#626e77','#39444b','#939fa6'))
        box(d,-7,-.5,1.5,5.7,2,1.5,('#343f48','#1c252e','#68767f'))
        polygon(d,[(-6.6,1.51,1.92),(-1.7,1.51,1.92),(-1.7,1.51,2.69),(-6.6,1.51,2.69)],'#101a23')
        d.line([point(-6.5,1.52,2.65),point(-1.8,1.52,2.65)],fill='#23bacc',width=3)
        x = -6.3 + 4*(.5-.5*math.cos(t*math.pi*7))
        box(d,x,1.15,1.95,.5,.45,.5,('#9aa9af','#5d6e78','#cad4d8'))
        # Heat press platen and frame.
        box(d,2.4,-.4,.7,4.2,3.6,.35,('#849097','#535f69','#bbc7cb'))
        box(d,5.8,-.7,.8,.4,.45,2.7,('#434e55','#273039','#71818a'))
        # A garment silhouette lies on the lower platen.
        tee=[(3.1,-.1,1.08),(3.8,-.4,1.08),(4.3,-.1,1.08),(4.9,-.4,1.08),
             (5.7,.1,1.08),(5.3,.9,1.08),(4.9,.7,1.08),(4.9,2.7,1.08),
             (3.3,2.7,1.08),(3.3,.7,1.08),(2.8,.9,1.08),(2.5,.1,1.08)]
        polygon(d,tee,'#fcfcfc','#b3bec4')
        travel = ease((t-1.3)/1.1)
        filmx = -4.8 + 8.2*travel
        filmy = 1.7 - 1.3*travel
        filmz = 1.9 - .78*travel
        # Printed transfers move as a physical plane, never a floating title.
        if t < 3.7:
            polygon(d,[(filmx,filmy,filmz),(filmx+1.55,filmy,filmz),
                (filmx+1.55,filmy+1.6,filmz),(filmx,filmy+1.6,filmz)],'#f8ffff','#2dbacb')
            printed = logo.copy()
            if t < 1.3:
                rows = int(logo.height*ease(t/1.2))
                printed.paste((248,255,255,255),(0,rows,logo.width,logo.height))
            decal(im,printed,filmx+.1,filmy+.1,filmz+.01,1.35,1.35)
        if t >= 3.7:
            decal(im,logo,3.5,.5,1.09,1.35,1.35)
            peel = ease((t-3.7)/1.15)
            edge = .4 + 1.6*peel
            polygon(d,[(3.4,edge,1.14),(4.95,edge,1.14),
                (4.95,2+peel,1.14+2.3*peel),(3.4,2+peel,1.14+2.3*peel)],'#d5eff0','#8baeb2')
        down = ease((t-2.5)/.45)*(1-ease((t-3.3)/.35))
        pressz = 2.6-1.35*down
        box(d,2.55,-.25,pressz,3.8,3.25,.28,('#303d47','#17212a','#637a84'))
        box(d,4.4,.5,pressz+.28,.35,1.2,.43,('#16a8bc','#117789','#54d9df'))
        if t > 5:
            end=Image.new('RGBA',im.size,'#f8fafb')
            end.alpha_composite(logo,(round((W-logo.width)/2),round(100*S)))
            e=ScaledDraw(end)
            e.text((480,310),'Wear Your Creativity.',font=heading,anchor='mm',fill='#20313b')
            e.text((480,383),'Explore DTF Machines    /    Customize Apparel',font=title,anchor='mm',fill='#137f91')
            im=Image.blend(im,end,ease((t-5)/.6))
        if frame in (24,64,116,174):
            preview = im.convert('RGB')
            preview.thumbnail((1920,1080))
            preview.save(ROOT / f'docs/film-fabric-{W}-frame-{frame}.jpg', quality=95)
        proc.stdin.write(im.convert('RGB').tobytes())
finally:
    proc.stdin.close()
if proc.wait():
    raise SystemExit('Video encoder failed')
print(output)
