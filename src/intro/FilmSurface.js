// Key only the wiping shot, so greenery in the opening street remains intact.
export async function createFilmSurface(host, video) {
  const T = await import('three');
  const renderer = new T.WebGLRenderer({ alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0, 0);
  host.appendChild(renderer.domElement);
  const texture = new T.VideoTexture(video);
  texture.colorSpace = T.NoColorSpace;
  const uniforms = {
    uFilm: { value: texture }, uKey: { value: 0 }, uOpacity: { value: 1 },
    uCrop: { value: new T.Vector2(1, 1) },
  };
  const geometry = new T.PlaneGeometry(2, 2);
  const material = new T.ShaderMaterial({
    transparent: true, depthWrite: false, uniforms,
    vertexShader: `varying vec2 vUv;
      void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
    fragmentShader: `precision highp float;
      varying vec2 vUv;
      uniform sampler2D uFilm;
      uniform vec2 uCrop;
      uniform float uKey,uOpacity;
      void main(){
        vec3 color=texture2D(uFilm,(vUv-.5)*uCrop+.5).rgb;
        float excess=color.g-max(color.r,color.b);
        float green=smoothstep(.25,.50,excess)*smoothstep(.50,.80,color.g)*uKey;
        color.g=mix(color.g,min(color.g,max(color.r,color.b)),green);
        gl_FragColor=vec4(color,(1.-green)*uOpacity);
      }`,
  });
  const scene = new T.Scene();
  scene.add(new T.Mesh(geometry, material));
  const camera = new T.Camera();
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    renderer.setSize(width, height);
    const screen = width / Math.max(height, 1);
    const source = (video.videoWidth || 1344) / (video.videoHeight || 768);
    uniforms.uCrop.value.set(Math.min(screen / source, 1), Math.min(source / screen, 1));
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  video.addEventListener('loadedmetadata', resize);
  resize();
  let disposed = false, lost = false, uploadedTime = -1;
  const contextLost = event => { event.preventDefault(); lost = true; };
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  return {
    render(time, cues) {
      if (disposed || lost || video.readyState < 2) return false;
      if (uploadedTime !== video.currentTime) {
        texture.needsUpdate = true;
        uploadedTime = video.currentTime;
      }
      uniforms.uKey.value = time >= cues.wipeStart ? 1 : 0;
      // The source leaves thin paint edges; let those settle away after the last stroke.
      uniforms.uOpacity.value = 1 - Math.max(0, Math.min(1, (time - cues.wipeEnd + .65) / .65));
      renderer.render(scene, camera);
      return true;
    },
    dispose() {
      disposed = true;
      observer.disconnect();
      video.removeEventListener('loadedmetadata', resize);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      texture.dispose(); geometry.dispose(); material.dispose(); renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
