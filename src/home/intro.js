/* ------------------------------------------------------------------
   Intro — one continuous, scroll-scrubbed WebGL shot in three acts:

   A. FLASH       25 archive photos slam in, each faster than the last
                  (colour washes, chromatic split, zoom blur, halftone,
                  double exposures, words flying through). Tap per frame.
   B. FLY-THROUGH the camera skims a mirrored plate between giant
                  extruded "SODMUN V" letters and the logo; their walls
                  play the secretariat's pictures.
   C. TURN-AROUND the camera climbs, swings round and pulls back to the
                  lockup while the pictures melt into liquid chrome.
------------------------------------------------------------------- */
import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { gsap, ScrollTrigger, $, range, smooth, lerp, clamp, reduceMotion, isTouch } from '../lib/shell.js';
import { sound } from '../lib/sound.js';
import { sceneControls } from './controls.js';
import { liquidMetal, studioEnvironment, tickMetal } from '../lib/metal.js';
import { letterGeometries, logoGeometry } from '../lib/shapes.js';

/* ---------------- the 25 archive frames ---------------- */
const P = (n) => `assets/photos/${n}.jpg`;
const I = (n) => `assets/intro/p${String(n).padStart(2, '0')}.jpg`;
export const FRAMES = [
  P('hall'), P('committee-room'), I(1), P('podium'), P('legacy-cover'), I(2), P('atrium'), P('award'),
  I(3), P('legacy-2'), P('speaker'), I(4), P('laptops'), P('legacy-3'), I(5), P('atrium-2'),
  I(6), P('legacy-2b'), I(7), P('legacy-3b'), I(8), I(9), P('legacy-end'), I(10), I(11),
];
// black & white cut-outs of the secretariat (tools/assets.py --people)
export const ATLAS = 'assets/people/atlas.webp';
const ATLAS_GRID = [6, 5];
const ATLAS_COUNT = 29;

// one pale green, in a few temperatures
const TINTS = ['#cdeedb', '#b4e3c7', '#e3f5ea', '#a6dcbd', '#d7f0e1', '#bfe8d0'].map((c) => new THREE.Color(c));
const INK = new THREE.Color('#06140c');
const WORDS = ['Diplomacy', 'Point of order', 'Crisis', 'Resolution', 'Motion passes', 'Dubai', 'Security Council', 'Delegates', 'Unmoderated caucus', 'Summit'];

// Acts, as fractions of the pinned scroll
const A_END = 0.36;
const B_END = 0.7;
const RATIO = 0.86; // each frame lasts 86% as long as the one before

/* ---------------- act A shader ---------------- */
const FLASH_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uA; uniform sampler2D uB;
uniform float uAspA; uniform float uAspB; uniform float uAspect;
uniform float uLocal; uniform float uSpeed; uniform float uMix; uniform float uTime;
uniform vec3 uTintA; uniform vec3 uTintB; uniform float uHalf; uniform vec2 uDir; uniform float uSeed;
varying vec2 vUv;

vec2 cover(vec2 uv, float asp) {
  vec2 s = uAspect > asp ? vec2(1.0, asp / uAspect) : vec2(uAspect / asp, 1.0);
  return (uv - 0.5) * s + 0.5;
}
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

vec3 grade(sampler2D t, vec2 uv, float asp, vec3 tint, float zoom, vec2 drift, float blur, float split) {
  vec2 c = cover(uv, asp);
  c = (c - 0.5) / zoom + 0.5 + drift;
  vec2 toC = (vec2(0.5) - c);
  vec3 acc = vec3(0.0);
  float wsum = 0.0;
  for (int i = 0; i < 10; i++) {
    float k = float(i) / 9.0;
    vec2 o = toC * k * blur;
    float w = 1.0 - k * 0.6;
    vec2 off = uDir * split * (1.0 + k);
    acc.r += texture2D(t, clamp(c + o + off, 0.001, 0.999)).r * w;
    acc.g += texture2D(t, clamp(c + o, 0.001, 0.999)).g * w;
    acc.b += texture2D(t, clamp(c + o - off, 0.001, 0.999)).b * w;
    wsum += w;
  }
  acc /= wsum;
  // duotone: crushed blacks, tinted highs, a little of the original split colour
  float l = dot(acc, vec3(0.299, 0.587, 0.114));
  l = smoothstep(0.06, 0.92, l);
  vec3 col = mix(vec3(0.015, 0.05, 0.03), tint, l) + (acc - vec3(dot(acc, vec3(0.333)))) * vec3(0.15, 0.35, 0.22);
  col += pow(l, 6.0) * 0.25;
  return col;
}

