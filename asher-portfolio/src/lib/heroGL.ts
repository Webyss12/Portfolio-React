// Raw WebGL ripple + warm trail drawn over the hero portrait.
// The two shader programs are the ones from the design brief.

const VERTEX = `attribute vec2 position; varying vec2 vUv;
void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;

const FRAGMENT = `precision highp float;
varying vec2 vUv;
uniform sampler2D image; uniform vec2 resolution,imageSize,mouse,trail[9];
uniform float strength,time;
vec2 coverUv(vec2 uv){
  float rs=resolution.x/resolution.y;
  float ims=imageSize.x/imageSize.y;
  vec2 scale=rs<ims?vec2(rs/ims,1.):vec2(1.,ims/rs);
  return (uv-.5)*scale+.5;
}
void main(){
  vec2 uv=vUv;
  vec2 aspect=vec2(resolution.x/resolution.y,1.);
  vec2 delta=(uv-mouse)*aspect;
  float dist=length(delta);
  float radius=.47;
  float falloff=(1.-smoothstep(0.,radius,dist))*strength;
  vec2 dir=delta/(dist+.0001);
  vec2 tangent=vec2(-dir.y,dir.x);
  float wave=sin(dist*38.-time*2.15)*falloff;
  float secondary=sin(dist*19.+time*.7)*falloff;
  vec2 displacement=dir*(wave*.00525+falloff*.004);
  displacement+=tangent*secondary*.001875;
  vec2 sampleUv=coverUv(uv+displacement);
  float aberration=(falloff*.0016+abs(wave)*.0012);
  vec2 rgbShift=dir*aberration;
  float r=texture2D(image,sampleUv+rgbShift).r;
  float g=texture2D(image,sampleUv).g;
  float b=texture2D(image,sampleUv-rgbShift).b;
  vec3 color=vec3(r,g,b);
  vec3 orange=vec3(1.,.22,.025);
  float glow=falloff*(.10+.08*(sin(dist*28.-time*1.5)*.5+.5));
  float trailGlow=0.;
  for(int i=0;i<9;i++){
    vec2 trailDelta=(uv-trail[i])*aspect;
    float trailDistance=length(trailDelta);
    float age=1.-float(i)/9.;
    float halo=exp(-trailDistance*trailDistance*145.);
    float core=exp(-trailDistance*trailDistance*420.);
    float shimmer=.82+.18*sin(time*2.-float(i)*.72);
    trailGlow+=(halo*.48+core*.28)*age*age*shimmer;
  }
  float headProtection=smoothstep(.035,.105,dist);
  trailGlow=min(trailGlow,1.35)*strength*headProtection;
  vec3 trailOrange=vec3(1.,.31,.045);
  vec3 trailGold=vec3(1.,.58,.20);
  color+=orange*glow;
  color+=trailOrange*trailGlow*.46;
  color+=trailGold*pow(trailGlow,1.65)*.11;
  gl_FragColor=vec4(color,1.);
}`;

interface Options {
  canvas: HTMLCanvasElement;
  hero: HTMLElement;
  src: string;
  /** true once a frame has really been drawn; false on failure / context loss */
  onReady: (ready: boolean) => void;
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('Shader compile failed:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/** Starts the effect. Returns a function that tears everything down. */
export function createHeroGL({ canvas, hero, src, onReady }: Options): () => void {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false });
  if (!gl) return () => {};

  // highp is preferred; fall back to mediump on devices without it
  const highp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
  const fragmentSource =
    highp && highp.precision > 0 ? FRAGMENT : FRAGMENT.replace('precision highp float', 'precision mediump float');

  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return () => {};
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('Shader link failed:', gl.getProgramInfoLog(program));
    return () => {};
  }
  gl.useProgram(program);

  // Full-screen rectangle made of two triangles
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const loc = {
    image: gl.getUniformLocation(program, 'image'),
    resolution: gl.getUniformLocation(program, 'resolution'),
    imageSize: gl.getUniformLocation(program, 'imageSize'),
    mouse: gl.getUniformLocation(program, 'mouse'),
    trail: gl.getUniformLocation(program, 'trail'),
    strength: gl.getUniformLocation(program, 'strength'),
    time: gl.getUniformLocation(program, 'time'),
  };

  let texture: WebGLTexture | null = null;
  let imageW = 1;
  let imageH = 1;
  let textureReady = false;
  let destroyed = false;
  let visible = true;
  let raf = 0;

  const target = { x: 0.5, y: 0.5 };
  const current = { x: 0.5, y: 0.5 };
  const trail = Array.from({ length: 9 }, () => ({ x: 0.5, y: 0.5 }));
  const trailData = new Float32Array(18);
  let strength = 0;
  let strengthTarget = 0;
  const startedAt = performance.now();

  function resize() {
    const rect = hero.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2.25);
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl!.viewport(0, 0, w, h);
  }

  function draw() {
    const g = gl!;
    g.uniform2f(loc.resolution, canvas.width, canvas.height);
    g.uniform2f(loc.imageSize, imageW, imageH);
    g.uniform2f(loc.mouse, current.x, current.y);
    trail.forEach((p, i) => {
      trailData[i * 2] = p.x;
      trailData[i * 2 + 1] = p.y;
    });
    g.uniform2fv(loc.trail, trailData);
    g.uniform1f(loc.strength, strength);
    g.uniform1f(loc.time, (performance.now() - startedAt) / 1000);
    g.drawArrays(g.TRIANGLES, 0, 6);
  }

  function frame() {
    raf = 0;
    if (destroyed || !visible || document.hidden || !textureReady) return;

    current.x += (target.x - current.x) * 0.075;
    current.y += (target.y - current.y) * 0.075;

    strength += (strengthTarget - strength) * (strengthTarget > 0 ? 0.07 : 0.028);
    if (strengthTarget === 0 && strength < 0.001) strength = 0;

    // Each trail point chases the one before it (the first chases the pointer)
    trail.forEach((p, i) => {
      const leader = i === 0 ? current : trail[i - 1];
      const k = 0.19 - i * 0.009;
      p.x += (leader.x - p.x) * k;
      p.y += (leader.y - p.y) * k;
    });

    draw();
    if (strength > 0 || strengthTarget > 0) raf = requestAnimationFrame(frame);
  }

  // Only ever one queued frame
  function kick() {
    if (raf || destroyed || !visible || document.hidden || !textureReady) return;
    raf = requestAnimationFrame(frame);
  }

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    const r = hero.getBoundingClientRect();
    target.x = (e.clientX - r.left) / r.width;
    target.y = 1 - (e.clientY - r.top) / r.height; // flip Y for WebGL
    strengthTarget = 1;
    kick();
  };
  const onLeave = () => {
    strengthTarget = 0;
    kick();
  };
  const onContextLost = (e: Event) => {
    e.preventDefault();
    textureReady = false;
    cancelAnimationFrame(raf);
    raf = 0;
    onReady(false);
  };
  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else {
      kick();
    }
  };

  hero.addEventListener('pointermove', onMove, { passive: true });
  hero.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('webglcontextlost', onContextLost);
  document.addEventListener('visibilitychange', onVisibility);

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else {
      kick();
    }
  });
  io.observe(hero);

  const ro = new ResizeObserver(() => {
    resize();
    if (textureReady) draw();
  });
  ro.observe(hero);

  // Load the portrait and upload it as a texture
  const img = new Image();
  if (/^https?:/.test(src) && !src.startsWith(window.location.origin)) img.crossOrigin = 'anonymous';
  img.onload = () => {
    if (destroyed) return;
    try {
      texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      if (gl.getError() !== gl.NO_ERROR) throw new Error('Texture upload failed');
      imageW = img.naturalWidth;
      imageH = img.naturalHeight;
      gl.uniform1i(loc.image, 0);
      textureReady = true;
      resize();
      draw();
      onReady(true); // the canvas fades in only after a real frame exists
    } catch (error) {
      console.warn(error);
      onReady(false); // the CSS portrait stays visible
    }
  };
  img.onerror = () => onReady(false);
  img.src = src;

  return () => {
    destroyed = true;
    cancelAnimationFrame(raf);
    hero.removeEventListener('pointermove', onMove);
    hero.removeEventListener('pointerleave', onLeave);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    document.removeEventListener('visibilitychange', onVisibility);
    io.disconnect();
    ro.disconnect();
    img.onload = null;
    img.onerror = null;
    if (texture) gl.deleteTexture(texture);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
  };
}
