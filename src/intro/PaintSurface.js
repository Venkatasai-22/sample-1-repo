import { wipeBounds } from './timeline.mjs';

// A single full-screen shader keeps the liquid coating continuous at every aspect ratio.
export async function createPaintSurface(host) {
  const T = await import('three');
  const renderer = new T.WebGLRenderer({ alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0, 0);
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  const uniforms = {
    uTime: { value: 0 }, uFill: { value: 0 }, uWipe: { value: 0 },
    uAspect: { value: 1 }, uBounds: { value: new T.Vector3() },
  };
  const geometry = new T.PlaneGeometry(2, 2);
  const material = new T.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms,
    vertexShader: `varying vec2 vUv;
      void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
    fragmentShader: `precision highp float;
      varying vec2 vUv;
      uniform float uTime,uFill,uWipe,uAspect;
      uniform vec3 uBounds;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
      float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+4.7;a*=.5;}return v;}
      float fluid(vec2 p){return fbm(p*3.+vec2(fbm(p*2.),fbm(p*2.+3.2)) + vec2(0.,-uTime*.035));}
      void main(){
        vec2 uv=vec2(vUv.x,1.-vUv.y);
        vec2 p=(uv-vec2(.5,.46))*vec2(uAspect,1.);
        float angle=atan(p.y,p.x);
        float edge=1.+.15*sin(angle*7.)+.10*sin(angle*13.+.4)+.08*noise(p*12.);
        float radius=uFill*(length(vec2(uAspect,1.))*.8);
        float alpha=(1.-smoothstep(radius-.025,radius+.025,length(p)/edge))*step(.001,uFill);
        if(uFill>.995)alpha=1.;
        float f=fluid(uv*vec2(uAspect,1.));
        float ribbons=uv.x*.55+uv.y*.27+f*.46;
        vec3 cyan=vec3(.015,.72,.83), pink=vec3(.94,.035,.38), yellow=vec3(1.,.78,.06);
        vec3 violet=vec3(.40,.08,.72), coral=vec3(1.,.24,.12);
        vec3 color=mix(cyan,violet,smoothstep(.34,.47,ribbons));
        color=mix(color,pink,smoothstep(.48,.62,ribbons));
        color=mix(color,coral,smoothstep(.64,.77,ribbons));
        color=mix(color,yellow,smoothstep(.78,.92,ribbons));
        float ridge=fluid(uv*vec2(uAspect,1.)+vec2(.002,0.))-f;
        color*=.83+f*.35;
        color+=vec3(.72)*pow(clamp(ridge*95.+.16,0.,1.),10.)*.44;
        color+=noise(uv*600.)*.014;
        if(uWipe>0.){
          float scallop=sin(uv.x*180.)*.002+sin(uv.x*39.)*.003;
          float insideX=1.-smoothstep(uBounds.z-.012,uBounds.z+.012,abs(uv.x-.5));
          float insideY=smoothstep(uBounds.x-.008,uBounds.x+.008,uv.y)*
            (1.-smoothstep(uBounds.y+scallop-.006,uBounds.y+scallop+.006,uv.y));
          alpha*=1.-insideX*insideY;
          float lip=exp(-abs(uv.y-uBounds.y-scallop)*190.)*insideX;
          color+=lip*.22;
        }
        if(uWipe>.999)alpha=0.;
        gl_FragColor=vec4(color,alpha);
      }`,
  });
  const scene = new T.Scene();
  scene.add(new T.Mesh(geometry, material));
  const camera = new T.Camera();
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    renderer.setSize(width, height);
    uniforms.uAspect.value = width / Math.max(height, 1);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  let disposed = false;
  return {
    render(time, fill, wipe) {
      if (disposed) return;
      const bounds = wipeBounds(wipe);
      uniforms.uTime.value = time;
      uniforms.uFill.value = fill;
      uniforms.uWipe.value = wipe;
      uniforms.uBounds.value.set(bounds.top, bounds.bottom, bounds.halfWidth);
      renderer.render(scene, camera);
    },
    dispose() {
      disposed = true;
      observer.disconnect();
      material.dispose();
      geometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