void main() {
  vec2 uv = vUv;
  float e = 1.0 - pow(1.0 - clamp(uLocal, 0.0, 1.0), 3.0);
  float zoom = 1.22 - 0.16 * e;
  vec2 drift = uDir * 0.05 * uLocal;
  float blur = 0.03 + 0.22 * uSpeed + 0.18 * (1.0 - smoothstep(0.0, 0.25, uLocal));
  float split = 0.002 + 0.01 * uSpeed;
  vec3 a = grade(uA, uv, uAspA, uTintA, zoom, drift, blur, split);
  vec3 b = grade(uB, uv, uAspB, uTintB, 1.04 + 0.2 * uLocal, -drift * 1.5, blur * 1.4, split * 2.0);
  // double exposure: the outgoing frame screen-blended over the incoming one
  vec3 col = 1.0 - (1.0 - a) * (1.0 - b * uMix);
  // halftone print on some frames
  if (uHalf > 0.0) {
    float l = dot(col, vec3(0.333));
    vec2 g = uv * vec2(uAspect, 1.0) * 140.0;
    g = mat2(0.707, -0.707, 0.707, 0.707) * g;
    float d = length(fract(g) - 0.5);
    float dots = smoothstep(0.5 * sqrt(1.0 - l) + 0.04, 0.5 * sqrt(1.0 - l) - 0.04, d);
    col = mix(col, col * (0.55 + 0.6 * (1.0 - dots)), uHalf);
  }
  // vignette + grain
  vec2 q = uv - 0.5;
  col *= 1.0 - dot(q, q) * 1.1;
  col += (hash(uv * 900.0 + uTime) - 0.5) * 0.025;
  gl_FragColor = vec4(col, 1.0);
}`;

/* ---------------- image → chrome material for letters ---------------- */
function imageChrome(atlas, tint, box, depth) {
  const mat = liquidMetal({
    color: '#eaf5ee', roughness: 0.06, ripple: 0.2, scale: 1.4, envMapIntensity: 1.8,
    inject: {
      uniforms: {
        uAtlas: { value: atlas },
        uCell: { value: 0 },
        uMetal: { value: 0 },
        uFlash: { value: 0 },
        uTint: { value: tint.clone() },
        uBox: { value: new THREE.Vector4(...box) },
        uDepth: { value: depth },
      },
      head: /* glsl */ `
uniform sampler2D uAtlas; uniform float uCell; uniform float uMetal; uniform float uFlash;
uniform vec3 uTint; uniform vec4 uBox; uniform float uDepth;
vec3 lmImage() {
  vec2 size = uBox.zw - uBox.xy;
  vec2 iuv;
  if (abs(vLmN.z) > 0.6) iuv = (vLmPos.xy - uBox.xy) / size;
  else iuv = vec2(fract(((vLmPos.x - uBox.x) + (vLmPos.y - uBox.y)) / (size.x + size.y) * 1.6), clamp(vLmPos.z / uDepth, 0.0, 1.0));
  iuv = clamp(iuv, 0.002, 0.998);
  float col = mod(uCell, ${ATLAS_GRID[0]}.0);
  float row = floor(uCell / ${ATLAS_GRID[0]}.0);
  vec2 img = vec2((col + iuv.x) / ${ATLAS_GRID[0]}.0, (row + 1.0 - iuv.y) / ${ATLAS_GRID[1]}.0);
  vec4 px = texture2D(uAtlas, vec2(img.x, 1.0 - img.y));
  float lum = smoothstep(0.03, 0.97, px.r);
  vec3 paper = uTint * 0.62;
  vec3 person = mix(vec3(0.02, 0.07, 0.045), uTint * 1.15, lum);
  return mix(paper, person, px.a) + uFlash * 0.35;
}`,
      body: /* glsl */ `
gl_FragColor.rgb = mix(lmImage(), gl_FragColor.rgb, uMetal);`,
    },
  });
  return mat;
}

/* ---------------- brushed plate overlay ---------------- */
function brushedTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 1024;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(512, 512, 60, 512, 512, 512);
  grd.addColorStop(0, 'rgba(10,12,11,0.55)');
  grd.addColorStop(0.55, 'rgba(6,8,7,0.82)');
  grd.addColorStop(1, 'rgba(0,0,0,1)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 2600; i++) {
    const y = Math.random() * 1024;
    g.strokeStyle = `rgba(255,255,255,${Math.random() * 0.035})`;
    g.lineWidth = Math.random() * 1.4;
    g.beginPath();
    g.moveTo(Math.random() * 1024 - 200, y);
    g.lineTo(Math.random() * 1024 + 200, y + (Math.random() - 0.5) * 6);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ================================================================== */
export function initIntro({ textures, atlas }) {
  const section = $('#intro');
  const canvas = $('.intro__gl', section);
  const flash = $('.intro__flash', section);
  const countEl = $('.intro__count', section);
  const capEl = $('.intro__cap', section);
  const hint = $('.intro__hint', section);
  const endLine = $('.intro__line', section);
  const wordsEl = $('.intro__word', section);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouch ? 1.5 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  /* ---------- act A: flash pass ---------- */
  const flashScene = new THREE.Scene();
  const ortho = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const fu = {
    uA: { value: textures[0] }, uB: { value: textures[0] },
    uAspA: { value: 1.5 }, uAspB: { value: 1.5 }, uAspect: { value: 1 },
    uLocal: { value: 0 }, uSpeed: { value: 0 }, uMix: { value: 0 }, uTime: { value: 0 },
    uTintA: { value: TINTS[0].clone() }, uTintB: { value: TINTS[1].clone() },
    uHalf: { value: 0 }, uDir: { value: new THREE.Vector2(1, 0) }, uSeed: { value: 0 },
  };
  flashScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    uniforms: fu, fragmentShader: FLASH_FRAG,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    depthTest: false, depthWrite: false,
  })));
  const asp = (t) => (t.image ? t.image.width / t.image.height : 1.5);

  // frame boundaries: geometric durations, normalised to act A
  const total = (1 - RATIO ** FRAMES.length) / (1 - RATIO);
  const starts = FRAMES.map((_, i) => (1 - RATIO ** i) / (1 - RATIO) / total);
  starts.push(1);
  const frameAt = (a) => {
    let i = 0;
    while (i < FRAMES.length - 1 && a >= starts[i + 1]) i++;
    return i;
  };

  /* ---------- acts B + C: the letters ---------- */
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#000');
  scene.fog = new THREE.Fog('#000', 9, 26);
  scene.environment = studioEnvironment(renderer, { tint: '#bfe8d0', bright: 1.1 });

  const DEPTH = 0.62;
  const lockup = new THREE.Group();
  scene.add(lockup);
  const metals = [];
  const pieces = [];

  letterGeometries({ width: 6.4, depth: DEPTH }).forEach(({ geo, box }, i) => {
    const m = imageChrome(atlas, TINTS[i % TINTS.length], [box[0], box[1], box[2], box[3]], DEPTH);
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.y = -0.46;
    lockup.add(mesh);
    metals.push(m);
    pieces.push({ mesh, mat: m, base: (i * 5) % ATLAS_COUNT, home: mesh.position.clone(), cx: (box[0] + box[2]) / 2, seed: i });
  });
  const LOGO_R = 1.06;
  const LOGO_Y = 1.62;
  const { ring, globe } = logoGeometry({ depth: DEPTH / LOGO_R, bevel: 0.01, centred: false });
  [ring, globe].forEach((geo, i) => {
    const m = imageChrome(atlas, TINTS[(i + 4) % TINTS.length], [-1, -1, 1, 1], DEPTH / LOGO_R);
    const mesh = new THREE.Mesh(geo, m);
    mesh.scale.setScalar(LOGO_R);
    mesh.position.y = LOGO_Y;
    lockup.add(mesh);
    metals.push(m);
    pieces.push({ mesh, mat: m, base: (i * 11 + 3) % ATLAS_COUNT, logo: i, home: mesh.position.clone(), cx: 0, seed: 7 + i });
  });

  // mirrored plate (cheaper dark plate on phones)
  const plateSize = 40;
  if (!isTouch) {
    const mirror = new Reflector(new THREE.PlaneGeometry(plateSize, plateSize), {
      textureWidth: Math.round(window.innerWidth * 0.75), textureHeight: Math.round(window.innerHeight * 0.75), color: 0x7c847f,
    });
    mirror.position.z = -0.002;
    scene.add(mirror);
  }
  const brushed = new THREE.Mesh(new THREE.PlaneGeometry(plateSize, plateSize), new THREE.MeshBasicMaterial({ map: brushedTexture(), transparent: true, depthWrite: false, opacity: isTouch ? 1 : 0.92 }));
  brushed.material.map.repeat.set(1, 1);
  scene.add(brushed);


  /* ---------- camera path (one continuous move) ---------- */
  const camera = new THREE.PerspectiveCamera(74, 1, 0.02, 80);
  const Y = 0.38; // corridor between the word and the logo
  const H = 0.2; // eye height above the plate
  const posKeys = [
    new THREE.Vector3(-7.0, Y, H), new THREE.Vector3(-3.6, Y + 0.02, H),
    new THREE.Vector3(-0.4, Y - 0.04, H + 0.03), new THREE.Vector3(2.4, Y - 0.1, H + 0.08),
    new THREE.Vector3(4.6, -0.2, 1.6), new THREE.Vector3(6.2, -2.4, 5.2),
    new THREE.Vector3(2.4, -0.6, 8.5), new THREE.Vector3(0, 0.58, 10),
  ];
  const lookKeys = [
    new THREE.Vector3(-4.5, Y + 0.05, H), new THREE.Vector3(-1.0, Y + 0.12, H + 0.05),
    new THREE.Vector3(2.2, Y - 0.1, H + 0.12), new THREE.Vector3(4.4, -0.3, H + 0.1),
    new THREE.Vector3(3.2, -0.3, 0.6), new THREE.Vector3(1.0, 0.2, 0.5),
    new THREE.Vector3(0.2, 0.55, 0.2), new THREE.Vector3(0, 0.58, 0),
  ];
  const posCurve = new THREE.CatmullRomCurve3(posKeys, false, 'centripetal');
  const lookCurve = new THREE.CatmullRomCurve3(lookKeys, false, 'centripetal');
  const upZ = new THREE.Vector3(0, 0, 1);
  const upY = new THREE.Vector3(0, 1, 0);
  const tmp = new THREE.Vector3();
  const look = new THREE.Vector3();

  let fit = 1;
  const resize = () => {
    const w = section.clientWidth || window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    fu.uAspect.value = w / h;
    // pull the final shot back on narrow screens so the whole lockup fits
    fit = Math.max(1, 1.2 / camera.aspect + 0.18);
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  /* ---------- state ---------- */
  let target = 0;
  let p = 0;
  let lastFrame = -1;
  let lastTap = 0;
  let lastCell = -1;
  let boomed = false;
  let active = true;
  let wordIdx = 0;

  const placeCamera = (u) => {
    // slower through the corridor, quicker on the swing
    const s = u < 0.5 ? u : 0.5 + smooth((u - 0.5) / 0.5) * 0.5;
    posCurve.getPoint(s, camera.position);
    lookCurve.getPoint(s, look);
    if (s > 0.85) camera.position.z = lerp(camera.position.z, 10 * fit, range(s, 0.85, 1));
    const k = smooth(range(s, 0.45, 0.85));
    camera.up.copy(tmp.copy(upZ).lerp(upY, k).normalize());
    camera.fov = lerp(76, 34, smooth(range(s, 0.42, 1)));
    camera.updateProjectionMatrix();
    camera.lookAt(look);
  };

  const render = (time) => {
    const t = time / 1000;
    p += (target - p) * 0.14;
    if (Math.abs(target - p) < 0.00005) p = target;

    hint.style.opacity = String(1 - range(p, 0, 0.015));

    if (p < A_END) {
      /* ---- act A ---- */
      const a = p / A_END;
      const i = frameAt(a);
      const local = range(a, starts[i], starts[i + 1]);
      if (i !== lastFrame) {
        const now = performance.now();
        if (lastFrame !== -1 && now - lastTap > 24) {
          sound.tap(i / FRAMES.length, 0.7 + 0.3 * (i / FRAMES.length));
          lastTap = now;
        }
        const prev = Math.max(0, i - 1);
        fu.uA.value = textures[i];
        fu.uB.value = textures[prev];
        fu.uAspA.value = asp(textures[i]);
        fu.uAspB.value = asp(textures[prev]);
        fu.uTintA.value.copy(TINTS[i % TINTS.length]);
        fu.uTintB.value.copy(TINTS[prev % TINTS.length]);
        fu.uHalf.value = i % 4 === 2 ? 1 : 0;
        const ang = (i * 2.399) % (Math.PI * 2);
        fu.uDir.value.set(Math.cos(ang), Math.sin(ang) * 0.5);
        fu.uSeed.value = i * 1.37;
        countEl.textContent = `${String(i + 1).padStart(2, '0')} / ${FRAMES.length}`;
        if (i % 3 === 1) {
          wordIdx = (wordIdx + 1) % WORDS.length;
          wordsEl.textContent = WORDS[wordIdx];
          wordsEl.style.setProperty('--wx', `${(Math.random() * 40 - 20).toFixed(1)}vw`);
          wordsEl.style.setProperty('--wy', `${(Math.random() * 40 - 20).toFixed(1)}vh`);
        }
        lastFrame = i;
      }
      const speed = i / (FRAMES.length - 1);
      fu.uLocal.value = local;
      fu.uSpeed.value = speed;
      fu.uMix.value = 0.75 * (1 - smooth(clamp(local * 2.2)));
      fu.uTime.value = t;
      wordsEl.style.opacity = String(i % 3 === 1 ? 0.9 * Math.sin(Math.PI * local) : 0);
      wordsEl.style.setProperty('--wl', local.toFixed(3));
      // white-out into act B
      flash.style.opacity = String(smooth(range(a, 0.93, 1)));
      renderer.render(flashScene, ortho);
      capEl.textContent = 'SODMUN I — IV · archive';
      return;
    }
    wordsEl.style.opacity = '0';

    /* ---- acts B + C ---- */
    lastFrame = -1;
    const u = range(p, A_END, 1);
    const ub = range(u, 0, (B_END - A_END) / (1 - A_END));
    flash.style.opacity = String(1 - smooth(range(u, 0, 0.06)));
    countEl.textContent = u < 0.55 ? 'The Secretariat' : 'SODMUN V';
    capEl.textContent = u < 0.55 ? 'SODMUN IV · the team' : '11 · 12 · 2026 · Dubai';

    // pictures on the walls flip as we pass
    const cellStep = Math.floor(ub * 16);
    if (cellStep !== lastCell && u < 0.6) {
      if (lastCell !== -1 && performance.now() - lastTap > 40) { sound.tap(0.3, 0.6); lastTap = performance.now(); }
      pieces.forEach((pc, k) => {
        pc.mat.userData.uniforms.uCell.value = (pc.base + cellStep * (k % 2 ? 3 : 1)) % ATLAS_COUNT;
        pc.mat.userData.uniforms.uFlash.value = 0.6;
      });
      lastCell = cellStep;
    }
    // the pictures melt to chrome while the pieces drift apart, then the
    // pieces flow back together and fuse into one liquid-metal lockup
    const metal = smooth(range(u, 0.6, 0.84));
    const apart = smooth(range(u, 0.56, 0.74)) * (1 - smooth(range(u, 0.76, 0.97)));
    const molten = Math.sin(Math.PI * range(u, 0.6, 1)) * 2.2;
    pieces.forEach((pc) => {
      const un = pc.mat.userData.uniforms;
      un.uFlash.value *= 0.88;
      un.uMetal.value = metal;
      un.uRipple.value = 0.1 + molten;
      const wob = Math.sin(t * 1.3 + pc.seed * 1.7);
      pc.mesh.position.set(
        pc.home.x + pc.cx * 0.55 * apart,
        pc.home.y + (pc.logo !== undefined ? 0.9 : -0.25) * apart + wob * 0.12 * apart,
        pc.home.z + (0.6 + 0.5 * Math.sin(pc.seed * 2.3)) * apart,
      );
      // a squash-and-stretch pulse as each piece lands, like a drop joining a pool
      const land = Math.sin(Math.PI * range(u, 0.86, 0.99));
      pc.mesh.scale.set(1 + land * 0.05, 1 - land * 0.04, 1 + land * 0.25).multiplyScalar(pc.logo !== undefined ? LOGO_R : 1);
    });
    // logo spins into place on the reveal
    const spin = 1 - smooth(range(u, 0.6, 0.98));
    pieces.filter((pc) => pc.logo !== undefined).forEach((pc) => {
      pc.mesh.rotation.z = (pc.logo === 0 ? -1 : 1) * spin * 1.4;
    });
    tickMetal(metals, t);

    if (u > 0.965 && !boomed) { sound.boom(); boomed = true; }
    if (u < 0.9) boomed = false;
    endLine.style.opacity = String(smooth(range(u, 0.9, 1)));
    endLine.style.transform = `translateY(${(1 - smooth(range(u, 0.9, 1))) * 20}px)`;

    placeCamera(u);
    renderer.render(scene, camera);
  };

  const loop = (time) => { if (active) render(time); };
  gsap.ticker.add(() => loop(performance.now()));

  // dev-only: jump straight to a point in the shot for screenshots
  if (import.meta.env.DEV) window.__introSeek = (v) => { target = v; p = v; };

  if (reduceMotion) {
    target = 1;
    p = 1;
    return;
  }

  const st = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: () => `+=${window.innerHeight * (isTouch ? 7 : 8.5)}`,
    pin: '.intro__stage',
    pinSpacing: true,
    scrub: true,
    onUpdate: (st) => { target = st.progress; },
    onToggle: (st) => { active = st.isActive || st.progress < 1; },
    onLeave: () => { active = false; },
    onEnterBack: () => { active = true; },
  });
  sceneControls(st, $('.intro__stage', section), { seconds: 22, skipLabel: 'Skip intro' });
}
